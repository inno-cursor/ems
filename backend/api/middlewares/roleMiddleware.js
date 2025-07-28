export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};
