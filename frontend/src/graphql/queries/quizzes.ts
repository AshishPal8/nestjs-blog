import { gql } from "@apollo/client";

export const GET_ADMIN_QUIZZES = gql`
  query AdminQuizzes($pagination: PaginationInput) {
    adminQuizzes(pagination: $pagination) {
      data {
        id
        title
        slug
        status
        isActive
        pointsReward
        timeLimitSeconds
        questionCount
        createdAt
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

export const GET_ADMIN_QUIZ_DETAIL = gql`
  query AdminQuizDetail($id: Int!) {
    adminQuizDetail(id: $id) {
      quiz {
        id
        title
        slug
        description
        categoryId
        imageId
        imageUrl
        sourceText
        status
        isActive
        pointsReward
        timeLimitSeconds
        questionCount
      }
      questions {
        id
        question
        options
        correctOptionIndex
        explanation
        orderIndex
      }
    }
  }
`;

export const GET_QUIZ_PLAY = gql`
  query QuizPlay($slug: String!) {
    quiz(slug: $slug) {
      quiz {
        id
        title
        description
        imageUrl
        pointsReward
        timeLimitSeconds
        questionCount
      }
      questions {
        id
        question
        options
        orderIndex
      }
      alreadyCompleted
    }
  }
`;

export const GET_QUIZZES = gql`
  query GetQuizzes {
    quizzes {
      id
      title
      slug
      description
      imageUrl
      questionCount
      pointsReward
      timeLimitSeconds
    }
  }
`;

export const GET_QUIZZES_BY_CATEGORY = gql`
  query QuizzesByCategory($categorySlug: String!) {
    quizzesByCategory(categorySlug: $categorySlug) {
      id
      title
      slug
      imageUrl
      questionCount
      pointsReward
    }
  }
`;
