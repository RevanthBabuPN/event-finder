import React, { useState } from "react";
// import { useSelector } from "react-redux";
import SwipeableViews from "react-swipeable-views";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import NoResults from "../utils/NoResult/NoResults";
import CircularProgress from "../utils/CircularProgress/CircularProgress";
import ShowMore from "../utils/ShowMore/ShowMore";

import notfav from "../../images/heart-regular.svg";
import fav from "../../images/heart-solid.svg";

import fb from "../../images/facebook.png";
import twitter from "../../images/twitter.png";
import spotify from "../../images/spotify.png";

import leftArrow from "../../images/left.svg";

import "./Event.css";
import TicketStatus from "../utils/TicketStatus/TicketStatus";
import Map from "../GoogleMap/GoogleMap";

const Event = (props: any) => {
  let isFav = props.isFav;
  // const event = useSelector((state: any) => state.app.events[0]);
  let event = props.event;
  const [tabIndex, setTabIndex] = React.useState("0");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };

  const addFavHandler = (eventId: number) => {
    alert("Event Added to Favorites!");
    props.onAddFav(eventId);
  };

  const deleteFavHandler = (eventId: number) => {
    alert("Removed from Favorites!");
    props.onDeleteFav(eventId);
  };

  const FBPost = `https://www.facebook.com/sharer/sharer.php?u=${event.info.buy_ticket_at}`;
  const tweetParams = new URLSearchParams({
    text: `Check ${event.info.name}.`,
    url: event.info.buy_ticket_at,
  }).toString();
  const twitterPost = `https://twitter.com/share?${tweetParams}`;

  const event_info = (
    <div>
      <Row>
        <Col xs={12} sm={6}>
          {event.info.date.localDate && (
            <InfoItem
              field={"Date"}
              value={
                event.info.date.localDate + " " + event.info.date.localTime
              }
            />
          )}
          {event.info.artists.length > 0 && (
            <InfoItem field={"Artist/Team"} value={event.info.artists} />
          )}
          {event.info.venue && (
            <InfoItem field={"Venue"} value={event.info.venue} />
          )}
          {event.info.genres.length > 0 && (
            <InfoItem field={"Genres"} value={event.info.genres} />
          )}
          {event.info.price_range.min && (
            <InfoItem
              field={"Price Ranges"}
              value={
                event.info.price_range.min + "-" + event.info.price_range.max ??
                ""
              }
            />
          )}
          {event.info.ticket_status && (
            <InfoItem
              field={"Ticket Status"}
              value={<TicketStatus status={event.info.ticket_status} />}
            />
          )}
          {event.info.buy_ticket_at && (
            <InfoItem
              field={"Buy Ticket At"}
              value={"Ticketmaster"}
              link={event.info.buy_ticket_at}
            />
          )}
        </Col>
        <Col
          xs={12}
          sm={6}
          className="d-flex align-items-center justify-content-center"
        >
          {event.info.seat_map && (
            <img className="w-100" src={event.info.seat_map} alt="Seatmap" />
          )}
        </Col>
      </Row>
      <div className="d-flex justify-content-center py-3">
        <span className="mx-1">Share on:</span>
        <a href={twitterPost} target={"_blank"} rel="noreferrer">
          <img className="mx-1" src={twitter} alt="twitter" width={"28px"} />
        </a>
        <a href={FBPost} target={"_blank"} rel="noreferrer">
          <img className="mx-1" src={fb} alt="facebook" width={"26px"} />
        </a>
      </div>
    </div>
  );

  const Artist = (props: any) => {
    const artists = props.artists;
    return (
      <>
        {artists.length === 0 && (
          <NoResults
            className="py-5"
            message="No music related artist details to show"
          />
        )}

        {artists.length > 0 && (
          <Row className="">
            <Carousel
              controls={artists.length > 1}
              indicators={false}
              interval={null}
              variant="dark"
            >
              {artists.map((artist: any) => {
                return (
                  <Carousel.Item key={artist.name}>
                    <Container className="w-75 mx-auto">
                      <Row className="artist_stats py-3">
                        <Col xs={12} md={4}>
                          <div className="d-flex flex-column justify-content-center align-items-center">
                            <img
                              className="artist__image"
                              src={artist.image}
                              alt={artist.name}
                            />
                            <h3 className="artist__name">{artist.name}</h3>
                          </div>
                        </Col>
                        <Col className="my-auto">
                          <Row>
                            <Col xs={12} md={4}>
                              <div className="artist__field">
                                <h3 className="artist__field_name">
                                  Popularity
                                </h3>
                                <div className="artist__field_value">
                                  <CircularProgress
                                    percent={artist.popularity}
                                  />
                                </div>
                              </div>
                            </Col>
                            <Col xs={12} md={4}>
                              <div className="artist__field">
                                <h3 className="artist__field_name">
                                  Followers
                                </h3>
                                <div className="artist__field_value">
                                  {artist.followers}
                                </div>
                              </div>
                            </Col>
                            <Col xs={12} md={4}>
                              <div className="artist__field">
                                <h3 className="artist__field_name">
                                  Spotify Link
                                </h3>
                                <div className="artist__field_value">
                                  <a
                                    href={artist.spotify_link}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={spotify}
                                      width={"32px"}
                                      height={"32px"}
                                      alt="spotify link"
                                    />
                                  </a>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="artist__album_container justify-content-center align-items-center py-3">
                        <h6>Album featuring {artist.name}</h6>
                        {artist.albums.map((album: string) => {
                          return (
                            <Col
                              className="d-flex justify-content-center"
                              xs={12}
                              sm={4}
                              key={album}
                            >
                              <img
                                className="album__image w-100 py-2"
                                src={album}
                                alt="album"
                              />
                            </Col>
                          );
                        })}
                      </Row>
                    </Container>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </Row>
        )}
      </>
    );
  };

  const Venue = (props: any) => {
    const [showMap, setShowMap] = useState(false);

    const handleClose = () => setShowMap(false);
    const handleShow = () => setShowMap(true);

    const venue = props.venue;

    return (
      <>
        <Row>
          <Col xs={12} sm={6}>
            {venue.name && <InfoItem field="Name" value={venue.name} />}
            {venue.address && (
              <InfoItem
                field="Address"
                value={[venue.address, venue.city, venue.state]
                  .filter((x) => x !== "")
                  .join(", ")}
              />
            )}
            {venue.phone && (
              <InfoItem field="Phone Number" value={venue.phone} />
            )}
          </Col>
          <Col xs={12} sm={6}>
            {venue.open_hours && (
              <InfoItem
                field="Open Hours"
                value={<ShowMore text={venue.open_hours}></ShowMore>}
              />
            )}
            {venue.rules.general && (
              <InfoItem
                field="General Rule"
                value={<ShowMore text={venue.rules.general}></ShowMore>}
              />
            )}
            {venue.rules.child && (
              <InfoItem
                field="Child Rule"
                value={<ShowMore text={venue.rules.child}></ShowMore>}
              />
            )}
          </Col>
        </Row>
        <Modal show={showMap} onHide={handleClose} backdrop="static">
          <Modal.Header>
            <Modal.Title style={{ color: "#000000" }}>Event Venue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Map
              lat={Number(venue.location.latitude)}
              lng={Number(venue.location.longitude)}
            />
          </Modal.Body>
          <Modal.Footer className="justify-content-start">
            <Button variant="dark" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Row className="py-3">
          <div className="d-flex justify-content-center">
            {venue.location.latitude && (
              <Button variant="danger" onClick={handleShow}>
                Show venue on Google map
              </Button>
            )}
          </div>
        </Row>
      </>
    );
  };

  return (
    <Row className="justify-content-center g-0">
      <Col xs={12} sm={7}>
        <div className="eventcard">
          <div className="eventcard__header">
            <div className="px-4">
              <span onClick={props.onBack} role="button">
                <img src={leftArrow} alt="back" />
                <u>Back</u>
              </span>
            </div>
            <div className="d-flex justify-content-center align-items-center py-3 px-2">
              <div className="eventcard__title">
                <p>{event.info.name}</p>
                <div
                  className="fav_icon mx-2"
                  onClick={() => {
                    isFav
                      ? deleteFavHandler(event.id) // props.onDeleteFav(event.id)
                      : addFavHandler(event.id); // props.onAddFav(event.id);
                  }}
                  role="button"
                >
                  {!isFav && <img src={notfav} width={"20px"} alt="fav" />}
                  {isFav && <img src={fav} width={"20px"} alt="fav" />}
                </div>
              </div>
            </div>
          </div>
          <TabContext value={tabIndex}>
            <TabList className="tablist" onChange={handleTabChange} centered>
              <Tab
                className={`tablist__item ${
                  tabIndex === "0" ? "tablist__item--active" : ""
                }`}
                label="Events"
                value={"0"}
              />
              <Tab
                className={`tablist__item ${
                  tabIndex === "1" ? "tablist__item--active" : ""
                }`}
                label="Artist/Teams"
                value={"1"}
              />
              <Tab
                className={`tablist__item ${
                  tabIndex === "2" ? "tablist__item--active" : ""
                }`}
                label="Venue"
                value={"2"}
              />
            </TabList>
            <SwipeableViews axis={"x"} index={Number(tabIndex)} disabled>
              <TabPanel value="0" className="tab__content">
                {event_info}
              </TabPanel>
              <TabPanel value="1" className="tab__content">
                <Artist artists={event.artists} />
              </TabPanel>
              <TabPanel value="2" className="tab__content">
                <Venue venue={event.venue} />
              </TabPanel>
            </SwipeableViews>
          </TabContext>
        </div>
      </Col>
    </Row>
  );
};

const InfoItem = (props: any) => {
  let field = props.field;
  let value = props.value;
  if (Array.isArray(value)) {
    value = value.filter((x) => x).join(" | ");
  }
  return (
    <div className="info_item">
      <p className="info_item__field">{field}</p>
      <div className="info_item__value">
        {typeof value === "function" ? (
          value
        ) : props.link ? (
          <a href={props.link}>{value}</a>
        ) : (
          value
        )}
      </div>
    </div>
  );
};

export default Event;
