/** @jsx jsx */
import React, { useState } from "react";
import styled from "@emotion/styled";
import { jsx, css } from "@emotion/core";
import ErrorBoundary from "react-error-boundary";
import {
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import {
  FacebookLoginButton,
  GoogleLoginButton,
  createButton,
} from "react-social-login-buttons";
import Banner from "./Banner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
const EnvelopeIcon = () => <FontAwesomeIcon icon={faEnvelope} />;

const EmailPasswordLoginButton = createButton({
  text: "Login with Email/Password",
  icon: EnvelopeIcon,
  style: { background: "#25a1b7" },
  activeStyle: { background: "#108291" },
});

const socialButtonStyle = css`
  border-radius: 4px !important;
  padding: 0px 16px !important;
  > div {
    > div:last-child {
      text-align: center !important;
    }
  }
`;

const LoginDivider = styled.hr`
  background-color: gray;
`;

const LoginLayout = styled.div`
  display: grid;
  grid-template-areas:
    "banner banner banner"
    "left content right";
  grid-template-rows: 40vh auto;
  grid-template-columns: 1fr auto 1fr;
  width: 100vw;
  min-height: 100vh;
  background: #1f2124;
`;

const LoginCard = styled(Card)`
  width: 400px;
  background-color: #383a3f !important;
  background-color: #3e4348 !important;
  background-color: #1f2124 !important;
  background-color: #011627 !important;
`;

const LoginContent = styled.div`
  grid-area: content;
  position: relative;
  top: -30vh;
`;

export default function Login(props) {
  return (
    <ErrorBoundary>
      <LoginLayout>
        <Banner />
        <LoginContent>
          <LoginForm {...props} />
        </LoginContent>
      </LoginLayout>
    </ErrorBoundary>
  );
}

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export function LoginForm(props) {
  const { loginEmailPasswordUser, loginFacebookUser, loginGoogleUser } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <LoginCard inverse color="dark">
      <CardBody>
        <Form>
          <FormGroup>
            <Label for="loginEmail">Email</Label>
            <Input
              type="email"
              name="email"
              id="loginEmail"
              placeholder="you@example.com"
              onChange={e => setEmail(e.currentTarget.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="loginPassword">Password</Label>
            <Input
              type="password"
              name="password"
              id="loginPassword"
              placeholder="Passw0rd"
              onChange={e => setPassword(e.currentTarget.value)}
            />
          </FormGroup>
          <ButtonRow>
            <Button
              color="info"
              onClick={() => loginEmailPasswordUser({ email, password })}
            >
              Log In
            </Button>
            <Button
              color="warning"
              onClick={() => {
                loginEmailPasswordUser({
                  email: "nick.larew@mongodb.com",
                  password: "password",
                });
              }}
            >
              Log In as Nick
            </Button>
          </ButtonRow>
          <LoginDivider />
          <EmailPasswordLoginButton
            css={socialButtonStyle}
            onClick={() => loginEmailPasswordUser({ email, password })}
          />
          <FacebookLoginButton
            css={socialButtonStyle}
            onClick={() => loginFacebookUser()}
          />
          <GoogleLoginButton
            css={socialButtonStyle}
            onClick={() => loginGoogleUser()}
          />
        </Form>
      </CardBody>
    </LoginCard>
  );
}
