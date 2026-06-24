import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

// protect everything under /dashboard, /users, /settings
export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*", "/settings/:path*"],
}
