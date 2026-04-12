// src/graphql/queries/bookmarks.ts
import { gql } from "@apollo/client";

export const GET_MY_BOOKMARKS = gql`
  query MyBookmarks($pagination: PaginationInput) {
    myBookmarks(pagination: $pagination) {
      data {
        id
        title
        slug
        description
        likesCount
        commentsCount
        isLiked
        isBookmarked
        readingTime
        createdAt
        updatedAt
        categories {
          id
          name
          slug
        }
        author {
          id
          name
          avatar
          email
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
