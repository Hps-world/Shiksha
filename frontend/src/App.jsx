import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import MyLearning from "./pages/MyLearning";
import Home from "./pages/Home"
import AddCourse from "./pages/AddCourse";
import EducatorLogin from "./pages/EducatorLogin";
import EducatorDashboard from "./pages/EducatorDasboard";
import ManageCourse from "./pages/ManageCourse";
import ManageLessons from "./pages/ManageLessons";
import EducatorSignup from "./pages/EducatorSignup";
import EducatorProfile from "./pages/EducatorProfile";


import "./app.css"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/mylearning" element={<MyLearning />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/educator-login" element={<EducatorLogin />} />
        <Route path="/educator-dashboard" element={<EducatorDashboard />} />
        <Route path="/manage-course" element={<ManageCourse />} />
        <Route path="/manage-lessons/:courseId" element={<ManageLessons />} />
        <Route path="/educator-signup" element={<EducatorSignup />} />
        <Route path="/educator-profile" element={<EducatorProfile />} />
        
      </Routes>
    </BrowserRouter>
  );
}
