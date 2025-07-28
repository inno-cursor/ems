"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Building,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

interface Employee {
  _id: string;
  id?: string;
  employeeCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  designation: string;
  department: string;
  employmentStatus: string;
  joiningDate: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  maritalStatus: string;
  bloodGroup: string;
  personalPhone: string;
  personalEmail: string;
  currentAddress: string;
  permanentAddress: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  employeeType: string;
  reportingManager: string;
  workLocation: string;
  officialEmail: string;
  officePhone: string;
  totalSalary: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  panNumber: string;
  pfNumber: string;
  esiNumber: string;
  annualLeaveBalance: number;
  sickLeaveBalance: number;
  casualLeaveBalance: number;
  shiftTiming: string;
  weeklyOff: string;
  performanceRating: string;
  goals: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EmployeeDetailPage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchEmployee = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${baseUrl}/api/employee/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include auth token
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          if (response.status === 404) {
            setError("Employee not found");
            return;
          }
          throw new Error(`Failed to fetch employee: ${response.statusText}`);
        }

        const data = await response.json();
        setEmployee(data);
      } catch (err) {
        console.error("Error fetching employee:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch employee data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [params.id, router]);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      "on leave": "bg-yellow-100 text-yellow-800",
      terminated: "bg-red-100 text-red-800",
      resigned: "bg-gray-100 text-gray-800",
    };
    return (
      statusColors[status.toLowerCase() as keyof typeof statusColors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading employee details...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="flex space-x-2">
                  <Link href="/employees">
                    <Button variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Employees
                    </Button>
                  </Link>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/employees">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {employee.firstName} {employee.middleName || ""}{" "}
                {employee.lastName}
              </h1>
              <p className="text-gray-600 mt-2">
                {employee.designation} • {employee.department || ""}
              </p>
            </div>
          </div>
          <Link href={`/employees/${employee._id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Employee
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Employee Code</p>
                  <p className="font-semibold">{employee.employeeCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Joining Date</p>
                  <p className="font-semibold">
                    {formatDate(employee.joiningDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold">{employee.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 flex items-center">
                  <Badge className={getStatusBadge(employee.employmentStatus)}>
                    {employee.employmentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="work">Work Details</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="leave">Leave</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-medium">{employee.gender || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-medium">
                        {formatDate(employee.dateOfBirth)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nationality</p>
                      <p className="font-medium">
                        {employee.nationality || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Marital Status</p>
                      <p className="font-medium">
                        {employee.maritalStatus || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="font-medium">
                      {employee.bloodGroup || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Personal Phone</p>
                      <p className="font-medium">
                        {employee.personalPhone || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Personal Email</p>
                      <p className="font-medium">
                        {employee.personalEmail || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Current Address</p>
                      <p className="font-medium">
                        {employee.currentAddress || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Permanent Address</p>
                      <p className="font-medium">
                        {employee.permanentAddress || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Contact Name</p>
                      <p className="font-medium">
                        {employee.emergencyContactName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact Number</p>
                      <p className="font-medium">
                        {employee.emergencyContactNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="work">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Position Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium">
                        {employee.department || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Designation</p>
                      <p className="font-medium">
                        {employee.designation || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Employee Type</p>
                      <p className="font-medium">
                        {employee.employeeType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reporting Manager</p>
                      <p className="font-medium">
                        {employee.reportingManager || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Work Location</p>
                    <p className="font-medium">
                      {employee.workLocation || "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Shift Timing</p>
                      <p className="font-medium">
                        {employee.shiftTiming || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Weekly Off</p>
                      <p className="font-medium">
                        {employee.weeklyOff || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Official Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Official Email</p>
                      <p className="font-medium">
                        {employee.officialEmail || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Office Phone</p>
                      <p className="font-medium">
                        {employee.officePhone || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payroll">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Salary Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        Total Salary (CTC)
                      </p>
                      <p className="font-medium">
                        {formatCurrency(employee.totalSalary)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Basic Salary</p>
                      <p className="font-medium">
                        {formatCurrency(employee.basicSalary)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Allowances</p>
                      <p className="font-medium">
                        {formatCurrency(employee.allowances)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Deductions</p>
                      <p className="font-medium">
                        {formatCurrency(employee.deductions)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Net Salary</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(employee.netSalary)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Bank Name</p>
                    <p className="font-medium">{employee.bankName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="font-medium">
                      {employee.bankAccountNumber || "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">IFSC Code</p>
                      <p className="font-medium">
                        {employee.ifscCode || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">PAN Number</p>
                      <p className="font-medium">
                        {employee.panNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">PF Number</p>
                      <p className="font-medium">
                        {employee.pfNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ESI Number</p>
                      <p className="font-medium">
                        {employee.esiNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leave">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Leave Balances</CardTitle>
                  <CardDescription>
                    Current available leave balances
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Annual Leave</p>
                      <p className="font-medium text-blue-600">
                        {employee.annualLeaveBalance || 0} days
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sick Leave</p>
                      <p className="font-medium text-yellow-600">
                        {employee.sickLeaveBalance || 0} days
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Casual Leave</p>
                    <p className="font-medium text-green-600">
                      {employee.casualLeaveBalance || 0} days
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Work Schedule</CardTitle>
                  <CardDescription>
                    Employee work timing and schedule
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Shift Timing</p>
                    <p className="font-medium">
                      {employee.shiftTiming || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Weekly Off</p>
                    <p className="font-medium">{employee.weeklyOff || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Rating</CardTitle>
                  <CardDescription>
                    Current performance evaluation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Overall Rating</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-2xl text-green-600">
                        {employee.performanceRating || "N/A"}
                      </p>
                      {employee.performanceRating && (
                        <p className="text-sm text-gray-600">/ 5.0</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Goals & Objectives</CardTitle>
                  <CardDescription>
                    Current performance goals and objectives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="text-sm text-gray-600">Current Goals</p>
                    <p className="font-medium mt-2">
                      {employee.goals || "No goals set"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>
                    Account status and system details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Account Status</p>
                      <Badge
                        className={
                          employee.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {employee.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Employee ID</p>
                      <p className="font-medium">{employee._id}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Created At</p>
                      <p className="font-medium">
                        {formatDate(employee.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-medium">
                        {formatDate(employee.updatedAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>
                    Other system-related information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Record Status</p>
                    <Badge className="bg-blue-100 text-blue-800">
                      {employee.isActive ? "Active Record" : "Inactive Record"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
