import Navigation from "../Navigation";
import { Genre } from "./types/genreProps";
import { useEffect, useState } from "react";
import { ExtendedPainting } from "../paintingsview/types/paintingProps";
import { useFavorites } from "../../context/FavoritesContext";
import GenreSelect from "./genreSelect/GenreSelect";
import PaintingModal from "../galleryview/gallery/PaintingModal";
import {
  getImageUrl,
  createImageErrorHandler,
} from "../paintingsview/utils/imageUtils";
import GenreInfo from "./genreInfo/GenreInfo";

const GenresView = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [paintings, setPaintings] = useState<ExtendedPainting[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [filteredPaintings, setFilteredPaintings] = useState<
    ExtendedPainting[]
  >([]);
  const [selectedPainting, setSelectedPainting] =
    useState<ExtendedPainting | null>(null);
  const [loading, setLoading] = useState(true);

  type SortField = "title" | "artist" | "year";
  const [sortBy, setSortBy] = useState<SortField>("title");

  const {
    isPaintingFavorite, //Used for painting Modal
    togglePaintingFavorite, //Used for painting Modal
  } = useFavorites();

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
      case "artist":
        sorted.sort((a, b) => {
          const aArtist =
            (a.Artists?.firstName || "") + " " + (a.Artists?.lastName || "");
          const bArtist =
            (b.Artists?.firstName || "") + " " + (b.Artists?.lastName || "");
          return aArtist.localeCompare(bArtist);
        });
        break;
      default:
        break;
    }

    setFilteredPaintings(sorted);
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("/api/genres");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        data.sort((a: Genre, b: Genre) =>
          a.genreName.localeCompare(b.genreName)
        );
        setGenres(data);
        //console.log(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
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

        const processedData = data
          .map((p: any) => ({
            ...p,
            fileName: p.fileName || p.imageFileName,

            Galleries: {
              ...p.Galleries,

              name:
                p.Galleries?.galleryName ||
                p.Galleries?.name ||
                "Unknown Gallery",
            },
          }))
          .filter((p: any) => p && p.Artists && p.Galleries);

        setPaintings(processedData);

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

  const handleSubmit = async (genreValue: number) => {
    setLoading(true);
    if (genreValue === 0) {
      setSelectedGenre(null);
      setFilteredPaintings(paintings);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/paintings/genre/${genreValue}`);
      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to fetch painting IDs by genre");
      }

      const paintingIds = (await response.json()).map(
        (item: any) => item.paintingId
      );
      const updatedFilteredPaintings = paintings.filter((p) =>
        paintingIds.includes(p.paintingId)
      );
      setSelectedGenre(genres.find((g) => g.genreId === genreValue) || null);
      setFilteredPaintings(updatedFilteredPaintings);
    } catch (error) {
      console.error("Error fetching painting IDs by genre:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedPainting(null);
  };

  const openModal = (painting: ExtendedPainting) => {
    setSelectedPainting(painting);
  };

  const skeletonCards = Array(12).fill(null);

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Genres</h1>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/4 md:sticky md:top-6">
            <GenreSelect
              genres={genres}
              onSubmit={handleSubmit}
              disabled={loading}
            />
          </div>
          <div className="w-full md:w-3/4 p-2 flex flex-col gap-6">
            <div className="bg-gray-100 p-4 rounded @md:h-auto @lg:h-[450px]">
              {!loading && selectedGenre && <GenreInfo genre={selectedGenre} />}
              {!selectedGenre && <p>Select a Genre to view details</p>}
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
                    setSortBy("artist");
                    sortPaintings("artist");
                  }}
                  className={`px-4 py-2 text-sm font-medium  
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
                  <p className="text-lg text-gray-600"></p>
                </div>
              )}

              {selectedPainting && (
                <PaintingModal
                  painting={selectedPainting}
                  onClose={closeModal}
                  isOpen={!!selectedPainting}
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

export default GenresView;
