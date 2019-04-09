/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import Banner from "./Banner"

export default function Loading(props) {
  return (
    <div css={css`
      display: grid;
      grid-template-areas:
        "banner banner banner"
        "left content right";
      grid-template-rows: 40vh auto;
      grid-template-columns: 1fr auto 1fr;
      width: 100vw;
      min-height: 100vh;
      background: #1f2124;
    `}>
      <Banner />
    </div>
  )
};
