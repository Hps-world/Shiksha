import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <div className="bg-mint-50 min-h-screen">
      {/* ✅ Navbar */}
      <DashboardNavbar />
      <Link
        to="/add-course"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
      >
        + Add Course
      </Link>

      {/* ✅ Dashboard Content */}
      <div className="p-8">
        {userData ? (
          <>
            <h1 className="text-3xl font-bold text-mint-700 mb-2">
              Welcome back, {userData.name || "User"} 👋
            </h1>
            <p className="text-gray-600">Email: {userData.email}</p>
            <p className="text-gray-600 mb-10">Role: {userData.role}</p>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-mint-700 mb-4">
                Your Dashboard Overview
              </h2>
              <p className="text-gray-700">
                Here you can view your enrolled courses, track progress, and
                continue learning. Explore the "My Learning" tab to get started.
              </p>
            </div>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
}
