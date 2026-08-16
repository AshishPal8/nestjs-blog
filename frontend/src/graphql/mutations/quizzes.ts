import { gql } from "@apollo/client";

export const CREATE_QUIZ = gql`
  mutation CreateQuiz($input: CreateQuizInput!) {
    createQuiz(input: $input) {
      id
      title
      slug
    }
  }
`;

export const UPDATE_QUIZ = gql`
  mutation UpdateQuiz($id: Int!, $input: UpdateQuizInput!) {
    updateQuiz(id: $id, input: $input) {
      id
      title
      slug
      isActive
    }
  }
`;

export const DELETE_QUIZ = gql`
  mutation DeleteQuiz($id: Int!) {
    deleteQuiz(id: $id)
  }
`;

export const PUBLISH_QUIZ = gql`
  mutation PublishQuiz($id: Int!) {
    publishQuiz(id: $id) {
      id
      status
    }
  }
`;

export const ADD_QUIZ_QUESTION = gql`
  mutation AddQuizQuestion($quizId: Int!, $input: QuizQuestionInput!) {
    addQuizQuestion(quizId: $quizId, input: $input) {
      id
      question
      options
      correctOptionIndex
      explanation
      orderIndex
    }
  }
`;

export const UPDATE_QUIZ_QUESTION = gql`
  mutation UpdateQuizQuestion($questionId: Int!, $input: QuizQuestionInput!) {
    updateQuizQuestion(questionId: $questionId, input: $input) {
      id
      question
      options
      correctOptionIndex
      explanation
      orderIndex
    }
  }
`;

export const DELETE_QUIZ_QUESTION = gql`
  mutation DeleteQuizQuestion($questionId: Int!) {
    deleteQuizQuestion(questionId: $questionId)
  }
`;

export const START_QUIZ_ATTEMPT = gql`
  mutation StartQuizAttempt($quizId: Int!) {
    startQuizAttempt(quizId: $quizId) {
      sessionId
      startedAt
      expiresAt
    }
  }
`;

export const SUBMIT_QUIZ_ATTEMPT = gql`
  mutation SubmitQuizAttempt($input: SubmitQuizAttemptInput!) {
    submitQuizAttempt(input: $input) {
      score
      totalQuestions
      pointsEarned
      firstCompletion
      timedOut
      answers {
        questionId
        selectedIndex
        correctOptionIndex
        correct
        explanation
      }
    }
  }
`;
