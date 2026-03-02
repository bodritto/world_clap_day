-- CreateTable (IF NOT EXISTS so migration is idempotent if table was created earlier)
CREATE TABLE IF NOT EXISTS "ClapperCountryCount" (
    "countryCode" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClapperCountryCount_pkey" PRIMARY KEY ("countryCode")
);
