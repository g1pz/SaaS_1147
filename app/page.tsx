import { redirect } from "next/navigation"

// root just redirects — actual content is in /dashboard
export default function Home() {
  redirect("/dashboard")
}
