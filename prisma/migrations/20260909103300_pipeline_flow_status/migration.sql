-- CreateEnum
CREATE TYPE "PipelineStatus" AS ENUM ('applied', 'flow', 'interview', 'test', 'rejected', 'offer');

-- AlterTable
ALTER TABLE "Analysis"
ALTER COLUMN "pipelineStatus" TYPE "PipelineStatus"
USING (
  CASE
    WHEN "pipelineStatus" IS NULL THEN NULL
    WHEN "pipelineStatus" IN ('applied', 'flow', 'interview', 'test', 'rejected', 'offer')
      THEN "pipelineStatus"::"PipelineStatus"
    ELSE 'applied'::"PipelineStatus"
  END
);
