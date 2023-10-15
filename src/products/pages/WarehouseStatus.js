import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/components/hooks/http-hook";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import WarehouseStatusList from "../components/WarehouseStatusList";

const WarehouseStatus = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedWarehouse, setLoadedWarehouse] = useState();
  const [destructionStatus, setDestructionStatus] = useState([]);

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const warehouseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/products/warehouse-status"
        );
        setLoadedWarehouse(warehouseData.warehouseStatus);
      } catch (err) {}
    };
    fetchWarehouse();
  }, [sendRequest]);

  useEffect(() => {
    const fetchDestructionStatus = async () => {
      try {
        const destructionData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            "/products/total-products-destructions-status"
        );
        setDestructionStatus(destructionData.totalProductsDestructions);
      } catch (err) {}
    };
    fetchDestructionStatus();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedWarehouse && (
        <WarehouseStatusList
          items={loadedWarehouse}
          destructionStatus={destructionStatus}
        />
      )}
    </React.Fragment>
  );
};

export default WarehouseStatus;
