// Attr: https://tailwindflex.com/@vishvajeet/best-responsive-navbar-design-easy-modern-navigation
// Author Vishvajeet

import { NavLink } from "react-router-dom";
import { useState } from "react";
import FavoriteModal from "./favoriteModal/FavoriteModal";
import { useFavorites } from "../context/FavoritesContext";
import AboutModal from "./about/aboutModal";

const Navigation = () => {
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "block py-2 pl-3 pr-4 text-white bg-purple-700 rounded lg:bg-transparent lg:text-purple-700 lg:p-0 dark:text-white"
      : "block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700";
  };

  const { favoriteGalleries, favoriteArtists, favoritePaintings } =
    useFavorites();

  const hasFavorites =
    favoriteGalleries.length > 0 ||
    favoriteArtists.length > 0 ||
    favoritePaintings.length > 0;

  // Log the state for debugging
  console.log("Favorites state:", {
    galleries: favoriteGalleries,
    artists: favoriteArtists,
    paintings: favoritePaintings,
    hasFavorites,
  });

  return (
    <>
      <nav className="bg-white border-gray-200 py-2.5 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
          <NavLink to="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Logo
            </span>
          </NavLink>
          <div className="flex items-center lg:order-2">
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="true"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <NavLink to="/artists" className={navLinkStyle}>
                  Artists
                </NavLink>
              </li>
              <li>
                <NavLink to="/paintings" className={navLinkStyle}>
                  Paintings
                </NavLink>
              </li>
              <li>
                <NavLink to="/galleryview" className={navLinkStyle}>
                  Galleries
                </NavLink>
              </li>
              <li>
                <NavLink to="/genres" className={navLinkStyle}>
                  Genres
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => hasFavorites && setIsFavoritesOpen(true)}
                  className={
                    navLinkStyle({ isActive: false }) +
                    (hasFavorites ? " cursor-pointer" : " cursor-not-allowed")
                  }
                  disabled={!hasFavorites}
                  style={{ pointerEvents: hasFavorites ? "auto" : "none" }}
                >
                  Favorites
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className={navLinkStyle({ isActive: false })}
                >
                  About
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <FavoriteModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};

export default Navigation;
