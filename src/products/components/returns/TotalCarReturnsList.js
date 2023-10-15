import TotalCarReturnsItem from "./TotalCarReturnsItem";
import { dateFormater } from "../../../shared/components/dateFormatter";
import Card from "../../../shared/components/UIElements/Card";
import "../shared.css";

const TotalCarReturnsList = (props) => {
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

  // Add a reducer to calculate the sum of all quantities starting from the fourth column
  const sums = columnNames.slice(1).map((columnName) => {
    return props.items.reduce((acc, item) => {
      return acc + parseInt(item[columnName], 10);
    }, 0);
  });

  const getCustomColumnName = (columnName) => {
    if (columnName === "pinakida") {
      return "Πινακίδα";
    }
    return columnName;
  };
  return (
    <div className="products-components__container-list ">
      {formattedStartDate !== formattedEndDate ? (
        <Card>
          <h2>
            ΣΥΝΟΛΙΚΕΣ ΕΠΙΣΤΡΟΦΕΣ ΑΠΟ <span>{formattedStartDate}</span> ΕΩΣ{" "}
            <span>{formattedEndDate}</span>
          </h2>
        </Card>
      ) : (
        <Card>
          <h2>
            ΣΥΝΟΛΙΚΕΣ ΕΠΙΣΤΡΟΦΕΣ <span>{formattedStartDate}</span>
          </h2>
        </Card>
      )}
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
              return <TotalCarReturnsItem key={index} item={item} />;
            })}
            <tr>
              <td className="table-sum">Σύνολο</td>

              {sums.map((sum, index) => (
                <td key={index}>{sum}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalCarReturnsList;
