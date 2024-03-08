import React from "react";

import "./CircularProgress.css";

const CircularProgress = (props: any = { percent: 100 }) => {
  return (
    <div className={"xsmall c100 red p" + props.percent}>
      <span>{props.percent}</span>
      <div className="slice">
        <div className="bar"></div>
        <div className="fill"></div>
      </div>
    </div>
  );
};

export default CircularProgress;
