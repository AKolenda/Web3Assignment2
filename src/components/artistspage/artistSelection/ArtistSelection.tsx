import React, { useState } from "react";
import { ArtistFilterProps } from "../types/artistProps";

const ArtistFilter: React.FC<ArtistFilterProps> = (props) => {
  const { onSubmit, artists, disabled = false } = props;
  const [filterArtist] = useState(true);

  const [artistValue, setArtistValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Number(artistValue));

    console.log("Filter form submitted", {
      filterArtist,
      artistValue,
    });
  };

  const handleReset = () => {
    setArtistValue("");

    onSubmit(0);
  };

  return (
    <div
      className={`bg-gray-100 p-4 rounded-lg sticky top-4 ${
        disabled ? "opacity-70" : ""
      }`}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            {filterArtist && (
              <select
                className="w-full border p-1 rounded mt-1"
                value={artistValue}
                onChange={(e) => setArtistValue(e.target.value)}
                disabled={disabled}
              >
                <option value="">Select artist</option>
                {artists?.map((artist) => (
                  <option key={artist.artistId} value={artist.artistId}>
                    {artist.firstName} {artist.lastName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition w-1/2"
              disabled={disabled}
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-1/2"
              disabled={disabled}
              onClick={handleSubmit}
            >
              Apply
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ArtistFilter;
