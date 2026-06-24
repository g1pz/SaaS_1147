import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const body = await request.json()
  const { name, currentPassword, newPassword } = body

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  })

  if (!user) return NextResponse.json({ error: "user not found" }, { status: 404 })

  const updateData: any = {}

  if (name) updateData.name = name

  if (newPassword) {
    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) return NextResponse.json({ error: "wrong password" }, { status: 400 })
    updateData.password = await bcrypt.hash(newPassword, 12)
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true },
  })

  return NextResponse.json({ user: updated })
}
