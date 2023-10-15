import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  function currentDate() {
    const date = new Date();
    const dateFormatter = new Intl.DateTimeFormat("el-GR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    let today = dateFormatter.format(date);

    const parts = today.split("/");
    today = parts[2] + "-" + parts[1] + "-" + parts[0];

    return today;
  }

  return (
    <ul className="navbar">
      {auth.isLoggedIn && (
        <li className="dropdown">
          <NavLink to="#" className="dropdown-btn">
            ΤΡΕΧΟΥΣΑ ΗΜΕΡΑ <span>▼</span>
          </NavLink>
          <div className="dropdown-content">
            <NavLink
              to={`/loads/total-car-loads?startdate=${currentDate()}&enddate=${currentDate()}`}
            >
              ΦΟΡΤΩΜΑΤΑ
            </NavLink>
            <NavLink
              to={`/loads/single-car-loads?carid=1&startdate=${currentDate()}&enddate=${currentDate()}`}
            >
              ΠΑΡΑΛΑΒΕΣ ΝΤΑΛΙΚΑΣ
            </NavLink>
            <NavLink
              to={`/destructions/total-car-destructions?startdate=${currentDate()}&enddate=${currentDate()}`}
            >
              ΚΑΤΑΣΤΡΟΦΕΣ ΟΧΗΜΑΤΩΝ
            </NavLink>
            <NavLink
              to={`/destructions/total-warehouse-destructions?startdate=${currentDate()}&enddate=${currentDate()}`}
            >
              ΚΑΤΑΣΤΡΟΦΕΣ ΑΠΟΘΗΚΗΣ
            </NavLink>
            <NavLink
              to={`/returns/total-car-returns?startdate=${currentDate()}&enddate=${currentDate()}`}
            >
              ΕΠΙΣΤΡΟΦΕΣ
            </NavLink>
          </div>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/search">ΑΝΑΖΗΤΗΣΗ</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/addentry">ΚΑΤΑΧΩΡΗΣΗ</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">ΛΟΓΑΡΙΑΣΜΟΣ</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>ΑΠΟΣΥΝΔΕΣΗ</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
