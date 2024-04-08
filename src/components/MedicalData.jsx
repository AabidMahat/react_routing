"use client";

import { Card } from "flowbite-react";
import { useCities } from "../contexts/CitiesContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import supabase from "../services/supabase";

function MedicalData() {
  const { currentCity, getCity, isLoading } = useCities();
  const [imageUrl, setImageUrl] = useState([]);
  const { id } = useParams();
  useEffect(
    function () {
      getCity(id);
    },
    [id]
  );
  useEffect(() => {
    const fetchImage = async () => {
      const { data } = await supabase.from("medical").select("*");
      setImageUrl(data);
    };
    fetchImage();
  }, []);

  console.log(imageUrl);
  const { cityName, contact } = currentCity;

  //@ find the current city Image

  const currentImageUrl = imageUrl.find((item) =>
    item.image.includes(cityName?.split(" ")[0])
  )?.image;

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="flex items-center justify-between gap-x-7 ">
      <div>
        <h5 className="text-2xl font-bold tracking-tight text-white">
          {cityName}
        </h5>
      </div>
      <div className="flex justify-center items-center ">
        <span className="text-white bg-blue-700 rounded-full px-3 text-center text-2xl font-bold leading-snug">
          {contact}
        </span>
      </div>
    </div>
  );
}

export default MedicalData;
