export default function CourseCard({ title, educator, image }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 w-72">
      <img src={image} alt={title} className="rounded-xl mb-3" />
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mb-2">by {educator}</p>
      <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
        Enroll Now
      </button>
    </div>
  );
}
