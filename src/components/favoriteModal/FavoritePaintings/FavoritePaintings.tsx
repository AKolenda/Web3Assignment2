import React from "react";
import { Painting } from "../../galleryview/types/paintingTypes";

type FavoritePaintingsProps = {
  paintings: Painting[];
  selectedPaintings: Painting[];
  onSelect: (painting: Painting) => void;
};

const FavoritePaintings: React.FC<FavoritePaintingsProps> = ({ paintings, selectedPaintings, onSelect }) => {
  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {paintings.map((painting) => (
        <div
          key={painting.paintingId}
          className={`flex justify-between items-center p-2 rounded-md shadow-sm hover:bg-gray-100 ${
            selectedPaintings.some((p) => p.paintingId === painting.paintingId) ? "bg-red-500 hover:bg-red-400" : "bg-white"
          }`}
        >
          <h3 className="font-medium text-gray-700">{painting.title}</h3>
          <button
            onClick={() => onSelect(painting)}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition`}
          >
            {selectedPaintings.some((p) => p.paintingId === painting.paintingId) ? "Deselect" : "View"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default FavoritePaintings;
