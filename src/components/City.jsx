import { useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import supabase from "../services/supabase";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  // @ useParams is ued to get data from url
  const { id } = useParams();
  const { currentCity, getCity, isLoading } = useCities();

  useEffect(
    function () {
      getCity(id);
    },
    [id]
  );
  const [imageUrl, setImageUrl] = useState([]);

  useEffect(() => {
    const fetchImage = async () => {
      const { data } = await supabase.from("medical").select("*");
      setImageUrl(data);
    };
    fetchImage();
  }, []);

  console.log(imageUrl);

  const { cityName, emoji, date, notes, mapData } = currentCity;

  const currentImageUrl = imageUrl.find((item) =>
    item.image.includes(cityName?.split(" ")[0])
  )?.image;
  console.log("🚀 ~ file: City.jsx:29 ~ City ~ currentCity:", currentCity);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={styles.city}>
          <div className={styles.row}>
            <img
              src={currentImageUrl}
              style={{
                height: "250px",
              }}
            />
            <h6>City name</h6>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}>
              <h3>
                <span>{emoji}</span> {cityName}
              </h3>
              <h6>
                <span
                  style={{
                    fontSize: "1.5rem",
                  }}>
                  {mapData && mapData.distance}
                </span>{" "}
                km
              </h6>
            </div>
          </div>

          <div className={styles.row}>
            <h6>{cityName} Total Time Taken </h6>
            <p>
              {mapData && mapData.distance && mapData.time
                ? `${
                    mapData.time.hours === 0 ? "" : mapData.time.hours + "hrs"
                  }  ${mapData.time.minutes} mins`
                : "Loading..."}
            </p>
          </div>

          {notes && (
            <div className={styles.row}>
              <h6>Your notes</h6>
              <p>{notes}</p>
            </div>
          )}

          <div className={styles.row}>
            <h6>Learn more</h6>
            <a
              href={`https://en.wikipedia.org/wiki/${cityName}`}
              target="_blank"
              rel="noreferrer">
              Check out {cityName} on Wikipedia &rarr;
            </a>
          </div>

          <div>
            <BackButton />
          </div>
        </div>
      )}
    </>
  );
}

export default City;
