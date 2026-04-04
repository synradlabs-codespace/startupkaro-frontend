"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, FileText, IndianRupee, HelpCircle } from "lucide-react"

const adminLinks = [
  { href: "/admin/analytics", label: "Analytics", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: FileText },
  { href: "/admin/payments", label: "Payments", icon: IndianRupee },
  { href: "/admin/inquiries", label: "Inquiries", icon: HelpCircle },
]

const employeeLinks = [
  { href: "/employee/customers", label: "Customers", icon: Users },
  { href: "/employee/orders", label: "Orders", icon: FileText },
  { href: "/employee/inquiries", label: "Inquiries", icon: HelpCircle },
]

export function DashboardSidebar({ role }: { role: "admin" | "employee" }) {
  const pathname = usePathname()
  const links = role === "admin" ? adminLinks : employeeLinks

  return (
    <aside className="w-64 border-r bg-white h-screen p-6 hidden md:block">
      <div className="text-2xl font-bold mb-10 text-[var(--color-indigo)]">
        StartupKaro
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition",
                active
                  ? "bg-[var(--color-saffron)] text-white"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}