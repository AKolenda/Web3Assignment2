import { useEffect, useState } from "react";
import { Gallery } from "./types/galleryTypes";
import { Painting } from "./types/paintingTypes";
import { useFavorites } from "../../context/FavoritesContext";
import GalleryList from "./gallerylist/GalleryList";
import GalleryInfo from "./galleryinfo/GalleryInfo";
import GalleryPaintings from "./gallery/GalleryPaintings";
import PaintingModal from "./gallery/PaintingModal";

const GalleryView = () => {
  const [galleryList, setGalleryList] = useState<Gallery[]>([]);
  const [clickedGallery, setClickedGallery] = useState<Gallery | null>(null);
  const [galleryPaintings, setGalleryPaintings] = useState<Painting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(
    null
  );
  const [isLoadingGalleries, setIsLoadingGalleries] = useState(true);

  // Use the favorites context instead of local state
  const {
    isGalleryFavorite,
    isPaintingFavorite,
    toggleGalleryFavorite,
    togglePaintingFavorite,
  } = useFavorites();

  // Fetch galleries
  useEffect(() => {
    async function fetchGalleries() {
      setIsLoadingGalleries(true);
      try {
        const resp = await fetch("/api/galleries");
        const data = await resp.json();
        data.sort((a: Gallery, b: Gallery) =>
          a.galleryName.localeCompare(b.galleryName)
        );
        setGalleryList(data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoadingGalleries(false);
      }
    }

    fetchGalleries();
  }, []);

  // Fetch paintings when a gallery is clicked
  useEffect(() => {
    if (clickedGallery) {
      setIsLoading(true);
      async function fetchPaintings() {
        try {
          const resp = await fetch(
            `/api/paintings/galleries/${clickedGallery!.galleryId}`
          );
          const data = await resp.json();
          setGalleryPaintings(Array.isArray(data) ? data : [data]);
        } catch (e) {
          console.log(e);
          setGalleryPaintings([]);
        } finally {
          setIsLoading(false);
        }
      }

      fetchPaintings();
    }
  }, [clickedGallery]);

  const handleClickingGallery = (gallery: Gallery) => {
    setClickedGallery(gallery);
  };

  const handleSelectPainting = (painting: Painting) => {
    setSelectedPainting(painting);
  };

  return (
    <div className="@container mx-auto p-4">
      <div className="flex flex-col @md:flex-row @md:flex-wrap">
        {/* Gallery List section */}
        <div className="w-full @md:w-1/2 p-2">
          <div className="bg-gray-100 p-4 rounded @md:h-[700px] @lg:h-[450px] overflow-y-auto">
            {isLoadingGalleries ? (
              <div className="flex flex-col items-center justify-center h-full">
                <img
                  src="https://i.gifer.com/ZKZg.gif"
                  alt="Loading"
                  className="w-16 h-16 mb-4"
                />
                <p className="text-gray-600">Loading galleries...</p>
              </div>
            ) : (
              <GalleryList
                galleryList={galleryList}
                setClickedGallery={handleClickingGallery}
              />
            )}
          </div>
        </div>

        {/* Gallery Info section */}
        <div className="w-full @md:w-1/2 p-2">
          <div className="bg-gray-100 p-4 rounded @md:h-auto @lg:h-[450px]">
            {clickedGallery && galleryList.length > 0 && (
              <GalleryInfo
                gallery={clickedGallery}
                isFavorite={isGalleryFavorite(clickedGallery.galleryId)}
                onToggleFavorite={toggleGalleryFavorite}
              />
            )}
            {(!clickedGallery || galleryList.length === 0) && (
              <p>Select a gallery to view details</p>
            )}
          </div>
        </div>

        {/* Gallery Paintings section */}
        <div className="w-full p-2">
          <div className="bg-gray-100 p-4 rounded">
            <GalleryPaintings
              paintings={galleryPaintings}
              isLoading={isLoading}
              galleryName={clickedGallery ? clickedGallery.galleryName : ""}
              onSelectPainting={handleSelectPainting}
            />
          </div>
        </div>
      </div>

      {/* Selected Painting Modal */}
      {selectedPainting && (
        <PaintingModal
          painting={selectedPainting}
          isOpen={!!selectedPainting}
          onClose={() => setSelectedPainting(null)}
          onAddToFavorites={togglePaintingFavorite}
          isFavorite={isPaintingFavorite(selectedPainting.paintingId)}
        />
      )}
    </div>
  );
};

export default GalleryView;
