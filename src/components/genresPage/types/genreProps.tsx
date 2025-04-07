export interface Genre {
  Eras: {
    eraId: number;
    eraName: string;
    eraYears: string;
  };
  genreId: number;
  genreName: string;
  description: string;
  wikiLink: string;
}

export interface GenreFilterProps {
  onSubmit: (filterGenre: number) => void;
  genres: Genre[];
  disabled?: boolean;
}
