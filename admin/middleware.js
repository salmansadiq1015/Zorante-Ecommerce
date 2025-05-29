import { NextResponse } from "next/server";

export const rolePermissions = {
  admin: [
    "dashboard",
    "users",
    "products",
    "coupon",
    "card",
    "categories",
    "orders",
    "chat",
    "notifications",
    "privacy",
    "settings",
  ],
  superadmin: [
    "dashboard",
    "users",
    "products",
    "coupon",
    "card",
    "categories",
    "orders",
    "chat",
    "notifications",
    "privacy",
    "settings",
  ],
  agent: ["orders"],
};

export function middleware(req) {
  //   const token = req.cookies.get("auth_token");
  const url = req.nextUrl.clone();
  const pathname = url.pathname.split("/")[2];

  console.log("Running middleware");

  //   if (!token) {
  //     url.pathname = "/login";
  //     return NextResponse.redirect(url);
  //   }

  // Decode token to get user details
  const user = JSON.parse(atob(token));
  const allowedRoutes = rolePermissions[user.role] || [];

  if (!allowedRoutes.includes(pathname)) {
    url.pathname = "/formidable";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
