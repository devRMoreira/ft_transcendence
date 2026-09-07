-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('CHOOSING', 'DRAFTING', 'PLAYING', 'COMPLETE');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "state" JSONB,
ADD COLUMN     "status" "MatchStatus" NOT NULL DEFAULT 'CHOOSING';
