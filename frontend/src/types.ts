export interface CreatePostRequest {
  type: string;
  shortcode: string;
  url: string;
  productType: string;
  caption: string;
  slideCount: number;
  owner: {
    username: string;
    fullName: string | null;
  };
}

export interface PostLensMetadata {
  post?: CreatePostRequest;
}

export interface Post {
  id: string;
  type: string;
  shortcode: string;
  url: string;
  productType: string;
  caption: string | null;
  slideCount: number | null;
  ownerId: string;
  categoryId: string | null;
}

export interface PostsResponse {
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCategoryRequest {
  name: string;
}

export interface Category {
  id: string;
  name: string;
}
