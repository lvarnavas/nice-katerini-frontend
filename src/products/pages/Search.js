import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import DatePicker from "react-datepicker";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import el from "date-fns/locale/el";
import Card from "../../shared/components/UIElements/Card";
import "./Search.css";

const SearchPage = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [searchType, setSearchType] = useState("");
  const [carList, setCarList] = useState([]);
  const [selectedCar, setSelectedCar] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const history = useHistory();

  useEffect(() => {
    const fetchCarList = async () => {
      try {
        const carListData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/products/get-car-list"
        );
        if (searchType === "Αναζήτηση βάσει οχήματος") {
          setCarList(
            carListData.carslist.filter((car) => car.pinakida !== "ΝΤΑΛΙΚΑ")
          );
        } else {
          setCarList(carListData.carslist);
        }
      } catch (err) {}
    };
    if (
      searchType === "Αναζήτηση βάσει οχήματος" ||
      searchType === "Αναζήτηση παραλαβών νταλίκας"
    ) {
      fetchCarList();
    }
  }, [sendRequest, searchType]);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  let formattedStartDate;
  let formattedEndDate;
  const noCarSearch = () => {
    formattedStartDate = formatDate(startDate);
    formattedEndDate = formatDate(endDate);

    const dropDownOptions = {
      "Αναζήτηση βάσει οχήματος": "",
      "Αναζήτηση συνολικών φορτωμάτων": "/loads/total-car-loads",
      "Αναζήτηση συνολικών καταστροφών οχημάτων":
        "/destructions/total-car-destructions",
      "Αναζήτηση συνολικών επιστροφών": "/returns/total-car-returns",
      "Αναζήτηση καταστροφών αποθήκης":
        "/destructions/total-warehouse-destructions",
      "Αναζήτηση παραλαβών νταλίκας": "/loads/single-car-loads?carid=1",
    };

    const selectedOption = dropDownOptions[searchType];
    if (selectedOption && searchType !== "Αναζήτηση παραλαβών νταλίκας") {
      history.push(
        `${selectedOption}?startdate=${formattedStartDate}&enddate=${formattedEndDate}`
      );
    } else {
      history.push(
        `${selectedOption}&startdate=${formattedStartDate}&enddate=${formattedEndDate}`
      );
    }
  };

  const carSearch = () => {
    formattedStartDate = formatDate(startDate);
    formattedEndDate = formatDate(endDate);

    const categoryUrls = {
      Φορτώματα: `/loads/single-car-loads`,
      Επιστροφές: `/returns/single-car-returns`,
      Καταστροφές: `/destructions/single-car-destructions`,
    };

    const selectedCategoryUrl = categoryUrls[selectedCategory];

    if (selectedCategoryUrl) {
      history.push(
        `${selectedCategoryUrl}?carid=${selectedCar}&startdate=${formattedStartDate}&enddate=${formattedEndDate}`
      );
    }
  };

  const renderForm = () => {
    switch (searchType) {
      case "Αναζήτηση συνολικών φορτωμάτων":
      case "Αναζήτηση συνολικών καταστροφών οχημάτων":
      case "Αναζήτηση συνολικών επιστροφών":
      case "Αναζήτηση καταστροφών αποθήκης":
      case "Αναζήτηση παραλαβών νταλίκας":
        return (
          <>
            <div className="search-container__content-title">
              Αναζήτηση από:
            </div>
            <div className="date-container">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                locale={el}
              />
            </div>
            <div className="search-container__content-title">
              Αναζήτηση εώς:
            </div>
            <div className="date-container">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                locale={el}
              />
            </div>
            {isLoading && <LoadingSpinner asOverlay />}
            <div className="search-container__content-btn">
              <Button onClick={noCarSearch}>ΑΝΑΖΗΤΗΣΗ</Button>
            </div>
          </>
        );
      case "Αναζήτηση βάσει οχήματος":
        return (
          <>
            <select
              value={selectedCar || ""}
              onChange={(e) => setSelectedCar(e.target.value)}
            >
              <option value="" disabled>
                Επιλέξτε όχημα
              </option>
              {carList.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.pinakida}
                </option>
              ))}
            </select>
            {selectedCar && (
              <>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Επιλέξτε κατηγορία
                  </option>
                  <option value="Φορτώματα">Φορτώματα</option>
                  <option value="Επιστροφές" disabled={selectedCar === "24"}>
                    Επιστροφές
                  </option>
                  <option value="Καταστροφές" disabled={selectedCar === "24"}>
                    Καταστροφές
                  </option>
                </select>

                {selectedCategory && (
                  <div className="search-container__content-date">
                    <div className="search-container__content-title">
                      Αναζήτηση από:
                    </div>
                    <div className="date-container">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        locale={el}
                      />
                    </div>
                    <div className="search-container__content-title">
                      Αναζήτηση εώς:
                    </div>
                    <div className="date-container">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        locale={el}
                      />
                    </div>
                    <React.Fragment>
                      <ErrorModal error={error} onClear={clearError} />
                      {isLoading && (
                        <div className="center">
                          <LoadingSpinner />
                        </div>
                      )}
                      <div className="search-container__content-btn">
                        <Button onClick={carSearch}>ΑΝΑΖΗΤΗΣΗ</Button>
                      </div>
                    </React.Fragment>
                  </div>
                )}
              </>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="search-container">
      <div className="search-container__content">
        <Card className="search-container-title">
          <h2>ΑΝΑΖΗΤΗΣΗ ΚΑΤΑΧΩΡΗΣΕΩΝ</h2>
        </Card>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="" disabled>
            Επιλέξτε τύπο αναζήτησης
          </option>
          <option value="Αναζήτηση συνολικών φορτωμάτων">
            Αναζήτηση συνολικών φορτωμάτων
          </option>
          <option value="Αναζήτηση συνολικών καταστροφών οχημάτων">
            Αναζήτηση συνολικών καταστροφών οχημάτων
          </option>
          <option value="Αναζήτηση καταστροφών αποθήκης">
            Αναζήτηση καταστροφών αποθήκης
          </option>
          <option value="Αναζήτηση συνολικών επιστροφών">
            Αναζήτηση συνολικών επιστροφών
          </option>
          <option value="Αναζήτηση βάσει οχήματος">
            Αναζήτηση βάσει οχήματος
          </option>
          <option value="Αναζήτηση παραλαβών νταλίκας">
            Αναζήτηση παραλαβών νταλίκας
          </option>
        </select>
        {renderForm()}
      </div>
    </div>
  );
};

export default SearchPage;
