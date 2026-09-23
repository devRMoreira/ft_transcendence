import { auth } from "@/auth"

export default auth((req) => {
	const isLoggedIn = Boolean(req.auth)
	const { pathname } = req.nextUrl
	const publicRoutes = ["/signin", "/signup", "/terms", "/privacy"]
	const isPublicRoute = publicRoutes.includes(pathname)
	const isAuthRoute = ["/signin", "/signup"].includes(pathname)

	if (!isLoggedIn && !isPublicRoute)
		return Response.redirect(new URL("/signin", req.nextUrl.origin))
	if (isLoggedIn && isAuthRoute) return Response.redirect(new URL("/", req.nextUrl.origin))
})

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
