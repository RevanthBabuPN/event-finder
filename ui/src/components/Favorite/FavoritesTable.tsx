import React from "react";
import { useSelector } from "react-redux";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

import NoResults from "../utils/NoResult/NoResults";

import { State } from "../../store/index";

interface _State {
  app: State;
}

const FavoritesTable = (props: any) => {
  let favorites = useSelector((state: _State) => state.app.favorites);

  const deleteHandler = (eventId: number) => {
    alert("Removed from Favorites!");
    props.onDelete(eventId);
  };

  return (
    <>
      <Row className="justify-content-center g-0">
        <Col xm={12} md={8} className="px-0 mx-3">
          {favorites.length > 0 && (
            <>
              <h6 className="text-center my-3" style={{ color: "#90f3da" }}>
                List of your favorite events
              </h6>
              <Table
                className="text-center"
                responsive
                hover
                variant="light"
                style={{
                  borderRadius: "15px 15px 15px 15px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Event</th>
                    <th>Category</th>
                    <th>Venue</th>
                    <th>Favorite</th>
                  </tr>
                </thead>
                <tbody>
                  {favorites.map((favorite: any, index: number) => {
                    return (
                      <tr key={favorite.id}>
                        <td style={{ fontWeight: "bold" }}>{index + 1}</td>
                        <td>{favorite.date}</td>
                        <td>{favorite.event}</td>
                        <td>{favorite.category.join(" | ")}</td>
                        <td>{favorite.venue}</td>
                        <td
                          role="button"
                          onClick={() => {
                            deleteHandler(favorite.id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                            <path
                              fillRule="evenodd"
                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                            />
                          </svg>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </>
          )}
          {favorites.length === 0 && (
            <NoResults message="No favorite events to show" />
          )}
        </Col>
      </Row>
    </>
  );
};

export default FavoritesTable;
