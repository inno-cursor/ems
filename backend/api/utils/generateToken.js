import jwt from "jsonwebtoken";

export const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      isRoot: admin.isRoot
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
