import React from "react";

import "./TicketStatus.css";

// enum status {
//   onsale = "onsale",
//   offsale = "offsale",
//   canceled = "canceled",
//   postponed = "postponed",
//   rescheduled = "rescheduled",
// }

const ticketStatusToMsg: { [key: string]: string } = {
  onsale: "On Sale",
  offsale: "Off Sale",
  canceled: "Cancelled",
  postponed: "Postponed",
  rescheduled: "Rescheduled",
};

const TicketStatus = (props: any) => {
  return (
    <div className={`ticket_status ticket_status--${props.status}`}>
      {ticketStatusToMsg[props.status as string]}
    </div>
  );
};

export default TicketStatus;
