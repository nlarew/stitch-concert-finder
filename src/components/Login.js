/** @jsx jsx */
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { jsx, css } from "@emotion/core";
import ErrorBoundary from "react-error-boundary";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Location } from "@reach/router"
import {
  FacebookLoginButton,
  GoogleLoginButton,
  createButton
} from "react-social-login-buttons";
import Banner from "./Banner";
import { Redirect } from "@reach/router";
import {
  confirmEmail,
  registerNewEmailUser,
  sendPasswordResetEmail,
  handlePasswordReset
} from "./../stitch";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUserPlus,
  faRedo,
  faMusic,
  faUserSecret,
} from "@fortawesome/free-solid-svg-icons";

const EnvelopeIcon = () => <FontAwesomeIcon icon={faEnvelope} />;
const UserPlusIcon = () => <FontAwesomeIcon icon={faUserPlus} />;
const RedoIcon = () => <FontAwesomeIcon icon={faRedo} flip="horizontal" />;
const MusicIcon = () => <FontAwesomeIcon icon={faMusic} />;
const GuestIcon = () => <FontAwesomeIcon icon={faUserSecret} />;

const EmailPasswordLoginButton = createButton({
  text: "Login with Email/Password",
  icon: EnvelopeIcon,
  style: { background: "#25a1b7" },
  activeStyle: { background: "#108291" }
});

const ResetPasswordButton = createButton({
  text: "Reset Your Password",
  icon: RedoIcon,
  style: { background: "#596267" },
  activeStyle: { background: "#108291" }
});

const EmailPasswordLoginActionButton = createButton({
  text: "Log In",
  icon: MusicIcon,
  style: { background: "#596267" },
  activeStyle: { background: "#108291" }
});

const GuestLoginButton = createButton({
  text: "Log In as a Guest",
  icon: GuestIcon,
  style: { background: "#596267" },
  activeStyle: { background: "#108291" }
});

const EmailPasswordRegisterButton = createButton({
  text: "Sign Up",
  icon: UserPlusIcon,
  style: { background: "#596267" },
  activeStyle: { background: "#108291" }
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
  background-color: #011627 !important;
`;

const LoginContent = styled.div`
  grid-area: content;
  position: relative;
  top: -30vh;
`;

export function ResetPassword(props) {
  const [newPassword, setNewPassword] = React.useState("");
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
                <Button onClick={() => handlePasswordReset(newPassword, props.location)}>
                  Reset Password
                </Button>
              </Form>
            </CardBody>
          </LoginCard>
        </LoginContent>
      </LoginLayout>
    </ErrorBoundary>
  );
}

export function ConfirmEmail(props) {
  const { location } = props
  const [isConfirming, setIsConfirming] = React.useState(true);
  useEffect(() => {
    confirmEmail(location).then(() => {
      setIsConfirming(false);
    });
  }, []);
  return isConfirming ? "confirming" : <Redirect to="/login" noThrow />;
}

function EmailPasswordForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentFormAction, setCurrentFormAction] = useState("login");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [registrationPassword, setRegistrationPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  return (
    <>
      <CardBody>
        {currentFormAction === "login" && (
          <Form>
            <h1>Log In</h1>
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
            <Button
              block
              color="info"
              onClick={() => props.loginEmailPasswordUser({ email, password })}
            >
              Log In
            </Button>
          </Form>
        )}
        {currentFormAction === "register" && (
          <Form>
            <h1>Create an Account</h1>
            <FormGroup>
              <Label for="registerEmail">Email</Label>
              <Input
                type="email"
                name="email"
                id="registerEmail"
                placeholder="you@example.com"
                onChange={e => setRegistrationEmail(e.currentTarget.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="registerPassword">Password</Label>
              <Input
                type="password"
                name="password"
                id="registerPassword"
                placeholder="Passw0rd"
                onChange={e => setRegistrationPassword(e.currentTarget.value)}
              />
            </FormGroup>
            <Button
              block
              color="info"
              onClick={() =>
                registerNewEmailUser(registrationEmail, registrationPassword)
              }
            >
              Sign Up
            </Button>
          </Form>
        )}
        {currentFormAction === "resetPassword" && (
          <Form>
            <h1>Reset Your Password</h1>
            <FormGroup>
              <Label for="resetEmail">Email</Label>
              <Input
                type="email"
                name="email"
                id="resetEmail"
                placeholder="you@example.com"
                onChange={e => setResetEmail(e.currentTarget.value)}
              />
            </FormGroup>
            <Button
              block
              color="info"
              onClick={() => sendPasswordResetEmail(resetEmail)}
            >
              Email New Password
            </Button>
          </Form>
        )}
        <LoginDivider />
        {currentFormAction !== "login" && (
          <EmailPasswordLoginActionButton
            css={socialButtonStyle}
            onClick={() => setCurrentFormAction("login")}
          />
        )}
        {currentFormAction !== "register" && (
          <EmailPasswordRegisterButton
            css={socialButtonStyle}
            onClick={() => setCurrentFormAction("register")}
          />
        )}
        {currentFormAction !== "resetPassword" && (
          <ResetPasswordButton
            css={socialButtonStyle}
            onClick={() => setCurrentFormAction("resetPassword")}
          />
        )}
      </CardBody>
      <CardFooter>
        <Button
          onClick={() => props.setIsEmailPassword(false)}
          color="secondary"
        >
          {"< Back"}
        </Button>
      </CardFooter>
    </>
  );
}

// function LoginButtons(props) {
//   return (
//     <>
//       <EmailPasswordLoginButton
//         css={socialButtonStyle}
//         onClick={() => props.setIsEmailPassword(true)}
//       />
//       <FacebookLoginButton
//         css={socialButtonStyle}
//         onClick={() => props.loginFacebookUser()}
//       />
//       <GoogleLoginButton
//         css={socialButtonStyle}
//         onClick={() => props.loginGoogleUser()}
//       />
//     </>
//   );
// }

export const LoginForm = React.memo(function(props) {
  const { loginEmailPasswordUser, loginFacebookUser, loginGoogleUser, loginGuestUser } = props;
  const [isEmailPassword, setIsEmailPassword] = useState(false);
  const setToEmailPassword = () => setIsEmailPassword(true);
  return (
    <LoginCard inverse color="dark">
      {isEmailPassword ? (
        <EmailPasswordForm
          loginEmailPasswordUser={loginEmailPasswordUser}
          setIsEmailPassword={setIsEmailPassword}
        />
      ) : (
        <CardBody>
          <>
            <EmailPasswordLoginButton
              css={socialButtonStyle}
              onClick={setToEmailPassword}
            />
            <FacebookLoginButton
              css={socialButtonStyle}
              onClick={loginFacebookUser}
            />
            <GoogleLoginButton
              css={socialButtonStyle}
              onClick={loginGoogleUser}
            />
            <GuestLoginButton
              css={socialButtonStyle}
              onClick={loginGuestUser}
            />
          </>
        </CardBody>
      )}
    </LoginCard>
  );
})

export default React.memo(function(props) {
  return !props.isLoggedIn ? (
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
  );
})

export function LinkLogin(props) {
  return (
    <ErrorBoundary>
      <LoginLayout>
        <Banner />
        <LoginContent>
          <LoginForm {...props} />
        </LoginContent>
      </LoginLayout>
    </ErrorBoundary>
  )
}
