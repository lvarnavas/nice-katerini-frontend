import WarehouseDestructionsItem from "./WarehouseDestructionsItem";
import { dateFormater } from "../../../shared/components/dateFormatter";
import Card from "../../../shared/components/UIElements/Card";
import "../shared.css";

const WarehouseDestructionsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="products-components__container-list">
        <Card>
          <h2>ΔΕΝ ΒΡΕΘΗΚΑΝ ΚΑΤΑΣΤΡΟΦΕΣ ΑΠΟΘΗΚΗΣ</h2>
        </Card>
      </div>
    );
  }

  const { formattedStartDate, formattedEndDate } = dateFormater(
    "startdate",
    "enddate",
    "DD-MM-YYYY"
  );

  const columnNames = Object.keys(props.items[0]);
  columnNames.push("-");
  // Add a reducer to calculate the sum of all quantities starting from the fourth column
  const sums = columnNames.slice(2, -1).map((columnName) => {
    return props.items.reduce((acc, item) => {
      return acc + parseInt(item[columnName], 10);
    }, 0);
  });

  return (
    <div className="products-components__container-list ">
      {formattedStartDate !== formattedEndDate ? (
        <Card>
          <h2>
            ΣΥΝΟΛΙΚΕΣ ΚΑΤΑΣΤΡΟΦΕΣ ΑΠΟΘΗΚΗΣ ΑΠΟ <span>{formattedStartDate}</span>{" "}
            ΕΩΣ <span>{formattedEndDate}</span>
          </h2>
        </Card>
      ) : (
        <Card>
          <h2>
            ΣΥΝΟΛΙΚΕΣ ΚΑΤΑΣΤΡΟΦΕΣ ΑΠΟΘΗΚΗΣ <span>{formattedStartDate}</span>
          </h2>
        </Card>
      )}
      <div className="products-components__container-list-content">
        <table>
          <thead>
            <tr>
              {columnNames.map((columnName, index) => {
                if (columnName === "date") {
                  return <th key={index}>Ημ/νία</th>;
                } else {
                  return <th key={index}>{columnName}</th>;
                }
              })}
            </tr>
          </thead>
          <tbody>
            {props.items.map((item, index) => {
              return (
                <WarehouseDestructionsItem
                  key={index}
                  item={item}
                  onDelete={props.onDeleteItem}
                />
              );
            })}
            <tr>
              <td className="table-sum"> Σύνολο</td>
              <td>-</td>
              {sums.map((sum, index) => (
                <td key={index}>{sum}</td>
              ))}
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseDestructionsList;
