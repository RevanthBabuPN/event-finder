import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import NavBar from "./components/NavBar/NavBar";
import SearchForm from "./components/Form/SearchForm";
import EventList from "./components/EventList/EventList";
import Event from "./components/Event/Event";
import FavoritesTable from "./components/Favorite/FavoritesTable";

import { actions } from "./store/index";
import { geohashFromIP, geohashFromAddress } from "./utils";

import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const [showTable, setShowTable] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [event, setEvent] = useState<any>();

  const events = useSelector((state: any) => state.app.events);
  const favorites = useSelector((state: any) => state.app.favorites);

  const isEventFavorite = (eventId: string): boolean => {
    return favorites.find((x: any) => x.id === eventId);
  };

  const showResults = async (formContent: any) => {
    const req = {
      keyword: formContent.keyword,
      distance: formContent.distance,
      category: formContent.category,
      location:
        (formContent.autoDetect
          ? await geohashFromIP()
          : await geohashFromAddress(formContent.location)) ?? "", //"9q5cs3e",
    };
    let queryParams = new URLSearchParams(req).toString();

    fetch(`/api/search?` + queryParams)
      .then((response) => response.json())
      .then((data) => {
        dispatch(actions.updateEvents({ events: data }));
        setShowTable(true);
        setShowEvent(false);
      })
      .catch((err) => console.error(err));
  };

  const clearResults = useCallback(() => {
    dispatch(actions.clearEvents());
    setShowTable(false);
    setShowEvent(false);
  }, [dispatch]);

  const location = useLocation();

  useEffect(() => {
    clearResults();
  }, [clearResults, location.pathname]);

  const selectEventHandler = (eventid: string) => {
    fetch(`/api/events/${eventid}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        setShowEvent(true);
        setShowTable(false);
      })
      .catch((err) => console.error(err));
  };

  const backHandler = () => {
    setShowEvent(false);
    setShowTable(true);
  };

  const addFavHandler = (eventid: string) => {
    dispatch(actions.addFavorite(eventid));
  };

  const deleteFavHandler = (id: string) => {
    dispatch(actions.removeFavorite(id));
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/search"} />} />
      <Route
        path={"/search"}
        element={
          <>
            <NavBar />
            <section>
              <SearchForm onClear={clearResults} onSubmit={showResults} />
            </section>
            {showTable && (
              <section>
                <EventList events={events} onEventSelect={selectEventHandler} />
              </section>
            )}
            {showEvent && (
              <section>
                <Event
                  event={event}
                  isFav={isEventFavorite(event.id)}
                  onBack={backHandler}
                  onAddFav={addFavHandler}
                  onDeleteFav={deleteFavHandler}
                />
              </section>
            )}
          </>
        }
      />
      <Route
        path="/favorites"
        element={
          <>
            <NavBar />
            <section>
              <FavoritesTable onDelete={deleteFavHandler} />
            </section>
          </>
        }
      />
    </Routes>
  );
};

export default App;
