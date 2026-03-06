import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
  query GetComments($postId: Int!, $pagination: CommentPaginationInput) {
    comments(postId: $postId, pagination: $pagination) {
      data {
        id
        content
        postId
        parentId
        createdAt
        author {
          id
          name
          avatar
        }
        replies {
          id
          content
          createdAt
          author {
            id
            name
            avatar
          }
        }
      }
      total
      hasMore
    }
  }
`;
