"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const ConditionalNavbar = () => {
  const pathname = usePathname();

  // Landing, login, register ve forgot-password sayfalarında navbar gösterme
  const hideNavbarPaths = [
    "/landing",
    "/login",
    "/register",
    "/forgot-password",
  ];

  const shouldHideNavbar = hideNavbarPaths.includes(pathname);

  if (shouldHideNavbar) {
    return null;
  }

  return <Navbar />;
};

export default ConditionalNavbar;
