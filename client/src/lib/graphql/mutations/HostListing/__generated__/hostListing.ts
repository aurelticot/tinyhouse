/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HostListingInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: hostListing
// ====================================================

export interface hostListing_hostListing {
  __typename: "Listing";
  id: string;
}

export interface hostListing {
  hostListing: hostListing_hostListing;
}

export interface hostListingVariables {
  input: HostListingInput;
}
