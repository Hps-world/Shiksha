import Hero from "../components/Hero";
import CourseCard from "../components/CourseCard";

export default function Home() {
  const courses = [
    {
      title: "Master Full Stack Development",
      educator: "Himanshu Pratap",
      image: "https://img.freepik.com/free-photo/coding-man_1098-18084.jpg",
    },
    {
      title: "Python for Data Science",
      educator: "Anjali Sharma",
      image: "https://img.freepik.com/free-photo/data-scientist_53876-126261.jpg",
    },
    {
      title: "React from Zero to Hero",
      educator: "Angela  Yu",
      image: "https://img.freepik.com/free-photo/frontend-developer_1098-17984.jpg",
    },
  ];

  return (
    <>
      <Hero />
      <section className="py-20 px-6 md:px-20 bg-gray-50">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
          Explore Popular Courses
        </h2>
        <div className="flex flex-wrap justify-center gap-10">
          {courses.map((course, idx) => (
            <CourseCard key={idx} {...course} />
          ))}
        </div>
      </section>
    </>
  );
}
