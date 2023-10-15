import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/components/hooks/http-hook";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import SingleCarLoadsList from "../../components/loads/SingleCarLoadsList";

const SingleCarLoads = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCarLoads, setLoadedCarLoads] = useState();
  const [carName, setCarName] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get("carid");
    const startDate = urlParams.get("startdate");
    const endDate = urlParams.get("enddate");

    const fetchCarLoads = async () => {
      try {
        const carLoadsData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/products/loads/${carId}/${startDate}/${endDate}`,
          "POST",
          JSON.stringify({
            flag: "singleCarLoads",
          }),
          { "Content-Type": "application/json" }
        );
        setLoadedCarLoads(carLoadsData.loads);
      } catch (err) {}
    };
    fetchCarLoads();

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
    setLoadedCarLoads((prevLoads) =>
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
      {!isLoading && loadedCarLoads && (
        <SingleCarLoadsList
          items={loadedCarLoads}
          carName={carName}
          onDeleteItem={itemDeleteHandler}
        />
      )}
    </React.Fragment>
  );
};

export default SingleCarLoads;
