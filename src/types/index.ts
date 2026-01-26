export interface Character {
  _id: string;
  name: string;
  normalized_name: string;
  avatar: string;
}

export interface Episode {
  _id: string;
  id: number;
  name: string;
  season: number;
  number_in_season: number;
  number_in_series: number;
  original_air_date: string;
  production_code: string;
  image_url: string;
  video_url: string;
}

export interface Location {
  _id: string;
  name: string;
  normalized_name: string;
  image: string;
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
