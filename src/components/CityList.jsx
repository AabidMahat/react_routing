import { useCities } from "../contexts/CitiesContext";
import CityItem from "./CityItem";
import styles from "./CityList.module.css";

import Spinner from "./Spinner";
import Message from "./Message";
import { useSearchParams } from "react-router-dom";

function CityList() {
  const { cities, isLoading } = useCities();
  const [searchParams] = useSearchParams();
  const medicalsQueryParam = searchParams.get("medical");
  const medicals = JSON.parse(decodeURIComponent(medicalsQueryParam));

  if (isLoading) return <Spinner />;

  if (!cities.length) {
    return <Message message={"Add your first medical Shop here"} />;
  }

  return (
    <ul className={styles.cityList}>
      {medicals
        ? medicals.map((city) => <CityItem city={city} key={city.id} />)
        : cities.map((city) => <CityItem city={city} key={city.id} />)}
    </ul>
  );
}

export default CityList;
