export default function Hero() {
  return (
    <section className="pt-24 md:pt-32 pb-20 px-6 md:px-20 bg-linear-to-r am from-white  to-blue-300 flex flex-col md:flex-row items-center justify-between">
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold text-black leading-tight">
          Crack your goal with <span className="text-blue-500">Shiksha</span>
        </h1>
        <p className="text-gray-600 mt-4">
          Learn from top educators, practice with live tests, and achieve your dream.
        </p>
        <div className="mt-6 flex space-x-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
            Get Started
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-400">
            Explore Courses
          </button>
        </div>
      </div>

      <img
        src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774"
        alt="learning"
        className="w-96 md:w-[500px] mt-10 md:mt-0 border-none rounded-xl"
        
      />
    </section>
  );
}
