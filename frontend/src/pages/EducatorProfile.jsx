import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function EducatorProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    subject: "",
    bio: "",
    photoURL: "",
  });
  const [newPhoto, setNewPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch current educator data
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/educator-login");
        return;
      }
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        alert("Profile not found!");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  // ✅ Handle profile photo upload
  const handlePhotoUpload = async () => {
    if (!newPhoto) return profile.photoURL;
    const user = auth.currentUser;
    const photoRef = ref(storage, `profilePictures/${user.uid}`);
    await uploadBytes(photoRef, newPhoto);
    const downloadURL = await getDownloadURL(photoRef);
    return downloadURL;
  };

  // ✅ Update Firestore profile data
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      const photoURL = await handlePhotoUpload();
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: profile.name,
        subject: profile.subject,
        bio: profile.bio,
        photoURL,
      });
      alert("✅ Profile updated successfully!");
      navigate("/educator-dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl border">
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
          My Profile
        </h2>

        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              profile.photoURL ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover mb-3"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPhoto(e.target.files[0])}
            className="text-sm"
          />
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Email (readonly) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border border-gray-200 rounded-md p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Subject Expertise
            </label>
            <input
              type="text"
              value={profile.subject}
              onChange={(e) =>
                setProfile({ ...profile, subject: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 h-24 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-green-600 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
