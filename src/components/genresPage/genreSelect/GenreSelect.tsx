import React, { useState } from "react";
import { GenreFilterProps } from "../types/genreProps";

const GenreSelect: React.FC<GenreFilterProps> = (props) => {
  const { onSubmit, genres, disabled = false } = props;
  const [filterGenre] = useState(true);

  const [genreValue, setGenreValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Number(genreValue));

    console.log("Filter form submitted", {
      filterGenre,
      genreValue,
    });
  };

  const handleReset = () => {
    setGenreValue("");
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
            {filterGenre && (
              <select
                className="w-full border p-1 rounded mt-1"
                value={genreValue}
                onChange={(e) => setGenreValue(e.target.value)}
                disabled={disabled}
              >
                <option value="">Select genre</option>
                {genres?.map((genre) => (
                  <option key={genre.genreId} value={genre.genreId}>
                    {genre.genreName}
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

export default GenreSelect;
