import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // where to redirect unauthenticated users
  },
});

export const config = {
  matcher: ["/((?!api|_next|static|login|register|favicon.ico).*)"],
};
