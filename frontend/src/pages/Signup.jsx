import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Update profile name (optional)
      await updateProfile(user, { displayName: name });

      // 3️⃣ Create Firestore document
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "student", // default role
        profileImage: "",
        enrolledCourses: [],
        createdAt: serverTimestamp(),
      });

      alert("User account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating user:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-mint-50">
      <form
        onSubmit={handleSignup}
        className="bg-white shadow-md rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-mint-700">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="border w-full p-2 mb-4 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-6 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          type="submit"
          className="bg-mint-500 text-blue-500 hover:bg-amber-300 w-full py-2 rounded hover:bg-mint-600 transition"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-mint-700 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
