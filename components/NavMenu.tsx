"use client";

import { usePathname } from "next/navigation";
import { navItems } from "@/lib/config";

export default function NavMenu() {
  const pathname = usePathname();

  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        {navItems?.length &&
          navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${
                pathname === item.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } rounded-md px-3 py-2 text-sm font-medium`}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
      </div>
    </div>
  );
}
