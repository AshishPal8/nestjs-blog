import { gql } from "@apollo/client";

export const UPDATE_POST = gql`
  mutation UpdatePost($id: Int!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      slug
      description
      updatedAt
    }
  }
`;

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
