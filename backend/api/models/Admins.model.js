import mongoose from "mongoose";
import { Schema } from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is Required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Email is Required"],
    },
    role: {
      type: String,
      enum: ["admin", "hr", "manager"],
      default: "manager",
      require: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: function () {
        return !this.isRoot;
      },
    },
    token: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
