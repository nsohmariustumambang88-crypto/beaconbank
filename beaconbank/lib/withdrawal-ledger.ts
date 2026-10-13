import { Prisma } from "@prisma/client"

type Hold = { id: string; userId: string; walletId: string; amount: Prisma.Decimal; fee: Prisma.Decimal; currency: string; accountLast4: string }

export function holdTotal(w: { amount: Prisma.Decimal; fee: Prisma.Decimal }) {
  return w.amount.add(w.fee).toFixed(2)
}

export async function releaseHold(tx: Prisma.TransactionClient, w: Hold, reason: string) {
  const total = holdTotal(w)
  await tx.wallet.update({ where: { id: w.walletId }, data: { balance: { increment: total } } })
  await tx.transaction.updateMany({ where: { referenceId: w.id, type: "withdrawal" }, data: { status: "cancelled" } })
  await tx.transaction.create({
    data: {
      userId: w.userId,
      walletId: w.walletId,
      type: "withdrawal_refund",
      amount: total,
      currency: w.currency,
      status: "completed",
      description: `Withdrawal returned: ${reason}`,
      referenceId: w.id,
    },
  })
}

export async function completeHold(tx: Prisma.TransactionClient, w: Hold) {
  await tx.transaction.updateMany({ where: { referenceId: w.id, type: "withdrawal" }, data: { status: "completed" } })
}
