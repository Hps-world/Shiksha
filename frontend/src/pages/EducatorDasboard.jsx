import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function EducatorDashboard() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalCourses: 0,
    totalStudents: 0,
    avgRating: 0,
    totalEarnings: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      navigate("/educator-login");
      return;
    }
    setUser(currentUser);
    fetchCourses(currentUser.uid);
  }, [navigate]);

  const fetchCourses = async (uid) => {
    const q = query(collection(db, "courses"), where("educatorId", "==", uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCourses(data);
    calculateAnalytics(data);
  };

  const calculateAnalytics = (courses) => {
    if (!courses.length) return;

    const totalCourses = courses.length;
    const totalStudents = courses.reduce(
      (acc, course) => acc + (course.students ? course.students.length : 0),
      0
    );
    const avgRating =
      courses.reduce((acc, c) => acc + (c.rating || 0), 0) / totalCourses;
    const totalEarnings = courses.reduce(
      (acc, c) =>
        acc + (c.students ? (c.students.length || 0) * (c.price || 0) : 0),
      0
    );

    setAnalytics({
      totalCourses,
      totalStudents,
      avgRating: avgRating.toFixed(1),
      totalEarnings,
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/educator-login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">Educator Dashboard</h1>
        <div className="flex gap-4">
          <Link
            to="/add-course"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            + Add Course
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Educator Info */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Welcome, {user?.email}
        </h2>
        <p className="text-gray-600 mb-6">Here’s your course summary:</p>

        {/* --- Analytics Section --- */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Courses
            </h3>
            <p className="text-3xl font-bold text-blue-700">
              {analytics.totalCourses}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Students
            </h3>
            <p className="text-3xl font-bold text-green-700">
              {analytics.totalStudents}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Avg Rating
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              {analytics.avgRating}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Earnings
            </h3>
            <p className="text-3xl font-bold text-purple-700">
              ₹{analytics.totalEarnings}
            </p>
          </div>
        </div>

        {/* --- Course List --- */}
        {courses.length === 0 ? (
          <p className="text-gray-500">No courses added yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition"
              >
                <img
                  src={
                    course.thumbnail ||
                    "https://img.freepik.com/free-photo/online-learning-concept_23-2148685630.jpg"
                  }
                  alt={course.title}
                  className="rounded-md mb-3 w-full h-40 object-cover"
                />
                <h3 className="text-lg font-semibold text-blue-700 mb-1">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {course.category} • ₹{course.price}
                </p>
                <p className="text-gray-500 text-sm mb-2">
                  Students: {course.students ? course.students.length : 0}
                </p>
                <p className="text-gray-500 text-sm">
                  Rating: {course.rating || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* -----Manage course---- */}
      <div>
        <Link
          to="/manage-course"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          Manage Courses
        </Link>
        <Link
          to="/educator-profile"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          Profile
        </Link>
      </div>
    </div>
  );
}
