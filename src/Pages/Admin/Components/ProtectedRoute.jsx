import { Navigate } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext"; // Add this import

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStateContext(); // Replace localStorage check with context

  if (!user) {
    return <Navigate to="/" replace />; // Add replace prop
  }

  return children;
};

export default ProtectedRoute;