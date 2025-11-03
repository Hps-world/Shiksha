import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate,Link } from "react-router-dom";

export default function EducatorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check role in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "educator") {
        alert("Welcome Educator ✅");
        navigate("/educator-dashboard");
      } else {
        alert("Access denied. Not an educator account ❌");
        await auth.signOut();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-md rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-blue-600 text-center mb-6">
          Educator Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 w-full p-2 mb-4 rounded focus:ring-2 focus:ring-green-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 w-full p-2 mb-6 rounded focus:ring-2 focus:ring-green-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-green-600 transition"
        >
          {loading ? "Logging in..." : "Login as Educator"}
        </button>
      </form>
      <p className="text-sm text-center mt-5 text-gray-600">
        New educator?{" "}
        <Link
          to="/educator-signup"
          className="text-blue-700 font-medium hover:underline"
        >
          Sign up here
        </Link>
      </p>
    </div>
  );
}
