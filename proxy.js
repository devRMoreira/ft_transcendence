import { auth } from "@/auth"

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname === "/")
    return Response.redirect(
      new URL("/signin", req.nextUrl.origin)
    )
  })

// paths to exclude proxy from running on
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// }
