import { dateFormater } from "../../../shared/components/dateFormatter";
import SingleCarReturnsItem from "./SingleCarReturnsItem";
import Card from "../../../shared/components/UIElements/Card";
import "../shared.css";

const SingleCarReturnsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="products-components__container-list">
        <Card>
          <h2>ΔΕΝ ΒΡΕΘΗΚΑΝ ΕΠΙΣΤΡΟΦΕΣ</h2>
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

  const getCustomColumnName = (columnName) => {
    if (columnName === "date") {
      return "Ημ/νία";
    } else if (columnName === "id") {
      return "ID";
    }
    return columnName;
  };

  return (
    <div className="products-components__container-list ">
      <Card>
        <h2>
          ΕΠΙΣΤΡΟΦΕΣ ΟΧΗΜΑΤΟΣ <span>{props.carName}</span> ΑΠΟ{" "}
          <span>{formattedStartDate}</span> ΕΩΣ <span>{formattedEndDate}</span>
        </h2>
      </Card>
      <div className="products-components__container-list-content">
        <table>
          <thead>
            <tr>
              {columnNames.map((columnName, index) => (
                <th key={index}> {getCustomColumnName(columnName)} </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.items.map((item, index) => {
              return (
                <SingleCarReturnsItem
                  key={index}
                  item={item}
                  onDelete={props.onDeleteItem}
                />
              );
            })}
            <tr>
              <td className="table-sum">Σύνολο</td>
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

export default SingleCarReturnsList;
