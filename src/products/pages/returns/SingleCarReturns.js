import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/components/hooks/http-hook";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import SingleCarReturnsList from "../../components/returns/SingleCarReturnsList";

const SingleCarReturns = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCarReturns, setLoadedCarReturns] = useState();
  const [carName, setCarName] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get("carid");
    const startDate = urlParams.get("startdate");
    const endDate = urlParams.get("enddate");

    const fetchCarReturns = async () => {
      try {
        const carReturnsData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/products/returns/${carId}/${startDate}/${endDate}`,
          "POST",
          JSON.stringify({
            flag: "singleCarReturns",
          }),
          { "Content-Type": "application/json" }
        );
        setLoadedCarReturns(carReturnsData.returns);
      } catch (err) {}
    };
    fetchCarReturns();

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
    setLoadedCarReturns((prevLoads) =>
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
      {!isLoading && loadedCarReturns && (
        <SingleCarReturnsList
          items={loadedCarReturns}
          carName={carName}
          onDeleteItem={itemDeleteHandler}
        />
      )}
    </React.Fragment>
  );
};

export default SingleCarReturns;
