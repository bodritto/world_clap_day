-- Add country columns to Supporter if missing (e.g. prod was created from older schema)
ALTER TABLE "Supporter" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "Supporter" ADD COLUMN IF NOT EXISTS "countryCode" TEXT;
