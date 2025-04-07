import React, { useState } from "react";
import { PaintingFilterProps } from "../types/paintingProps";

const PaintingFilter: React.FC<PaintingFilterProps> = ({
  onFilter,
  artists,
  galleries,
  genres,
  disabled = false,
}) => {
  const [filterTitle, setFilterTitle] = useState(false);
  const [filterArtist, setFilterArtist] = useState(false);
  const [filterGallery, setFilterGallery] = useState(false);
  const [filterYear, setFilterYear] = useState(false);

  const [titleValue, setTitleValue] = useState("");
  const [artistValue, setArtistValue] = useState("");
  const [galleryValue, setGalleryValue] = useState("");
  const [yearStart, setYearStart] = useState("1400"); // Default values
  const [yearEnd, setYearEnd] = useState("1900");
  const [genreId, setGenreId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Filter form submitted", {
      filterTitle,
      titleValue,
      filterArtist,
      artistValue,
      filterGallery,
      galleryValue,
      filterYear,
      yearStart,
      yearEnd,
      genreId,
    });

    onFilter(
      filterTitle,
      filterArtist,
      filterGallery,
      filterYear,
      titleValue,
      artistValue,
      galleryValue,
      yearStart,
      yearEnd,
      genreId
    );
  };

  const handleReset = () => {
    setFilterTitle(false);
    setFilterArtist(false);
    setFilterGallery(false);
    setFilterYear(false);

    setTitleValue("");
    setArtistValue("");
    setGalleryValue("");
    setYearStart("1400");
    setYearEnd("1900");
    setGenreId("");

    // Apply the reset filter immediately
    onFilter(false, false, false, false, "", "", "", "", "", "");
  };

  return (
    <div
      className={`bg-gray-100 p-4 rounded-lg sticky top-4 ${
        disabled ? "opacity-70" : ""
      }`}
    >
      <h2 className="text-xl font-semibold mb-3">Filter Paintings</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={filterTitle}
                onChange={() => setFilterTitle(!filterTitle)}
                className="form-checkbox h-5 w-5"
                disabled={disabled}
              />
              <span className="font-medium">Title contains</span>
            </label>
            {filterTitle && (
              <input
                className="w-full border p-1 rounded mt-1"
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                placeholder="Enter title text"
                disabled={disabled}
              />
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={filterArtist}
                onChange={() => setFilterArtist(!filterArtist)}
                className="form-checkbox h-5 w-5"
                disabled={disabled}
              />
              <span className="font-medium">Artist</span>
            </label>
            {filterArtist && (
              <select
                className="w-full border p-1 rounded mt-1"
                value={artistValue}
                onChange={(e) => setArtistValue(e.target.value)}
                disabled={disabled}
              >
                <option value="">Select artist</option>
                {artists?.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={filterGallery}
                onChange={() => setFilterGallery(!filterGallery)}
                className="form-checkbox h-5 w-5"
                disabled={disabled}
              />
              <span className="font-medium">Gallery</span>
            </label>
            {filterGallery && (
              <select
                className="w-full border p-1 rounded mt-1"
                value={galleryValue}
                onChange={(e) => setGalleryValue(e.target.value)}
                disabled={disabled}
              >
                <option value="">Select gallery</option>
                {galleries?.map((gallery) => (
                  <option key={gallery.galleryId} value={gallery.galleryId}>
                    {gallery.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={filterYear}
                onChange={() => setFilterYear(!filterYear)}
                className="form-checkbox h-5 w-5"
                disabled={disabled}
              />
              <span className="font-medium">Year range</span>
            </label>
            {filterYear && (
              <div className="flex items-center gap-2 mt-1">
                <input
                  className="border p-1 rounded w-full"
                  type="number"
                  value={yearStart}
                  onChange={(e) => setYearStart(e.target.value)}
                  min="1000"
                  max="2023"
                  placeholder="From"
                  disabled={disabled}
                />
                <span>to</span>
                <input
                  className="border p-1 rounded w-full"
                  type="number"
                  value={yearEnd}
                  onChange={(e) => setYearEnd(e.target.value)}
                  min="1000"
                  max="2023"
                  placeholder="To"
                  disabled={disabled}
                />
              </div>
            )}
          </div>

          <div>
            <label className="flex flex-col gap-2 mb-2">
              <span className="font-medium">Genre</span>
              <select
                className="w-full border p-1 rounded mt-1"
                value={genreId}
                onChange={(e) => setGenreId(e.target.value)}
                disabled={disabled}
              >
                <option value="">All Genres</option>
                {genres?.map((genre) => (
                  <option key={genre.genreId} value={genre.genreId}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </label>
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
            >
              Apply
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaintingFilter;
