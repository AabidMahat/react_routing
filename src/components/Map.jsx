import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "./../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";

import L from "leaflet";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers";
import "leaflet-routing-machine";
import { useUrlPosition } from "../hooks/useUrlPosition";

import MedicalData from "./MedicalData";

function Map() {
  //! to read the query we use useSearchParams

  const [routeLoading, setRouteLoading] = useState(false);

  const { cities, getMapData, updateCity } = useCities();

  const [mapPosition, setMapPosition] = useState([18.5204303, 73.8567437]);

  const [userPosition, setUserPosition] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);
  const navigate = useNavigate();

  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geoLocationPosition) {
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
      setUserPosition(geoLocationPosition);
    }
  }, [geoLocationPosition]);

  // @ Selected City

  // ! For routing
  const HandleCityMarkerClick = (city, map) => {
    if (!userPosition) {
      alert("Please wait until your position is determined.");
      return;
    }

    // ? Setting loading to true
    setRouteLoading(true);

    if (routingControl) {
      // ! To clear the previous route

      if (routingControl.getPlan()) {
        routingControl.getPlan().setWaypoints([]);
      }
    }

    const waypoints = [
      L.latLng(userPosition.lat, userPosition.lng),
      L.latLng(city.position.lat, city.position.lng),
    ];

    const control = L.Routing.control({
      waypoints,
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "red", weight: 5 }], // Customize color and width here
      },
      fitSelectedRoutes: false,
      showAlternatives: true,

      altLineOptions: {
        styles: [
          { color: "black", opacity: 0.15, weight: 9 },
          { color: "white", opacity: 0.8, weight: 6 },
          { color: "blue", opacity: 0.5, weight: 3 },
        ],
      },
    }).addTo(map);

    //? Once the route is added to the map, set loading state to false

    control.on("routesfound", async (e) => {
      setRouteLoading(false);

      console.log(cities);
      const distance = (e.routes[0].summary.totalDistance / 1000).toFixed(2);
      const totalTime = e.routes[0].summary.totalTime + 5 * 60 * 1000;
      const hours = totalTime / 3600;
      const minutes = Math.ceil((totalTime % 3600) / 60);

      const time = {
        hours: Math.floor(hours),
        minutes: minutes,
      };

      getMapData({ distance, time });

      await updateCity(city.id, { mapData: { distance, time } });

      navigate(
        `cities/${city.id}?dist=${distance}&hour=${time.hours}&min=${time.minutes}`
      );
    });
    setRoutingControl(control);
  };

  return (
    <div className={styles.mapContainer}>
      {!userPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}
      {routeLoading && <Spinner />}
      <MapContainer
        center={mapPosition}
        zoom={20}
        scrollWheelZoom={true}
        className={`${styles.map} ${routeLoading ? styles.hidden : ""}`}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
            icon={L.AwesomeMarkers.icon({
              icon: "star",
              prefix: "fa",
              markerColor: "green",
            })}
            eventHandlers={{
              click: (e) => HandleCityMarkerClick(city, e.target._map),
            }}>
            <Popup>{<MedicalData />}</Popup>
          </Marker>
        ))}

        {userPosition && (
          <Marker
            position={[userPosition.lat, userPosition.lng]}
            icon={L.AwesomeMarkers.icon({
              icon: "certificate",
              prefix: "fa",
              markerColor: "blue",
            })}>
            <Popup>Your Position</Popup>
          </Marker>
        )}
        <ChnageCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChnageCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
