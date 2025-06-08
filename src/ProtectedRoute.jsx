import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/landing");
    }
  }, [navigate]);

  return children;
}
