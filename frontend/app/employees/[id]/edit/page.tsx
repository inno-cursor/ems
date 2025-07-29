"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface Employee {
  firstName: string;
  middleName: string;
  lastName: string;
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
  department: string;
  designation: string;
  employeeType: string;
  joiningDate: string;
  employmentStatus: string;
  reportingManager: string;
  workLocation: string;
  officialEmail: string;
  officePhone: string;
  employeeCode: string;
  totalSalary: string;
  basicSalary: string;
  allowances: string;
  deductions: string;
  netSalary: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  panNumber: string;
  pfNumber: string;
  esiNumber: string;
  annualLeaveBalance: string;
  sickLeaveBalance: string;
  casualLeaveBalance: string;
  shiftTiming: string;
  weeklyOff: string;
  performanceRating: string;
  goals: string;
  isActive: boolean; // Account status
}

type AlertType = "success" | "error" | null;

export default function EditEmployeePage() {
  const [formData, setFormData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: AlertType; message: string }>({
    type: null,
    message: "",
  });

  const router = useRouter();
  const params = useParams();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchEmployee() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setAlert({
            type: "error",
            message: "Authentication token not found. Please login again.",
          });
          return;
        }
        const res = await axios.get(`${baseUrl}/api/employee/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
        setAlert({ type: null, message: "" });
      } catch (err: any) {
        console.error("Failed to load employee:", err);
        setAlert({
          type: "error",
          message: err.response?.data?.message || "Failed to load employee data",
        });
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchEmployee();
    }
  }, [params.id, baseUrl]);

  // Auto-dismiss alert after 5 seconds
  useEffect(() => {
    if (alert.type) {
      const timer = setTimeout(() => {
        setAlert({ type: null, message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Handle input change with special handling for isActive boolean field
  const handleInputChange = (field: keyof Employee, value: string) => {
    if (field === "isActive") {
      setFormData((prev) => (prev ? { ...prev, [field]: value === "true" } : null));
    } else {
      setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
    }
  };

  // Render input helpers with string conversion for values
  const renderInput = (label: string, field: keyof Employee, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <Input
        id={field}
        type={type}
        value={formData?.[field] === undefined || formData?.[field] === null ? "" : String(formData[field])}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={submitting}
      />
    </div>
  );

  const renderTextarea = (label: string, field: keyof Employee) => (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <Textarea
        id={field}
        value={formData?.[field] === undefined || formData?.[field] === null ? "" : String(formData[field])}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={submitting}
        rows={3}
      />
    </div>
  );

  const renderSelect = (
    label: string,
    field: keyof Employee,
    options: { value: string; label: string }[]
  ) => (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <Select
        value={
          field === "isActive"
            ? formData
              ? formData[field]
                ? "true"
                : "false"
              : ""
            : formData?.[field] || ""
        }
        onValueChange={(value) => handleInputChange(field, value)}
        disabled={submitting}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setAlert({ type: "error", message: "Authentication token not found. Please login again." });
        return;
      }
      await axios.patch(`${baseUrl}/api/employee/${params.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({ type: "success", message: "Employee updated successfully!" });
      setTimeout(() => {
        router.push(`/employees/${params.id}`);
      }, 1500);
    } catch (error: any) {
      console.error("Failed to update employee:", error);
      setAlert({ type: "error", message: error.response?.data?.message || "Failed to update employee" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64 text-lg">Loading employee data...</div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto p-6">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load employee data. Please try again.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl">
        {alert.type && (
          <Alert className={`mb-6 ${alert.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            {alert.type === "success" ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
            <AlertDescription className={alert.type === "success" ? "text-green-800" : "text-red-800"}>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href={`/employees/${params.id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Edit Employee</h1>
              <p className="text-muted-foreground">Update employee information</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="salary">Salary & Benefits</TabsTrigger>
              <TabsTrigger value="other">Other Details</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Basic personal details</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput("First Name", "firstName")}
                  {renderInput("Middle Name", "middleName")}
                  {renderInput("Last Name", "lastName")}
                  {renderSelect("Gender", "gender", [
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ])}
                  {renderInput("Date of Birth", "dateOfBirth", "date")}
                  {renderInput("Nationality", "nationality")}
                  {renderSelect("Marital Status", "maritalStatus", [
                    { value: "Single", label: "Single" },
                    { value: "Married", label: "Married" },
                    { value: "Divorced", label: "Divorced" },
                    { value: "Widowed", label: "Widowed" },
                  ])}
                  {renderSelect("Blood Group", "bloodGroup", [
                    { value: "A+", label: "A+" },
                    { value: "A-", label: "A-" },
                    { value: "B+", label: "B+" },
                    { value: "B-", label: "B-" },
                    { value: "AB+", label: "AB+" },
                    { value: "AB-", label: "AB-" },
                    { value: "O+", label: "O+" },
                    { value: "O-", label: "O-" },
                  ])}
                  {renderInput("Personal Phone", "personalPhone", "tel")}
                  {renderInput("Personal Email", "personalEmail", "email")}
                  <div className="md:col-span-2">{renderTextarea("Current Address", "currentAddress")}</div>
                  <div className="md:col-span-2">{renderTextarea("Permanent Address", "permanentAddress")}</div>
                  {renderInput("Emergency Contact Name", "emergencyContactName")}
                  {renderInput("Emergency Contact Number", "emergencyContactNumber", "tel")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employment">
              <Card>
                <CardHeader>
                  <CardTitle>Employment Details</CardTitle>
                  <CardDescription>Work-related information</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput("Department", "department")}
                  {renderInput("Designation", "designation")}
                  {renderSelect("Employee Type", "employeeType", [
                    { value: "Full-time", label: "Full-time" },
                    { value: "Part-time", label: "Part-time" },
                    { value: "Contract", label: "Contract" },
                    { value: "Intern", label: "Intern" },
                  ])}
                  {renderInput("Joining Date", "joiningDate", "date")}
                  {renderSelect("Employment Status", "employmentStatus", [
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                    { value: "Terminated", label: "Terminated" },
                    { value: "On Leave", label: "On Leave" },
                  ])}
                  {renderInput("Reporting Manager", "reportingManager")}
                  {renderInput("Work Location", "workLocation")}
                  {renderInput("Official Email", "officialEmail", "email")}
                  {renderInput("Office Phone", "officePhone", "tel")}
                  {renderInput("Employee Code", "employeeCode")}

                  {/* isActive field */}
                  {renderSelect("Account Status", "isActive", [
                    { value: "true", label: "Active" },
                    { value: "false", label: "Inactive" },
                  ])}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="salary">
              <Card>
                <CardHeader>
                  <CardTitle>Salary & Benefits</CardTitle>
                  <CardDescription>Compensation and statutory details</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput("Total Salary", "totalSalary", "number")}
                  {renderInput("Basic Salary", "basicSalary", "number")}
                  {renderInput("Allowances", "allowances", "number")}
                  {renderInput("Deductions", "deductions", "number")}
                  {renderInput("Net Salary", "netSalary", "number")}
                  {renderInput("Bank Name", "bankName")}
                  {renderInput("Bank Account Number", "bankAccountNumber")}
                  {renderInput("IFSC Code", "ifscCode")}
                  {renderInput("PAN Number", "panNumber")}
                  {renderInput("PF Number", "pfNumber")}
                  {renderInput("ESI Number", "esiNumber")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="other">
              <Card>
                <CardHeader>
                  <CardTitle>Other Details</CardTitle>
                  <CardDescription>
                    Leave balance, performance, and additional information
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput("Annual Leave Balance", "annualLeaveBalance", "number")}
                  {renderInput("Sick Leave Balance", "sickLeaveBalance", "number")}
                  {renderInput("Casual Leave Balance", "casualLeaveBalance", "number")}
                  {renderInput("Shift Timing", "shiftTiming")}
                  {renderInput("Weekly Off", "weeklyOff")}
                  {renderSelect("Performance Rating", "performanceRating", [
                    { value: "Excellent", label: "Excellent" },
                    { value: "Good", label: "Good" },
                    { value: "Average", label: "Average" },
                    { value: "Below Average", label: "Below Average" },
                    { value: "Poor", label: "Poor" },
                  ])}
                  <div className="md:col-span-2">{renderTextarea("Goals", "goals")}</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 mt-6">
            <Link href={`/employees/${params.id}`}>
              <Button type="button" variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={submitting}>
              <Save className="w-4 h-4 mr-2" />
              {submitting ? "Updating..." : "Update Employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
