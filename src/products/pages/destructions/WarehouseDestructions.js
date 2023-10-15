import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/components/hooks/http-hook";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import WarehouseDestructionsList from "../../components/destructions/WarehouseDestructionsList";
import { dateFormater } from "../../../shared/components/dateFormatter";

const WarehouseDestructions = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedDestructions, setLoadedDestructions] = useState();
  const { formattedStartDate, formattedEndDate } = dateFormater(
    "startdate",
    "enddate",
    "YYYY-MM-DD"
  );

  useEffect(() => {
    const fetchDestructions = async () => {
      try {
        const destructionsData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/products/destructions/${formattedStartDate}/${formattedEndDate}`,
          "POST",
          JSON.stringify({
            flag: "warehouseDestructions",
          }),
          { "Content-Type": "application/json" }
        );
        setLoadedDestructions(destructionsData.destructions);
      } catch (err) {}
    };
    fetchDestructions();
  }, [sendRequest, formattedStartDate, formattedEndDate]);

  const itemDeleteHandler = (deletedItemId) => {
    setLoadedDestructions((prevWarehouseDestructions) =>
      prevWarehouseDestructions.filter(
        (warehouse) => warehouse.ID !== deletedItemId
      )
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
      {!isLoading && loadedDestructions && (
        <WarehouseDestructionsList
          items={loadedDestructions}
          onDeleteItem={itemDeleteHandler}
        />
      )}
    </React.Fragment>
  );
};

export default WarehouseDestructions;
