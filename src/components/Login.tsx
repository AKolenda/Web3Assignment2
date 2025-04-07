import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface UnsplashImage {
  urls: {
    regular: string;
  };
  alt_description: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

const Login: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<UnsplashImage | null>(
    null
  );
  const [, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch a random image from Unsplash for the background
  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        // Check if the API key is defined
        const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

        if (!apiKey) {
          console.warn(
            "Unsplash API key is not defined. Using fallback image."
          );
          // Set a fallback image instead of fetching from Unsplash
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://api.unsplash.com/photos/random?client_id=${apiKey}`
        );

        if (!response.ok) {
          throw new Error(`Unsplash API error: ${response.status}`);
        }

        const data = await response.json();
        setBackgroundImage(data);
      } catch (err) {
        console.error("Error fetching background image:", err);
        setError("Failed to load background image");
      } finally {
        setLoading(false);
      }
    };

    fetchRandomImage();
  }, []);

  // Background style
  const backgroundStyle = {
    backgroundImage: backgroundImage
      ? `url(${backgroundImage.urls.regular})`
      : "url('https://source.unsplash.com/random/1920x1080/?painting,art')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  // If loading, show a loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={backgroundStyle}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Art Gallery App</h1>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <Link to="/galleryview">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </button>
            </Link>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Don't have an account?{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </a>
          </p>
        </div>

        {backgroundImage && (
          <div className="mt-6 text-xs text-gray-500 text-center">
            Photo by{" "}
            <a
              href={backgroundImage.user.links.html}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {backgroundImage.user.name}
            </a>{" "}
            on Unsplash
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
