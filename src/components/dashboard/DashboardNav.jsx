"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Settings, Users, FileSpreadsheet } from "lucide-react";

const navItems = [
  {
    href: "/dashboard/services",
    label: "Services",
    icon: Settings,
  },
  {
    href: "/dashboard/service-requests",
    label: "Service Requests",
    icon: FileSpreadsheet,
  },
  {
    href: "/dashboard/users",
    label: "Users",
    icon: Users,
  },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold">Bytewave Dashboard</h1>
        <p className="text-muted-foreground">
          Manage services and track customer requests
        </p>
      </div>
      
      <nav className="flex gap-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === href
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-accent text-muted-foreground hover:text-accent-foreground border"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}