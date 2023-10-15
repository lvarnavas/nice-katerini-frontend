import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/components/hooks/form-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_MAX,
  VALIDATOR_MIN,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import "./EditQuantities.css";

const EditQuantities = () => {
  const [entryExists, setEntryExists] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [requestCompleted, setRequestCompleted] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const tid = searchParams.get("tid");
  const type = searchParams.get("type");
  const [productsList, setProductsList] = useState([]);
  const [loadedQuantities, setLoadedQuantities] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formState, inputHandler, setFormData] = useForm(
    {
      product: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const checkIfEntryExists = useCallback(async () => {
    if (tid && type) {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/products/check-entry",
          "POST",
          JSON.stringify({
            flag: `edit${type}`,
            transactionid: tid,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        setEntryExists(response.exists);
      } catch (err) {
        console.error(err);
      }
    }
  }, [sendRequest, tid, type]);

  const fetchProductsList = useCallback(async () => {
    try {
      const productListData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/products/get-products"
      );
      setProductsList(productListData.productsList);
    } catch (err) {}
  }, [sendRequest]);

  const fetchQuantities = useCallback(async () => {
    try {
      const quantitiesData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/products/get-quantities",
        "POST",
        JSON.stringify({
          id: `${tid}`,
          flag: `${type}`,
        }),
        { "Content-Type": "application/json" }
      );
      setLoadedQuantities(quantitiesData.quantities);

      setFormData({
        product: {
          value: quantitiesData.quantities[0].quantity,
          isValid: true,
        },
      });
    } catch (err) {}
  }, [sendRequest, tid, type, setFormData]);

  useEffect(() => {
    const loadData = async () => {
      await checkIfEntryExists();

      if (entryExists) {
        await fetchProductsList();
        await fetchQuantities();
      }
    };

    if (tid && type) {
      loadData();
    }
  }, [
    sendRequest,
    tid,
    type,
    setFormData,
    entryExists,
    checkIfEntryExists,
    fetchProductsList,
    fetchQuantities,
  ]);

  const getTitle = () => {
    if (type === "load") {
      return (
        <Card className="edit-quantities_title">
          <h2>
            ΕΠΕΞΕΡΓΑΣΙΑ ΦΟΡΤΩΜΑΤΟΣ ΜΕ ΚΩΔΙΚΟ <span>{tid}</span>{" "}
          </h2>
        </Card>
      );
    } else if (type === "return") {
      return (
        <Card className="edit-quantities_title">
          <h2>
            ΕΠΕΞΕΡΓΑΣΙΑ ΕΠΙΣΤΡΟΦΗΣ ΜΕ ΚΩΔΙΚΟ <span>{tid}</span>
          </h2>
        </Card>
      );
    } else if (type === "cardestruction") {
      return (
        <Card className="edit-quantities_title">
          <h2>
            ΕΠΕΞΕΡΓΑΣΙΑ ΚΑΤΑΣΤΡΟΦΗΣ ΟΧΗΜΑΤΟΣ ΜΕ ΚΩΔΙΚΟ <span>{tid}</span>
          </h2>
        </Card>
      );
    } else if (type === "warehousedestruction") {
      return (
        <Card className="edit-quantities_title">
          <h2>
            ΕΠΕΞΕΡΓΑΣΙΑ ΚΑΤΑΣΤΡΟΦΗΣ ΑΠΟΘΗΚΗΣ ΜΕ ΚΩΔΙΚΟ <span>{tid}</span>
          </h2>
        </Card>
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setShowConfirmModal(false);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/products/edit-entry",
        "PATCH",
        JSON.stringify({
          transactionid: tid, // ok
          date: new Date(),
          flag: `edit${type}`,
          products: productsList.map((product, index) => ({
            productId: product.id,
            quantity: formState.inputs[`product-${product.id}`].value,
          })),
        }),
        {
          "Content-Type": "application/json",
        }
      );

      setRequestCompleted(true);
      showWarningHandler();
    } catch (err) {}
  };

  const showWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const handleBackClick = () => {
    history.goBack();
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if ((!loadedQuantities && !error) || !entryExists) {
    return (
      <div className="edit-quantities_container">
        <Card className="edit-quantities_container-title">
          <h2>Η ΚΑΤΑΧΩΡΗΣΗ ΔΕ ΒΡΕΘΗΚΕ</h2>
        </Card>
        <br />
        <Button inverse onClick={handleBackClick}>
          ΕΠΙΣΤΡΟΦΗ ΠΙΣΩ
        </Button>
      </div>
    );
  }

  const toStringQuantitiesArray = loadedQuantities
    ? loadedQuantities.map((obj) => {
        return {
          ...obj,
          quantity: obj.quantity.toString(),
        };
      })
    : [];

  return (
    <div className="edit-quantities_container">
      {entryExists && (
        <div className="edit-quantities_container-title">
          {getTitle()}
          <br />
          <br />
          {productsList.map((product, index) => (
            <div key={product.id}>
              <Input
                id={`product-${product.id}`}
                element="input"
                type="text"
                label={product.name}
                validators={[
                  VALIDATOR_MIN(0),
                  VALIDATOR_MAX(1999),
                  VALIDATOR_REQUIRE(),
                ]}
                errorText="Παρακαλώ εισάγετε έναν έγκυρο αιρθμό."
                onInput={inputHandler}
                initialValue={
                  requestCompleted
                    ? formState.inputs[`product-${product.id}`].value
                    : toStringQuantitiesArray[index].quantity
                }
                initialValid={true}
              />
            </div>
          ))}
        </div>
      )}
      {tid && type && (
        <div className="edit-quantities_btn">
          <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {requestCompleted && (
              <Modal
                show={showConfirmModal}
                header={<div>ΕΠΙΤΥΧΗΣ ΚΑΤΑΧΩΡΗΣΗ</div>}
                contentClass="specific-item__modal-content"
                footerClass="specific-item__modal-actions"
                footer={<Button onClick={handleBackClick}>OK</Button>}
              ></Modal>
            )}
            {isLoading && <LoadingSpinner asOverlay />}
            {entryExists === 1 && (
              <Button disabled={!formState.isValid} onClick={handleSubmit}>
                ΥΠΟΒΟΛΗ
              </Button>
            )}
          </React.Fragment>
          <br />
          <br />
          <div>
            <Button inverse onClick={handleBackClick}>
              ΕΠΙΣΤΡΟΦΗ ΠΙΣΩ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditQuantities;
