-- CreateTable
CREATE TABLE "TemporaryData" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verificationcode" TEXT,

    CONSTRAINT "TemporaryData_pkey" PRIMARY KEY ("id")
);
