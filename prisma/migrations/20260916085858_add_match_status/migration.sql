-- AlterEnum
ALTER TYPE "MatchStatus" ADD VALUE 'ABANDONED';

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "player1LastSeenAt" TIMESTAMP(3),
ADD COLUMN     "player2LastSeenAt" TIMESTAMP(3);
