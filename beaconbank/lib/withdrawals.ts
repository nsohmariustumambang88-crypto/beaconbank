export const WITHDRAW_CURRENCIES = ["USD", "EUR", "GBP"] as const
export const WITHDRAW_MIN = 10
export const WITHDRAW_MAX = 10000
export const WITHDRAW_FEE_RATE = 0.01
export const WITHDRAW_MIN_FEE = 1

export function withdrawalFee(amount: number) {
  return Math.round(Math.max(WITHDRAW_MIN_FEE, amount * WITHDRAW_FEE_RATE) * 100) / 100
}

export function validateWithdrawal(body: Record<string, unknown>) {
  const errors: Record<string, string> = {}
  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "")
  const amount = Number(body.amount)
  if (!Number.isFinite(amount) || amount < WITHDRAW_MIN) errors.amount = `Minimum withdrawal is ${WITHDRAW_MIN}`
  else if (amount > WITHDRAW_MAX) errors.amount = `Maximum withdrawal is ${WITHDRAW_MAX}`
  if (!(WITHDRAW_CURRENCIES as readonly string[]).includes(str("currency"))) errors.currency = "Choose a currency"
  if (str("bankName").length < 2) errors.bankName = "Enter the bank name"
  if (str("accountHolder").length < 3) errors.accountHolder = "Enter the account holder name"
  const account = str("accountNumber").replace(/\s+/g, "")
  if (!/^[A-Za-z0-9]{6,34}$/.test(account)) errors.accountNumber = "Enter a valid account number"
  const iban = str("iban").replace(/\s+/g, "").toUpperCase()
  if (iban && !/^[A-Z]{2}[0-9A-Z]{13,32}$/.test(iban)) errors.iban = "Enter a valid IBAN or leave it empty"
  return {
    errors,
    cleaned: {
      amount,
      currency: str("currency"),
      bankName: str("bankName"),
      accountHolder: str("accountHolder"),
      account,
      iban: iban || null,
    },
  }
}
