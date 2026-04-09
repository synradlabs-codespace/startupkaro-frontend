import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockCustomers, mockOrders } from "@/lib/mock-data";
import { Mail, Phone, Eye } from "lucide-react";

export function EmployeeCustomerDetailPage({ id }: { id: string }) {
  const customer = mockCustomers.find((c) => c.id === id) ?? mockCustomers[0];
  const orders = mockOrders.slice(0, customer.orders || 1);

  return (
    <div>
      <PageHeader title="Customer Profile" />
      <div className="p-6 space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="text-base bg-[var(--color-indigo)]/10 text-[var(--color-indigo)]">
                  {customer.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-base">{customer.name}</p>
                <div className="flex gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{customer.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{customer.mobile}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Joined {customer.joined} · {customer.orders} orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Orders & Payment Status</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No orders yet
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell>{order.service}</TableCell>
                      <TableCell>₹{order.amount.toLocaleString("en-IN")}</TableCell>
                      <TableCell><OrderStatusBadge status={order.status as any} /></TableCell>
                      <TableCell><PaymentStatusBadge status={order.paymentStatus as any} /></TableCell>
                      <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/employee/orders/${order.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[var(--color-indigo)]/10 hover:text-[var(--color-indigo)]">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}