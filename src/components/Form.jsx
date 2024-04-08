import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Toastify from "./Toastify";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";

import supabase, { SUPABASE_URL } from "../services/supabase";

function Form() {
  const navigate = useNavigate();
  const { createCity, isLoading, mapData } = useCities();
  const [lat, lng] = useUrlPosition();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [contact, setContact] = useState("");
  const [isLoadingGeoCoding, setIsLoadingGeocoding] = useState(false);
  const [geoCodingError, setGeoCodingError] = useState("");

  const URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  useEffect(() => {
    if (!lat && !lng) return;

    async function fetchCity() {
      try {
        setIsLoadingGeocoding(true);
        setGeoCodingError("");

        const res = await fetch(`${URL}?latitude=${lat}&longitude=${lng}`);

        const data = await res.json();

        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else "
          );

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
      } catch (err) {
        setGeoCodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchCity();
  }, [lat, lng]);

  const uploadImage = async (e) => {
    let files = e.target.files[0];

    const imageName = `${Math.random()}-${files.name}`.replaceAll("/", "");
    const imagePath = `${SUPABASE_URL}/storage/v1/object/public/Medical/${imageName}`;

    await supabase
      .from("medical")
      .insert([{ image: imagePath }])
      .select();

    // https://wwrjpeselhicsjvdtjyz.supabase.co/storage/v1/object/public/Medical/0.8720178515115453-aaaaa.jpg
    await supabase.storage.from("Medical").upload(imageName, files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      contact,
      date,
      emoji: "💊",
      notes,
      position: { lat, lng },
      mapData,
    };

    await createCity(newCity);
    navigate("/app");
  };

  if (isLoadingGeoCoding) return <Spinner />;

  if (!lat & !lng)
    return (
      <>
        <Message message="Start By Clicking on Map" />
        <Toastify type="success" msg="Start By Clicking on Map" />
      </>
    );

  if (geoCodingError)
    return (
      <>
        <Message message={geoCodingError} />
        <Toastify type="error" msg={geoCodingError} />
      </>
    );

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">Medical name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>🏥</span>
      </div>
      <div className={styles.row}>
        <label htmlFor="phoneNo">Phone No</label>
        <input
          id="phoneNo"
          onChange={(e) => setContact(e.target.value)} // Corrected the function name
          value={contact}
        />
      </div>
      {/* <div className={styles.row}>
        <label htmlFor="date">{cityName} Available from 9:00 to </label>
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div> */}
      <div className={styles.row}>
        <label htmlFor="notes">Summary About Medical {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="notes">Upload the image {cityName}</label>
        <input type="file" onChange={uploadImage} />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
