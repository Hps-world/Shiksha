import { useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function EducatorSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subject, setSubject] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Update Firebase user display name
      await updateProfile(user, { displayName: name });

      // ✅ Add educator data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        subject,
        bio,
        role: "educator",
        createdAt: serverTimestamp(),
      });

      alert("🎉 Signup successful! Welcome, Educator!");
      navigate("/educator-dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 shadow-lg rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Educator Signup
        </h2>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Subject / Expertise */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Subject Expertise
          </label>
          <input
            type="text"
            placeholder="e.g., Mathematics, Science, ReactJS"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Short Bio */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Short Bio
          </label>
          <textarea
            placeholder="Write a short bio about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 h-24 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-green-600 transition"
        >
          {loading ? "Creating Account..." : "Sign Up as Educator"}
        </button>

        {/* Already have an account */}
        <p className="text-sm text-center mt-5 text-gray-600">
          Already registered?{" "}
          <Link
            to="/educator-login"
            className="text-blue-700 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
