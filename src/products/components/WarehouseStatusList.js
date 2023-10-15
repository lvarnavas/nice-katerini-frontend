import WarehouseStatusItem from "./WarehouseStatusItem";
import Card from "../../shared/components/UIElements/Card";
import "./shared.css";

const WarehouseStatusList = (props) => {
  if (props.items.length === 0) {
    return (
      <div>
        <h2>Αδυναμία φόρτωσης δεδομένων.</h2>
      </div>
    );
  }

  const getDestructionStatus = (id) => {
    const status = props.destructionStatus.find(
      (item) => item.product_id === id
    );
    return status ? status.total_quantity : "0";
  };
  return (
    <div className="products-components__container-list">
      <Card>
        <h2>ΚΑΤΑΣΤΑΣΗ ΘΑΛΑΜΟΥ</h2>
      </Card>
      <div className="products-components__container-list-content">
        <table>
          <thead>
            <tr>
              {/*<th>ID</th> */}
              <th>Όνομα Προίόντος</th>
              <th>Ποσότητα</th>
              <th>Κατεστραμμένα</th>
            </tr>
          </thead>
          {props.items.map((warehouse) => {
            return (
              <WarehouseStatusItem
                key={warehouse.product_id}
                id={warehouse.product_id}
                productName={warehouse.product_name}
                quantity={warehouse.current_quantity}
                totalQuantity={getDestructionStatus(warehouse.product_id)}
              />
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default WarehouseStatusList;
