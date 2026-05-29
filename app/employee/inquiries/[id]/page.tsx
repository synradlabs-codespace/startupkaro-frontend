import { EmployeeInquiryDetailPage } from "@/features/employee/components/EmployeeInquiriesDetailPage";


export default async function EmployeeInquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EmployeeInquiryDetailPage id={id} />;
}