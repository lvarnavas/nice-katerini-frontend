import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/components/hooks/http-hook";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import TotalCarDestructionsList from "../../components/destructions/TotalCarDestructionsList";
import { dateFormater } from "../../../shared/components/dateFormatter";

const TotalCarDestructions = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCarDestructions, setLoadedCarDestructions] = useState();
  const { formattedStartDate, formattedEndDate } = dateFormater(
    "startdate",
    "enddate",
    "YYYY-MM-DD"
  );

  useEffect(() => {
    const fetchCarDestructions = async () => {
      try {
        const carDestructionsData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/products/destructions/${formattedStartDate}/${formattedEndDate}`,
          "POST",
          JSON.stringify({
            flag: "totalCarDestructions",
          }),
          { "Content-Type": "application/json" }
        );
        setLoadedCarDestructions(carDestructionsData.destructions);
      } catch (err) {}
    };
    fetchCarDestructions();
  }, [sendRequest, formattedStartDate, formattedEndDate]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCarDestructions && (
        <TotalCarDestructionsList items={loadedCarDestructions} />
      )}
    </React.Fragment>
  );
};

export default TotalCarDestructions;
