import { customers } from "@/data/mock-data";

const sessionRosterIds: Record<string, string[]> = {
  "ses-1": ["cus-aarav", "cus-meera", "cus-priya", "cus-kabir"],
  "ses-3": ["cus-aarav", "cus-meera", "cus-kabir"],
  "ses-5": ["cus-priya", "cus-kabir", "cus-meera"],
};

export function getSessionRoster(sessionId: string) {
  return (sessionRosterIds[sessionId] ?? [])
    .map((customerId) => customers.find((customer) => customer.id === customerId))
    .filter((customer): customer is NonNullable<typeof customer> => Boolean(customer));
}
