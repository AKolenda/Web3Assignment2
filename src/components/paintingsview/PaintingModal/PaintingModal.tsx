import React from "react";
import { PaintingModalProps } from "../types/paintingProps";
import { getImageUrl, createImageErrorHandler } from "../utils/imageUtils";

const PaintingModal: React.FC<PaintingModalProps> = ({
  painting,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!painting || !painting.paintingId) return;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{painting.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative w-full">
              <img
                src={getImageUrl(
                  painting.fileName || painting.imageFileName,
                  500,
                  true
                )}
                alt={painting.title}
                className="w-full h-auto rounded"
                onError={createImageErrorHandler(500)}
              />
            </div>

            <div>
              {painting.Artists && (
                <h3 className="text-lg font-semibold mb-1">
                  {painting.Artists.firstName} {painting.Artists.lastName} (
                  {painting.yearOfWork})
                </h3>
              )}

              <div className="space-y-2 text-gray-700">
                {painting.Galleries && (
                  <p>
                    <span className="font-medium">Gallery:</span>{" "}
                    {painting.Galleries.name ||
                      painting.Galleries.galleryName ||
                      "Unknown Gallery"}
                    {(painting.Galleries.galleryCity ||
                      painting.Galleries.city) &&
                      `, ${
                        painting.Galleries.galleryCity ||
                        painting.Galleries.city
                      }`}
                  </p>
                )}
                <p>
                  <span className="font-medium">Medium:</span> {painting.medium}
                </p>
                <p>
                  <span className="font-medium">Dimensions:</span>{" "}
                  {painting.width}cm × {painting.height}cm
                </p>
                {painting.Genres && (
                  <p>
                    <span className="font-medium">Genre:</span>{" "}
                    {painting.Genres.name}
                  </p>
                )}

                {painting.description && (
                  <div className="mt-4">
                    <h4 className="font-medium text-lg mb-1">Description</h4>
                    <p className="text-sm">{painting.description}</p>
                  </div>
                )}

                <div className="mt-4">
                  <h4 className="font-medium text-lg mb-1">Details</h4>
                  <p>
                    <span className="font-medium">Painting ID:</span>{" "}
                    {painting.paintingId}
                  </p>
                  <p>
                    <span className="font-medium">Copyright:</span>{" "}
                    {painting.copyrightText || "Unknown"}
                  </p>
                  {painting.wikiLink && (
                    <p>
                      <span className="font-medium">Wiki:</span>{" "}
                      <a
                        href={painting.wikiLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View on Wikipedia
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 px-6 py-3 flex justify-between items-center">
          <button
            onClick={() => onToggleFavorite(painting)}
            className={`px-4 py-2 rounded-full transition flex items-center gap-1${
              isFavorite
          ? " bg-yellow-400 text-gray-800 hover:bg-yellow-300"
          : " bg-gray-300 bg-opacity-20 text-black hover:bg-opacity-30"
            }`}
          >
            <span className="text-lg">{isFavorite ? "★" : "☆"}</span>
            <span>{isFavorite ? "Favorited" : "Favorite"}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
        </div>
      </div>
  );
};

export default PaintingModal;
