-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN "archivedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Analysis_profileId_archivedAt_idx" ON "Analysis"("profileId", "archivedAt");
