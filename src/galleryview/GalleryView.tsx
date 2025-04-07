import GalleryViewComponent from "../components/galleryview/GalleryView";
import Navigation from "../components/Navigation";

// simple component to point users to the right page
const GalleryView = () => {
  return (
    <>
      <Navigation />
      <GalleryViewComponent />
    </>
  );
};

export default GalleryView;
