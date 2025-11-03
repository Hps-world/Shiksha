import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage, auth } from "../firebase";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function ManageLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDesc, setLessonDesc] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch lessons for the course
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/educator-login");
      return;
    }
    fetchLessons();
  }, [courseId, navigate]);

  const fetchLessons = async () => {
    const lessonsRef = collection(db, "courses", courseId, "lessons");
    const snapshot = await getDocs(lessonsRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setLessons(data);
  };

  // ✅ Upload video + save lesson
  const handleUploadLesson = async (e) => {
    e.preventDefault();

    if (!lessonTitle || !videoFile) {
      alert("Please enter title and choose a video file.");
      return;
    }

    try {
      setUploading(true);

      // Upload video to Firebase Storage
      const fileRef = ref(storage, `lessons/${courseId}/${videoFile.name}`);
      const uploadTask = uploadBytesResumable(fileRef, videoFile);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          alert("Upload failed: " + error.message);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Save lesson in Firestore
          await addDoc(collection(db, "courses", courseId, "lessons"), {
            title: lessonTitle,
            description: lessonDesc,
            videoUrl: downloadURL,
            createdAt: serverTimestamp(),
          });

          alert("✅ Lesson uploaded successfully!");
          setLessonTitle("");
          setLessonDesc("");
          setVideoFile(null);
          setUploading(false);
          fetchLessons();
        }
      );
    } catch (error) {
      alert(error.message);
      setUploading(false);
    }
  };

  // ✅ Delete lesson
  const handleDeleteLesson = async (lessonId, videoUrl) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this lesson?");
    if (!confirmDelete) return;

    // Delete from Firestore
    await deleteDoc(doc(db, "courses", courseId, "lessons", lessonId));

    // Delete from Storage
    const fileRef = ref(storage, videoUrl);
    await deleteObject(fileRef);

    alert("Lesson deleted successfully!");
    fetchLessons();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white border-b shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Manage Lessons</h1>
        <button
          onClick={() => navigate("/educator-dashboard")}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Upload Form */}
      <div className="max-w-2xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Lesson
        </h2>
        <form onSubmit={handleUploadLesson}>
          <input
            type="text"
            placeholder="Lesson Title"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            className="w-full border rounded-md p-2 mb-3"
            required
          />
          <textarea
            placeholder="Lesson Description (optional)"
            value={lessonDesc}
            onChange={(e) => setLessonDesc(e.target.value)}
            className="w-full border rounded-md p-2 mb-3"
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="mb-4"
          />
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            {uploading ? "Uploading..." : "Upload Lesson"}
          </button>
        </form>
      </div>

      {/* Lessons List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition"
          >
            <video
              src={lesson.videoUrl}
              controls
              className="w-full rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold text-blue-700 mb-1">
              {lesson.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2">{lesson.description}</p>
            <button
              onClick={() => handleDeleteLesson(lesson.id, lesson.videoUrl)}
              className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
