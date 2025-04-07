import { useEffect, useState } from "react";
import PaintingFilter from "./paintingFilter/paintingFilter";
import Navigation from "../Navigation";
import PaintingModal from "../galleryview/gallery/PaintingModal";
import { ExtendedPainting } from "./types/paintingProps"; // Import the proper type
import { getImageUrl, createImageErrorHandler } from "./utils/imageUtils";
import { useFavorites } from "../../context/FavoritesContext";

const PaintingView = () => {
  // Use the imported ExtendedPainting type
  const [paintings, setPaintings] = useState<ExtendedPainting[]>([]);
  const [filteredPaintings, setFilteredPaintings] = useState<
    ExtendedPainting[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("yearOfWork");
  const [selectedPainting, setSelectedPainting] =
    useState<ExtendedPainting | null>(null);
  const [artists, setArtists] = useState<{ id: number; name: string }[]>([]);
  const [galleries, setGalleries] = useState<
    { galleryId: number; name: string }[]
  >([]);
  const [genres, setGenres] = useState<{ genreId: number; name: string }[]>([]);

  const {
    isPaintingFavorite, //Used for painting Modal
    togglePaintingFavorite, //Used for painting Modal
  } = useFavorites();

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        // Using the API endpoint from info.txt
        const response = await fetch("/api/paintings");

        if (!response.ok) {
          throw new Error("Failed to fetch paintings");
        }

        const data = await response.json();

        // Map API response to include fileName if it's not already there
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
          .filter((p: any) => p && p.Artists && p.Galleries); // Filter out items with missing essential data

        setPaintings(processedData);

        // Explicitly type the arrays to fix type errors
        interface ArtistItem {
          id: number;
          name: string;
        }
        interface GalleryItem {
          galleryId: number;
          name: string;
        }
        interface GenreItem {
          genreId: number;
          name: string;
        }

        // Extract unique artists with proper typing
        const uniqueArtistsMap = new Map<number, ArtistItem>();
        processedData.forEach((p: ExtendedPainting) => {
          if (
            p.Artists &&
            p.Artists.artistId !== undefined &&
            p.Artists.firstName &&
            p.Artists.lastName
          ) {
            uniqueArtistsMap.set(p.Artists.artistId, {
              id: p.Artists.artistId,
              name: `${p.Artists.firstName} ${p.Artists.lastName}`,
            });
          }
        });

        // Convert to array and make sure all entries have a name before sorting
        const uniqueArtistsArray = Array.from(uniqueArtistsMap.values()).filter(
          (artist) => artist && artist.name
        );

        // Now sort (safely)
        const uniqueArtists: ArtistItem[] = uniqueArtistsArray.sort((a, b) => {
          return a.name && b.name ? a.name.localeCompare(b.name) : 0;
        });

        // Extract unique galleries with proper typing
        const uniqueGalleriesMap = new Map<number, GalleryItem>();
        processedData.forEach((p: ExtendedPainting) => {
          if (
            p.Galleries &&
            p.Galleries.galleryId !== undefined &&
            p.Galleries.name
          ) {
            uniqueGalleriesMap.set(p.Galleries.galleryId, {
              galleryId: p.Galleries.galleryId,
              name: p.Galleries.name,
            });
          }
        });

        // Convert to array and make sure all entries have a name before sorting
        const uniqueGalleriesArray = Array.from(
          uniqueGalleriesMap.values()
        ).filter((gallery) => gallery && gallery.name);

        // Now sort (safely)
        const uniqueGalleries: GalleryItem[] = uniqueGalleriesArray.sort(
          (a, b) => {
            return a.name && b.name ? a.name.localeCompare(b.name) : 0;
          }
        );

        // Extract unique genres with proper typing
        const uniqueGenresMap = new Map<number, GenreItem>();
        processedData.forEach((p: ExtendedPainting) => {
          if (p.Genres && p.Genres.genreId !== undefined && p.Genres.name) {
            uniqueGenresMap.set(p.Genres.genreId, {
              genreId: p.Genres.genreId,
              name: p.Genres.name,
            });
          }
        });

        // Convert to array and make sure all entries have a name before sorting
        const uniqueGenresArray = Array.from(uniqueGenresMap.values()).filter(
          (genre) => genre && genre.name
        );

        // Now sort (safely)
        const uniqueGenres: GenreItem[] = uniqueGenresArray.sort((a, b) => {
          return a.name && b.name ? a.name.localeCompare(b.name) : 0;
        });

        setArtists(uniqueArtists);
        setGalleries(uniqueGalleries);
        setGenres(uniqueGenres);

        // Initially sort by year
        const sortedData = [...processedData].sort(
          (a, b) => (a.yearOfWork || 0) - (b.yearOfWork || 0)
        );
        setFilteredPaintings(sortedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaintings();
  }, []);

  useEffect(() => {
    if (paintings.length > 0 && filteredPaintings === paintings) {
      // Only auto-sort when paintings change but no filters are applied
      sortPaintings(sortField);
    }
  }, [paintings, sortField]); // Remove filteredPaintings from dependencies

  const sortPaintings = (field: string) => {
    if (!filteredPaintings || filteredPaintings.length === 0) return;

    let sorted = [...filteredPaintings];

    switch (field) {
      case "artistName":
        sorted.sort((a, b) => {
          // Strengthen null checks
          if (!a.Artists || !b.Artists) return 0;
          const aName =
            a.Artists.firstName && a.Artists.lastName
              ? `${a.Artists.firstName} ${a.Artists.lastName}`
              : "";
          const bName =
            b.Artists.firstName && b.Artists.lastName
              ? `${b.Artists.firstName} ${b.Artists.lastName}`
              : "";
          return aName.localeCompare(bName);
        });
        break;
      case "title":
        sorted.sort((a, b) => {
          const aTitle = a.title || "";
          const bTitle = b.title || "";
          return aTitle.localeCompare(bTitle);
        });
        break;
      case "galleryName":
        sorted.sort((a, b) => {
          // Strengthen null checks
          if (!a.Galleries || !b.Galleries) return 0;
          // Use a consistent property (name) for sorting
          const aName = a.Galleries.name || a.Galleries.galleryName || "";
          const bName = a.Galleries.name || a.Galleries.galleryName || "";
          return aName.localeCompare(bName);
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

  const handleFilterSubmit = (
    filterTitle: boolean,
    filterArtist: boolean,
    filterGallery: boolean,
    filterYear: boolean,
    titleValue: string,
    artistValue: string,
    galleryValue: string,
    startYear: string,
    endYear: string,
    genreId: string
  ) => {
    // Start with all paintings
    let filtered = [...paintings];
    console.log("Filter applied with:", {
      filterTitle,
      filterArtist,
      filterGallery,
      filterYear,
      titleValue,
      artistValue,
      galleryValue,
      startYear,
      endYear,
      genreId,
    });
    console.log("Initial paintings count:", filtered.length);

    if (filterTitle && titleValue) {
      filtered = filtered.filter((p) =>
        p.title?.toLowerCase().includes(titleValue.toLowerCase())
      );
      console.log("After title filter:", filtered.length);
    }

    if (filterArtist && artistValue) {
      const artistId = parseInt(artistValue);
      filtered = filtered.filter(
        (p) => p.Artists && p.Artists.artistId === artistId
      );
      console.log("After artist filter:", filtered.length);
    }

    if (filterGallery && galleryValue) {
      const numericValue = parseInt(galleryValue);
      filtered = filtered.filter(
        (p) => p.Galleries && p.Galleries.galleryId === numericValue
      );
      console.log("After gallery filter:", filtered.length);
    }

    if (filterYear && startYear && endYear) {
      const from = parseInt(startYear);
      const to = parseInt(endYear);
      filtered = filtered.filter(
        (p) => p.yearOfWork >= from && p.yearOfWork <= to
      );
      console.log("After year filter:", filtered.length);
    }

    if (genreId && genreId !== "") {
      const genreIdNum = parseInt(genreId);
      console.log("Filtering by genre ID:", genreIdNum);
      filtered = filtered.filter(
        (p) => p.Genres && p.Genres.genreId === genreIdNum
      );
      console.log("After genre filter:", filtered.length);
    }

    // Sort the filtered results directly instead of calling sortPaintings
    if (filtered.length > 0) {
      switch (sortField) {
        case "artistName":
          filtered.sort((a, b) => {
            if (!a.Artists || !b.Artists) return 0;
            const aName =
              a.Artists.firstName && a.Artists.lastName
                ? `${a.Artists.firstName} ${a.Artists.lastName}`
                : "";
            const bName =
              b.Artists.firstName && b.Artists.lastName
                ? `${b.Artists.firstName} ${b.Artists.lastName}`
                : "";
            return aName.localeCompare(bName);
          });
          break;
        case "title":
          filtered.sort((a, b) => {
            const aTitle = a.title || "";
            const bTitle = b.title || "";
            return aTitle.localeCompare(bTitle);
          });
          break;
        case "galleryName":
          filtered.sort((a, b) => {
            if (!a.Galleries || !b.Galleries) return 0;
            const aName = a.Galleries.name || a.Galleries.galleryName || "";
            const bName = a.Galleries.name || b.Galleries.galleryName || "";
            return aName.localeCompare(bName);
          });
          break;
        case "yearOfWork":
          filtered.sort((a, b) => (a.yearOfWork || 0) - (b.yearOfWork || 0));
          break;
        default:
          break;
      }
    }

    console.log("Final filtered count before update:", filtered.length);

    // Update state with filtered and sorted results
    setFilteredPaintings(filtered);
  };

  const handleSort = (field: string) => {
    setSortField(field);
  };

  const openModal = (painting: ExtendedPainting) => {
    setSelectedPainting(painting);
  };

  const closeModal = () => {
    setSelectedPainting(null);
  };

  if (error) return <div>Error: {error}</div>;

  // Create an array for skeleton cards during loading
  const skeletonCards = Array(12).fill(null);

  return (
    <div>
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Paintings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar for filters - 1/4 width */}
          <div className="w-full md:w-1/4">
            <PaintingFilter
              onFilter={handleFilterSubmit}
              artists={artists}
              galleries={galleries}
              genres={genres}
              disabled={loading} // Disable filters while loading
            />
          </div>

          {/* Right side for painting results - 3/4 width */}
          <div className="w-full md:w-3/4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Sort by:</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded ${
                    sortField === "artistName"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleSort("artistName")}
                >
                  Artist Name
                </button>
                <button
                  className={`px-3 py-1 rounded ${
                    sortField === "title"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleSort("title")}
                >
                  Painting Title
                </button>
                <button
                  className={`px-3 py-1 rounded ${
                    sortField === "galleryName"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleSort("galleryName")}
                >
                  Gallery Name
                </button>
                <button
                  className={`px-3 py-1 rounded ${
                    sortField === "yearOfWork"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleSort("yearOfWork")}
                >
                  Year
                </button>
              </div>
            </div>

            {/* Conditional rendering based on loading state */}
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
                  No paintings found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>

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
  );
};

export default PaintingView;
