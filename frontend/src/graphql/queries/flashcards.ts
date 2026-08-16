import { gql } from "@apollo/client";

export const GET_ADMIN_FLASHCARD_DECKS = gql`
  query AdminFlashcardDecks($pagination: PaginationInput) {
    adminFlashcardDecks(pagination: $pagination) {
      data {
        id
        title
        slug
        status
        isActive
        pointsReward
        cardCount
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

export const GET_ADMIN_FLASHCARD_DECK_DETAIL = gql`
  query AdminFlashcardDeckDetail($id: Int!) {
    adminFlashcardDeckDetail(id: $id) {
      deck {
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
        cardCount
      }
      cards {
        id
        front
        back
        orderIndex
      }
    }
  }
`;

export const GET_FLASHCARD_DECK_PLAY = gql`
  query FlashcardDeckPlay($slug: String!) {
    flashcardDeck(slug: $slug) {
      deck {
        id
        title
        description
        imageUrl
        pointsReward
        cardCount
      }
      cards {
        id
        front
        back
      }
      alreadyCompleted
    }
  }
`;

export const GET_FLASHCARD_DECKS = gql`
  query GetFlashcardDecks {
    flashcardDecks {
      id
      title
      slug
      description
      imageUrl
      cardCount
      pointsReward
    }
  }
`;

export const GET_FLASHCARD_DECKS_BY_CATEGORY = gql`
  query FlashcardDecksByCategory($categorySlug: String!) {
    flashcardDecksByCategory(categorySlug: $categorySlug) {
      id
      title
      slug
      imageUrl
      cardCount
      pointsReward
    }
  }
`;
