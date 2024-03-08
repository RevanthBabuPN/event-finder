import React, { useState } from "react";
import LinesEllipsis from "react-lines-ellipsis";

import DownArrow from "../../../images/angle-down.svg";
import UpArrow from "../../../images/angle-up.svg";

import "./ShowMore.css";

const ShowMore = (props: any) => {
  const [truncated, setTruncated] = useState<boolean>(true);
  const [showButton, setShowButton] = useState<boolean>(true);

  return (
    <div>
      {truncated ? (
        <LinesEllipsis
          text={props.text}
          maxLine="2"
          ellipsis={""}
          basedOn="words"
          onReflow={({ clamped }) => {
            setShowButton(clamped);
            // setShowButton(true);
          }}
        />
      ) : (
        <>{props.text} </>
      )}
      {showButton && (
        <div onClick={() => setTruncated((state) => !state)}>
          <span style={{ color: "rgb(110 190 255)", cursor: "pointer" }}>
            <span style={{ borderBottom: "1px solid" }}>
              {truncated ? "Show More" : "Show less"}
            </span>
            <span className="px-1">
              <img src={truncated ? DownArrow : UpArrow} width="10px" alt="" />
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

// const ShowMore1 = (props: any) => {
//   return (
//     <ShowMoreText
//       lines={2}
//       more={
//         <div style={{ color: "rgb(110 190 255)" }}>
//           <span style={{ borderBottom: "1px solid" }}>Show More</span>
//           <span className="px-1">
//             <img src={DownArrow} width="10px" alt="" />
//           </span>
//         </div>
//       }
//       less={
//         <div style={{ color: "rgb(110 190 255)" }}>
//           <span style={{ borderBottom: "1px solid" }}>Show less</span>
//           <span className="px-1">
//             <img src={UpArrow} width="10px" alt="" />
//           </span>
//         </div>
//       }
//       className="content"
//       truncatedEndingComponent={""}
//     >
//       {props.children}
//     </ShowMoreText>
//   );
// };

export default ShowMore;
