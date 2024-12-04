import jwt from "jsonwebtoken";

// Middleware to validate users
const validateUser = (requiredRoles = []) => {
  return (req, res, next) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) { 
        return res.status(401).json({ message: "Authorization token missing or invalid" });
      }

      const token = authHeader.split(" ")[1]; // Extract the token

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to the request object
      req.user = decoded;

      // Check if the user has the required roles (if any)
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access forbidden: insufficient permissions" });
      }

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Handle token verification errors
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default validateUser ;


