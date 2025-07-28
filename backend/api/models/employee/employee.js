import mongoose from "mongoose";

const { Schema, model } = mongoose;

const employeeSchema = new Schema({
  firstName: { type: String, required: true },
  middleName: String,
  lastName: { type: String, required: true },
  gender: String,
  dateOfBirth: Date,
  nationality: String,
  maritalStatus: String,
  bloodGroup: String,
  personalPhone: String,
  personalEmail: String,
  currentAddress: String,
  permanentAddress: String,
  emergencyContactName: String,
  emergencyContactNumber: String,

  employeeCode: { type: String },
  department: { type: String },
  designation: { type: String },
  employeeType: String,
  joiningDate: { type: Date, required: true },
  employmentStatus: String,
  reportingManager: String,
  workLocation: String,
  officialEmail: String,
  officePhone: String,

  totalSalary: Number,
  basicSalary: Number,
  allowances: Number,
  deductions: Number,
  netSalary: Number,
  bankName: String,
  bankAccountNumber: String,
  ifscCode: String,
  panNumber: String,
  pfNumber: String,
  esiNumber: String,

  annualLeaveBalance: Number,
  sickLeaveBalance: Number,
  casualLeaveBalance: Number,
  shiftTiming: String,
  weeklyOff: String,

  performanceRating: String,
  goals: String,

  isActive: { type: Boolean },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Employee = model("Employee", employeeSchema);

export default Employee;
