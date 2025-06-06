import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { DEVELOPMENT_BLOG_SERVER_BASE_URL } from "../utils/config";
const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [status, setStatus] = useState({
    loading: true,
    success: null,
    message: "",
  });

  useEffect(() => {
    if (!token) {
      setStatus({
        loading: false,
        success: false,
        message: "Token not found",
      });
      return;
    }
    axios
      .get(`${DEVELOPMENT_BLOG_SERVER_BASE_URL}/api/auth/verify-email`, { params: { token } })
      .then((res) => {
        const data = res.data;
        if (res.status === 200 && data.success) {
          setStatus({
            loading: false,
            success: true,
            message: data.message || "Verify Failed",
          });
        } else {
          setStatus({
            loading: false,
            success: false,
            message: data.message || "Verify Failed",
          });
        }
      })
      .catch((error) => {
        const message =
          error.response?.data?.message || "Network error. Try again";
        setStatus({ loading: false, success: false, message });
      });
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-start">
        <h1 className={`flex text-3xl font-bold mb-4 `}>athStock.</h1>
        {status.loading ? (
          <p className="text-gray-700">Verifying</p>
        ) : status.success ? (
          <>
            <h2 className="text-xl font-bold text-green-600 mb-4">
              Account Verify Successful
            </h2>
            <p className="text-gray-700 mb-6">{status.message}</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Login now
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Account Verify Failed:
            </h2>
            <p className="text-gray-700 mb-6">{status.message}</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition"
              >
                Back to home
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 bg-black text-white rounded-lg hover:bg-black/70 transition"
              >
                Register again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
