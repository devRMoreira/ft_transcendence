import { auth } from "@/auth"

export default auth((req) => {
	const isLoggedIn = Boolean(req.auth)
	const { pathname } = req.nextUrl
	const publicRoutes = ["/signin", "/signup"]
	const isPublicRoute = publicRoutes.includes(pathname)

	if (!isLoggedIn && !isPublicRoute)
		return Response.redirect(new URL("/signin", req.nextUrl.origin))
	if (isLoggedIn && isPublicRoute) return Response.redirect(new URL("/", req.nextUrl.origin))
})

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
