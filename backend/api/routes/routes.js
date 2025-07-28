import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  deleteAdmin,
  getLoggedInAdmin,
  editAdmins,
} from "../controllers/adminController.js";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// -------------------- AUTH ROUTES --------------------
router.post("/admin/login", loginAdmin);
router.post(
  "/admin/register",
  authMiddleware,
  roleMiddleware("admin"),
  registerAdmin
);

// -------------------- ADMIN ROUTES --------------------
// Get all admins (admin only)
router.get("/admin", authMiddleware, roleMiddleware("admin"), getAllAdmins);

// Delete an admin (admin only)
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteAdmin
);

router.patch("/admin/:id", authMiddleware, roleMiddleware("admin"), editAdmins);

router.get("/admin/me", authMiddleware, getLoggedInAdmin);

// -------------------- EMPLOYEE ROUTES --------------------
router.get(
  "/employee",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  getAllEmployees
);
router.post(
  "/employee/create",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  createEmployee
);
router.get(
  "/employee/:id",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  getEmployeeById
);
router.patch(
  "/employee/:id",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  updateEmployee
);
router.delete(
  "/employee/:id",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  deleteEmployee
);

export default router;
