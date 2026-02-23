import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories($paginationInput: PaginationInput!) {
    categories(paginationInput: $paginationInput) {
      data {
        id
        name
        slug
        description
        isActive
        createdAt
        updatedAt
      }
      meta {
        total
        page
        limit
        totalPages
        hasNext
        hasPrev
      }
    }
  }
`;

export const GET_CATEGORY_BY_ID = gql`
  query GetCategoryById($id: Int!) {
    category(id: $id) {
      id
      name
      slug
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACTIVE_CATEGORIES = gql`
  query GetActiveCategories {
    activeCategories {
      id
      name
      slug
    }
  }
`;
