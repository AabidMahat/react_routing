import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";
import supabase from "../services/supabase";
import { useEffect, useState } from "react";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity } = useCities();

  const { cityName, emoji, date, id, position, contact, mapData } = city;

  //@ find the current city Image

  return (
    <li>
      {/* // ? We need to simply pass the id in to prop as mentioned */}
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id && styles["cityItem--active"]
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}>
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        {/* <time className={styles.date}>{formatDate(date)}</time> */}
        <h6>
          <span
            style={{
              fontSize: "1.5rem",
            }}>
            {mapData.distance}
          </span>{" "}
          km
        </h6>

        <button className={styles.deleteBtn}>x</button>
      </Link>
    </li>
  );
}

export default CityItem;
