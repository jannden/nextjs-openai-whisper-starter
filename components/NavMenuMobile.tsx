"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/lib/config";
import { useUI } from "@/lib/stores/ui";

export default function NavMenuMobile() {
  const pathname = usePathname();
  const isNavMobileOpen = useUI((state) => state.isNavMobileOpen);

  if (!isNavMobileOpen) return null;

  return (
    <div className="md:hidden" id="mobile-menu">
      <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
        {navItems?.length &&
          navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${
                pathname === item.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } block rounded-md px-3 py-2 text-base font-medium`}
            >
              {item.label}
            </Link>
          ))}
      </div>
    </div>
  );
}
