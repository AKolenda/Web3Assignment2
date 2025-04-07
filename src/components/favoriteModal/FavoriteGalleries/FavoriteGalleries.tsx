import React from "react";
import { Gallery } from "../../galleryview/types/galleryTypes";

type FavoriteGalleriesProps = {
  galleries: Gallery[];
  selectedGalleries: Gallery[];
  onSelect: (gallery: Gallery) => void;
};

const FavoriteGalleries: React.FC<FavoriteGalleriesProps> = ({ galleries, selectedGalleries, onSelect }) => {
  return (
    <div className="space-y-2 max-h-64 overflow-y-auto bg-gray-200">
      {galleries.map((gallery) => (
        <div
          key={gallery.galleryId}
          className={`flex justify-between items-center p-2 rounded-md shadow-sm hover:bg-gray-100 ${selectedGalleries.some((g) => g.galleryId === gallery.galleryId) ? "bg-red-500 hover:bg-red-400" : "bg-white"
          }`}
        >
          <h3 className="font-medium text-gray-700">{gallery.galleryName}</h3>
          <button
            onClick={() => onSelect(gallery)}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition`}
          >
            {selectedGalleries.some((g) => g.galleryId === gallery.galleryId) ? "Deselect" : "Select"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default FavoriteGalleries;