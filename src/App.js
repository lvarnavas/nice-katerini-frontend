import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/components/context/auth-context";
import { useAuth } from "./shared/components/hooks/auth-hook";

import WarehouseStatus from "./products/pages/WarehouseStatus";
import SingleCarLoads from "./products/pages/loads/SingleCarLoads";
import TotalCarLoads from "./products/pages/loads/TotalCarLoads";
import SingleCarDestructions from "./products/pages/destructions/SingleCarDestructions";
import TotalCarDestructions from "./products/pages/destructions/TotalCarDestructions";
import WarehouseDestructions from "./products/pages/destructions/WarehouseDestructions";
import SingleCarReturns from "./products/pages/returns/SingleCarReturns";
import TotalCarReturns from "./products/pages/returns/TotalCarReturns";
import NotFound from "./NotFound";
import SearchPage from "./products/pages/Search";
import AddEntry from "./products/pages/AddEntry";
import EditQuantities from "./products/pages/EditQuantities";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import Auth from "./users/components/pages/Auth";
import "./App.css";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <React.Fragment>
        <Switch>
          <Route path="/warehouse-status" exact>
            <WarehouseStatus />
          </Route>

          <Route path="/loads/single-car-loads">
            <SingleCarLoads />
          </Route>

          <Route path="/loads/total-car-loads">
            <TotalCarLoads />
          </Route>

          <Route path="/destructions/single-car-destructions">
            <SingleCarDestructions />
          </Route>

          <Route path="/destructions/total-car-destructions">
            <TotalCarDestructions />
          </Route>

          <Route path="/destructions/total-warehouse-destructions">
            <WarehouseDestructions />
          </Route>

          <Route path="/returns/single-car-returns">
            <SingleCarReturns />
          </Route>

          <Route path="/returns/total-car-returns">
            <TotalCarReturns />
          </Route>

          <Route path="/edit-quantities">
            <EditQuantities />
          </Route>

          <Route path="/search" component={SearchPage} />

          <Route path="/addentry" component={AddEntry} />
          <Route path="/auth" element={<Redirect to="/" />} />
          <Route path="/">
            <div className="image-container">
              <img src={require("./nice-logo.png")} alt="nice-logo" />
            </div>
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Switch>
          <Route path="/auth">
            <Auth />
          </Route>
          <Route path="/">
            <div className="image-container">
              <img src={require("./nice-logo.png")} alt="nice-logo" />
            </div>
          </Route>
        </Switch>
      </React.Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
