export interface Character {
  id: number;
  name: string;
  age: number | null;
  gender: string;
  occupation: string;
  portrait_path: string;
  status: string;
  phrases?: string[];
  _id?: string;
}

export interface Episode {
  id: number;
  name: string;
  season: number;
  episode: number;
  rating: string;
  originalAirDate: string;
  thumbnailUrl: string;
  _id?: string;
}

export interface Location {
  id: number;
  title: string;
  description: string;
  image: string;
  _id?: string;
}

export interface ApiResponse<T> {
  docs: T[];
  totalDocs?: number;
  limit?: number;
  totalPages?: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: number | null;
  nextPage?: number | null;
}
