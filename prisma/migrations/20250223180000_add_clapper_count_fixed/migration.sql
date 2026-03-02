-- AlterTable
ALTER TABLE "SiteStats" ADD COLUMN IF NOT EXISTS "clapperCountFixed" INTEGER NOT NULL DEFAULT 64241;

-- Backfill: set fixed = current for existing row so manual baseline is preserved
UPDATE "SiteStats" SET "clapperCountFixed" = "clapperCount" WHERE "id" = 'main';
