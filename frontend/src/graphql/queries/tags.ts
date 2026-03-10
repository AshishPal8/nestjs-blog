import { gql } from "@apollo/client";

export const SEARCH_TAGS = gql`
  query SearchTags($input: SearchTagsInput!) {
    searchTags(input: $input) {
      id
      name
      slug
    }
  }
`;
