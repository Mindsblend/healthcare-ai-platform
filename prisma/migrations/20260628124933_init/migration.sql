-- AlterTable
ALTER TABLE "HealthAssessment" ADD COLUMN     "causalChain" JSONB,
ADD COLUMN     "diagnosis" TEXT,
ADD COLUMN     "futureProjection" JSONB,
ADD COLUMN     "goals" JSONB,
ADD COLUMN     "keyInsight" TEXT,
ADD COLUMN     "mainBottleneck" JSONB,
ADD COLUMN     "priorityFactors" JSONB,
ADD COLUMN     "startingPoint" JSONB,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "whyThisMatters" TEXT;
