import { Gallery } from "../types/galleryTypes";

interface GalleryListProps {
  galleryList: Gallery[];
  setClickedGallery: (gallery: Gallery) => void;
}

const GalleryList: React.FC<GalleryListProps> = ({
  galleryList,
  setClickedGallery,
}) => {
  return (
    <div className="space-y-2">
      {galleryList.map((gallery, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm hover:bg-gray-50"
        >
          <h3 className="font-medium text-gray-700">{gallery.galleryName}</h3>
          <button
            onClick={() => setClickedGallery(gallery)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
};

export default GalleryList;
