import { useState } from "react";
import { db, storage, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // ✅ Upload files to Firebase Storage
  const uploadFile = async (file, path) => {
    const fileRef = ref(storage, `${path}/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  // ✅ Handle course upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !category) {
      alert("Please fill all required fields.");
      return;
    }

    setUploading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to add a course.");
        return;
      }

      let thumbnailURL = "";
      let videoURL = "";

      // Upload thumbnail
      if (thumbnail) {
        thumbnailURL = await uploadFile(thumbnail, `thumbnails/${user.uid}`);
      }

      // Upload video
      if (video) {
        videoURL = await uploadFile(video, `courseVideos/${user.uid}`);
      }

      // Save course data in Firestore
      await addDoc(collection(db, "courses"), {
        educatorId: user.uid,
        title,
        description,
        price: Number(price),
        category,
        thumbnail: thumbnailURL,
        videoUrl: videoURL,
        createdAt: serverTimestamp(),
      });

      alert("✅ Course added successfully!");
      navigate("/educator-dashboard");
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Error uploading course: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl border"
      >
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
          Add New Course
        </h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="Course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            placeholder="Write a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 h-24 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          >
            <option value="">Select category</option>
            <option value="Web Development">Web Development</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Data Science">Data Science</option>
            <option value="Business">Business</option>
          </select>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Thumbnail Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full"
          />
        </div>

        {/* Intro Video Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Intro Video (optional)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-green-600 transition"
        >
          {uploading ? "Uploading..." : "Add Course"}
        </button>
      </form>
    </div>
  );
}
