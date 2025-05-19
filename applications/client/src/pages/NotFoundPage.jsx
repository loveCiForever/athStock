import { useNavigate } from "react-router-dom";
import HomeIcon from "../assets/icons/homeIcon.png";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="container px-10">
        <div className="flex flex-col items-center max-w-lg mx-auto text-center">
          <h1 className="text-3xl lg:text-6xl font-semibold text-gray-800">
            Page not found
          </h1>
          <p className="text-sm lg:text-lg mt-4 text-gray-500">
            The page you are looking for doesn't exist.
            <br /> Or this feature is not released yet.
          </p>

          <div className="flex flex-col lg:flex-row items-center w-full mt-8 gap-4 lg:gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-[80%] lg:w-2/5 px-5 py-3 text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 hover:bg-gray-100"
              aria-label="Go back to previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:rotate-180"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>

              <span>Go back</span>
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center w-[80%] lg:w-1/2 px-5 py-3 text-white transition-colors duration-200 bg-orange-400 border rounded-lg gap-x-2 hover:bg-orange-300"
              aria-label="Go to home page"
            >
              <img src={HomeIcon} alt="homeicon" className="w-5" />
              Take me home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
