import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts($pagination: PaginationInput) {
    posts(pagination: $pagination) {
      data {
        id
        title
        slug
        description
        createdAt
        categories {
          id
          name
          slug
        }
        tags {
          id
          name
          slug
        }
        images {
          id
          url
        }
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
