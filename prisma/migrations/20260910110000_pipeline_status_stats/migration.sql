-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN "flowAt" TIMESTAMP(3);
ALTER TABLE "Analysis" ADD COLUMN "rejectedAt" TIMESTAMP(3);
ALTER TABLE "Analysis" ADD COLUMN "offerAt" TIMESTAMP(3);

-- Backfill first-enter dates from the current column
UPDATE "Analysis"
SET "flowAt" = COALESCE("pipelineUpdatedAt", "appliedAt", "createdAt")
WHERE "pipelineStatus" = 'flow' AND "flowAt" IS NULL;

UPDATE "Analysis"
SET "rejectedAt" = COALESCE("pipelineUpdatedAt", "appliedAt", "createdAt")
WHERE "pipelineStatus" = 'rejected' AND "rejectedAt" IS NULL;

UPDATE "Analysis"
SET "offerAt" = COALESCE("pipelineUpdatedAt", "appliedAt", "createdAt")
WHERE "pipelineStatus" = 'offer' AND "offerAt" IS NULL;
