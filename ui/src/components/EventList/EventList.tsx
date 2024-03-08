import React from "react";
import { useDispatch } from "react-redux";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

import NoResults from "../utils/NoResult/NoResults";

import { actions } from "../../store/index";

import "./EventList.css";

type key = "date" | "event" | "genre" | "venue";

const EventList = (props: any) => {
  const dispatch = useDispatch();
  let events = [...props.events];
  events.sort((e1: any, e2: any) => {
    let d1 = e1.date.localDate + (e1.date.localTime ?? "");
    let d2 = e2.date.localDate + (e2.date.localTime ?? "");
    return d1 < d2 ? -1 : d1 > d2 ? 1 : 0;
  });

  const sortTable = (key: key) => {
    console.log("SORT: ", key);
    dispatch(actions.sortEvents({ key }));
  };

  return (
    <Row className="justify-content-center g-0">
      <Col xm={12} md={9} className="px-0 mx-3">
        {events?.length > 0 && (
          <Table
            className="text-center"
            responsive
            striped
            // hover
            variant="dark"
            style={{ borderRadius: "15px 15px 0px 0px", overflow: "hidden" }}
          >
            <thead>
              <tr>
                <th
                  onClick={() => {
                    sortTable("date");
                  }}
                >
                  Date/Time
                </th>
                <th>Icon</th>
                <th
                  onClick={() => {
                    sortTable("event");
                  }}
                >
                  Event
                </th>
                <th
                  onClick={() => {
                    sortTable("genre");
                  }}
                >
                  Genre
                </th>
                <th
                  onClick={() => {
                    sortTable("venue");
                  }}
                >
                  Venue
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event: any) => {
                // event = event.table_info;
                return (
                  <tr
                    key={event.id}
                    onClick={() => {
                      props.onEventSelect(event.id);
                    }}
                    role="button"
                  >
                    <td style={{ fontWeight: "bold" }}>
                      {/* {event.date.localDate + " " + event.date.localTime} */}
                      {
                        <>
                          {event.date.localDate} <br /> {event.date.localTime}
                        </>
                      }
                    </td>
                    <td>
                      <img className="icon" src={event.icon} alt="" />
                    </td>
                    <td>{event.event}</td>
                    <td>
                      {event.genre?.toLowerCase() !== "undefined"
                        ? event.genre
                        : ""}
                    </td>
                    <td>{event.venue}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        {(!events || events.length === 0) && (
          <NoResults message="No results available" />
        )}
      </Col>
    </Row>
  );
};

export default EventList;
