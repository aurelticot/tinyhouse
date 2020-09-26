import { gql } from "apollo-boost";

export const HOST_LISTING = gql`
  mutation hostListing($input: HostListingInput!) {
    hostListing(input: $input) {
      id
    }
  }
`;
