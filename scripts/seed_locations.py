#!/usr/bin/env python3
"""
Seed UserLocation rows for the world map.

This script intentionally does NOT connect to Postgres directly (no psycopg deps).
Instead, it generates SQL and executes it using Prisma CLI:

  npx prisma db execute --file /tmp/wcd_seed_locations.sql

Usage (run from repo root on server):
  python3 scripts/seed_locations.py --dry-run
  python3 scripts/seed_locations.py --truncate --total 84563 --seed 42

Notes:
- Uses ISO alpha-2 country codes in DB (UK is stored as GB).
- Generates rows for: US, GB, AR, CN, IN, CA, TR
- Also generates additional countries (default: 60) with small random counts (default: 1..100)
- Total rows = --total (default 84563)
"""

from __future__ import annotations

import argparse
import os
import random
import subprocess
import tempfile
import uuid
from datetime import datetime, timedelta, timezone


COUNTRIES = [
    ("US", "United States", ["New York", "Los Angeles", "Chicago", "Houston", "San Francisco"]),
    ("GB", "United Kingdom", ["London", "Manchester", "Birmingham", "Glasgow", "Liverpool"]),
    ("AR", "Argentina", ["Buenos Aires", "Córdoba", "Mendoza", "Rosario", "La Plata"]),
    ("CN", "China", ["Beijing", "Shanghai", "Shenzhen", "Guangzhou", "Chengdu"]),
    ("IN", "India", ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"]),
    ("CA", "Canada", ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"]),
    ("TR", "Turkey", ["Istanbul", "Ankara", "Izmir", "Antalya", "Bursa"]),
]

# Pool of additional countries (alpha-2, name, sample cities).
# We pick the first N after shuffling with the provided seed.
EXTRA_COUNTRIES_POOL = [
    ("DE", "Germany", ["Berlin"]),
    ("FR", "France", ["Paris"]),
    ("ES", "Spain", ["Madrid"]),
    ("IT", "Italy", ["Rome"]),
    ("NL", "Netherlands", ["Amsterdam"]),
    ("BE", "Belgium", ["Brussels"]),
    ("CH", "Switzerland", ["Zurich"]),
    ("AT", "Austria", ["Vienna"]),
    ("SE", "Sweden", ["Stockholm"]),
    ("NO", "Norway", ["Oslo"]),
    ("DK", "Denmark", ["Copenhagen"]),
    ("FI", "Finland", ["Helsinki"]),
    ("IE", "Ireland", ["Dublin"]),
    ("PT", "Portugal", ["Lisbon"]),
    ("PL", "Poland", ["Warsaw"]),
    ("CZ", "Czech Republic", ["Prague"]),
    ("HU", "Hungary", ["Budapest"]),
    ("GR", "Greece", ["Athens"]),
    ("RO", "Romania", ["Bucharest"]),
    ("BG", "Bulgaria", ["Sofia"]),
    ("UA", "Ukraine", ["Kyiv"]),
    ("RU", "Russia", ["Moscow"]),
    ("IL", "Israel", ["Tel Aviv"]),
    ("AE", "United Arab Emirates", ["Dubai"]),
    ("SA", "Saudi Arabia", ["Riyadh"]),
    ("QA", "Qatar", ["Doha"]),
    ("EG", "Egypt", ["Cairo"]),
    ("MA", "Morocco", ["Casablanca"]),
    ("NG", "Nigeria", ["Lagos"]),
    ("KE", "Kenya", ["Nairobi"]),
    ("ZA", "South Africa", ["Johannesburg"]),
    ("ET", "Ethiopia", ["Addis Ababa"]),
    ("GH", "Ghana", ["Accra"]),
    ("SN", "Senegal", ["Dakar"]),
    ("TZ", "Tanzania", ["Dar es Salaam"]),
    ("UG", "Uganda", ["Kampala"]),
    ("RW", "Rwanda", ["Kigali"]),
    ("CM", "Cameroon", ["Yaoundé"]),
    ("DZ", "Algeria", ["Algiers"]),
    ("TN", "Tunisia", ["Tunis"]),
    ("MX", "Mexico", ["Mexico City"]),
    ("BR", "Brazil", ["São Paulo"]),
    ("CL", "Chile", ["Santiago"]),
    ("CO", "Colombia", ["Bogotá"]),
    ("PE", "Peru", ["Lima"]),
    ("VE", "Venezuela", ["Caracas"]),
    ("EC", "Ecuador", ["Quito"]),
    ("UY", "Uruguay", ["Montevideo"]),
    ("PY", "Paraguay", ["Asunción"]),
    ("BO", "Bolivia", ["La Paz"]),
    ("PA", "Panama", ["Panama City"]),
    ("CR", "Costa Rica", ["San José"]),
    ("GT", "Guatemala", ["Guatemala City"]),
    ("CU", "Cuba", ["Havana"]),
    ("DO", "Dominican Republic", ["Santo Domingo"]),
    ("JM", "Jamaica", ["Kingston"]),
    ("AU", "Australia", ["Sydney"]),
    ("NZ", "New Zealand", ["Auckland"]),
    ("JP", "Japan", ["Tokyo"]),
    ("KR", "South Korea", ["Seoul"]),
    ("SG", "Singapore", ["Singapore"]),
    ("MY", "Malaysia", ["Kuala Lumpur"]),
    ("TH", "Thailand", ["Bangkok"]),
    ("VN", "Vietnam", ["Hanoi"]),
    ("PH", "Philippines", ["Manila"]),
    ("ID", "Indonesia", ["Jakarta"]),
    ("PK", "Pakistan", ["Karachi"]),
    ("BD", "Bangladesh", ["Dhaka"]),
    ("LK", "Sri Lanka", ["Colombo"]),
    ("NP", "Nepal", ["Kathmandu"]),
]


def generate_counts(total: int, seed: int) -> list[int]:
    rng = random.Random(seed)
    base = [1.0, 0.78, 0.52, 0.48, 0.46, 0.34, 0.30]
    weights = []
    for i, w in enumerate(base):
        jitter = 0.9 + rng.random() * 0.2  # 0.9..1.1
        sep = 1 + (len(base) - i) * 0.015
        weights.append(w * jitter * sep)

    sum_w = sum(weights)
    counts = [int(total * w / sum_w) for w in weights]

    # Ensure descending in given order.
    for i in range(1, len(counts)):
        if counts[i] >= counts[i - 1]:
            counts[i] = max(1, counts[i - 1] - 1)

    diff = total - sum(counts)
    counts[0] += diff  # push remainder to top

    # Re-check ordering (very unlikely to break, but keep safe).
    for i in range(1, len(counts)):
        if counts[i] >= counts[i - 1]:
            needed = counts[i] - (counts[i - 1] - 1)
            counts[i] -= needed
            counts[0] += needed

    return counts


def sql_escape(value: str) -> str:
    return value.replace("'", "''")


def random_created_at(rng: random.Random, within_days: int = 60) -> datetime:
    delta = timedelta(seconds=int(rng.random() * within_days * 24 * 3600))
    return datetime.now(timezone.utc) - delta


def build_sql(total: int, seed: int, truncate: bool) -> tuple[str, list[tuple[str, str, int]]]:
    rng = random.Random(seed)
    top_counts = generate_counts(total, seed)

    # Extra countries with small counts.
    # We keep the overall total == `total` by subtracting extras from the top bucket (US).
    extra_countries = int(os.environ.get("WCD_SEED_EXTRA_COUNTRIES", "60"))
    extra_max = int(os.environ.get("WCD_SEED_EXTRA_MAX", "100"))

    pool = list(EXTRA_COUNTRIES_POOL)
    rng.shuffle(pool)
    extras = pool[: max(0, min(extra_countries, len(pool)))]
    extra_counts: list[int] = [rng.randint(1, max(1, extra_max)) for _ in extras]
    extras_sum = sum(extra_counts)

    counts = list(top_counts)
    counts[0] -= extras_sum
    if counts[0] <= 0:
        raise ValueError(
            f"Extras sum too large ({extras_sum}) relative to total ({total}). "
            f"Lower WCD_SEED_EXTRA_COUNTRIES / WCD_SEED_EXTRA_MAX."
        )

    summary = []
    for (code, name, _cities), count in zip(COUNTRIES, counts):
        summary.append((code, name, count))
    for (code, name, _cities), count in zip(extras, extra_counts):
        summary.append((code, name, count))

    lines: list[str] = []
    lines.append("-- Generated by scripts/seed_locations.py")
    lines.append(f"-- total={total} seed={seed} utc_generated_at={datetime.now(timezone.utc).isoformat()}")
    lines.append(f"-- extras={len(extras)} extras_max={extra_max} extras_sum={extras_sum}")
    lines.append("BEGIN;")
    if truncate:
        lines.append('TRUNCATE TABLE "UserLocation";')

    batch_size = 2000

    # Insert the top countries first
    for (code, country, cities), n in zip(COUNTRIES, counts):
        inserted = 0
        while inserted < n:
            take = min(batch_size, n - inserted)
            values = []
            for _ in range(take):
                row_id = uuid.uuid4().hex
                city = rng.choice(cities)
                created_at = random_created_at(rng).isoformat()
                values.append(
                    f"('{sql_escape(row_id)}','{sql_escape(city)}','{sql_escape(country)}','{sql_escape(code)}','{created_at}')"
                )
            lines.append(
                'INSERT INTO "UserLocation" ("id","city","country","countryCode","createdAt") VALUES '
                + ",".join(values)
                + ";"
            )
            inserted += take

    # Insert extra countries
    for (code, country, cities), n in zip(extras, extra_counts):
        inserted = 0
        while inserted < n:
            take = min(batch_size, n - inserted)
            values = []
            for _ in range(take):
                row_id = uuid.uuid4().hex
                city = rng.choice(cities)
                created_at = random_created_at(rng).isoformat()
                values.append(
                    f"('{sql_escape(row_id)}','{sql_escape(city)}','{sql_escape(country)}','{sql_escape(code)}','{created_at}')"
                )
            lines.append(
                'INSERT INTO "UserLocation" ("id","city","country","countryCode","createdAt") VALUES '
                + ",".join(values)
                + ";"
            )
            inserted += take

    lines.append("COMMIT;")
    return "\n".join(lines) + "\n", summary


def run_prisma_execute(sql_path: str) -> None:
    # Uses Prisma config (prisma.config.ts) which reads DATABASE_URL from env.
    cmd = ["npx", "prisma", "db", "execute", "--file", sql_path]
    subprocess.run(cmd, check=True)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--total", type=int, default=84563)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--truncate", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--extra-countries", type=int, default=60)
    parser.add_argument("--extra-max", type=int, default=100)
    args = parser.parse_args()

    # Allow CLI flags to override defaults used by build_sql (so output is reproducible).
    os.environ["WCD_SEED_EXTRA_COUNTRIES"] = str(args.extra_countries)
    os.environ["WCD_SEED_EXTRA_MAX"] = str(args.extra_max)

    sql, summary = build_sql(args.total, args.seed, args.truncate)

    print("Seed locations summary (alpha-2):")
    for code, name, count in summary:
        print(f"- {code} ({name}): {count}")
    print(f"Total: {sum(c for _, _, c in summary)}")
    print(f"Seed: {args.seed}")

    if args.dry_run:
        print("Dry run enabled; not writing to DB.")
        return 0

    def load_env_file(path: str) -> None:
        try:
            with open(path, "r", encoding="utf-8") as f:
                for raw in f:
                    line = raw.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    key, value = line.split("=", 1)
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")
                    if key and key not in os.environ:
                        os.environ[key] = value
        except FileNotFoundError:
            return

    # On the server, DATABASE_URL is usually stored in /var/www/wcd/.env
    if not os.environ.get("DATABASE_URL"):
        load_env_file(".env")

    if not os.environ.get("DATABASE_URL"):
        print("ERROR: DATABASE_URL is not set in the environment and .env was not found/readable.")
        return 1

    with tempfile.NamedTemporaryFile(prefix="wcd_seed_locations_", suffix=".sql", delete=False, mode="w") as f:
        f.write(sql)
        sql_path = f.name

    print(f"Executing SQL via Prisma: {sql_path}")
    run_prisma_execute(sql_path)
    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

