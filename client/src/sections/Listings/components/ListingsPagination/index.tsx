import React from "react";
import { Pagination } from "antd";

interface Props {
  total: number;
  page: number;
  limit: number;
  setPage: (newPage: number) => void;
}

export const ListingsPagination = ({ total, page, limit, setPage }: Props) => {
  return (
    <Pagination
      current={page}
      total={total}
      defaultPageSize={limit}
      hideOnSinglePage
      showLessItems
      onChange={setPage}
      className="listings-pagination"
    />
  );
};
