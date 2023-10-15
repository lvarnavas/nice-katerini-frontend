import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/components/hooks/http-hook";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import TotalCarLoadsList from "../../components/loads/TotalCarLoadsList";
import { dateFormater } from "../../../shared/components/dateFormatter";

const TotalCarLoads = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCarLoads, setLoadedCarLoads] = useState();
  const { formattedStartDate, formattedEndDate } = dateFormater(
    "startdate",
    "enddate",
    "YYYY-MM-DD"
  );

  useEffect(() => {
    const fetchCarLoads = async () => {
      try {
        const carLoadsData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/products/loads/${formattedStartDate}/${formattedEndDate}`,
          "POST",
          JSON.stringify({
            flag: "totalCarLoads",
          }),
          { "Content-Type": "application/json" }
        );
        const filteredCarList = carLoadsData.loads.filter(
          (obj) => !(obj.Pinakida === "ΝΤΑΛΙΚΑ")
        );
        setLoadedCarLoads(filteredCarList);
      } catch (err) {}
    };
    fetchCarLoads();
  }, [sendRequest, formattedStartDate, formattedEndDate]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCarLoads && (
        <TotalCarLoadsList items={loadedCarLoads} />
      )}
    </React.Fragment>
  );
};

export default TotalCarLoads;
