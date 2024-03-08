import React from "react";

import "./FrostedCard.css";

const FrostedCard = (props: any) => {
  return (
    <div className={`card-frosted ${props.className || ""}`}>
      <p className="card-title">{props.title}</p>
      <hr className="card-hr" />
      {props.children}
    </div>
  );
};

export default FrostedCard;
