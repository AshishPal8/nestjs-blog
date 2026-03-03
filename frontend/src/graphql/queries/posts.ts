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

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    postBySlug(slug: $slug) {
      id
      title
      slug
      description
      metaDescription
      createdAt
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
  }
`;
