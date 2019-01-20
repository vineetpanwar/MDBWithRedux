import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import _ from "lodash";
import axios from "axios";

import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";

class Login extends Component {
  state = {
    username: "",
    password: "",
    validationErrors: {
      username_Error: "",
      password_Error: ""
    },
    noInternetConnection: false
  };

  checkCredentials = async () => {
    let fetchedData;
    let newData = { ...this.state };
    try {
      let data = await axios.get("https://reqres.in/api/users");
      fetchedData = data;
    } catch (err) {
      console.log(err);
      newData.noInternetConnection = true;
      this.setState(newData);
      return false;
    }

    newData.validationErrors.username_Error = "Invalid Username";

    for (var i = 0; i < fetchedData.data.data.length; i++) {
      console.log(this.state.username);
      console.log(fetchedData.data.data[i].first_name);

      if (this.state.username === fetchedData.data.data[i].first_name) {
        //USERNAME doesnt exist
        newData.validationErrors.username_Error = "";
        break;
      }
    }
    //If the username is correct only then check for the password
    if (newData.validationErrors.username_Error === "") {
      newData.validationErrors.password_Error = "Please enter correct Password";
      for (var j = 0; j < fetchedData.data.data.length; j++) {
        if (this.state.password === fetchedData.data.data[i].last_name) {
          //PASSWORD doesnt match
          newData.validationErrors.password_Error = "";
          break;
        }
      }
    }

    this.setState(newData);

    if (
      newData.validationErrors.username_Error === "" &&
      newData.validationErrors.password_Error === ""
    ) {
      return true;
    }

    return false;
  };

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  validateFields = (value, fieldName) => {
    if (_.isNull(value) || _.isEmpty(value)) {
      let newData = { ...this.state };
      if (fieldName === "username") {
        newData.validationErrors.username_Error = "Please enter the username";
      }
      if (fieldName === "password") {
        newData.validationErrors.password_Error = "Please enter the password";
      }

      this.setState(newData);
    }
  };
  clearValidation = () => {
    let newData = { ...this.state };
    newData.validationErrors.username_Error = "";
    newData.validationErrors.password_Error = "";
    this.setState(newData);
  };
  loggedIn = () => {
    this.clearValidation();
    this.validateFields(this.state.username, "username");
    this.validateFields(this.state.password, "password");
    if (
      this.state.validationErrors.password_Error ||
      this.state.validationErrors.username_Error
    ) {
      return;
    }
    if (this.checkCredentials()) {
      console.log("comeing here");
      this.props.history.push("/home");
    }
  };

  receiveUsername = data => {
    let newData = { ...this.state };
    newData.username = _.trim(data.target.value);
    this.setState(newData);
  };

  recievePassword = data => {
    let newData = { ...this.state };
    newData.password = _.trim(data.target.value);
    this.setState(newData);
  };

  render() {
    const noInternetConnection = (
      <div> Please check your internet Connection and try again!</div>
    );
    return (
      <div className="app flex-row align-items-center abc">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              {this.state.noInternetConnection && noInternetConnection}
              <CardGroup>
                <Card className="p-5">
                  <CardBody>
                    <Form noValidate>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className={"mb-3"}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          className={classnames({
                            "is-invalid":
                              this.state.validationErrors.username_Error === ""
                                ? false
                                : true
                          })}
                          type="text"
                          placeholder="Username"
                          autoComplete="username"
                          onChange={e => {
                            this.receiveUsername(e);
                          }}
                          required
                        />
                        {this.state.validationErrors.username_Error !== "" && (
                          <div className="invalid-feedback">
                            {this.state.validationErrors.username_Error}
                          </div>
                        )}
                      </InputGroup>

                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          className={classnames({
                            "is-invalid":
                              this.state.validationErrors.password_Error === ""
                                ? false
                                : true
                          })}
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          onChange={e => {
                            this.recievePassword(e);
                          }}
                          required
                        />
                        {this.state.validationErrors.password_Error !== "" && (
                          <div className="invalid-feedback">
                            {this.state.validationErrors.password_Error}
                          </div>
                        )}
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="primary"
                            className="px-4"
                            onClick={e => this.loggedIn()}
                          >
                            Login
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card
                  className="text-white bg-primary py-5 d-md-down-none"
                  style={{ width: "44%" }}
                >
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua.
                      </p>
                      <Link to="/register">
                        <Button
                          color="primary"
                          className="mt-3"
                          active
                          tabIndex={-1}
                        >
                          Register Now!
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
