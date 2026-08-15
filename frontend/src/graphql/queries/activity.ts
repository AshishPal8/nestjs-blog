import { gql } from "@apollo/client";

export const GET_MY_STATS = gql`
  query MyStats {
    myStats {
      totalPoints
      currentStreak
      longestStreak
      lastActiveDate
    }
  }
`;

export const GET_USER_STATS = gql`
  query UserStats($userId: Int!) {
    userStats(userId: $userId) {
      totalPoints
      currentStreak
      longestStreak
      lastActiveDate
    }
  }
`;
