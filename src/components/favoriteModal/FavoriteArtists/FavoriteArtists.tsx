import React from "react";
import { Artist } from "../../artistspage/types/artistProps";

type FavoriteArtistsProps = {
  artists: Artist[];
  selectedArtists: Artist[];
  onSelect: (artist: Artist) => void;
};

const FavoriteArtists: React.FC<FavoriteArtistsProps> = ({ artists, selectedArtists, onSelect }) => {
  return (
    <div className="space-y-2 max-h-64 overflow-y-auto bg-gray-200">
      {artists.map((artist) => (
        <div
          key={artist.artistId}
          className={`flex justify-between items-center p-2 rounded-md shadow-sm hover:bg-gray-100 ${selectedArtists.some((a) => a.artistId === artist.artistId) ? "bg-red-500 hover:bg-red-400" : "bg-white"
          }`}
        >
          <h3 className="font-medium text-gray-700">{artist.firstName} {artist.lastName}</h3>
          <button
            onClick={() => onSelect(artist)}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition`}
          >
            {selectedArtists.some((a) => a.artistId === artist.artistId) ? "Deselect" : "Select"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default FavoriteArtists;