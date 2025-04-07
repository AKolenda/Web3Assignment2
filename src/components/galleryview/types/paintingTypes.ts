export interface Artist {
  gender: string;
  details: string;
  artistId: number;
  lastName: string;
  firstName: string;
  artistLink: string;
  nationality: string;
  yearOfBirth: number;
  yearOfDeath: number;
}

export interface Painting {
  paintingId: number;
  artistId: number;
  galleryId: number;
  imageFileName: number;
  title: string;
  shapeId: number;
  museumLink: string;
  accessionNumber: string;
  copyrightText: string;
  description: string;
  excerpt: string;
  yearOfWork: number;
  width: number;
  height: number;
  medium: string;
  cost: number;
  MSRP: number;
  googleLink: string;
  googleDescription: string;
  wikiLink: string;
  jsonAnnotations: string;
  Galleries: {
    galleryId: number;
  };
  Artists: Artist;
}
