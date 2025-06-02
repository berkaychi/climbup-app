"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface ConditionalMainProps {
  children: ReactNode;
}

const ConditionalMain = ({ children }: ConditionalMainProps) => {
  const pathname = usePathname();

  // Ana sayfa, login, register ve forgot-password sayfalarında container ve padding ekleme
  const noContainerPaths = ["/", "/login", "/register", "/forgot-password"];
  const shouldUseContainer = !noContainerPaths.includes(pathname);

  if (shouldUseContainer) {
    return (
      <main className="container mx-auto px-4 py-8" data-oid="bl4319p">
        {children}
      </main>
    );
  }

  // Auth sayfaları için container olmadan direkt render et
  return <>{children}</>;
};

export default ConditionalMain;
