export const mockOrders = [
  { id: "ORD-001", customer: "Rahul Sharma", service: "GST Registration", amount: 1499, status: "completed", paymentStatus: "paid", date: "2025-03-01" },
  { id: "ORD-002", customer: "Priya Mehta", service: "Company Incorporation", amount: 6999, status: "processing", paymentStatus: "paid", date: "2025-03-05" },
  { id: "ORD-003", customer: "Amit Patel", service: "Trademark Filing", amount: 3999, status: "pending", paymentStatus: "unpaid", date: "2025-03-10" },
  { id: "ORD-004", customer: "Sneha Roy", service: "Income Tax Filing", amount: 999, status: "completed", paymentStatus: "paid", date: "2025-03-12" },
  { id: "ORD-005", customer: "Vikram Singh", service: "GST Registration", amount: 1499, status: "cancelled", paymentStatus: "refunded", date: "2025-03-15" },
  { id: "ORD-006", customer: "Neha Gupta", service: "FSSAI License", amount: 2499, status: "processing", paymentStatus: "partial", date: "2025-03-18" },
];

export const mockPayments = [
  { id: "PAY-001", orderId: "ORD-001", customer: "Rahul Sharma", amount: 1499, method: "Razorpay", status: "paid", date: "2025-03-01" },
  { id: "PAY-002", orderId: "ORD-002", customer: "Priya Mehta", amount: 6999, method: "Razorpay", status: "paid", date: "2025-03-05" },
  { id: "PAY-003", orderId: "ORD-003", customer: "Amit Patel", amount: 3999, method: "—", status: "unpaid", date: "—" },
  { id: "PAY-004", orderId: "ORD-004", customer: "Sneha Roy", amount: 999, method: "Razorpay", status: "paid", date: "2025-03-12" },
  { id: "PAY-005", orderId: "ORD-005", customer: "Vikram Singh", amount: 1499, method: "Razorpay", status: "refunded", date: "2025-03-16" },
  { id: "PAY-006", orderId: "ORD-006", customer: "Neha Gupta", amount: 1200, method: "Razorpay", status: "partial", date: "2025-03-18" },
];

export const mockCustomers = [
  { id: "CUS-001", name: "Rahul Sharma", email: "rahul@example.com", mobile: "+91 98765 43210", orders: 3, joined: "2025-01-15" },
  { id: "CUS-002", name: "Priya Mehta", email: "priya@example.com", mobile: "+91 87654 32109", orders: 1, joined: "2025-02-01" },
  { id: "CUS-003", name: "Amit Patel", email: "amit@example.com", mobile: "+91 76543 21098", orders: 2, joined: "2025-02-10" },
  { id: "CUS-004", name: "Sneha Roy", email: "sneha@example.com", mobile: "+91 65432 10987", orders: 1, joined: "2025-02-20" },
  { id: "CUS-005", name: "Vikram Singh", email: "vikram@example.com", mobile: "+91 54321 09876", orders: 0, joined: "2025-03-01" },
  { id: "CUS-006", name: "Neha Gupta", email: "neha@example.com", mobile: "+91 43210 98765", orders: 1, joined: "2025-03-05" },
];

export const mockEmployees = [
  { id: "EMP-001", name: "Arjun Verma", email: "arjun@startupkaro.com", role: "EMPLOYEE", status: "active", joined: "2024-10-01" },
  { id: "EMP-002", name: "Kavya Nair", email: "kavya@startupkaro.com", role: "EMPLOYEE", status: "active", joined: "2024-11-15" },
  { id: "EMP-003", name: "Rohit Das", email: "rohit@startupkaro.com", role: "EMPLOYEE", status: "inactive", joined: "2024-12-01" },
];

export const mockInquiries = [
  {
    id: "INQ-001",
    name: "Suresh Kumar",
    email: "suresh@example.com",
    mobile: "+91 99887 76655",
    message: "I want to know more about GST registration process and the cost involved.",
    date: "2025-03-18",
    status: "resolved" as const,
    notes: ["Called customer on 2025-03-19. Explained GST registration process.", "Sent detailed email with pricing breakdown."],
  },
  {
    id: "INQ-002",
    name: "Meena Iyer",
    email: "meena@example.com",
    mobile: "+91 88776 65544",
    message: "Need help with company incorporation for a tech startup.",
    date: "2025-03-19",
    status: "unresolved" as const,
    notes: ["Follow up scheduled for 2025-03-22."],
  },
  {
    id: "INQ-003",
    name: "Deepak Joshi",
    email: "deepak@example.com",
    mobile: "+91 77665 54433",
    message: "Looking for trademark registration services. What documents are needed?",
    date: "2025-03-20",
    status: "unresolved" as const,
    notes: [],
  },
];

export const mockAnalytics = {
  totalRevenue: 16895,
  totalOrders: 6,
  totalCustomers: 6,
  activeOrders: 2,
  revenueByMonth: [
    { month: "Jan", revenue: 2400 },
    { month: "Feb", revenue: 5600 },
    { month: "Mar", revenue: 8895 },
  ],
  ordersByStatus: [
    { status: "Completed", count: 2 },
    { status: "Processing", count: 2 },
    { status: "Pending", count: 1 },
    { status: "Cancelled", count: 1 },
  ],
};

export const mockServices = [
  { id: "SVC-001", name: "GST Registration", description: "Register your business for GST and get your GSTIN within 7 working days.", price: 1499, duration: "7 days", category: "Tax" },
  { id: "SVC-002", name: "Company Incorporation", description: "Incorporate a Private Limited Company with MCA registration included.", price: 6999, duration: "15 days", category: "Business" },
  { id: "SVC-003", name: "Trademark Filing", description: "File your trademark application and protect your brand identity.", price: 3999, duration: "10 days", category: "Legal" },
  { id: "SVC-004", name: "Income Tax Filing", description: "File your individual or business income tax return hassle-free.", price: 999, duration: "3 days", category: "Tax" },
  { id: "SVC-005", name: "FSSAI License", description: "Get your food business operator license from FSSAI.", price: 2499, duration: "10 days", category: "License" },
  { id: "SVC-006", name: "Import Export Code", description: "Obtain your IEC code for international trade from DGFT.", price: 1999, duration: "5 days", category: "Business" },
];

export const mockPurchases = [
  { id: "PUR-001", service: "GST Registration", amount: 1499, status: "completed", paymentStatus: "paid", date: "2025-02-10", invoiceUrl: "#" },
  { id: "PUR-002", service: "Income Tax Filing", amount: 999, status: "processing", paymentStatus: "paid", date: "2025-03-05", invoiceUrl: "#" },
];
