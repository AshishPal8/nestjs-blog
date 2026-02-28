export interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  metaDescription: string;
  createdAt: string;
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  images: { id: number; url: string }[];
}

export interface PostsData {
  posts: {
    data: Post[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}
