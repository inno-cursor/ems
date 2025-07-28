import express from "express";
import Employee from "../models/employee/employee.js";

// To create employee
export const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;
    const newEmployee = await Employee.create(employeeData);
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to create employee", details: error.message });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employee = await Employee.find({ isActive: true });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employee" });
  }
};

// Update employee partially (PATCH)

export const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Employee not found" });
    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update employee", details: error.message });
  }
};

// Soft delete (isActive = false)
export const deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee soft deleted", employee: deleted });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
};
