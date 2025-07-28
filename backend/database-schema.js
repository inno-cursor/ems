// MongoDB Database Schema for Employee Management System
const { ObjectId } = require('mongodb');

// 1. Users Collection (Admin/HR users)
const usersSchema = {
  _id: ObjectId,
  name: String, // Full name
  email: String, // Unique email address
  password: String, // Hashed password
  role: String, // "admin" | "hr"
  status: String, // "active" | "inactive"
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId, // Reference to user who created this account
  lastLogin: Date,
  profileImage: String, // URL to profile image
  permissions: [String], // Array of specific permissions
  isRoot: Boolean, // true for root admin (innocursor@gmail.com)
}

// 2. Employees Collection (Main employee data)
const employeesSchema = {
  _id: ObjectId,
  
  // Personal Information
  personalInfo: {
    firstName: String,
    middleName: String,
    lastName: String,
    fullName: String, // Computed field for search
    gender: String, // "Male" | "Female" | "Other"
    dateOfBirth: Date,
    nationality: String,
    maritalStatus: String, // "Single" | "Married" | "Divorced" | "Widowed"
    bloodGroup: String, // "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
    personalPhone: String,
    personalEmail: String,
    currentAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      fullAddress: String
    },
    permanentAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      fullAddress: String
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      email: String,
      address: String
    }
  },

  // Company/Work Details
  workDetails: {
    employeeCode: String, // Unique identifier
    department: String,
    designation: String,
    employeeType: String, // "Full-time" | "Part-time" | "Intern" | "Contractor"
    joiningDate: Date,
    employmentStatus: String, // "Active" | "On Leave" | "Terminated" | "Resigned"
    reportingManager: {
      employeeId: ObjectId,
      name: String,
      email: String
    },
    workLocation: String,
    officialEmail: String,
    officePhone: String,
    workShift: {
      startTime: String,
      endTime: String,
      weeklyOff: String, // "Sunday" | "Monday" etc.
      shiftType: String // "Day" | "Night" | "Rotational"
    }
  },

  // Payroll & Bank Details
  payrollDetails: {
    salary: {
      totalSalary: Number, // CTC
      basicSalary: Number,
      allowances: {
        hra: Number,
        transport: Number,
        medical: Number,
        other: Number,
        total: Number
      },
      deductions: {
        tax: Number,
        pf: Number,
        esi: Number,
        other: Number,
        total: Number
      },
      netSalary: Number
    },
    bankDetails: {
      bankName: String,
      accountNumber: String,
      ifscCode: String,
      accountType: String, // "Savings" | "Current"
      branchName: String
    },
    taxDetails: {
      panNumber: String,
      pfNumber: String,
      esiNumber: String,
      uanNumber: String
    }
  },

  // Leave & Attendance
  leaveDetails: {
    leaveBalance: {
      annualLeave: Number,
      sickLeave: Number,
      casualLeave: Number,
      maternityLeave: Number,
      paternityLeave: Number,
      compensatoryOff: Number
    },
    leavePolicy: {
      annualLeaveEntitlement: Number,
      sickLeaveEntitlement: Number,
      casualLeaveEntitlement: Number
    }
  },

  // Performance & Appraisal
  performanceDetails: {
    currentRating: Number, // 1-5 scale
    goals: [String],
    kpis: [String],
    skills: [String],
    certifications: [String],
    lastAppraisalDate: Date,
    nextAppraisalDate: Date,
    careerLevel: String,
    promotionHistory: [{
      fromDesignation: String,
      toDesignation: String,
      promotionDate: Date,
      reason: String
    }]
  },

  // System Access Info
  systemAccess: {
    userLoginId: String,
    systemRole: String, // "Employee" | "Manager" | "HR" | "Admin"
    accessPermissions: [String],
    lastLoginDate: Date,
    accountStatus: String, // "Active" | "Inactive" | "Suspended"
    passwordLastChanged: Date
  },

  // Exit/Separation Details
  exitDetails: {
    resignationDate: Date,
    lastWorkingDay: Date,
    exitReason: String,
    exitInterviewNotes: String,
    finalSettlementAmount: Number,
    clearanceStatus: String, // "Pending" | "Completed"
    rehireEligible: Boolean,
    exitInterviewDate: Date,
    handoverStatus: String
  },

  // Metadata
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId, // Reference to user who created this employee
  updatedBy: ObjectId, // Reference to user who last updated
  isActive: Boolean,
  version: Number // For optimistic locking
}

// 3. Documents Collection (Employee documents)
const documentsSchema = {
  _id: ObjectId,
  employeeId: ObjectId, // Reference to employee
  documentType: String, // "Resume" | "Offer Letter" | "ID Proof" | "Address Proof" | "Educational Certificate" | "Experience Letter" | "Other"
  documentName: String,
  fileName: String,
  fileUrl: String, // URL to stored file
  fileSize: Number,
  mimeType: String,
  uploadedAt: Date,
  uploadedBy: ObjectId,
  isVerified: Boolean,
  verifiedBy: ObjectId,
  verifiedAt: Date,
  expiryDate: Date, // For documents like passport, visa etc.
  notes: String
}

