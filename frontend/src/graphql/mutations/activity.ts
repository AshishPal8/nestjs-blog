import { gql } from "@apollo/client";

export const RECORD_DAILY_LOGIN = gql`
  mutation RecordDailyLogin {
    recordDailyLogin {
      totalPoints
      currentStreak
      longestStreak
      lastActiveDate
    }
  }
`;
