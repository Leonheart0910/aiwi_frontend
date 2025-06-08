import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = parseInt(localStorage.getItem("user_id"));
        const base = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${base}/api/v1/user/${userId}`);
        if (!response.ok) {
          throw new Error("사용자 정보를 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">내 계정 정보</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xl font-medium text-gray-700">
              이메일
            </label>
            <div className="mt-1 text-gray-900">{userData?.email}</div>
          </div>
          <div>
            <label className="block text-xl font-medium text-gray-700">
              닉네임
            </label>
            <div className="mt-1 text-gray-900">{userData?.nickname}</div>
          </div>
          <div>
            <label className="block text-xl font-medium text-gray-700">
              나이
            </label>
            <div className="mt-1 text-gray-900">{userData?.user_info?.age}</div>
          </div>
          <div>
            <label className="block text-xl font-medium text-gray-700">
              성별
            </label>
            <div className="mt-1 text-gray-900">{userData?.user_info?.sex}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
