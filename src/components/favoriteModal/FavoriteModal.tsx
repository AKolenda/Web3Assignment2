import React, { useState } from "react";
import { useFavorites } from "../../context/FavoritesContext";
import { Gallery } from "../galleryview/types/galleryTypes";
import { Artist } from "../artistspage/types/artistProps";
import { Painting } from "../galleryview/types/paintingTypes";

import FavoriteGalleries from "./FavoriteGalleries/FavoriteGalleries";
import FavoriteArtists from "./FavoriteArtists/FavoriteArtists";
import FavoritePaintings from "./FavoritePaintings/FavoritePaintings";

interface FavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteGalleries?: string[];
  favoriteArtists?: string[];
  favoritePaintings?: string[];
}

const FavoriteModal: React.FC<FavoriteModalProps> = ({ isOpen, onClose }) => {
  // Move useState calls before conditional return
  const [selectedGalleries, setSelectedGalleries] = useState<Gallery[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);
  const [selectedPaintings, setSelectedPaintings] = useState<Painting[]>([]);

  const {
    favoriteGalleries,
    favoriteArtists,
    favoritePaintings,
    toggleGalleryFavorite,
    toggleArtistFavorite,
    togglePaintingFavorite,
  } = useFavorites();

  const handleGallerySelect = (gallery: Gallery) => {
    setSelectedGalleries((prev) => {
      if (prev.some((g) => g.galleryId === gallery.galleryId)) {
        return prev.filter((g) => g.galleryId !== gallery.galleryId);
      } else {
        return [...prev, gallery];
      }
    });
  };

  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtists((prev) => {
      if (prev.some((a) => a.artistId === artist.artistId)) {
        return prev.filter((a) => a.artistId !== artist.artistId);
      } else {
        return [...prev, artist];
      }
    });
  };

  const handlePaintingSelect = (painting: Painting) => {
    setSelectedPaintings((prev) => {
      if (prev.some((p) => p.paintingId === painting.paintingId)) {
        return prev.filter((p) => p.paintingId !== painting.paintingId);
      } else {
        return [...prev, painting];
      }
    });
  };

  const handleRemoveSelected = () => {
    selectedGalleries.forEach((gallery) => toggleGalleryFavorite(gallery));
    selectedArtists.forEach((artist) => toggleArtistFavorite(artist));
    selectedPaintings.forEach((painting) => togglePaintingFavorite(painting));

    setSelectedGalleries([]);
    setSelectedArtists([]);
    setSelectedPaintings([]);
  };

  const handleSelectAllToggle = () => {
    if (
      selectedGalleries.length === favoriteGalleries.length &&
      selectedArtists.length === favoriteArtists.length &&
      selectedPaintings.length === favoritePaintings.length &&
      (favoriteGalleries.length > 0 ||
        favoriteArtists.length > 0 ||
        favoritePaintings.length > 0)
    ) {
      setSelectedGalleries([]);
      setSelectedArtists([]);
      setSelectedPaintings([]);
    } else {
      setSelectedGalleries(favoriteGalleries);
      setSelectedArtists(favoriteArtists);
      setSelectedPaintings(favoritePaintings);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-[1000]">
      <div className="bg-white rounded-md shadow-xl max-w-6xl w-full max-h-[150%] p-4 relative flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Favorites</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
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
        <div className="flex-1 overflow-y-auto">
          <div className="flex space-x-4">
            <div className="flex-1 text-center bg-gray-200 p-2 rounded">
              <h3 className="font-bold pb-3">Favorite Galleries</h3>
              <FavoriteGalleries
                galleries={favoriteGalleries}
                selectedGalleries={selectedGalleries}
                onSelect={handleGallerySelect}
              />
            </div>
            <div className="flex-1 text-center bg-gray-200 p-2 rounded">
              <h3 className="font-bold pb-3">Favorite Artists</h3>
              <FavoriteArtists
                artists={favoriteArtists}
                selectedArtists={selectedArtists}
                onSelect={handleArtistSelect}
              />
            </div>
            <div className="flex-1 text-center bg-gray-200 p-2 rounded">
              <h3 className="font-bold pb-3">Favorite Paintings</h3>
              <FavoritePaintings
                paintings={favoritePaintings}
                selectedPaintings={selectedPaintings}
                onSelect={handlePaintingSelect}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex space-x-2">
            <button
              onClick={handleSelectAllToggle}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {selectedGalleries.length === favoriteGalleries.length &&
              selectedArtists.length === favoriteArtists.length &&
              selectedPaintings.length === favoritePaintings.length &&
              (favoriteGalleries.length > 0 ||
                favoriteArtists.length > 0 ||
                favoritePaintings.length > 0)
                ? "Deselect All"
                : "Select All"}
            </button>
            <button
              onClick={handleRemoveSelected}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={
                selectedGalleries.length === 0 &&
                selectedArtists.length === 0 &&
                selectedPaintings.length === 0
              }
            >
              Remove
            </button>
          </div>
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

export default FavoriteModal;
