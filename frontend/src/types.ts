export interface CreatePostRequest {
  type: string;
  shortcode: string;
  url: string;
  productType: string;
  caption: string | '-';
  slideCount: number | 0;
  owner: {
    username: string;
    fullName: string | null
  };
};

export interface Post {
  id: string;
  type: string;
  shortcode: string;
  url: string;
  productType: string;
  caption: string;
  slideCount: number;
  ownerId: string;
  categoryId: string;
}