import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { v4 as uuidv4 } from "uuid";
import Admin from "../models/Admins.model.js";

export const registerAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "manager",
      isRoot = false,
    } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already in use" });

    // Only allow root admin if one doesn't exist
    if (isRoot && (await Admin.findOne({ isRoot: true }))) {
      return res.status(403).json({ error: "Root admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminId = uuidv4();
    const createdBy = req.admin?._id;

    const newAdmin = await Admin.create({
      adminId,
      name,
      email,
      password: hashedPassword,
      role,
      isRoot,
      createdBy: isRoot ? undefined : createdBy,
    });

    res.status(201).json({
      message: "Admin created",
      admin: {
        id: newAdmin._id,
        adminId: newAdmin.adminId,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        isRoot: newAdmin.isRoot,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create admin", details: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const token = generateToken(admin);
  res.json({
    token,
    admin: { name: admin.name, email: admin.email, role: admin.role },
  });
};

export const getAllAdmins = async (req, res) => {
  try {
    const admin = await Admin.find();
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};

export const editAdmins = async (req, res) => {
  try {
    const adminId = req.params.id;

    // First check if admin exists and if it's root
    const existingAdmin = await Admin.findById(adminId);
    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (existingAdmin.isRoot) {
      return res.status(403).json({ message: "Root admin cannot be edited" });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Hash password if provided and not empty
    if (updateData.password && updateData.password.trim() !== "") {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      // Remove password from update if it's empty (keep existing password)
      delete updateData.password;
    }

    // Update the admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error("Edit admin error:", error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const admin = await Admin.findById(userId);
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
    }
    if (admin.isRoot) {
      return res.status(403).json({ message: "Cannot delete root admin" });
    }
    // Delete the admin
    await Admin.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getLoggedInAdmin = (req, res) => {
  const { _id, email, name, role, isRoot, status } = req.admin;
  res.status(200).json({
    admin: {
      id: _id,
      email,
      name,
      role,
      status,
      isRoot,
    },
  });
};
