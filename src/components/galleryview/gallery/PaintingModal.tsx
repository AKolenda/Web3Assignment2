import { useEffect, useState, useRef } from "react";
import { Painting } from "../types/paintingTypes";

interface PaintingModalProps {
  painting: Painting;
  isOpen: boolean;
  onClose: () => void;
  onAddToFavorites?: (painting: Painting) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (painting: Painting) => void;
}

interface Color {
  color: {
    red: number;
    green: number;
    blue: number;
  };
  web: string;
  name: string;
}

interface JsonAnnotations {
  dominantColors: Color[];
}

const PaintingModal: React.FC<PaintingModalProps> = ({
  painting,
  isOpen,
  onClose,
  onAddToFavorites,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dominantColors, setDominantColors] = useState<Color[]>([]);
  const [primaryColor, setPrimaryColor] = useState("#609cd4");
  const [secondaryColor, setSecondaryColor] = useState("#78ac44");
  const [aspectRatio, setAspectRatio] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    try {
      if (painting.jsonAnnotations) {
        const annotations = JSON.parse(
          painting.jsonAnnotations
        ) as JsonAnnotations;
        if (
          annotations.dominantColors &&
          annotations.dominantColors.length > 0
        ) {
          setDominantColors(annotations.dominantColors);

          // Use first two dominant colors for styling
          if (annotations.dominantColors[0]?.web) {
            setPrimaryColor(annotations.dominantColors[0].web);
          }

          if (annotations.dominantColors[1]?.web) {
            setSecondaryColor(annotations.dominantColors[1].web);
          }
        }
      }
    } catch (error) {
      console.error("Error parsing JSON annotations:", error);
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, painting]);

  const handleImageLoad = () => {
    setImageLoaded(true);

    if (imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      const ratio = naturalWidth / naturalHeight;
      setAspectRatio(ratio);
    }
  };

  if (!isOpen) return null;

  const artistName =
    `${painting.Artists.firstName} ${painting.Artists.lastName}`.trim();

  const getImageUrl = () => {
    const formattedFileName = String(painting.imageFileName).padStart(6, "0");
    return `/art-images/paintings/full/${formattedFileName}.jpg`;
  };

  const isLandscape = aspectRatio > 1.2;
  const isPortrait = aspectRatio < 0.8;

  const modalLayoutClass = isLandscape
    ? "md:grid-cols-[450px_2fr]"
    : isPortrait
    ? "md:grid-cols-[400px_1fr]"
    : "md:grid-cols-[450px_1fr]";

  const imageContainerClass = "w-full max-w-[450px]";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[1000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div
          className="flex justify-between items-start p-4 border-b sticky top-0 z-10 text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <h2 className="text-xl font-semibold">{painting.title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
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

        <div className="p-6">
          <div className={`grid ${modalLayoutClass} gap-6`}>
            <div
              className={`flex flex-col justify-center items-center ${imageContainerClass}`}
            >
              {!imageLoaded && (
                <div className="flex items-center justify-center h-64 w-full">
                  <img
                    src="https://i.gifer.com/ZKZg.gif"
                    alt="Loading"
                    className="w-12 h-12"
                  />
                </div>
              )}

              <div
                className="rounded-md overflow-hidden w-full"
                style={{ borderColor: secondaryColor, borderWidth: "3px" }}
              >
                <img
                  ref={imgRef}
                  src={getImageUrl()}
                  alt={painting.title}
                  className={`object-contain ${
                    imageLoaded ? "block" : "hidden"
                  } w-full h-auto ${
                    isLandscape
                      ? "max-h-[350px]"
                      : isPortrait
                      ? "max-h-[500px]"
                      : "max-h-[400px]"
                  }`}
                  onLoad={handleImageLoad}
                  onError={(e) => {
                    setImageLoaded(true);
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/400x400?text=Image+Not+Available";
                  }}
                />
              </div>

              <button
                onClick={() => onToggleFavorite?.(painting)}
                className="mt-4 px-4 py-2 rounded-full transition flex items-center gap-1 w-full justify-center"
                style={{
                  backgroundColor: isFavorite ? "#ffc404" : "#f5f5f5",
                  color: isFavorite ? "#000" : "#333",
                  borderColor: secondaryColor,
                  borderWidth: "1px",
                }}
              >
                <span className="text-lg">{isFavorite ? "★" : "☆"}</span>
                <span>{isFavorite ? "In Favorites" : "Add to Favorites"}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: primaryColor }}
                >
                  {painting.title}
                </h3>
                <p className="text-lg" style={{ color: secondaryColor }}>
                  {artistName}, {painting.yearOfWork}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="text-gray-500 font-medium">Medium</div>
                <div>{painting.medium}</div>

                <div className="text-gray-500 font-medium">Dimensions</div>
                <div>
                  {painting.width} × {painting.height} cm
                </div>

                <div className="text-gray-500 font-medium">Gallery</div>
                <div>{painting.Galleries?.galleryId}</div>

                <div className="text-gray-500 font-medium">Copyright</div>
                <div>{painting.copyrightText}</div>
              </div>

              <div className="pt-2">
                <h4
                  className="font-medium mb-2"
                  style={{ color: primaryColor }}
                >
                  Description
                </h4>
                <p className="text-gray-600">{painting.description}</p>
              </div>

              <div className="flex space-x-4 pt-4">
                {painting.museumLink && (
                  <a
                    href={painting.museumLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center"
                    style={{ color: primaryColor }}
                  >
                    <span>Museum Page</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}

                {painting.wikiLink && (
                  <a
                    href={painting.wikiLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center"
                    style={{ color: secondaryColor }}
                  >
                    <span>Wikipedia</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingModal;
