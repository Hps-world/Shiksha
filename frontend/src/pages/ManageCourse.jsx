import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function ManageCourse() {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const navigate = useNavigate();

  // ✅ Load educator's courses
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/educator-login");
      return;
    }
    fetchCourses(user.uid);
  }, [navigate]);

  const fetchCourses = async (uid) => {
    const q = query(collection(db, "courses"), where("educatorId", "==", uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCourses(data);
  };

  // ✅ Delete a course
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirm) return;
    await deleteDoc(doc(db, "courses", id));
    alert("Course deleted successfully");
    setCourses(courses.filter((course) => course.id !== id));
  };

  // ✅ Open edit form
  const handleEdit = (course) => {
    setEditingCourse(course.id);
    setForm({
      title: course.title,
      description: course.description,
      price: course.price,
      category: course.category,
    });
  };

  // ✅ Update Firestore
  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "courses", editingCourse), {
      ...form,
      price: Number(form.price),
    });
    alert("Course updated successfully ✅");
    setEditingCourse(null);
    fetchCourses(auth.currentUser.uid);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white border-b shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          Manage Your Courses
        </h1>
        <button
          onClick={() => navigate("/educator-dashboard")}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
          >
            <img
              src={
                course.thumbnail ||
                "https://img.freepik.com/free-photo/online-learning-concept_23-2148685630.jpg"
              }
              alt={course.title}
              className="rounded-md mb-3 w-full h-40 object-cover"
            />
            {editingCourse === course.id ? (
              // ✅ Edit form
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded-md p-2 mb-2"
                />
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border rounded-md p-2 mb-2"
                />
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border rounded-md p-2 mb-2"
                />
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full border rounded-md p-2 mb-4"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Business">Business</option>
                </select>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Update
                  </button>
                </div>
              </form>
            ) : (
              // ✅ Normal course view
              <>
                <h3 className="text-lg font-semibold text-blue-700 mb-1">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {course.category} • ₹{course.price}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {course.description.slice(0, 80)}...
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(course)}
                    className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {/* Manage courses */}
      <div>
        <Link
          to={`/manage-lessons/${course.id}`}
          className="bg-purple-600 text-white px-4 py-1 rounded-md hover:bg-purple-700 transition"
        >
          Lessons
        </Link>
      </div>
    </div>
  );
}
