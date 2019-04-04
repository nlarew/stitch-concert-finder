/** @jsx jsx */
import React, { useEffect } from "react";
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
  // Default Values
  const numItems = list.length;
  const numItemsPerPage = config.numItemsPerPage || 10;
  const getDefaultState = () => ({
    list,
    numItems,
    numItemsPerPage,
    numPages: Math.ceil(numItems / numItemsPerPage),
    currentPage: 1,
    currentItems: R.slice(0, numItemsPerPage, list)
  });
  // Helpers
  const getItemsForPage = pageNumber => {
    const maxIndex = numItems - 1;
    const firstIndex = numItemsPerPage * (pageNumber - 1);
    const nextFirstIndex = Math.min(firstIndex + numItemsPerPage, maxIndex);
    return R.slice(firstIndex, nextFirstIndex, list);
  };
  // Reducer
  const reducer = (state, action) => {
    switch (action.type) {
      case "updateList": {
        const { list } = action.payload;
        const isValid = list instanceof Array;
        return isValid ? getDefaultState() : state;
      }
      case "getNextPage": {
        const hasNext = state.currentPage < state.numPages;
        if (hasNext) {
          const nextPage = state.currentPage + 1;
          return {
            ...state,
            currentPage: nextPage,
            currentItems: getItemsForPage(nextPage)
          };
        } else {
          return state;
        }
      }
      case "getPrevPage": {
        const hasPrev = state.currentPage > 1;
        if (hasPrev) {
          const prevPage = state.currentPage - 1;
          return {
            ...state,
            currentPage: prevPage,
            currentItems: getItemsForPage(prevPage)
          };
        } else {
          return state;
        }
      }
      case "getPage": {
        const { pageNum } = action.payload;
        const isValidPageNum = pageNum >= 1 && pageNum <= state.numPages;
        if (isValidPageNum) {
          return {
            ...state,
            currentPage: pageNum,
            currentItems: getItemsForPage(pageNum)
          };
        } else {
          return state;
        }
      }
      default: {
        throw new Error(`Invalid action type: "${action.type}"`);
      }
    }
  };
  // Store
  const [state, dispatch] = React.useReducer(reducer, getDefaultState());
  // Actions
  function getNextPage() {
    dispatch({ type: "getNextPage" });
  }
  function getPrevPage() {
    dispatch({ type: "getPrevPage" });
  }
  function getPage(pageNum) {
    dispatch({ type: "getPage", payload: { pageNum } });
  }
  // Effects
  useEffect(() => {
    if (list !== state.list || numItemsPerPage !== state.numItemsPerPage) {
      dispatch({ type: "updateList", payload: { list } });
    }
  }, [list, config]);

  return {
    currentItems: state.currentItems,
    currentPage: state.currentPage,
    metadata: {
      numItems: state.numItems,
      numPages: state.numPages,
      numItemsPerPage: state.numItemsPerPage
    },
    getNextPage,
    getPrevPage,
    getPage
  };
}

const VenuesList = props => {
  const { venues, currentVenue, setCurrentVenue } = props;
  const rowClickHandler = event => e => {
    setCurrentVenue(event);
  };
  const {
    currentItems: currentVenues,
    currentPage,
    getNextPage,
    getPrevPage,
    getPage,
    metadata: { numPages }
  } = usePagination(venues, { numItemsPerPage: 12 });

  const renderVenueRows = () => {
    return (
      currentVenues &&
      currentVenues
        .map(venue => {
          const isFavorite = venue.isFavorite
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
                <div css={css`display: flex; flex-direction: row;`}>
                  <span>{venue.name}</span>
                  <span css={css`margin-left: auto;`}>({venue.upcomingEvents.length} shows)</span>
                </div>
              </td>
            </tr>
          );
        })
    );
  };

  const PageSelector = ({ numPages, currentPage }) => {
    const renderSpecificPageSelectors = () => {
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
      <Pagination css={css`> ul.pagination {margin-bottom: 0 !important};`}>
        <PaginationItem>
          <PaginationLink previous onClick={getPrevPage} />
        </PaginationItem>
        {renderSpecificPageSelectors()}
        <PaginationItem>
          <PaginationLink next onClick={getNextPage} />
        </PaginationItem>
      </Pagination>
    );
  };

  return (
    <>
      <Table dark hover css={css`
        table-layout: fixed;
      `}>
        <thead>
          <tr>
            <th css={css`width: 58px;`}><span css={css`white-space: nowrap;`}>Venues</span></th>
            <th css={css``}>
              <div css={css`display: flex; flex-direction: row;`}>
                  <span css={css`margin-left: auto;`}><PageSelector numPages={numPages} currentPage={currentPage} /></span>
                </div>
            </th>
            
          </tr>
        </thead>
        <tbody css={tableStyle("body")}>{renderVenueRows()}</tbody>
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
  const { address = "You" } = props;
  return (
    <ContentCard inverse>
      <ErrorBoundary>
        <CardBody>
          <CardHeader css={headerStyle}>
            <h1>Venues Near...</h1>
            <h3 css={css`color: #25A1B7;`}>{address}</h3>
          </CardHeader>
          <VenuesList {...props} />
        </CardBody>
      </ErrorBoundary>
    </ContentCard>
  );
}
export default List;
export { EventsList };
