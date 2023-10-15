import React, { useState } from "react";
import Modal from "../../../shared/components/UIElements/Modal";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import Button from "../../../shared/components/FormElements/Button";
import { useHttpClient } from "../../../shared/components/hooks/http-hook";
import moment from "moment";
import "../shared.css";

const SingleCarDestructionsItem = ({ item, onDelete }) => {
  const currentDate = moment();
  const itemDate = moment(item.date, "YYYY-MM-DD"); // assuming date format is "YYYY-MM-DD"
  const diffInDays = itemDate.diff(currentDate, "days");
  const isWithinOneDay = diffInDays >= -1 && diffInDays <= 1;
  //END DATE

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/products/delete-item/${item.id}`,
        "DELETE",
        JSON.stringify({
          flag: "deleteCarDestructionItem",
        }),
        { "Content-Type": "application/json" }
      );
      onDelete(item.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="ΕΠΙΒΕΒΑΙΩΣΗ ΔΙΑΓΡΑΦΗΣ"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <div className="products-components__item-modal-btn">
              <Button inverse onClick={cancelDeleteHandler}>
                ΑΚΥΡΩΣΗ
              </Button>
              <Button danger onClick={confirmDeleteHandler}>
                ΔΙΑΓΡΑΦΗ
              </Button>
            </div>
          </React.Fragment>
        }
      >
        <p>Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το στοιχείο;</p>
      </Modal>

      <tr>
        {Object.entries(item).map(([key, value], index) => {
          if (key === "date") {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            value = `${day}-${month}-${year}`;
          }
          return <td key={index}>{value}</td>;
        })}
        <td className="products-compontents__edit-item">
          {isLoading && <LoadingSpinner asOverlay />}
          {isWithinOneDay ? (
            <Button
              inverse
              to={`/edit-quantities?tid=${item.id}&type=cardestruction`}
            >
              <img src={require("../../../edit-btn.png")} alt="edit-btn" />
            </Button>
          ) : (
            <Button disabled inverse>
              <img src={require("../../../edit-btn.png")} alt="edit-btn" />
            </Button>
          )}
          <div className="spacer"></div>
          {isWithinOneDay ? (
            <Button danger onClick={showDeleteWarningHandler}>
              <img src={require("../../../delete-btn.png")} alt="delete-btn" />
            </Button>
          ) : (
            <Button disabled danger>
              <img src={require("../../../delete-btn.png")} alt="delete-btn" />
            </Button>
          )}
        </td>
      </tr>
    </React.Fragment>
  );
};

export default SingleCarDestructionsItem;
