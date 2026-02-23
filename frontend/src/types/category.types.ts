export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ActiveCategoriesData {
  activeCategories: Category[];
}