// 4. Leave Requests Collection
const leaveRequestsSchema = {
  _id: ObjectId,
  employeeId: ObjectId,
  leaveType: String, // "Annual" | "Sick" | "Casual" | "Maternity" | "Paternity" | "Compensatory"
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  reason: String,
  status: String, // "Pending" | "Approved" | "Rejected" | "Cancelled"
  appliedDate: Date,
  approvedBy: ObjectId,
  approvedDate: Date,
  rejectionReason: String,
  attachments: [String], // URLs to supporting documents
  isHalfDay: Boolean,
  halfDayType: String, // "First Half" | "Second Half"
  emergencyLeave: Boolean
}

// 5. Attendance Collection
const attendanceSchema = {
  _id: ObjectId,
  employeeId: ObjectId,
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  totalHours: Number,
  status: String, // "Present" | "Absent" | "Half Day" | "Late" | "On Leave"
  location: {
    checkIn: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    checkOut: {
      latitude: Number,
      longitude: Number,
      address: String
    }
  },
  notes: String,
  approvedBy: ObjectId,
  overtimeHours: Number,
  breakTime: Number
}

// 6. Performance Reviews Collection
const performanceReviewsSchema = {
  _id: ObjectId,
  employeeId: ObjectId,
  reviewPeriod: {
    startDate: Date,
    endDate: Date
  },
  reviewType: String, // "Annual" | "Half-yearly" | "Quarterly" | "Probation"
  overallRating: Number, // 1-5 scale
  ratings: {
    technical: Number,
    communication: Number,
    teamwork: Number,
    leadership: Number,
    initiative: Number,
    punctuality: Number
  },
  goals: [{
    description: String,
    status: String, // "Achieved" | "Partially Achieved" | "Not Achieved"
    rating: Number
  }],
  strengths: [String],
  areasOfImprovement: [String],
  developmentPlan: [String],
  reviewerComments: String,
  employeeComments: String,
  reviewedBy: ObjectId,
  reviewDate: Date,
  nextReviewDate: Date,
  salary: {
    currentSalary: Number,
    proposedSalary: Number,
    increment: Number,
    incrementPercentage: Number,
    effectiveDate: Date
  }
}

// 7. Disciplinary Actions Collection
const disciplinaryActionsSchema = {
  _id: ObjectId,
  employeeId: ObjectId,
  actionType: String, // "Warning" | "Written Warning" | "Suspension" | "Termination"
  reason: String,
  description: String,
  actionDate: Date,
  actionTakenBy: ObjectId,
  severity: String, // "Minor" | "Major" | "Critical"
  status: String, // "Active" | "Resolved" | "Appealed"
  followUpDate: Date,
  attachments: [String],
  employeeAcknowledgment: {
    acknowledged: Boolean,
    acknowledgedDate: Date,
    comments: String
  }
}

// 8. Payroll History Collection
const payrollHistorySchema = {
  _id: ObjectId,
  employeeId: ObjectId,
  payPeriod: {
    month: Number,
    year: Number,
    startDate: Date,
    endDate: Date
  },
  salary: {
    basicSalary: Number,
    allowances: {
      hra: Number,
      transport: Number,
      medical: Number,
      other: Number,
      total: Number
    },
    deductions: {
      tax: Number,
      pf: Number,
      esi: Number,
      advance: Number,
      other: Number,
      total: Number
    },
    grossSalary: Number,
    netSalary: Number
  },
  attendance: {
    workingDays: Number,
    presentDays: Number,
    absentDays: Number,
    leavesTaken: Number,
    overtimeHours: Number
  },
  paymentStatus: String, // "Pending" | "Processed" | "Paid"
  paymentDate: Date,
  payslipUrl: String,
  processedBy: ObjectId
}

