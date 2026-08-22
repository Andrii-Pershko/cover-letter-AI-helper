-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT '',
    "headline" TEXT NOT NULL DEFAULT '',
    "yearsExperience" DOUBLE PRECISION,
    "englishLevel" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "workFormat" TEXT NOT NULL DEFAULT '',
    "targetLevel" TEXT NOT NULL DEFAULT '',
    "clLanguage" TEXT NOT NULL DEFAULT 'uk',
    "linkedin" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "telegram" TEXT NOT NULL DEFAULT '',
    "cvFileName" TEXT,
    "cvMimeType" TEXT,
    "cvText" TEXT,
    "coreStack" TEXT NOT NULL DEFAULT '',
    "avoidInCl" TEXT,
    "extraNotes" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "product" TEXT NOT NULL DEFAULT '',
    "problem" TEXT NOT NULL,
    "contribution" TEXT NOT NULL,
    "stack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "result" TEXT NOT NULL DEFAULT '',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExampleCoverLetter" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT '',
    "whyItWorks" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExampleCoverLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyName" TEXT,
    "jobTitle" TEXT,
    "jobLevel" TEXT,
    "jobText" TEXT NOT NULL,
    "matchMin" INTEGER NOT NULL,
    "matchMax" INTEGER NOT NULL,
    "recommendation" TEXT NOT NULL,
    "gaps" TEXT[],
    "coverLetter" TEXT,
    "usedProjectTitle" TEXT,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisRequirement" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "candidate" TEXT NOT NULL,
    "match" TEXT NOT NULL,
    "explanation" TEXT,
    "techExplainer" TEXT,
    "isMustHave" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AnalysisRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_profileId_idx" ON "Project"("profileId");

-- CreateIndex
CREATE INDEX "ExampleCoverLetter_profileId_idx" ON "ExampleCoverLetter"("profileId");

-- CreateIndex
CREATE INDEX "Analysis_profileId_idx" ON "Analysis"("profileId");

-- CreateIndex
CREATE INDEX "AnalysisRequirement_analysisId_idx" ON "AnalysisRequirement"("analysisId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExampleCoverLetter" ADD CONSTRAINT "ExampleCoverLetter_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisRequirement" ADD CONSTRAINT "AnalysisRequirement_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
