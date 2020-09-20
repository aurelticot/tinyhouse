import React from "react";
import moment, { Moment } from "moment";
import { DatePicker, Button, Card, Divider, Typography } from "antd";
import { formatListingPrice, displayErrorMessage } from "../../../../lib/utils";

const { Paragraph, Title } = Typography;

interface Props {
  price: number;
  checkInDate: Moment | null;
  setCheckInDate: (date: Moment | null) => void;
  checkOutDate: Moment | null;
  setCheckOutDate: (date: Moment | null) => void;
}

export const ListingCreateBooking = ({ price, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate }: Props) => {
  const disabledDate = (currentDate: Moment | null) => {
    if (!currentDate) {
      return false;
    }
    const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));

    // keep room for additional constraints

    return dateIsBeforeEndOfDay;
  };

  const verifyAndSetCheckoutDate = (selectedCheckOutDate: Moment | null) => {
    if (checkInDate && selectedCheckOutDate) {
      if (selectedCheckOutDate.isBefore(checkInDate, "days")) {
        return displayErrorMessage(`You can't book date of check out to be prior to check in!`);
      }
    }
    setCheckOutDate(selectedCheckOutDate);
  };

  const checkOutInputDisabled = !checkInDate;
  const buttonDisabled = !checkInDate || !checkOutDate;

  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Paragraph>
            <Title level={2} className="listing-booking__card-title">
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
          </Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check In</Paragraph>
            <DatePicker
              value={checkInDate}
              onChange={(dateValue) => setCheckInDate(dateValue)}
              onOpenChange={() => setCheckOutDate(null)}
              showToday={false}
              format={"YYYY/MM/DD"}
              disabledDate={disabledDate}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check Out</Paragraph>
            <DatePicker
              value={checkOutDate}
              onChange={(dateValue) => verifyAndSetCheckoutDate(dateValue)}
              showToday={false}
              format={"YYYY/MM/DD"}
              disabledDate={disabledDate}
              disabled={checkOutInputDisabled}
            />
          </div>
        </div>
        <Divider />
        <Button disabled={buttonDisabled} size="large" type="primary" className="listing-booking__card-cta">
          Request a book
        </Button>
      </Card>
    </div>
  );
};
