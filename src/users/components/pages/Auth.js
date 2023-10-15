import React, { useContext } from "react";

import Input from "../../../shared/components/FormElements/Input";
import Button from "../../../shared/components/FormElements/Button";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import Card from "../../../shared/components/UIElements/Card";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MAXLENGTH,
} from "../../../shared/components/util/validators";
import { useForm } from "../../../shared/components/hooks/form-hook";
import { useHttpClient } from "../../../shared/components/hooks/http-hook";
import { AuthContext } from "../../../shared/components/context/auth-context";
import "./Auth.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Auth = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      username: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/login",
        "POST",
        JSON.stringify({
          username: formState.inputs.username.value,
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      auth.login(responseData.userId, responseData.token);
      history.push("/warehouse-status");
    } catch (err) {}
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className="authentication">
        <Card className="authentication-card">
          {isLoading && <LoadingSpinner asOverlay />}
          <h2>ΣΥΝΔΕΣΗ ΧΡΗΣΤΗ</h2>
          <hr />
          <br />
          <form onSubmit={authSubmitHandler}>
            <Input
              element="input"
              id="username"
              type="text"
              label="Όνομα χρήστη"
              placeholder="Εισάγετε το όνομα χρήστη"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(20)]}
              errorText="Παρακαλώ εισάγετε το όνομα χρήστη."
              onInput={inputHandler}
            />
            <Input
              element="input"
              id="password"
              type="password"
              label="Κωδικός πρόσβασης"
              placeholder="Εισάγετε κωδικό πρόσβασης"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(20)]}
              errorText="Παρακαλώ εισάγετε τον κωδικό πρόσβασης."
              onInput={inputHandler}
            />
            <br />
            <Button type="submit" disabled={!formState.isValid}>
              {"ΣΥΝΔΕΣΗ"}
            </Button>
          </form>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Auth;
