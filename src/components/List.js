/** @jsx jsx */
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css, jsx } from "@emotion/core";
import ErrorBoundary from "react-error-boundary";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import ReactTableContainer from "react-table-container";
import * as R from "ramda";

const StarIcon = () => (
  <FontAwesomeIcon
    css={css`
      margin: auto 8px;
    `}
    icon={faStar}
  />
);

const ContentCard = styled(Card)`
  grid-area: list;
  margin: 10px;
  background-color: #383a3f !important;
  background-color: #3e4348 !important;
  background-color: #1f2124 !important;
  position: relative;
  top: -70px;
`;

function tableStyle(el, modifiers={}) {
  const tableStyles = {
    body: css`
      overflow-y: scroll;
    `,
    row: css`
      background-color: ${modifiers.isCurrent
        ? "#16a2b8"
        : "#3e4348"};
    `
  };
  return tableStyles[el]
}

// const date2time = dateString => {
//   const date = new Date(Date.parse(dateString));
//   const hours = date.getHours();
//   const minutes = String(date.getMinutes());

//   const month = ["Jan","Feb","Mar","Apr","Jun","Jul","Aug","Sep","Oct","Nov","Dec",][date.getMonth()];
//   const dayOfMonth = date.getDate();
//   const period = hours <= 11 ? "AM" : "PM";
//   const hour = period === "AM" ? hours : hours === 12 ? "12" : hours - 12;
//   const minute = minutes.length > 1 ? minutes : minutes + "0";

//   return `${month} ${dayOfMonth} ${hour}:${minute}${period}`;
// };

const EventsList = props => {
  const { events, currentEvent, setCurrentEvent } = props;
  const rowClickHandler = event => e => {
    setCurrentEvent(event);
  };
  const renderEventRows = () => {
    return (
      events &&
      events.map(event => (
        <tr
          css={tableStyle("row", {
            isCurrent: currentEvent && currentEvent.id === event.id
          })}
          key={event.id}
          onClick={rowClickHandler(event)}
        >
          <td>
            <a href={event.url}>{event.name}</a>
          </td>
        </tr>
      ))
    );
  };
  return (
    <Table dark>
      <thead>
        <tr>
          <th>Event</th>
        </tr>
      </thead>
      <tbody css={tableStyle("body")}>{renderEventRows()}</tbody>
    </Table>
  );
};

function usePagination(list, config) {
  // Parse configuration values
  const {
    numItemsPerPage=10,
  } = config
  // Pagination Metadata
  const numItems = list.length
  const [currentItems, setCurrentItems] = useState([])
  const [numPages, setNumPages] = useState(Math.ceil(list.length / numItemsPerPage))
  const [currentPage, setCurrentPage] = useState(1)
  const metadata = { numItems, numPages, currentPage, numItemsPerPage };
  useEffect(() => {
    setNumPages(Math.ceil(list.length / numItemsPerPage));
  }, [list, numItemsPerPage])
  // Keep the current page in sync
  useEffect(() => {
    const firstIndex = numItemsPerPage * (currentPage - 1);
    const possibleNextFirstIndex = firstIndex + numItemsPerPage;
    const nextFirstIndex =
      possibleNextFirstIndex <= numItems - 1
        ? possibleNextFirstIndex
        : numItems - 1;
    setCurrentItems(R.slice(firstIndex, nextFirstIndex, list));
  }, [currentPage, numItemsPerPage]);
  // Switch between pages
  function getNextPage() {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  function getPrevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  function getPage(pageNum) {
    if (pageNum >= 1 && pageNum <= numPages) {
      setCurrentPage(pageNum);
    }
  }
  return { currentItems, getNextPage, getPrevPage, getPage, metadata };
}

const VenuesList = props => {
  const { venues=[], currentVenue, setCurrentVenue, currentUserProfile } = props;
  const rowClickHandler = event => e => {
    setCurrentVenue(event);
  };
  const {
    currentItems: currentVenues,
    getNextPage,
    getPrevPage,
    getPage,
    metadata: { numPages, currentPage }
  } = usePagination(venues, { numItemsPerPage: 12 });

  const renderVenueRows = () => {
    return (
      currentVenues &&
      currentVenues
        .filter((v, i) => i < 20)
        .map(venue => {
          const isFavorite =
            currentUserProfile &&
            currentUserProfile.favoriteVenues.includes(venue.id);
          return (
            <tr
              css={tableStyle("row", {
                isCurrent:
                  currentVenue && currentVenue.id === venue.id
              })}
              key={venue.id}
              onClick={rowClickHandler(venue)}
            >
              <td>{isFavorite && <StarIcon />}</td>
              <td>
                <span>{venue.name}</span>
              </td>
              <td>{venue.upcomingEvents.length} Shows</td>
            </tr>
          );
        })
    );
  };

  const PageSelector = props => {
    const renderSpecificPageSelectors = (numPages) => {
      return numPages && new Array(numPages).fill("").map((x, index) => {
        const pageNum = index + 1;
        return (
          <PaginationItem key={pageNum} active={currentPage === pageNum}>
            <PaginationLink onClick={() => getPage(pageNum)}>
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        );
      });
    }
    return (
      <Pagination>
        <PaginationItem>
          <PaginationLink previous onClick={getPrevPage} />
        </PaginationItem>
        {renderSpecificPageSelectors(numPages, currentPage)}
        <PaginationItem>
          <PaginationLink next onClick={getNextPage} />
        </PaginationItem>
      </Pagination>
    );
  };

  return (
    <>
      <PageSelector numPages={numPages} />
      <Table dark>
        <thead>
          <tr>
            <th />
            <th>Venues</th>
            <th />
          </tr>
        </thead>
        <tbody css={tableStyle("body")}>
          {renderVenueRows()}
        </tbody>
      </Table>
    </>
  );
};

const headerStyle = css`
  min-height: 165px;
  padding-left: 0px;
  padding-right: 0px;
`

function List(props) {
  const { address = "You", currentUserProfile } = props;
  return (
    <ContentCard inverse>
      <ErrorBoundary>
        <CardBody>
          <CardHeader css={headerStyle}>
            <h1>Venues Near...</h1>
            <h3 css={css`color: #25A1B7;`}>{address}</h3>
          </CardHeader>
          <VenuesList {...props} currentUserProfile={currentUserProfile} />
        </CardBody>
      </ErrorBoundary>
    </ContentCard>
  );
}
export default List;
export { EventsList };
