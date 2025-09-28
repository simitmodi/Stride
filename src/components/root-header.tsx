
"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import { useUser } from "@/firebase/provider";

/**
 * A component that conditionally renders the main application header.
 *
 * The main application header is only shown on pages where the user is
 * authenticated. On pages under the "/dashboard" route, a different
 * header is used, so this component will not render the main header
 * for those routes.
 */
export default function RootHeader() {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();

  // Do not render a header on the root page or while the user's
  // authentication status is still loading.
  if (pathname === '/' || isUserLoading) {
    return null;
  }

  // Do not render the main application header on any of the dashboard
  // pages, since they have their own specialized header.
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  // Render the header only if there is an authenticated user.
  return user ? <Header /> : null;
}
