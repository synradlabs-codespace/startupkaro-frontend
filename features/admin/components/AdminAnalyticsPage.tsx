import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockAnalytics } from "@/lib/mock-data";
import { TrendingUp, ShoppingCart, Users, IndianRupee } from "lucide-react";

export function AdminAnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" description="Business performance overview" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: `₹${mockAnalytics.totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-[var(--color-green)]" },
            { label: "Total Orders", value: mockAnalytics.totalOrders, icon: ShoppingCart, color: "text-[var(--color-saffron)]" },
            { label: "Total Customers", value: mockAnalytics.totalCustomers, icon: Users, color: "text-[var(--color-indigo)]" },
            { label: "Active Orders", value: mockAnalytics.activeOrders, icon: TrendingUp, color: "text-[var(--color-saffron)]" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue by Month</CardTitle>
              <CardDescription>2025 year to date</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAnalytics.revenueByMonth.map((row) => (
                <div key={row.month} className="flex items-center gap-3">
                  <span className="text-sm w-8 text-muted-foreground">{row.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-[var(--color-saffron)]"
                      style={{ width: `${(row.revenue / 10000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-20 text-right">
                    ₹{row.revenue.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Orders by Status</CardTitle>
              <CardDescription>Current breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAnalytics.ordersByStatus.map((row) => (
                <div key={row.status} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{row.status}</span>
                  <span className="text-sm font-semibold">{row.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">3rd Party Analytics</CardTitle>
            <CardDescription>PostHog / Mixpanel integration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Analytics embed will be placed here once integration is configured</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}