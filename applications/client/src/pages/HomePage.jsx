import { useContext, useEffect, useState } from "react";
import NavBar from "../components/layout/nav-bar/NavBar";
import { ThemeContext } from "../App";
import { UserContext } from "../App";
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  LineChart,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import Footer from "../components/layout/footer/Footer";

import { useNavigate } from "react-router-dom";
const HomePage = () => {
  useEffect(() => {
    document.title = "Home Page";
  });

  const { theme } = useContext(ThemeContext);
  const { userAuth } = useContext(UserContext);
  const { isDark } = useState("dark");
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col items-center min-h-screen ${
        theme == "light" ? "bg-white" : "bg-black/90"
      }`}
    >
      <NavBar theme={theme} />
      {/* <div className="flex items-center gap-2 rounded-full p-4 border-[1px] border-gray-200 shadow-xl mt-32 text-black w-[600px]">
        <Search className="text-gray-700" />
        <input
          type="text"
          placeholder="Search for blogs and stock"
          className=" ml-2 w-full text-black/90 outline-none tracking-wider"
        />
      </div> */}

      <section className="flex items-center justify-center py-0 md:py-0 h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Predict Markets with{" "}
                <span className="text-orange-500">AI Precision</span>
              </h1>
              <p className="text-xl mb-8 opacity-80 max-w-lg">
                Advanced machine learning models to forecast stock trends and a
                platform to share your financial insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-300 text-white rounded-lg font-medium transition-colors"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Get Started
                </button>
                <button
                  className={`px-8 py-3 rounded-lg font-medium ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-100 hover:bg-gray-200"
                  } transition-colors`}
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div
                className={`relative rounded-2xl overflow-hidden shadow-xl ${
                  isDark ? "bg-gray-800" : "bg-white"
                } p-6`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold">Stock Predictions</h3>
                      <p
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Powered by AI
                      </p>
                    </div>
                    {/* <LineChart className="text-orange-500" /> */}
                  </div>

                  <div className="h-48 w-full bg-gradient-to-r from-orange-500/20 to-orange-500/5 rounded-lg flex items-center justify-center mb-6">
                    <TrendingUp size={64} className="text-orange-500/50" />
                  </div>

                  <div className="flex justify-between items-center">
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <span className="text-sm">Accuracy</span>
                      <div className="text-lg font-bold">67%</div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <span className="text-sm">Models</span>
                      <div className="text-lg font-bold">2+</div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <span className="text-sm">Data Points</span>
                      <div className="text-lg font-bold">10M+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="h-screen py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Smart Investors
            </h2>
            <p
              className={`max-w-2xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Our platform combines cutting-edge AI technology with community
              insights to help you make better investment decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className={`p-8 rounded-xl ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-750"
                  : "bg-gray-50 hover:bg-gray-100"
              } transition-all`}
            >
              <div
                className={`w-14 h-14 rounded-full ${
                  isDark ? "bg-orange-900/50" : "bg-orange-100"
                } flex items-center justify-center mb-6`}
              >
                <BarChart2 size={24} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Predictions</h3>
              <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Our machine learning models analyze market data, news sentiment,
                and historical patterns to forecast stock movements.
              </p>
            </div>

            <div
              className={`p-8 rounded-xl ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-750"
                  : "bg-gray-50 hover:bg-gray-100"
              } transition-all`}
            >
              <div
                className={`w-14 h-14 rounded-full ${
                  isDark ? "bg-orange-900/50" : "bg-orange-100"
                } flex items-center justify-center mb-6`}
              >
                <BookOpen size={24} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Blog Publishing Platform
              </h3>
              <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Share your financial insights and trading strategies with our
                community or learn from experienced investors.
              </p>
            </div>

            <div
              className={`p-8 rounded-xl ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-750"
                  : "bg-gray-50 hover:bg-gray-100"
              } transition-all`}
            >
              <div
                className={`w-14 h-14 rounded-full ${
                  isDark ? "bg-orange-900/50" : "bg-orange-100"
                } flex items-center justify-center mb-6`}
              >
                <Users size={24} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Insights</h3>
              <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Tap into the collective wisdom of thousands of traders and
                investors to inform your decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <div className="h-screen ">
        <section
          className={`py-16 md:py-24 ${
            isDark ? "bg-gray-800/50" : "bg-gray-50"
          } rounded-3xl my-8`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p
                className={`max-w-2xl mx-auto ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Our platform makes it easy to get AI-powered stock predictions
                and share your financial knowledge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-full ${
                      isDark ? "bg-emerald-900/50" : "bg-orange-100"
                    } flex items-center justify-center mx-auto mb-6`}
                  >
                    <span className="text-2xl font-bold text-orange-500">
                      1
                    </span>
                  </div>
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 -ml-4 bg-orange-500/30"></div>
                </div>
                <h3 className="text-xl font-bold mb-3">Sign Up</h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Create your account in seconds and set up your investment
                  preferences.
                </p>
              </div>

              <div className="text-center">
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-full ${
                      isDark ? "bg-orange-900/50" : "bg-orange-100"
                    } flex items-center justify-center mx-auto mb-6`}
                  >
                    <span className="text-2xl font-bold text-orange-500">
                      2
                    </span>
                  </div>
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 -ml-4 bg-orange-500/30"></div>
                </div>
                <h3 className="text-xl font-bold mb-3">Get Predictions</h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Access AI-powered stock predictions based on advanced machine
                  learning models.
                </p>
              </div>

              <div className="text-center">
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-full ${
                      isDark ? "bg-orange-900/50" : "bg-orange-100"
                    } flex items-center justify-center mx-auto mb-6`}
                  >
                    <span className="text-2xl font-bold text-orange-500">
                      3
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Share Insights</h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Publish your own analyses and learn from our community of
                  financial experts.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
