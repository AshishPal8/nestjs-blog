import { gql } from "@apollo/client";

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      slug
      description
      metaDescription
      images {
        id
        url
      }
      tags {
        id
        name
        slug
      }
      categories {
        id
        name
        slug
      }
      createdAt
    }
  }
`;
