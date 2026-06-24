import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const users = [
  { email: "admin@example.com", name: "Alex Morgan", role: "admin" },
  { email: "j.carter@example.com", name: "Jake Carter", role: "user" },
  { email: "sarah.k@example.com", name: "Sarah Kim", role: "user" },
  { email: "m.johnson@example.com", name: "Mike Johnson", role: "user" },
  { email: "lisa.w@example.com", name: "Lisa White", role: "user" },
  { email: "d.brown@example.com", name: "Dan Brown", role: "user" },
  { email: "anna.lee@example.com", name: "Anna Lee", role: "user" },
  { email: "r.scott@example.com", name: "Ryan Scott", role: "user" },
  { email: "c.davis@example.com", name: "Claire Davis", role: "user" },
  { email: "tom.n@example.com", name: "Tom Nguyen", role: "user" },
  { email: "e.wilson@example.com", name: "Emma Wilson", role: "user" },
  { email: "p.martinez@example.com", name: "Paul Martinez", role: "user" },
  { email: "k.taylor@example.com", name: "Kate Taylor", role: "user" },
  { email: "b.anderson@example.com", name: "Brian Anderson", role: "user" },
  { email: "n.thomas@example.com", name: "Nina Thomas", role: "user" },
  { email: "c.jackson@example.com", name: "Chris Jackson", role: "user" },
  { email: "amy.h@example.com", name: "Amy Harris", role: "user" },
  { email: "j.martin@example.com", name: "James Martin", role: "user" },
  { email: "o.garcia@example.com", name: "Olivia Garcia", role: "user" },
  { email: "w.clark@example.com", name: "Will Clark", role: "user" },
]

const revenueData = [
  { month: "Jan", amount: 42300 },
  { month: "Feb", amount: 37800 },
  { month: "Mar", amount: 51200 },
  { month: "Apr", amount: 58900 },
  { month: "May", amount: 63400 },
  { month: "Jun", amount: 71100 },
  { month: "Jul", amount: 68700 },
  { month: "Aug", amount: 74500 },
  { month: "Sep", amount: 82300 },
  { month: "Oct", amount: 89100 },
  { month: "Nov", amount: 94700 },
  { month: "Dec", amount: 103200 },
]

async function main() {
  console.log("seeding...")

  await prisma.user.deleteMany()
  await prisma.revenue.deleteMany()

  const hashed = await bcrypt.hash("password123", 12)

  for (const user of users) {
    await prisma.user.create({
      data: { ...user, password: hashed },
    })
  }

  for (const row of revenueData) {
    await prisma.revenue.create({ data: row })
  }

  console.log("done")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
