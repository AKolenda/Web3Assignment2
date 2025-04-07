// credits Author Alok &&  Aman kumar
// https://tailwindflex.com/@alok/tailwind-image-gallery
// https://tailwindflex.com/@Aman300/gallery-2

import { useState, useEffect } from "react";
import { Painting } from "../types/paintingTypes";

interface GalleryPaintingsProps {
  paintings: Painting[];
  isLoading: boolean;
  galleryName?: string;
  onSelectPainting: (painting: Painting) => void;
}

type SortField = "title" | "artist" | "year";

const GalleryPaintings: React.FC<GalleryPaintingsProps> = ({
  paintings,
  isLoading,
  galleryName,
  onSelectPainting,
}) => {
  const [sortedPaintings, setSortedPaintings] = useState<Painting[]>([]);
  const [sortBy, setSortBy] = useState<SortField>("title");
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (paintings.length > 0) {
      const sorted = [...paintings].sort((a, b) => {
        switch (sortBy) {
          case "artist":
            return `${a.Artists.lastName}${a.Artists.firstName}`.localeCompare(
              `${b.Artists.lastName}${b.Artists.firstName}`
            );
          case "year":
            return a.yearOfWork - b.yearOfWork;
          case "title":
          default:
            return a.title.localeCompare(b.title);
        }
      });
      setSortedPaintings(sorted);
    } else {
      setSortedPaintings([]);
    }
  }, [paintings, sortBy]);

  const handleImageError = (paintingId: number) => {
    setImageErrors((prev) => ({ ...prev, [paintingId]: true }));
  };

  const getImageUrl = (painting: Painting) => {
    if (imageErrors[painting.paintingId]) {
      return "https://via.placeholder.com/300x300?text=Image+Not+Available";
    }

    const formattedFileName = String(painting.imageFileName).padStart(6, "0");

    return `/art-images/paintings/square/${formattedFileName}.jpg`;

  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <img
          src="https://i.gifer.com/ZKZg.gif"
          alt="Loading"
          className="w-16 h-16 mb-4"
        />
        <p className="text-gray-600">Loading paintings...</p>
      </div>
    );
  }

  if (sortedPaintings.length === 0) {
    return (
      <div className="text-center py-10">
        {galleryName
          ? `No paintings available for ${galleryName}`
          : "Select a gallery to view paintings"}
      </div>
    );
  }

  return (
    <div className="bg-white py-3 sm:py-5 lg:py-7">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-4 flex items-center justify-between gap-8 sm:mb-8 md:mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl ">
              {galleryName
                ? `Paintings from ${galleryName}`
                : "Gallery Paintings"}
            </h2>
            <p className="text-gray-500 ">
              Displaying {sortedPaintings.length} artwork
              {sortedPaintings.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center">
            <span className="mr-2 text-gray-600 ">Sort by:</span>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setSortBy("title")}
                className={`px-4  text-sm font-medium rounded-l-lg 
                  ${
                    sortBy === "title"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  }`}
              >
                Title
              </button>
              <button
                type="button"
                onClick={() => setSortBy("artist")}
                className={`px-4  text-sm font-medium 
                  ${
                    sortBy === "artist"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  }`}
              >
                Artist
              </button>
              <button
                type="button"
                onClick={() => setSortBy("year")}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg 
                  ${
                    sortBy === "year"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  }`}
              >
                Year
              </button>
            </div>
          </div>
        </div>

        <div className="columns-1 md:columns-2 xl:columns-3 gap-7">
          {sortedPaintings.map((painting) => (
            <div
              key={painting.paintingId}
              className="break-inside-avoid mb-8 group relative cursor-pointer"
              onClick={() => onSelectPainting(painting)}
            >
              <img
                src={getImageUrl(painting)}
                onError={() => handleImageError(painting.paintingId)}
                loading="lazy"
                alt={painting.title}
                className="h-auto max-w-full transition duration-200 group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-semibold">{painting.title}</h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm opacity-90">
                    {painting.Artists.firstName} {painting.Artists.lastName}
                  </span>
                  <span className="text-sm opacity-90">
                    {painting.yearOfWork}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPaintings;
