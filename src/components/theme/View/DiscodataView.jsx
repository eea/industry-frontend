/* REACT IMPORTS */
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import qs from 'query-string';
/* ROOT IMPORTS */
import DefaultViewNoHeading from './DefaultViewNoHeading';
/* LOCAL IMPORTS */
import { getDiscodataResource, setQueryParam } from 'volto-datablocks/actions';
import { Dimmer, Loader } from 'semantic-ui-react';
/* =================================================== */
const DiscodataView = (props) => {
  const [state, setState] = useState({
    mounted: false,
  });
  const history = useHistory();
  const { search, deletedQueryParams } = props.discodata_query;
  const parsedQuery = { ...(qs.parse(props.query) || {}) };
  // useEffect(() => {
  //   /* Add query to discodata_query on mount */
  // let updatedSearch = false;
  // let newSearch = { ...search };
  // Object.entries(parsedQuery).forEach(([key, value]) => {
  //   if (!search[key] || search[key] !== value) {
  //     newSearch[key] = value;
  //     if (!updatedSearch) updatedSearch = true;
  //   }
  // });
  // if (updatedSearch) props.setQueryParam({ queryParam: newSearch });
  //   setState({
  //     ...state,
  //     mounted: true,
  //   });
  //   /* eslint-disable-next-line */
  // }, [])

  // useEffect(() => {
  //   if (state.mounted && props.content.layout === 'discodata_view') {
  //     const newQuery = { ...parsedQuery };
  //     Object.entries(deletedQueryParams).forEach(([key, value]) => {
  //       if (newQuery[key]) delete newQuery[key];
  //     });
  //     Object.entries(search).forEach(([key, value], index) => {
  //       if (newQuery[key] !== value) {
  //         newQuery[key] = value;
  //       }
  //     });
  //     if (qs.stringify(parsedQuery) !== `${qs.stringify(newQuery)}`) {
  //       history.push({
  //         search: `?${qs.stringify(newQuery)}`,
  //       });
  //     }
  //   }
  //   /* eslint-disable-next-line */
  // }, [props.query])
  return (
    <div id="discodata-mosaic-view">
      <Dimmer active={props.discodata_resources.loading}>
        <Loader />
      </Dimmer>
      <DefaultViewNoHeading {...props} />
    </div>
  );
};

export default connect(
  (state, props) => ({
    query: state.router.location.search,
    location: state.router.location,
    discodata_query: state.discodata_query,
    discodata_resources: state.discodata_resources,
    content:
      state.prefetch?.[state.router.location.pathname] || state.content.data,
  }),
  { getDiscodataResource, setQueryParam },
)(DiscodataView);
