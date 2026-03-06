import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
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
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      success
      postId
    }
  }
`;
