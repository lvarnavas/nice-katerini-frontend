import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/components/hooks/http-hook";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import TotalCarReturnsList from "../../components/returns/TotalCarReturnsList";
import { dateFormater } from "../../../shared/components/dateFormatter";

const TotalCarReturns = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCarReturns, setLoadedCarReturns] = useState();
  const { formattedStartDate, formattedEndDate } = dateFormater(
    "startdate",
    "enddate",
    "YYYY-MM-DD"
  );

  useEffect(() => {
    const fetchCarReturns = async () => {
      try {
        const carReturnsData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/products/returns/${formattedStartDate}/${formattedEndDate}`,
          "POST",
          JSON.stringify({
            flag: "totalCarReturns",
          }),
          { "Content-Type": "application/json" }
        );
        setLoadedCarReturns(carReturnsData.returns);
      } catch (err) {}
    };
    fetchCarReturns();
  }, [sendRequest, formattedStartDate, formattedEndDate]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCarReturns && (
        <TotalCarReturnsList items={loadedCarReturns} />
      )}
    </React.Fragment>
  );
};

export default TotalCarReturns;
