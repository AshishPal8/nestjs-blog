import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts($pagination: PaginationInput) {
    posts(pagination: $pagination) {
      data {
        id
        title
        slug
        description
        likesCount
        commentsCount
        isLiked
        isBookmarked
        isActive
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

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    postBySlug(slug: $slug) {
      id
      title
      slug
      description
      metaDescription
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

export const GET_POST_BY_ID = gql`
  query GetPostById($id: Int!) {
    post(id: $id) {
      id
      title
      description
      isActive
      tags {
        id
        name
      }
      categories {
        id
        name
      }
      images {
        id
        url
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id) {
      success
      message
    }
  }
`;
