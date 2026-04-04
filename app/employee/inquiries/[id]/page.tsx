import { EmployeeInquiryDetailPage } from "@/features/employee/components/EmployeeInquiriesDetailPage";


export default function EmployeeInquiryDetail({ params }: { params: { id: string } }) {
  return <EmployeeInquiryDetailPage id={params.id} />;
}