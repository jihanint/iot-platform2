import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { UserItem } from "@/interfaces/user";

const ALREADY_AUTHORIZED_PATH = "/dashboard/?title=Warning&description=You are already logged in&status=info";
const WAITING_APPROVAL_PATH = "/helps/waiting-approval";
const UNAUTHORIZED_PATH = "/dashboard?title=Unauthorized&description=Access Restricted&status=error";
const UNAUTHORIZED_PAGE = "/auth/login";
const USER_ASSIGNMENT_MANAGER_PATH = "/user/assignment/manager";
const USER_ASSIGNMENT_SUPERVISOR_PATH = "/user/assignment/supervisor";

// Helper function to create unauthorized response
const createUnauthorizedResponse = (reqParam: NextRequest) =>
  NextResponse.rewrite(new URL(UNAUTHORIZED_PATH, reqParam.url));

// Helper function to create redirection response
const createRedirectionResponse = (path: string, reqParam: NextRequest) =>
  NextResponse.redirect(new URL(path, reqParam.url));

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  // DOCS: this if want implement blacklist page that need to approved (user === verified)
  // const needApproval = ["dashboard", "settings", "devices", "admin", "user"];
  const noNeedApproval = ["helps"];
  const token = (await getToken({ req })) as unknown as { user: UserItem };
  const isAuthenticated = !!token;
  const firstSegmentUrl = await req.nextUrl.pathname.split("/")?.[1];

  if (req.nextUrl.pathname === "/") {
    const response = NextResponse.rewrite(
      new URL(
        (process.env.NEXT_PUBLIC_BASE_URL_LANDING_iothub as string) +
          process.env.NEXT_PUBLIC_BASE_URL_LANDING_iothub_BASE_PATH,
        process.env.NEXT_PUBLIC_BASE_URL_LANDING_iothub
      )
    );

    // const response = NextResponse.redirect(new URL("/landing", req.url));

    return response;
  }

  if (req.nextUrl.pathname === "/demo") {
    const response = NextResponse.rewrite(
      new URL(
        process.env.NEXT_PUBLIC_BASE_URL_LANDING_iothub + "demo",
        process.env.NEXT_PUBLIC_BASE_URL_LANDING_iothub
      )
    );

    return response;
  }

  if (req.nextUrl.pathname.startsWith("/home")) {
    return NextResponse.next();
  }

  /**
   * If user already authenticated, then when accessing route with /auth, redirect to /dashboard
   * If not, then open the page
   * ex: /auth/login, /auth/register, /auth/forgot-password
   */

  if (req.nextUrl.pathname.startsWith("/auth")) {
    return isAuthenticated ? createRedirectionResponse(ALREADY_AUTHORIZED_PATH, req) : NextResponse.next();
  }

  /**
   * If user already authenticated, verified, NOT approved, then open /waiting-approval
   * If route start with /admin, role NOT admin, then redirect to /dashboard
   * If route start with /user, role NOT user, then redirect to /dashboard
   */

  if (isAuthenticated) {
    const hasUserRole = (role: string) => token?.user.roles.includes(role);
    const isAdmin = hasUserRole("admin");
    const isManager = hasUserRole("user");

    // If user already authenticated, verified, NOT approved, then open /waiting-approval
    if (token.user.status === "verified" && !noNeedApproval.includes(firstSegmentUrl)) {
      return createRedirectionResponse(WAITING_APPROVAL_PATH, req);
    }

    // If user accssing the USER_ASSIGNMENT_MANAGER_PATH
    if (req.nextUrl.pathname.includes(USER_ASSIGNMENT_MANAGER_PATH)) {
      if (!isAdmin) {
        return createUnauthorizedResponse(req);
      }
      return NextResponse.next();
    }

    // If user accesing the USER_ASSIGNMENT_SUPERVISOR_PATH
    if (req.nextUrl.pathname.includes(USER_ASSIGNMENT_SUPERVISOR_PATH)) {
      if (isAdmin || isManager) {
        return NextResponse.next();
      }
      return createUnauthorizedResponse(req);
    }

    // If route start with /admin, role NOT admin, then redirect to /dashboard
    if (req.nextUrl.pathname.startsWith("/admin") && !hasUserRole("admin")) {
      return createUnauthorizedResponse(req);
      // If route start with /user, role NOT user, then redirect to /dashboard
    } else if (req.nextUrl.pathname.startsWith("/user") && !hasUserRole("user")) {
      return createUnauthorizedResponse(req);
    }
  }

  const authMiddleware = await withAuth({
    pages: {
      signIn: `/auth/login`,
    },
  });

  // @ts-expect-error eslint-disable-next-line @typescript-eslint/ban-ts-comment
  return authMiddleware(req, event);
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