// 9. Departments Collection
const departmentsSchema = {
  _id: ObjectId,
  name: String,
  code: String,
  description: String,
  headOfDepartment: ObjectId, // Reference to employee
  parentDepartment: ObjectId, // For sub-departments
  budget: Number,
  location: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// 10. Audit Logs Collection
const auditLogsSchema = {
  _id: ObjectId,
  userId: ObjectId, // Who performed the action
  action: String, // "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT"
  resource: String, // "Employee" | "User" | "Leave" | "Attendance"
  resourceId: ObjectId, // ID of the affected resource
  changes: {
    before: Object, // Previous state
    after: Object // New state
  },
  ipAddress: String,
  userAgent: String,
  timestamp: Date,
  description: String
}

// Indexes for better performance
const indexes = {
  users: [
    { email: 1 }, // Unique
    { role: 1 },
    { status: 1 }
  ],
  employees: [
    { "workDetails.employeeCode": 1 }, // Unique
    { "workDetails.officialEmail": 1 }, // Unique
    { "personalInfo.fullName": "text" }, // Text search
    { "workDetails.department": 1 },
    { "workDetails.employmentStatus": 1 },
    { "workDetails.joiningDate": 1 },
    { isActive: 1 }
  ],
  documents: [
    { employeeId: 1 },
    { documentType: 1 },
    { uploadedAt: -1 }
  ],
  leaveRequests: [
    { employeeId: 1 },
    { status: 1 },
    { startDate: 1 },
    { appliedDate: -1 }
  ],
  attendance: [
    { employeeId: 1, date: 1 }, // Compound unique
    { date: -1 },
    { status: 1 }
  ],
  performanceReviews: [
    { employeeId: 1 },
    { reviewDate: -1 },
    { reviewType: 1 }
  ],
  payrollHistory: [
    { employeeId: 1 },
    { "payPeriod.year": 1, "payPeriod.month": 1 },
    { paymentStatus: 1 }
  ],
  auditLogs: [
    { userId: 1 },
    { timestamp: -1 },
    { resource: 1, resourceId: 1 }
  ]
}

// Sample data structure
const sampleEmployee = {
  _id: ObjectId("64a1b2c3d4e5f6789abcdef0"),
  personalInfo: {
    firstName: "John",
    middleName: "Michael",
    lastName: "Doe",
    fullName: "John Michael Doe",
    gender: "Male",
    dateOfBirth: new Date("1990-05-15"),
    nationality: "American",
    maritalStatus: "Married",
    bloodGroup: "O+",
    personalPhone: "+1-555-0123",
    personalEmail: "john.doe@personal.com",
    currentAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "10001",
      fullAddress: "123 Main St, New York, NY 10001, USA"
    },
    permanentAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "10001",
      fullAddress: "123 Main St, New York, NY 10001, USA"
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phone: "+1-555-0124",
      email: "jane.doe@email.com",
      address: "123 Main St, New York, NY 10001"
    }
  },
  workDetails: {
    employeeCode: "EMP001",
    department: "Engineering",
    designation: "Senior Software Engineer",
    employeeType: "Full-time",
    joiningDate: new Date("2022-01-15"),
    employmentStatus: "Active",
    reportingManager: {
      employeeId: ObjectId("64a1b2c3d4e5f6789abcdef1"),
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com"
    },
    workLocation: "New York Office",
    officialEmail: "john.doe@company.com",
    officePhone: "ext. 1234",
    workShift: {
      startTime: "09:00",
      endTime: "18:00",
      weeklyOff: "Sunday",
      shiftType: "Day"
    }
  },
  payrollDetails: {
    salary: {
      totalSalary: 120000,
      basicSalary: 80000,
      allowances: {
        hra: 15000,
        transport: 3000,
        medical: 2000,
        other: 0,
        total: 20000
      },
      deductions: {
        tax: 12000,
        pf: 2400,
        esi: 600,
        other: 0,
        total: 15000
      },
      netSalary: 105000
    },
    bankDetails: {
      bankName: "Chase Bank",
      accountNumber: "1234567890",
      ifscCode: "CHAS0001234",
      accountType: "Savings",
      branchName: "New York Main Branch"
    },
    taxDetails: {
      panNumber: "ABCDE1234F",
      pfNumber: "PF123456789",
      esiNumber: "ESI987654321",
      uanNumber: "UAN123456789012"
    }
  },
  leaveDetails: {
    leaveBalance: {
      annualLeave: 18,
      sickLeave: 10,
      casualLeave: 7,
      maternityLeave: 0,
      paternityLeave: 0,
      compensatoryOff: 2
    },
    leavePolicy: {
      annualLeaveEntitlement: 21,
      sickLeaveEntitlement: 12,
      casualLeaveEntitlement: 10
    }
  },
  performanceDetails: {
    currentRating: 4.2,
    goals: ["Complete project X", "Learn new technology Y"],
    kpis: ["Code quality", "Project delivery", "Team collaboration"],
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    certifications: ["AWS Certified Developer"],
    lastAppraisalDate: new Date("2023-12-15"),
    nextAppraisalDate: new Date("2024-12-15"),
    careerLevel: "Senior",
    promotionHistory: []
  },
  systemAccess: {
    userLoginId: "john.doe",
    systemRole: "Employee",
    accessPermissions: ["read_profile", "update_profile", "apply_leave"],
    lastLoginDate: new Date("2024-01-15T09:30:00Z"),
    accountStatus: "Active",
    passwordLastChanged: new Date("2023-06-01")
  },
  exitDetails: null,
  createdAt: new Date("2022-01-10"),
  updatedAt: new Date("2024-01-15"),
  createdBy: ObjectId("64a1b2c3d4e5f6789abcdef2"),
  updatedBy: ObjectId("64a1b2c3d4e5f6789abcdef2"),
  isActive: true,
  version: 1
}