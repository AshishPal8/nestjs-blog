import { gql } from "@apollo/client";

export const TOGGLE_BOOKMARK = gql`
  mutation ToggleBookmark($postId: Int!) {
    toggleBookmark(postId: $postId) {
      isBookmarked
      message
    }
  }
`;
