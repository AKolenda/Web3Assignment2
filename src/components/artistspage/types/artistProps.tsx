export interface Artist{
    artistId: number,
    firstName: string,
    lastName: string,
    nationality: string,
    gender: string,
    yearOfBirth: number,
    yearOfDeath: number | null,
    details: string,
    artistLink: string,
}

export interface ArtistFilterProps {
  onSubmit: (
    filterArtist: number,
  ) => void;

  artists: Artist[];
  
  disabled?: boolean; // Add optional disabled prop
  }

