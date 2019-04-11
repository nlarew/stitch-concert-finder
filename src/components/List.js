/** @jsx jsx */
import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { css, jsx } from "@emotion/core";
import ErrorBoundary from "react-error-boundary";
import { format } from 'date-fns';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  Collapse,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink
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

const EventsList = props => {
  const { events, currentEvent, setCurrentEvent } = props;
  const {
    currentItems: currentEvents,
    // currentPage,
    // getNextPage,
    // getPrevPage,
    // getPage,
    // metadata: { numPages },
    PageSelector,
  } = usePagination(events, { numItemsPerPage: 8 });
  // const [openEvents, setOpenEvents] = useState([]);
  const rowClickHandler = event => e => {
    console.log(event)
    if (currentEvent && currentEvent.id === event.id) {
      setCurrentEvent(null);
    } else {
      setCurrentEvent(event);
    }
  };
  const renderEventRows = () => {
    console.log("currentEvents", currentEvents);
    return (
      currentEvents &&
      currentEvents.map(event => (
        <tr
          key={event.id}
          css={tableStyle("row", {
            isCurrent: currentEvent && currentEvent.id === event.id
          })}
          onClick={rowClickHandler(event)}
        >
          <td>
            <span>{event.name}</span>
            <Collapse isOpen={currentEvent && currentEvent.id === event.id}>
              <Card inverse css={css`background-color: #1f2124 !important;`}>
                <CardBody>
                  <div css={css`display: flex; flex-direction: row; justify-content: space-between;`}>
                    <CardText css={css`line-height: 40px; margin-bottom: 0;`}>{format(new Date(event.time.start), "MMM DD")}</CardText>
                    <Button tag="a" href={event.url}>Eventful Page</Button>
                  </div>
                </CardBody>
              </Card>
            </Collapse>
          </td>
        </tr>
      ))
    );
  };
  return (
    <Table dark>
      <thead>
        <tr>
          <th css={css``}>
            <div css={css`display: flex; flex-direction: row;`}>
              <span css={css`margin-left: auto;`}><PageSelector /></span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody css={tableStyle("body")}>
        {renderEventRows()}
      </tbody>
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

  const PageSelector = (props) => {
    const { numPages, currentPage } = state
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
    getPage,
    PageSelector
  };
}

export const VenuesList = props => {
  const { venues, currentVenue, setCurrentVenue, title="Venues" } = props;
  const rowClickHandler = event => e => {
    setCurrentVenue(event);
  };
  const {
    currentItems: currentVenues,
    PageSelector,
  } = usePagination(venues, { numItemsPerPage: 9 });

  const renderVenueRows = () => {
    return (
      currentVenues &&
      currentVenues
        .filter(venue => venue.upcomingEvents.length > 0)
        .map(venue => {
          const isFavorite = venue.isFavorite;
          return (
            <tr
              css={tableStyle("row", {
                isCurrent: currentVenue && currentVenue.id === venue.id
              })}
              key={venue.id}
              onClick={rowClickHandler(venue)}
            >
              <td>{isFavorite && <StarIcon />}</td>
              <td>
                <div
                  css={css`
                    display: flex;
                    flex-direction: row;
                  `}
                >
                  <span>{venue.name}</span>
                  <span
                    css={css`
                      margin-left: auto;
                    `}
                  >
                    ({venue.upcomingEvents && venue.upcomingEvents.length}{" "}
                    shows)
                  </span>
                </div>
              </td>
            </tr>
          );
        })
    );
  };

  return (
    <>
      <Table dark hover css={css`
        table-layout: fixed;
      `}>
        <thead>
          <tr>
            <th css={css`width: 58px;`}><span css={css`white-space: nowrap;`}>{title}</span></th>
            <th css={css``}>
              <div css={css`display: flex; flex-direction: row;`}>
                  <span css={css`margin-left: auto;`}><PageSelector /></span>
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
            <h1>{props.venues.length} Venues Near...</h1>
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
