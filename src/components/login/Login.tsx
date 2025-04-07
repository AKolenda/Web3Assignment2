// credit: https://flowbite.com/blocks/marketing/login/

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [bgImage, setBgImage] = useState("");
  const [credits, setCredits] = useState("");

  useEffect(() => {
    // weird that useEFfect forces this, but okay
    async function fetchRandomImage() {
      try {
        const response = await fetch(
          `https://api.unsplash.com/photos/random?client_id=${
            import.meta.env.VITE_UNSPLASH_ACCESS_KEY
          }`
        );
        const data = await response.json();
        setBgImage(data.urls?.full ?? "");
        setCredits(data.user?.name ?? "");
      } catch (error) {
        console.error("Error fetching Unsplash image:", error);
      }
    }
    fetchRandomImage();
  }, []);

  return (
    <>
      <section
        className="bg-gray-50 dark:bg-gray-900 login-bg m-5"
        style={
          {
            "--bg-image": bgImage ? `url(${bgImage})` : "none",
          } as React.CSSProperties
        }
      >
        <div className="flex flex-col items-center justify-between mx-auto h-full lg:py-0 overflow-hidden">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white mt-15"
          >
            PlaceHolder Application Name
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Username"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500 text-white"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/galleryview"
                    className="w-full text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary-800 cursor-pointer"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary-800 cursor-pointer"
                  >
                    Register
                  </Link>
                </div>
              </form>
            </div>
          </div>
          <div className="mb-15 text-white text-lg">
            <p>Credits: {credits}</p>
          </div>
        </div>
      </section>
    </>
  );
}
