import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { Search, Gift, Phone } from "lucide-react";

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("MERN");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="bg-linear-to-r from-green-300 to-blue-300 shadow-sm border-b border-gray-50-300 sticky top-0 z-50">
      {/* ---------- TOP NAV ---------- */}
      <div className="flex justify-between items-center px-6 py-3 max-w-[1350px] mx-auto">
        {/* LEFT: Logo + Dropdown */}
        <div className="flex items-center gap-3">
          <img 
          src="/logo.jpg"
          className="w-8 h-8"
          />
          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="font-medium text-gray-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option>Full Stack Developer</option>
              <option>CAT & Other MBA Exams</option>
              <option>UPSC</option>
              <option>GATE</option>
              <option>Banking</option>
              <option>SSC</option>
              <option>JEE</option>
            </select>
          </div>
        </div>

        {/* CENTER: Search Bar */}
        <div className="hidden md:flex items-center w-[40%] bg-gray-100 rounded-md px-3 py-2 border border-gray-200">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search courses, test series and educators"
            className="w-full bg-transparent text-sm ml-2 focus:outline-none text-gray-700"
          />
        </div>

        {/* RIGHT: Contact + Icons + Profile */}
        <div className="flex items-center gap-6">
          {/* Contact Info */}
          <div className="hidden md:flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <div className="text-sm leading-tight">
              <p className="text-gray-400">Talk to our experts</p>
              <a
                href="tel:+911203628122"
                className="text-blue-700 font-medium hover:underline"
              >
                +911203628122
              </a>
            </div>
          </div>

          {/* Gift Icon */}
          <button className="bg-gray-100 p-2 rounded-full hover:bg-green-100 transition">
            <Gift className="w-5 h-5 text-green-600" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative group">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Profile"
              className="w-9 h-9 rounded-full border border-gray-300 cursor-pointer"
            />
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 delay-200 w-36">
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
              >
                Home
              </Link>
              <Link
                to="/courses"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
              >
                Courses
              </Link>
              <Link
                to="/mylearning"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
              >
                My Learning
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- SECOND ROW NAV ---------- */}
      <div className="flex justify-center gap-8 py-2 border-t border-gray-100 text-sm font-medium text-gray-700">
        <Link
          to="/dashboard"
          className="hover:text-blue-700 border-b-2 border-transparent hover:border-green-600 pb-1 transition"
        >
          Get started
        </Link>
        <Link
          to="/educators"
          className="hover:text-blue-700 border-b-2 border-transparent hover:border-green-600 pb-1 transition"
        >
          Educators
        </Link>
        <Link
          to="/batch"
          className="hover:text-blue-700 border-b-2 border-transparent hover:border-green-600 pb-1 transition"
        >
          Batch
        </Link>
        <Link
          to="/store"
          className="hover:text-blue-700 border-b-2 border-transparent hover:border-green-600 pb-1 transition"
        >
          Store
        </Link>
        <Link
          to="/subscription"
          className="hover:text-blue-700 border-b-2 border-transparent hover:border-green-600 pb-1 transition"
        >
          Subscription plan
        </Link>
        <Link
          to="/success"
          className="hover:text-blue-700 border-b-2 border-transparent hover:border-green-600 pb-1 transition"
        >
          Success stories
        </Link>
        <Link
          to="/exam"
          className="hover:text-blue-700 border-b-2 border-transparent hover:border-green-600 pb-1 transition"
        >
          About exam
        </Link>
      </div>
    </nav>
  );
}
