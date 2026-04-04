import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockInquiries } from "@/lib/mock-data";

export function EmployeeInquiryDetailPage({ id }: { id: string }) {
  const inquiry = mockInquiries.find((i) => i.id === id) ?? mockInquiries[0];

  return (
    <div>
      <PageHeader title="Inquiry Detail" />
      <div className="p-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="text-base">Inquiry from {inquiry.name}</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            {[
              { label: "Name", value: inquiry.name },
              { label: "Email", value: inquiry.email },
              { label: "Mobile", value: inquiry.mobile },
              { label: "Date", value: inquiry.date },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
            <div className="pt-2 border-t">
              <p className="text-muted-foreground text-xs mb-2">Message</p>
              <p className="text-sm leading-relaxed">{inquiry.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}