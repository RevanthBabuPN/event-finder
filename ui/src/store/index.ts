import { configureStore } from "@reduxjs/toolkit";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SortableKey = "date" | "event" | "genre" | "venue";

interface UpdateAction {
  events: any[];
}

interface SortAction {
  key: SortableKey;
}

const initialSortOrder = {
  date: true,
  event: true,
  genre: true,
  venue: true,
};

export interface State {
  events: any[];
  sortOrder: { [key in SortableKey]: boolean };
  favorites: any[];
}

const persistedFavorites = localStorage.getItem("esAppState")
  ? JSON.parse(localStorage.getItem("esAppState") as string)
  : [];

const appSlice = createSlice({
  name: "app",
  initialState: {
    events: [], //EVENTS,
    sortOrder: initialSortOrder,
    favorites: persistedFavorites, //FAVORITES,
  } as State,
  reducers: {
    clearEvents: (state: State) => {
      state.events = [];
      state.sortOrder = initialSortOrder;
    },
    updateEvents: (state: State, action: PayloadAction<UpdateAction>) => {
      state.events = action.payload.events;
      state.sortOrder = initialSortOrder;
    },
    sortEvents: (state: State, action: PayloadAction<SortAction>) => {
      let key = action.payload.key;
      let order = state.sortOrder[key];
      state.sortOrder = { ...state.sortOrder, [key]: !order };
      state.events.sort((e1, e2) => {
        if (order) {
          return e1[key] < e2[key] ? -1 : e1[key] > e2[key] ? 1 : 0;
        } else {
          return e1[key] < e2[key] ? 1 : e1[key] > e2[key] ? -1 : 0;
        }
      });
    },
    updateFavorites: (state: State, action: PayloadAction<State>) => {
      state = { ...state, ...action.payload };
      return state;
    },
    removeFavorite: (state: State, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        (favorite) => favorite.id !== action.payload
      );
    },
    addFavorite: (state: State, action: PayloadAction<string>) => {
      const id = action.payload;
      const event = state.events.find((x) => x.id === id);
      if (!state.favorites.find((x) => x.id === id)) {
        const newfav = {
          id: event.id,
          date: event.date?.localDate,
          event: event.event,
          category: event.category,
          venue: event.venue,
        };
        state.favorites = [...state.favorites, newfav];
      }
    },
  },
});

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

store.subscribe(() => {
  localStorage.setItem(
    "esAppState",
    JSON.stringify(store.getState().app.favorites)
  );
});

export const actions = appSlice.actions;
export default store;
