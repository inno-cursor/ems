"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import axios from "axios";

interface EmployeeFormData {
  // Personal Information
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

  // Company/Work Details
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

  // Payroll & Bank Details
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

  // Leave & Attendance
  annualLeaveBalance: string;
  sickLeaveBalance: string;
  casualLeaveBalance: string;
  shiftTiming: string;
  weeklyOff: string;

  // Status
  isActive: boolean;

  // Performance & Appraisal
  performanceRating: string;
  goals: string;
}

type AlertType = "success" | "error" | null;

export default function AddEmployeePage() {
  const [formData, setFormData] = useState<EmployeeFormData>({
    // Personal Information
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    maritalStatus: "",
    bloodGroup: "",
    personalPhone: "",
    personalEmail: "",
    currentAddress: "",
    permanentAddress: "",
    emergencyContactName: "",
    emergencyContactNumber: "",

    // Company/Work Details
    department: "",
    designation: "",
    employeeType: "",
    joiningDate: "",
    employmentStatus: "Active",
    reportingManager: "",
    workLocation: "",
    officialEmail: "",
    officePhone: "",
    employeeCode: "",

    // Payroll & Bank Details
    totalSalary: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    netSalary: "",
    bankName: "",
    bankAccountNumber: "",
    ifscCode: "",
    panNumber: "",
    pfNumber: "",
    esiNumber: "",

    // Leave & Attendance
    annualLeaveBalance: "",
    sickLeaveBalance: "",
    casualLeaveBalance: "",
    shiftTiming: "",
    weeklyOff: "",

    // Status (default true)
    isActive: true,

    // Performance & Appraisal
    performanceRating: "",
    goals: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: AlertType; message: string }>({
    type: null,
    message: "",
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (alert.type) {
      const timer = setTimeout(() => {
        setAlert({ type: null, message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Handle input changes, including boolean conversion for isActive
  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    if (field === "isActive") {
      setFormData((prev) => ({ ...prev, [field]: value === "true" }));
      if (validationErrors[field]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Basic form validations
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.department.trim())
      errors.department = "Department is required";
    if (!formData.designation.trim())
      errors.designation = "Designation is required";
    if (!formData.joiningDate.trim())
      errors.joiningDate = "Joining date is required";
    if (!formData.employeeCode.trim())
      errors.employeeCode = "Employee code is required";
    if (!formData.officialEmail.trim())
      errors.officialEmail = "Official email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.personalEmail && !emailRegex.test(formData.personalEmail)) {
      errors.personalEmail = "Please enter a valid email address";
    }
    if (formData.officialEmail && !emailRegex.test(formData.officialEmail)) {
      errors.officialEmail = "Please enter a valid email address";
    }

    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (formData.personalPhone && !phoneRegex.test(formData.personalPhone)) {
      errors.personalPhone = "Please enter a valid phone number";
    }
    if (
      formData.emergencyContactNumber &&
      !phoneRegex.test(formData.emergencyContactNumber)
    ) {
      errors.emergencyContactNumber = "Please enter a valid phone number";
    }

    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16 || age > 100) {
        errors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    if (formData.joiningDate) {
      const joinDate = new Date(formData.joiningDate);
      const today = new Date();
      if (joinDate > today) {
        errors.joiningDate = "Joining date cannot be in the future";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlert({
        type: "error",
        message: "Please fix the validation errors before submitting.",
      });
      return;
    }

    const payload = {
      // Mandatory fields
      employeeCode: formData.employeeCode,
      firstName: formData.firstName,
      department: formData.department,
      designation: formData.designation,
      employmentStatus: formData.employmentStatus || "Active",
      joiningDate: formData.joiningDate,
      isActive: formData.isActive,

      // Optional fields included only if truthy
      ...(formData.middleName && { middleName: formData.middleName }),
      ...(formData.lastName && { lastName: formData.lastName }),
      ...(formData.gender && { gender: formData.gender }),
      ...(formData.dateOfBirth && { dateOfBirth: formData.dateOfBirth }),
      ...(formData.nationality && { nationality: formData.nationality }),
      ...(formData.maritalStatus && { maritalStatus: formData.maritalStatus }),
      ...(formData.bloodGroup && { bloodGroup: formData.bloodGroup }),
      ...(formData.personalPhone && { personalPhone: formData.personalPhone }),
      ...(formData.personalEmail && { personalEmail: formData.personalEmail }),
      ...(formData.currentAddress && {
        currentAddress: formData.currentAddress,
      }),
      ...(formData.permanentAddress && {
        permanentAddress: formData.permanentAddress,
      }),
      ...(formData.emergencyContactName && {
        emergencyContactName: formData.emergencyContactName,
      }),
      ...(formData.emergencyContactNumber && {
        emergencyContactNumber: formData.emergencyContactNumber,
      }),
      ...(formData.employeeType && { employeeType: formData.employeeType }),
      ...(formData.reportingManager && {
        reportingManager: formData.reportingManager,
      }),
      ...(formData.workLocation && { workLocation: formData.workLocation }),
      ...(formData.officialEmail && { officialEmail: formData.officialEmail }),
      ...(formData.officePhone && { officePhone: formData.officePhone }),
      ...(formData.totalSalary && { totalSalary: formData.totalSalary }),
      ...(formData.basicSalary && { basicSalary: formData.basicSalary }),
      ...(formData.allowances && { allowances: formData.allowances }),
      ...(formData.deductions && { deductions: formData.deductions }),
      ...(formData.netSalary && { netSalary: formData.netSalary }),
      ...(formData.bankName && { bankName: formData.bankName }),
      ...(formData.bankAccountNumber && {
        bankAccountNumber: formData.bankAccountNumber,
      }),
      ...(formData.ifscCode && { ifscCode: formData.ifscCode }),
      ...(formData.panNumber && { panNumber: formData.panNumber }),
      ...(formData.pfNumber && { pfNumber: formData.pfNumber }),
      ...(formData.esiNumber && { esiNumber: formData.esiNumber }),
      ...(formData.annualLeaveBalance && {
        annualLeaveBalance: formData.annualLeaveBalance,
      }),
      ...(formData.sickLeaveBalance && {
        sickLeaveBalance: formData.sickLeaveBalance,
      }),
      ...(formData.casualLeaveBalance && {
        casualLeaveBalance: formData.casualLeaveBalance,
      }),
      ...(formData.shiftTiming && { shiftTiming: formData.shiftTiming }),
      ...(formData.weeklyOff && { weeklyOff: formData.weeklyOff }),
      ...(formData.performanceRating && {
        performanceRating: formData.performanceRating,
      }),
      ...(formData.goals && { goals: formData.goals }),
    };

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setAlert({
          type: "error",
          message: "Authentication token not found. Please login again.",
        });
        return;
      }

      const response = await axios.post(
        `${baseUrl}/api/employee/create`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAlert({ type: "success", message: "Employee created successfully!" });

      // Redirect after success
      setTimeout(() => {
        router.push("/employees");
      }, 1500);
    } catch (error: any) {
      console.error("Error saving employee:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create employee";
      setAlert({ type: "error", message: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to render text/number inputs
  const renderInput = (
    label: string,
    field: keyof EmployeeFormData,
    type = "text",
    required = false,
    placeholder?: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={field}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={field}
        type={type}
        value={
          formData[field] === undefined || formData[field] === null
            ? ""
            : String(formData[field])
        }
        onChange={(e) => handleInputChange(field, e.target.value)}
        required={required}
        disabled={submitting}
        placeholder={placeholder}
        className={validationErrors[field] ? "border-red-500" : ""}
      />
      {validationErrors[field] && (
        <p className="text-sm text-red-500">{validationErrors[field]}</p>
      )}
    </div>
  );

  // Helper to render select dropdowns (handles isActive boolean properly)
  const renderSelect = (
    label: string,
    field: keyof EmployeeFormData,
    options: { value: string; label: string }[],
    required = false,
    placeholder?: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={field}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select
        value={
          field === "isActive"
            ? formData.isActive
              ? "true"
              : "false"
            : (formData[field] as unknown as string)
        }
        onValueChange={(value) => handleInputChange(field, value)}
        disabled={submitting}
      >
        <SelectTrigger
          className={validationErrors[field] ? "border-red-500" : ""}
        >
          <SelectValue
            placeholder={placeholder || `Select ${label.toLowerCase()}`}
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {validationErrors[field] && (
        <p className="text-sm text-red-500">{validationErrors[field]}</p>
      )}
    </div>
  );

  const renderTextarea = (
    label: string,
    field: keyof EmployeeFormData,
    placeholder?: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <Textarea
        id={field}
        value={
          formData[field] === undefined || formData[field] === null
            ? ""
            : String(formData[field])
        }
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={submitting}
        placeholder={placeholder}
        rows={3}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Alerts */}
        {alert.type && (
          <Alert
            className={`mb-6 ${
              alert.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            {alert.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription
              className={
                alert.type === "success" ? "text-green-800" : "text-red-800"
              }
            >
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Header & Navigation */}
        <div className="flex items-center mb-6">
          <Link href="/employees">
            <Button
              variant="outline"
              size="sm"
              className="mr-4"
              disabled={submitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Employee
            </h1>
            <p className="text-gray-600 mt-2">
              Fill in the employee information
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal" disabled={submitting}>
                Personal
              </TabsTrigger>
              <TabsTrigger value="work" disabled={submitting}>
                Work Details
              </TabsTrigger>
              <TabsTrigger value="payroll" disabled={submitting}>
                Payroll
              </TabsTrigger>
              <TabsTrigger value="leave" disabled={submitting}>
                Leave
              </TabsTrigger>
              <TabsTrigger value="performance" disabled={submitting}>
                Performance
              </TabsTrigger>
            </TabsList>

            {/* Personal Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Basic personal details of the employee
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderInput("First Name", "firstName", "text", true)}
                    {renderInput("Middle Name", "middleName")}
                    {renderInput("Last Name", "lastName", "text", true)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSelect("Gender", "gender", [
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ])}
                    {renderInput("Date of Birth", "dateOfBirth", "date")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput("Nationality", "nationality")}
                    {renderSelect("Marital Status", "maritalStatus", [
                      { value: "Single", label: "Single" },
                      { value: "Married", label: "Married" },
                      { value: "Divorced", label: "Divorced" },
                      { value: "Widowed", label: "Widowed" },
                    ])}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  {renderInput("Personal Email", "personalEmail", "email")}
                  {renderTextarea("Current Address", "currentAddress")}
                  {renderTextarea("Permanent Address", "permanentAddress")}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput(
                      "Emergency Contact Name",
                      "emergencyContactName"
                    )}
                    {renderInput(
                      "Emergency Contact Number",
                      "emergencyContactNumber",
                      "tel"
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Work Tab */}
            <TabsContent value="work">
              <Card>
                <CardHeader>
                  <CardTitle>Work Details</CardTitle>
                  <CardDescription>
                    Company and work-related information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSelect(
                      "Department",
                      "department",
                      [
                        { value: "Engineering", label: "Engineering" },
                        { value: "Human Resources", label: "Human Resources" },
                        { value: "Finance", label: "Finance" },
                        { value: "Marketing", label: "Marketing" },
                        { value: "Sales", label: "Sales" },
                        { value: "Operations", label: "Operations" },
                      ],
                      true
                    )}
                    {renderInput("Designation", "designation", "text", true)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSelect("Employee Type", "employeeType", [
                      { value: "Full-time", label: "Full-time" },
                      { value: "Part-time", label: "Part-time" },
                      { value: "Intern", label: "Intern" },
                      { value: "Contractor", label: "Contractor" },
                    ])}
                    {renderInput("Joining Date", "joiningDate", "date", true)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSelect("Employment Status", "employmentStatus", [
                      { value: "Active", label: "Active" },
                      { value: "On Leave", label: "On Leave" },
                      { value: "Terminated", label: "Terminated" },
                      { value: "Resigned", label: "Resigned" },
                    ])}
                    {renderInput("Reporting Manager", "reportingManager")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput("Work Location", "workLocation")}
                    {renderInput(
                      "Official Email",
                      "officialEmail",
                      "email",
                      true
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput("Office Phone Extension", "officePhone")}
                    {renderInput("Employee Code", "employeeCode", "text", true)}
                  </div>
                  {/* Account Status Select */}
                  <div className="mt-4">
                    {renderSelect(
                      "Account Status",
                      "isActive",
                      [
                        { value: "true", label: "Active" },
                        { value: "false", label: "Inactive" },
                      ],
                      true
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payroll Tab */}
            <TabsContent value="payroll">
              <Card>
                <CardHeader>
                  <CardTitle>Payroll & Bank Details</CardTitle>
                  <CardDescription>
                    Salary and banking information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput("Total Salary (CTC)", "totalSalary", "number")}
                    {renderInput("Basic Salary", "basicSalary", "number")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput("Allowances", "allowances", "number")}
                    {renderInput("Deductions", "deductions", "number")}
                  </div>
                  {renderInput("Net Salary", "netSalary", "number")}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput("Bank Name", "bankName")}
                    {renderInput("Bank Account Number", "bankAccountNumber")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput("IFSC Code", "ifscCode")}
                    {renderInput("PAN Number", "panNumber")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput("PF Number", "pfNumber")}
                    {renderInput("ESI Number", "esiNumber")}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leave Tab */}
            <TabsContent value="leave">
              <Card>
                <CardHeader>
                  <CardTitle>Leave & Attendance</CardTitle>
                  <CardDescription>
                    Leave balances and attendance settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderInput(
                      "Annual Leave Balance",
                      "annualLeaveBalance",
                      "number"
                    )}
                    {renderInput(
                      "Sick Leave Balance",
                      "sickLeaveBalance",
                      "number"
                    )}
                    {renderInput(
                      "Casual Leave Balance",
                      "casualLeaveBalance",
                      "number"
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput(
                      "Shift Timing",
                      "shiftTiming",
                      "text",
                      false,
                      "e.g., 9:00 AM - 6:00 PM"
                    )}
                    {renderSelect("Weekly Off Day", "weeklyOff", [
                      { value: "Sunday", label: "Sunday" },
                      { value: "Monday", label: "Monday" },
                      { value: "Tuesday", label: "Tuesday" },
                      { value: "Wednesday", label: "Wednesday" },
                      { value: "Thursday", label: "Thursday" },
                      { value: "Friday", label: "Friday" },
                      { value: "Saturday", label: "Saturday" },
                    ])}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Performance & Appraisal</CardTitle>
                  <CardDescription>
                    Performance ratings and goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {renderSelect("Performance Rating", "performanceRating", [
                    { value: "5", label: "5 - Outstanding" },
                    { value: "4", label: "4 - Exceeds Expectations" },
                    { value: "3", label: "3 - Meets Expectations" },
                    { value: "2", label: "2 - Below Expectations" },
                    { value: "1", label: "1 - Unsatisfactory" },
                  ])}
                  {renderTextarea(
                    "Goals/KPIs",
                    "goals",
                    "Enter employee goals and KPIs"
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <Link href="/employees">
              <Button type="button" variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Employee
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
