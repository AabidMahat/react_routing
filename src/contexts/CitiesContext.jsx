import { createContext, useContext, useEffect, useReducer } from "react";
import { useSearchParams } from "react-router-dom";

const CitiesContext = createContext();

const URL = "http://localhost:8400";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
  mapData: {},
  medicals: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "cities/update":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.map((city) =>
          city.id === action.payload
            ? { ...city, mapData: state.mapData }
            : city
        ),
      };

    case "map/clicked":
      return { ...state, mapData: action.payload };

    case "medicals":
      return { ...state, medicals: action.payload };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
  }
}

function CityProvider({ children }) {
  const [
    { cities, isLoading, currentCity, error, mapData, medicals },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchData() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${URL}/cities`);
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There is error while loading data",
        });
      }
    }

    fetchData();
  }, []);

  async function getCity(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${URL}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: "city/loaded", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There is error while loading data",
      });
    }
  }
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There is error while loading data",
      });
    }
  }

  async function updateCity(id, newData) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${URL}/cities/${id}`, {
        method: "PATCH",
        body: JSON.stringify(newData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      dispatch({ type: "cities/update", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There is error while deleting city",
      });
    }
  }

  function getMapData(mapData) {
    dispatch({ type: "map/clicked", payload: mapData });
  }

  function getMedicalData(data) {
    dispatch({ type: "medicals", payload: data });
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        mapData,
        medicals,
        error,
        getCity,
        createCity,
        updateCity,
        getMapData,
        getMedicalData,
      }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("Cities Context is used outside the Cities Provider");

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CityProvider, useCities };
