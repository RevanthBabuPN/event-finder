import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const NoResults = (props: any) => {
  return (
    <Row className={`g-0 ${props.className}`}>
      <Col
        xs={10}
        sm={8}
        style={{
          borderRadius: "24px",
          backgroundColor: "white",
          color: "red",
          fontWeight: 500,
        }}
        className="text-center mx-auto px-3"
      >
        {props.message}
      </Col>
    </Row>
  );
};

export default NoResults;
