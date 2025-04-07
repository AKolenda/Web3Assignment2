import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Gallery } from "../components/galleryview/types/galleryTypes";
import { Painting } from "../components/galleryview/types/paintingTypes";
import { Artist } from "../components/artistspage/types/artistProps";

interface FavoritesContextType {
  favoriteGalleries: Gallery[];
  favoritePaintings: Painting[];
  favoriteArtists: Artist[];
  toggleGalleryFavorite: (gallery: Gallery) => void;
  togglePaintingFavorite: (painting: Painting) => void;
  toggleArtistFavorite: (artist: Artist) => void;
  isGalleryFavorite: (galleryId: number) => boolean;
  isPaintingFavorite: (paintingId: number) => boolean;
  isArtistFavorite: (artistId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favoriteGalleries, setFavoriteGalleries] = useState<Gallery[]>(() => {
    const savedFavorites = localStorage.getItem("favoriteGalleries");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [favoritePaintings, setFavoritePaintings] = useState<Painting[]>(() => {
    const savedFavorites = localStorage.getItem("favoritePaintings");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [favoriteArtists, setFavoriteArtists] = useState<Artist[]>(() => {
    const savedFavorites = localStorage.getItem("favoriteArtists");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "favoriteGalleries",
      JSON.stringify(favoriteGalleries)
    );
  }, [favoriteGalleries]);

  useEffect(() => {
    localStorage.setItem(
      "favoritePaintings",
      JSON.stringify(favoritePaintings)
    );
  }, [favoritePaintings]);

  useEffect(() => {
    localStorage.setItem("favoriteArtists", JSON.stringify(favoriteArtists));
  }, [favoriteArtists]);

  const toggleGalleryFavorite = (gallery: Gallery) => {
    setFavoriteGalleries((prev) => {
      if (prev.some((g) => g.galleryId === gallery.galleryId)) {
        return prev.filter((g) => g.galleryId !== gallery.galleryId);
      } else {
        return [...prev, gallery];
      }
    });
  };

  const togglePaintingFavorite = (painting: Painting) => {
    if (!painting || !painting.paintingId) return;
    setFavoritePaintings((prev) => {
      if (prev.some((p) => p.paintingId === painting.paintingId)) {
        return prev.filter((p) => p.paintingId !== painting.paintingId);
      } else {
        return [...prev, painting];
      }
    });
  };

  const toggleArtistFavorite = (artist: Artist) => {
    setFavoriteArtists((prev) => {
      if (prev.some((a) => a.artistId === artist.artistId)) {
        return prev.filter((a) => a.artistId !== artist.artistId);
      } else {
        return [...prev, artist];
      }
    });
  };

  const isGalleryFavorite = (galleryId: number) => {
    return favoriteGalleries.some((g) => g.galleryId === galleryId);
  };

  const isPaintingFavorite = (paintingId: number) => {
    return favoritePaintings.some((p) => p.paintingId === paintingId);
  };

  const isArtistFavorite = (artistId: number) => {
    return favoriteArtists.some((a) => a.artistId === artistId);
  };

  const value = {
    favoriteGalleries,
    favoritePaintings,
    favoriteArtists,
    toggleGalleryFavorite,
    togglePaintingFavorite,
    toggleArtistFavorite,
    isGalleryFavorite,
    isPaintingFavorite,
    isArtistFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
