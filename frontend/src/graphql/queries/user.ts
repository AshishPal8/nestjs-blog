import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      avatar
      bio
      location
      website
      isVerified
    }
  }
`;
