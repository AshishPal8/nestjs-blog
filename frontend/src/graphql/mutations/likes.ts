import { gql } from "@apollo/client";

export const TOGGLE_LIKE = gql`
  mutation ToggleLike($input: ToggleLikeInput!) {
    toggleLike(input: $input) {
      postId
      likesCount
      isLiked
    }
  }
`;
