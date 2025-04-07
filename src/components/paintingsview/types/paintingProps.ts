import { Painting } from "../../galleryview/types/paintingTypes";

// Add this type to represent the structure from the API
export interface ExtendedPainting extends Painting {
  fileName?: string;
  Genres?: {
    genreId: number;
    name: string;
  };
  Galleries: {
    galleryId: number;
    name?: string; // Some responses may use name instead of galleryName
    galleryName?: string; // From the API example
    city?: string;
    galleryCity?: string;
  };
}

export interface PaintingFilterProps {
  onFilter: (
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
  ) => void;
  artists: { id: number; name: string }[];
  galleries: { galleryId: number; name: string }[];
  genres: { genreId: number; name: string }[];
  disabled?: boolean; // Add optional disabled prop
}

export interface PaintingModalProps {
  painting: ExtendedPainting; // Use the extended type
  onClose: () => void;
  
  isFavorite: boolean;
  onToggleFavorite: (painting: Painting) => void;
}
