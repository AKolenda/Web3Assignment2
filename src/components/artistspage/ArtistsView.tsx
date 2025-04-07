import Navigation from "../Navigation";
import ArtistSelection from "./artistSelection/ArtistSelection";
import { useState, useEffect } from "react";
import { ExtendedPainting } from "../paintingsview/types/paintingProps";
import {
  getImageUrl,
  createImageErrorHandler,
} from "../paintingsview/utils/imageUtils";
import PaintingModal from "../galleryview/gallery/PaintingModal";

import ArtistInfo from "./artistInfo/ArtistInfo";
import { Artist } from "./types/artistProps";
import { useFavorites } from "../../context/FavoritesContext";

const ArtistsView = () => {
  
  const [artists, setArtists] = useState<Artist[]>([]);
  const [paintings, setPaintings] = useState<ExtendedPainting[]>([]);
  const [filteredPaintings, setFilteredPaintings] = useState<ExtendedPainting[]>([]);
  const [selectedPainting, setSelectedPainting] =
    useState<ExtendedPainting | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  type SortField = "title" | "year";
  const [sortBy, setSortBy] = useState<SortField>("title");


  const {
    isArtistFavorite,
    isPaintingFavorite,     //Used for painting Modal
    togglePaintingFavorite, //Used for painting Modal
    toggleArtistFavorite,
  } = useFavorites();

  useEffect(() => {
    const fetchArtists = async () => {
      try {

        // Fetch artists from the API
        const response = await fetch("/api/artists");

        if (!response.ok) {
          throw new Error("Failed to fetch artists");
        }

        const data = await response.json();

        // Map the data to the specified object structure
        const mappedArtists = data.map((artist: any) => ({
          artistId: artist.artistId,
          firstName: artist.firstName,
          lastName: artist.lastName,
          nationality: artist.nationality,
          gender: artist.gender,
          yearOfBirth: artist.yearOfBirth,
          yearOfDeath: artist.yearOfDeath,
          details: artist.details,
          artistLink: artist.artistLink,
        }));

        //Stops the type compiler from complaining

        const uniqueArtistsArray: Artist[] = mappedArtists.filter(
          (artist: Artist) => artist && artist.firstName && artist.lastName
        );

        // Sort the mapped artists by name
        const sortedArtists = uniqueArtistsArray.sort((a, b) =>
          a.lastName && b.lastName ? a.lastName.localeCompare(b.lastName) : 0
        );

        setArtists(sortedArtists);
      } catch (error) {
        console.error("Error fetching artists:", error);
      } finally {

      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true);

        // Fetch paintings from the API
        const response = await fetch("/api/paintings");

        if (!response.ok) {
          throw new Error("Failed to fetch paintings");
        }

        const data = await response.json();
        // Explicitly filter out entries with missing data before processing

        const processedData = data
          .map((p: any) => ({
            ...p,
            fileName: p.fileName || p.imageFileName,
            // Make sure Galleries has consistent properties
            Galleries: {
              ...p.Galleries,
              // Ensure we have a name property for consistent filtering/sorting
              name:
                p.Galleries?.galleryName ||
                p.Galleries?.name ||
                "Unknown Gallery",
            },
          }))
          .filter((p: any) => p && p.Artists && p.Galleries);

        setPaintings(processedData);

        // Initially sort by title
        const sortedData = [...processedData].sort((a, b) => {
          const aTitle = a.title || "";
          const bTitle = b.title || "";
          return aTitle.localeCompare(bTitle);
        });
        setFilteredPaintings(sortedData);

      } catch (error) {
        console.error("Error fetching paintings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaintings();
  }, []);

  const openModal = (painting: ExtendedPainting) => {
    setSelectedPainting(painting);
  };

  const closeModal = () => {
    setSelectedPainting(null);
  };

  const sortPaintings = (field: string) => {
    if (!filteredPaintings.length) return;

    let sorted = [...filteredPaintings];

    switch (field) {
      case "title":
        sorted.sort((a, b) => {
          const aTitle = a.title || "";
          const bTitle = b.title || "";
          return aTitle.localeCompare(bTitle);
        });
        break;
      case "yearOfWork":
        sorted.sort((a, b) => (a.yearOfWork || 0) - (b.yearOfWork || 0));
        break;
      default:
        break;
    }

    setFilteredPaintings(sorted);
  };

  const handleSubmit = (artistValue: number) => {
    let filteredPaintings = [...paintings];

    if (artistValue) {
      filteredPaintings = filteredPaintings.filter(
        (painting) =>
          painting.Artists && painting.Artists.artistId === artistValue
      );
    }
    setSelectedArtist(artists.find((a) => a.artistId === artistValue) || null);
    console.log(filteredPaintings);
    setFilteredPaintings(filteredPaintings);
  };

  const skeletonCards = Array(12).fill(null);

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Artists</h1>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/4 md:sticky md:top-6">
            <ArtistSelection
              artists={artists}
              onSubmit={handleSubmit}
              disabled={loading}
            />
          </div>
          <div className="w-full md:w-3/4 p-2 flex flex-col gap-6">
            <div className="bg-gray-100 p-4 rounded @md:h-auto @lg:h-[450px]">
              {!loading && selectedArtist && (
                <ArtistInfo
                  artist={selectedArtist}
                  isFavorite={isArtistFavorite(selectedArtist.artistId)}
                  onToggleFavorite={() => toggleArtistFavorite(selectedArtist)}
                />
              )}
              {!selectedArtist && <p>Select an Artist to view details</p>}
            </div>

            <div className="flex items-center mt-3">
              <span className="mr-2 text-gray-600 ">Sort by:</span>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("title");
                    sortPaintings("title");
                  }}
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
                  onClick={() => {
                    setSortBy("year");
                    sortPaintings("yearOfWork");
                  }}
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
            <div>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skeletonCards.map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="border rounded-lg overflow-hidden shadow-lg animate-pulse"
                    >
                      <div className="bg-gray-300 h-48 w-full"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                        <div className="h-7 bg-gray-300 rounded w-1/3 mt-4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPaintings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPaintings.map((painting) => (
                    <div
                      key={painting.paintingId}
                      className="border rounded-lg overflow-hidden shadow-lg"
                    >
                      <div className="relative w-full h-48">
                        <img
                          src={getImageUrl(painting.imageFileName, 300, true)}
                          alt={painting.title}
                          className="w-full h-full object-cover"
                          onError={createImageErrorHandler(300)}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">
                          {painting.title}
                        </h3>
                        {painting.Artists && (
                          <p>
                            Artist: {painting.Artists.firstName}{" "}
                            {painting.Artists.lastName}
                          </p>
                        )}
                        <p>Year: {painting.yearOfWork}</p>
                        {painting.Galleries && (
                          <p>
                            Gallery:{" "}
                            {painting.Galleries.name ||
                              painting.Galleries.galleryName ||
                              "Unknown Gallery"}
                          </p>
                        )}
                        <p>Medium: {painting.medium}</p>
                        <p>
                          Dimensions: {painting.width}cm × {painting.height}cm
                        </p>
                        <button
                          onClick={() => openModal(painting)}
                          className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg text-gray-600">
                    
                  </p>
                </div>
              )}

              {selectedPainting && (
                <PaintingModal
                  painting={selectedPainting}
                  onClose={closeModal}
                  isOpen={!!selectedPainting} // Added isOpen property
                  isFavorite={isPaintingFavorite(selectedPainting.paintingId)}
                  onToggleFavorite={togglePaintingFavorite}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistsView;
