import { useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔑 Email-password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // If not found, create a new record
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "New User",
          email: user.email,
          role: "student",
          profileImage: user.photoURL || "",
          enrolledCourses: [],
          createdAt: serverTimestamp(),
        });
      }

      alert("Login successful ✅");
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  // 🌐 Google login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create or update user record in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "Google User",
          email: user.email,
          role: "student",
          profileImage: user.photoURL || "",
          enrolledCourses: [],
          createdAt: serverTimestamp(),
        });
      }

      alert(`Welcome back, ${user.displayName || "User"}!`);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="lg:min-h-screen flex flex-col lg:flex-row items-center justify-center p-6 bg-slate-50">
      <div className="grid lg:grid-cols-2 items-center gap-10 max-w-6xl max-lg:max-w-lg w-full">
        {/* Left Side: Text */}
        <div>
          <h1 className="lg:text-5xl text-4xl font-bold text-slate-900 leading-tight">
            Seamless Login for Exclusive Access
          </h1>
          <p className="text-[15px] mt-6 text-slate-600 leading-relaxed">
            Immerse yourself in a hassle-free login journey with our intuitively designed
            login form. Effortlessly access your account.
          </p>
          <p className="text-[15px] mt-6 lg:mt-12 text-slate-600">
            Don’t have an account?
            <Link to="/signup" className="text-blue-600 font-medium hover:underline ml-1">
              Register here
            </Link>
          </p>
        </div>

        {/* Right Side: Form */}
        <form onSubmit={handleLogin} className="max-w-md lg:ml-auto w-full bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-slate-900 text-3xl font-semibold mb-8 text-center">
            Sign In
          </h2>

          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-sm text-slate-900 font-medium mb-2 block">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-100 w-full text-sm text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent"
                placeholder="Enter Email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-slate-900 font-medium mb-2 block">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-100 w-full text-sm text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent"
                placeholder="Enter Password"
              />
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-slate-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <div className="mt-10">
            <button
              type="submit"
              className="w-full shadow-xl py-3 px-4 text-[15px] font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
            >
              Log in
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <hr className="w-full border-slate-300" />
            <p className="text-sm text-slate-900 text-center">or</p>
            <hr className="w-full border-slate-300" />
          </div>

          {/* Social buttons */}
          <div className="space-x-6 flex justify-center">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              title="Login with Google"
              className="cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 512 512">
                <path fill="#fbbd00" d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z" />
                <path fill="#0f9d58" d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z" />
                <path fill="#3c79e6" d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z" />
                <path fill="#eb4132" d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
