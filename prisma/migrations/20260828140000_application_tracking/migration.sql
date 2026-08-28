-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN "jobUrl" TEXT;
ALTER TABLE "Analysis" ADD COLUMN "appliedAt" TIMESTAMP(3);
ALTER TABLE "Analysis" ADD COLUMN "pipelineStatus" TEXT;
ALTER TABLE "Analysis" ADD COLUMN "pipelineUpdatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Analysis_profileId_createdAt_idx" ON "Analysis"("profileId", "createdAt");
CREATE INDEX "Analysis_profileId_appliedAt_idx" ON "Analysis"("profileId", "appliedAt");
CREATE INDEX "Analysis_profileId_pipelineStatus_idx" ON "Analysis"("profileId", "pipelineStatus");
