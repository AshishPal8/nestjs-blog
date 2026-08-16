import { gql } from "@apollo/client";

export const CREATE_FLASHCARD_DECK = gql`
  mutation CreateFlashcardDeck($input: CreateFlashcardDeckInput!) {
    createFlashcardDeck(input: $input) {
      id
      title
      slug
    }
  }
`;

export const UPDATE_FLASHCARD_DECK = gql`
  mutation UpdateFlashcardDeck($id: Int!, $input: UpdateFlashcardDeckInput!) {
    updateFlashcardDeck(id: $id, input: $input) {
      id
      title
      slug
      isActive
    }
  }
`;

export const DELETE_FLASHCARD_DECK = gql`
  mutation DeleteFlashcardDeck($id: Int!) {
    deleteFlashcardDeck(id: $id)
  }
`;

export const PUBLISH_FLASHCARD_DECK = gql`
  mutation PublishFlashcardDeck($id: Int!) {
    publishFlashcardDeck(id: $id) {
      id
      status
    }
  }
`;

export const ADD_FLASHCARD_CARD = gql`
  mutation AddFlashcardCard($deckId: Int!, $input: FlashcardCardInput!) {
    addFlashcardCard(deckId: $deckId, input: $input) {
      id
      front
      back
      orderIndex
    }
  }
`;

export const UPDATE_FLASHCARD_CARD = gql`
  mutation UpdateFlashcardCard($cardId: Int!, $input: FlashcardCardInput!) {
    updateFlashcardCard(cardId: $cardId, input: $input) {
      id
      front
      back
      orderIndex
    }
  }
`;

export const DELETE_FLASHCARD_CARD = gql`
  mutation DeleteFlashcardCard($cardId: Int!) {
    deleteFlashcardCard(cardId: $cardId)
  }
`;

export const SUBMIT_FLASHCARD_ATTEMPT = gql`
  mutation SubmitFlashcardAttempt($input: SubmitFlashcardAttemptInput!) {
    submitFlashcardAttempt(input: $input) {
      knownCount
      totalCards
      pointsEarned
      firstCompletion
    }
  }
`;
