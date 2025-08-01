"use client";

import type React from "react";

import { useState, useRef } from "react";
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
import {
  CalendarDays,
  Download,
  Eye,
  PrinterIcon as Print,
  User,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";

interface EmployeeData {
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  payPeriod: string;
}

interface SalaryData {
  basicSalary: number;
  hra: number;
  transportAllowance: number;
  medicalAllowance: number;
  otherAllowances: number;
  providentFund: number;
  professionalTax: number;
  incomeTax: number;
  otherDeductions: number;
}

export default function Component() {
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    name: "",
    employeeId: "",
    designation: "",
    department: "",
    dateOfJoining: "",
    payPeriod: "",
  });

  const [salaryData, setSalaryData] = useState<SalaryData>({
    basicSalary: 0,
    hra: 0,
    transportAllowance: 0,
    medicalAllowance: 0,
    otherAllowances: 0,
    providentFund: 0,
    professionalTax: 0,
    incomeTax: 0,
    otherDeductions: 0,
  });

  const [showPreview, setShowPreview] = useState(false);
  const salarySlipRef = useRef<HTMLDivElement>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");

  const totalEarnings =
    salaryData.basicSalary +
    salaryData.hra +
    salaryData.transportAllowance +
    salaryData.medicalAllowance +
    salaryData.otherAllowances;
  const totalDeductions =
    salaryData.providentFund +
    salaryData.professionalTax +
    salaryData.incomeTax +
    salaryData.otherDeductions;
  const netSalary = totalEarnings - totalDeductions;

  const handleEmployeeChange = (field: keyof EmployeeData, value: string) => {
    setEmployeeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalaryChange = (field: keyof SalaryData, value: string) => {
    setSalaryData((prev) => ({
      ...prev,
      [field]: Number.parseFloat(value) || 0,
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (salarySlipRef.current) {
      try {
        // Create canvas from the salary slip element
        const canvas = await html2canvas(salarySlipRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: salarySlipRef.current.scrollWidth,
          height: salarySlipRef.current.scrollHeight,
        });

        // Calculate dimensions
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );

        // Generate filename
        const filename = `salary-slip-${
          employeeData.employeeId || "employee"
        }-${employeeData.payPeriod || "current"}.pdf`;
        pdf.save(filename);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert(
          "Error generating PDF. Please try using the Print option instead."
        );
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handlePrintToPDF = () => {
    // Enhanced print styles for better PDF output
    const printStyles = `
      <style>
        @media print {
          body { margin: 0; padding: 0; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:w-full { width: 100% !important; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
        }
      </style>
    `;

    const originalTitle = document.title;
    document.title = `Salary-Slip-${employeeData.employeeId || "Employee"}-${
      employeeData.payPeriod || "Current"
    }`;

    // Add print styles
    const styleElement = document.createElement("style");
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);

    window.print();

    // Cleanup
    document.title = originalTitle;
    document.head.removeChild(styleElement);
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6 print:hidden">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              ← Back to Form
            </Button>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline">
                <Print className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handlePrintToPDF} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Minimalist Salary Slip */}
          <div
            ref={salarySlipRef}
            className="bg-white shadow-sm print:shadow-none border border-gray-200"
          >
            {/* Simple Header with Logo */}
            <div className="text-center py-8 border-b border-gray-200">
              {logoUrl ? (
                <div className="mb-4">
                  <img
                    src={logoUrl || "/placeholder.svg"}
                    alt="Company Logo"
                    className="h-16 w-auto mx-auto object-contain"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <div className="h-16 w-16 mx-auto rounded-full flex items-center justify-center border-2 border-dashed">
                    <Image
                      src="/innovative-cursor.png"
                      width={500}
                      height={500}
                      alt="Logo"
                    />
                  </div>
                </div>
              )}
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Innovative Cursor
              </h1>
              <h2 className="text-lg text-gray-800">
                Payslip - {employeeData.payPeriod || "March 2024"}
              </h2>
            </div>

            <div className="p-8">
              {/* Employee Details */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Employee Name</span>
                    <span className="font-medium">
                      {employeeData.name || "----"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Employee ID</span>
                    <span className="font-medium">
                      {employeeData.employeeId || "----"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Designation</span>
                    <span className="font-medium">
                      {employeeData.designation || "----"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Date of Joining</span>
                    <span className="font-medium">
                      {employeeData.dateOfJoining || "30/06/2020"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Pay Period</span>
                    <span className="font-medium">
                      {employeeData.payPeriod || "March 2024"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Pay Date</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString("en-GB")}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Working Days</span>
                    <span className="font-medium">22</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">LOP Days</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="text-center py-6 mb-8 border border-gray-200 rounded">
                <div className="text-3xl font-semibold text-gray-900 mb-1">
                  {formatCurrency(netSalary)}
                </div>
                <div className="text-gray-600">Net Pay</div>
              </div>

              {/* Earnings and Deductions */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Earnings */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Earnings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Basic Salary</span>
                      <span className="font-medium">
                        {formatCurrency(salaryData.basicSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">HRA</span>
                      <span className="font-medium">
                        {formatCurrency(salaryData.hra)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transport Allowance</span>
                      <span className="font-medium">
                        {formatCurrency(salaryData.transportAllowance)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Medical Allowance</span>
                      <span className="font-medium">
                        {formatCurrency(salaryData.medicalAllowance)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other Allowances</span>
                      <span className="font-medium">
                        {formatCurrency(salaryData.otherAllowances)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                      <span>Total Earnings</span>
                      <span>{formatCurrency(totalEarnings)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Deductions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">EPF Contribution</span>
                      <span className="font-medium">
                        {formatCurrency(salaryData.providentFund)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Professional Tax</span>
                      <span className="font-medium">
                        {formatCurrency(salaryData.professionalTax)}
                      </span>
                    </div>
                    {salaryData.incomeTax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Income Tax</span>
                        <span className="font-medium">
                          {formatCurrency(salaryData.incomeTax)}
                        </span>
                      </div>
                    )}
                    {salaryData.otherDeductions > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Other Deductions</span>
                        <span className="font-medium">
                          {formatCurrency(salaryData.otherDeductions)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                      <span>Total Deductions</span>
                      <span>{formatCurrency(totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Gross Earnings</span>
                  <span className="text-lg font-semibold">
                    {formatCurrency(totalEarnings)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">
                    Total Deductions
                  </span>
                  <span className="text-lg font-semibold">
                    {formatCurrency(totalDeductions)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xl font-semibold border-t border-gray-200 pt-4">
                  <span>Net Payable</span>
                  <span>{formatCurrency(netSalary)}</span>
                </div>
              </div>

              {/* Amount in Words */}
              <div className="text-center py-4 bg-gray-50 rounded mb-6">
                <span className="text-gray-700">
                  Amount in words:{" "}
                  {netSalary > 0
                    ? `Rupees ${Math.floor(netSalary).toLocaleString(
                        "en-IN"
                      )} Only`
                    : "Zero"}
                </span>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
                <p>
                  This is a computer-generated payslip. No signature required.
                </p>
                <p className="mt-1">
                  Generated on {new Date().toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Salary Slip Generator
          </h1>
          <p className="text-gray-600">
            Create professional salary slips with ease
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Employee Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Employee Information
              </CardTitle>
              <CardDescription>
                Enter the employee's basic details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={employeeData.name}
                    onChange={(e) =>
                      handleEmployeeChange("name", e.target.value)
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={employeeData.employeeId}
                    onChange={(e) =>
                      handleEmployeeChange("employeeId", e.target.value)
                    }
                    placeholder="EMP001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={employeeData.designation}
                    onChange={(e) =>
                      handleEmployeeChange("designation", e.target.value)
                    }
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={employeeData.department}
                    onChange={(e) =>
                      handleEmployeeChange("department", e.target.value)
                    }
                    placeholder="IT Department"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfJoining">Date of Joining</Label>
                  <Input
                    id="dateOfJoining"
                    type="date"
                    value={employeeData.dateOfJoining}
                    onChange={(e) =>
                      handleEmployeeChange("dateOfJoining", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="payPeriod">Pay Period</Label>
                  <Input
                    id="payPeriod"
                    value={employeeData.payPeriod}
                    onChange={(e) =>
                      handleEmployeeChange("payPeriod", e.target.value)
                    }
                    placeholder="January 2024"
                  />
                </div>
              </div>
              {/* <div className="col-span-2">
                <Label htmlFor="logo">Company Logo</Label>
                <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="cursor-pointer" />
                <p className="text-xs text-gray-500 mt-1">Upload company logo (PNG, JPG, SVG)</p>
              </div> */}
            </CardContent>
          </Card>

          {/* Salary Components */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Salary Components
              </CardTitle>
              <CardDescription>Enter earnings and deductions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Earnings */}
              <div>
                <h3 className="font-semibold text-green-700 mb-3">Earnings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="basicSalary">Basic Salary</Label>
                    <Input
                      id="basicSalary"
                      type="number"
                      value={salaryData.basicSalary || ""}
                      onChange={(e) =>
                        handleSalaryChange("basicSalary", e.target.value)
                      }
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hra">HRA</Label>
                    <Input
                      id="hra"
                      type="number"
                      value={salaryData.hra || ""}
                      onChange={(e) =>
                        handleSalaryChange("hra", e.target.value)
                      }
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="transportAllowance">
                      Transport Allowance
                    </Label>
                    <Input
                      id="transportAllowance"
                      type="number"
                      value={salaryData.transportAllowance || ""}
                      onChange={(e) =>
                        handleSalaryChange("transportAllowance", e.target.value)
                      }
                      placeholder="3000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="medicalAllowance">Medical Allowance</Label>
                    <Input
                      id="medicalAllowance"
                      type="number"
                      value={salaryData.medicalAllowance || ""}
                      onChange={(e) =>
                        handleSalaryChange("medicalAllowance", e.target.value)
                      }
                      placeholder="2000"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="otherAllowances">Other Allowances</Label>
                    <Input
                      id="otherAllowances"
                      type="number"
                      value={salaryData.otherAllowances || ""}
                      onChange={(e) =>
                        handleSalaryChange("otherAllowances", e.target.value)
                      }
                      placeholder="5000"
                    />
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="font-semibold text-red-700 mb-3">Deductions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="providentFund">Provident Fund</Label>
                    <Input
                      id="providentFund"
                      type="number"
                      value={salaryData.providentFund || ""}
                      onChange={(e) =>
                        handleSalaryChange("providentFund", e.target.value)
                      }
                      placeholder="6000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="professionalTax">Professional Tax</Label>
                    <Input
                      id="professionalTax"
                      type="number"
                      value={salaryData.professionalTax || ""}
                      onChange={(e) =>
                        handleSalaryChange("professionalTax", e.target.value)
                      }
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="incomeTax">Income Tax</Label>
                    <Input
                      id="incomeTax"
                      type="number"
                      value={salaryData.incomeTax || ""}
                      onChange={(e) =>
                        handleSalaryChange("incomeTax", e.target.value)
                      }
                      placeholder="8000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="otherDeductions">Other Deductions</Label>
                    <Input
                      id="otherDeductions"
                      type="number"
                      value={salaryData.otherDeductions || ""}
                      onChange={(e) =>
                        handleSalaryChange("otherDeductions", e.target.value)
                      }
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Salary Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(totalEarnings)}
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600 mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-red-700">
                  {formatCurrency(totalDeductions)}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 mb-1">Net Salary</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(netSalary)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center mt-8">
          <Button
            onClick={() => setShowPreview(true)}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            <Eye className="w-5 h-5 mr-2" />
            Generate Salary Slip
          </Button>
        </div>
      </div>
    </div>
  );
}
