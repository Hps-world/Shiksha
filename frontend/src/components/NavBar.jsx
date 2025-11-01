import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-sm bg-linear-to-r from-green-500 to-blue-400 fixed top-0 w-full z-50">
      <div className="text-2xl font-bold text-white">Shiksha</div>
      <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/dashboard">My Learning</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 hidden md:block">
        Join for Free
      </button>
    </nav>
  );
}
