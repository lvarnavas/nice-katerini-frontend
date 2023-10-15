import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/components/hooks/http-hook";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import SingleCarDestructionsList from "../../components/destructions/SingleCarDestructionsList";

const SingleCarDestructions = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCarDestructions, setLoadedCarDestructions] = useState();
  const [carName, setCarName] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get("carid");
    const startDate = urlParams.get("startdate");
    const endDate = urlParams.get("enddate");

    const fetchCarDestructions = async () => {
      try {
        const carDestructionsData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/products/destructions/${carId}/${startDate}/${endDate}`,
          "POST",
          JSON.stringify({
            flag: "singleCarDestructions",
          }),
          { "Content-Type": "application/json" }
        );
        setLoadedCarDestructions(carDestructionsData.destructions);
      } catch (err) {}
    };
    fetchCarDestructions();

    const fetchCarList = async () => {
      try {
        const carListData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/products/get-car-list"
        );
        const car = carListData.carslist.find(
          (car) => car.id === parseInt(carId)
        );
        if (car) {
          setCarName(car.pinakida);
        }
      } catch (err) {}
    };
    fetchCarList();
  }, [sendRequest]);

  const itemDeleteHandler = (deletedItemId) => {
    setLoadedCarDestructions((prevLoads) =>
      prevLoads.filter((load) => load.id !== deletedItemId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCarDestructions && (
        <SingleCarDestructionsList
          items={loadedCarDestructions}
          carName={carName}
          onDeleteItem={itemDeleteHandler}
        />
      )}
    </React.Fragment>
  );
};

export default SingleCarDestructions;
