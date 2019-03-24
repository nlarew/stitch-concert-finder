import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from "reactstrap";
import Banner from "./Banner";

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
`;

const LoginContent = styled.div`
  grid-area: content;
  position: relative;
  top: -30vh;
`;

export default function Login(props) {
  return (
    <LoginLayout>
      <Banner />
      <LoginContent>
        <LoginForm {...props} />
      </LoginContent>
    </LoginLayout>
  );
}

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export function LoginForm(props) {
  const { loginEmailPasswordUser } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    loginEmailPasswordUser({ email, password });
  };
  const handleLoginNick = () => {
    loginEmailPasswordUser({
      email: "nick.larew@mongodb.com",
      password: "password",
    });
  };
  return (
    <LoginCard>
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
            <Button onClick={handleLogin}>Log In</Button>
            <Button onClick={handleLoginNick}>Log In as Nick</Button>
          </ButtonRow>
        </Form>
      </CardBody>
    </LoginCard>
  );
}
