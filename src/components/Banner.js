import React from "react";
import styled from "@emotion/styled";

// https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&q=80
// https://images.unsplash.com/photo-1449748040579-354c191a7934?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&q=80
const Banner = props => {
  const { photo } = props;
  const photoId = photo || "1449748040579-354c191a7934";
  const BannerContainer = styled.div`
    grid-area: banner;
    // background: #1f2124;
    background: linear-gradient(0deg, #1f2124 0%, transparent),
      url(https://images.unsplash.com/photo-${photoId}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&q=80)
        no-repeat center;
    background-size: cover;
  `;
  return <BannerContainer {...props} />;
};
