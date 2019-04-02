/** @jsx jsx */
import React, { useState, useEffect } from "react";
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
import { Redirect } from "@reach/router"
import {
  confirmEmail,
  sendPasswordResetEmail,
  handlePasswordReset
} from './../stitch'
import { navigate } from "@reach/router"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUserPlus } from "@fortawesome/free-solid-svg-icons";

const EnvelopeIcon = () => <FontAwesomeIcon icon={faEnvelope} />;
const UserPlusIcon = () => <FontAwesomeIcon icon={faUserPlus} />;

const EmailPasswordLoginButton = createButton({
  text: "Login with Email/Password",
  icon: EnvelopeIcon,
  style: { background: "#25a1b7" },
  activeStyle: { background: "#108291" },
});

const EmailPasswordRegisterButton = createButton({
  text: "Sign Up",
  icon: UserPlusIcon,
  style: { background: "#25a1b7" },
  activeStyle: { background: "#108291" },
});

const socialButtonStyle = css`
  border-radius: 4px !important;
  padding: 0px 16px !important;
  margin: 8 px 0 !important;
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
    !props.isLoggedIn ? (
      <ErrorBoundary>
        <LoginLayout>
          <Banner />
          <LoginContent>
            <LoginForm {...props} />
          </LoginContent>
        </LoginLayout>
      </ErrorBoundary>
    ) : (
      <Redirect to="/app" noThrow />
    )
  );
}

export function ResetPassword() {
  const [newPassword, setNewPassword] = React.useState("")
  return (
    <ErrorBoundary>
      <LoginLayout>
        <Banner />
        <LoginContent>
          <LoginCard inverse color="dark">
            <CardBody>
              <Form>
                <FormGroup>
                  <Label for="newPassword">New Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="newPassword"
                    placeholder="Passw0rd"
                    onChange={e => setNewPassword(e.currentTarget.value)}
                  />
                </FormGroup>
                <Button onClick={() => handlePasswordReset(newPassword)}>Reset Password</Button>
              </Form>
            </CardBody>
          </LoginCard>
        </LoginContent>
      </LoginLayout>
    </ErrorBoundary>
  )
}

export function ConfirmEmail() {
  const [confirming, setConfirming] = React.useState(true)
  const [isConfirmed, setIsConfirmed] = React.useState(false)

  useEffect(() => {
    confirmEmail().then(() => {
      setConfirming(false)
      setIsConfirmed(true)
      navigate("/login")
    })
  }, [])
}

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

function EmailPasswordForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
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
          <Button onClick={() => props.setIsEmailPassword(false)}>{"< Back"}</Button>
          <EmailPasswordRegisterButton
            css={socialButtonStyle}
            onClick={() => props.loginEmailPasswordUser({ email, password })}
          />
        </ButtonRow>
      </Form>
      <LoginDivider />
    </>
  )
}

function LoginButtons(props) {
  return (
    <>
      <EmailPasswordLoginButton
        css={socialButtonStyle}
        onClick={() => props.setIsEmailPassword(true)}
      />
      <FacebookLoginButton
        css={socialButtonStyle}
        onClick={() => props.loginFacebookUser()}
      />
      <GoogleLoginButton
        css={socialButtonStyle}
        onClick={() => props.loginGoogleUser()}
      />
    </>
  )
}

export function LoginForm(props) {
  const { loginEmailPasswordUser, loginFacebookUser, loginGoogleUser } = props;
  const [isEmailPassword, setIsEmailPassword] = useState(false)
  return (
    <LoginCard inverse color="dark">
      <CardBody>
        {isEmailPassword ? (
          <EmailPasswordForm
            loginEmailPasswordUser={loginEmailPasswordUser}
            setIsEmailPassword={setIsEmailPassword}
          />
        ) : (
          <LoginButtons
            setIsEmailPassword={setIsEmailPassword}
            loginFacebookUser={loginFacebookUser}
            loginGoogleUser={loginGoogleUser}
          />
        )}
      </CardBody>
    </LoginCard>
  );
}
