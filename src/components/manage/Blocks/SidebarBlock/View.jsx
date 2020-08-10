/* REACT */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import qs from 'query-string';
/* ROOT */
import { settings } from '~/config';
/* HELPERS */
import { getNavigationByParent } from 'volto-tabsview/helpers';
import {
  getDiscodataResource,
  setQueryParam,
  deleteQueryParam,
} from 'volto-datablocks/actions';
import DiscodataSqlBuilderView from 'volto-datablocks/DiscodataSqlBuilder/View';

import './style.css';
const sidebarRef = React.createRef();
const View = ({ content, ...props }) => {
  const [state, setState] = useState({
    sidebar: [],
    sidebarOpened: true,
    selectedResource: {},
  });
  const { query } = props;
  const { search } = props.discodata_query;
  const { data } = props.discodata_resources;
  const history = useHistory();
  const globalQuery = { ...query, ...search };
  const resourcePackageKey = props.data.resource_package_key?.value;
  const key = props.data.key?.value;
  const source = props.data.source?.value;
  const multiply = props.data.multiply?.value;
  const depthOfMultiplication = props.data.depth_of_multiplication?.value;
  const queryParam = props.data.query_parameter?.value;
  const activeItem = globalQuery?.[queryParam] || '';
  const queryParameters = props.data?.query_parameters?.value
    ? JSON.parse(props.data.query_parameters.value).properties
    : {};

  useEffect(() => {
    if (
      multiply &&
      resourcePackageKey &&
      key &&
      source &&
      data[resourcePackageKey]?.[globalQuery[key]]?.[source] &&
      props.navigation
    ) {
      const selectedResource =
        data[resourcePackageKey][globalQuery[key]][source];
      setState({ ...state, selectedResource });
    }
    /* eslint-disable-next-line */
  }, [resourcePackageKey, key, source, multiply, props.discodata_resources, props.navigation, activeItem])

  useEffect(() => {
    const sidebar = [...getSidebar(props.navigation, 1)];
    setState({ ...state, sidebar });
    /* eslint-disable-next-line */
  }, [state.selectedResource, search])

  const getSidebar = (item, depth) => {
    const sidebar = [];
    if (multiply && depth === parseInt(depthOfMultiplication)) {
      Object.entries(state.selectedResource).forEach(([key, source]) => {
        sidebar.push(
          <button
            key={`${key}_button`}
            onClick={() => {
              const queries = {};
              Object.entries(queryParameters).forEach(([qKey, qValue]) => {
                if (Array.isArray(source)) {
                  source.forEach(item => {
                    if (!queries[qKey] && item[qValue.queryParam]) {
                      queries[qKey] = item[qValue.queryParam];
                    } else if (
                      queries[qKey] &&
                      item[qValue.queryParam] &&
                      queries[qKey] !== item[qValue.queryParam]
                    ) {
                      if (
                        typeof item[qValue.queryParam] === 'number' &&
                        !isNaN(item[qValue.queryParam]) &&
                        item[qValue.queryParam] > queries[qKey]
                      ) {
                        queries[qKey] = item[qValue.queryParam];
                      }
                    }
                  });
                } else if (source && Object.keys(source).length > 0) {
                  queries[qKey] = source[qValue.queryParam];
                }
              });
              if (key !== activeItem) {
                props.setQueryParam({
                  queryParam: queries,
                });
              } else {
                props.deleteQueryParam({
                  queryParam: Object.keys(queryParameters),
                });
              }
              if (
                item.items?.length > 0 &&
                item.items[0].url !== props.location.pathname
              ) {
                history.push(
                  item.items[0].url === '' ? '/' : item.items[0].url,
                );
              }
            }}
            className={
              activeItem === key
                ? `tabs__item_active depth__${depth}`
                : `tabs__item depth__${depth}`
            }
          >
            {key}
          </button>,
        );
        item?.items?.length &&
          item.items.forEach(nextItem => {
            sidebar.push(
              <NavLink
                to={nextItem.url === '' ? '/' : nextItem.url}
                exact={
                  settings.isMultilingual
                    ? nextItem.url === `/${props.lang}}`
                    : nextItem.url === ''
                }
                key={`${key}_${nextItem.url}`}
                className={
                  activeItem === key
                    ? `tabs__item show depth__${depth + 1}`
                    : `tabs__item hidden depth__${depth + 1}`
                }
                activeClassName="tabs__item_active"
              >
                {nextItem.title}
              </NavLink>,
            );
            sidebar.push(...getSidebar(nextItem, depth + 2));
          });
      });
    } else {
      item?.items?.length &&
        item.items.forEach(nextItem => {
          sidebar.push(
            <NavLink
              onClick={() => {
                let deleteQueries = false;
                Object.keys(queryParameters).forEach(key => {
                  if (globalQuery[key] && !deleteQueries) deleteQueries = true;
                });
                if (multiply && deleteQueries) {
                  props.deleteQueryParam({
                    queryParam: Object.keys(queryParameters),
                  });
                }
              }}
              to={nextItem.url === '' ? `/}` : nextItem.url}
              exact={
                settings.isMultilingual
                  ? nextItem.url === `/${props.lang}}`
                  : nextItem.url === ''
              }
              key={nextItem.url}
              className={`tabs__item depth__${depth}`}
              activeClassName="tabs__item_active"
            >
              {nextItem.title}
            </NavLink>,
          );
          sidebar.push(...getSidebar(nextItem, depth + 1));
        });
    }
    return sidebar;
  };

  return (
    <DiscodataSqlBuilderView {...props}>
      <div className="sidebar-block-container">
        <div
          ref={sidebarRef}
          className={`sidebar ${
            state.sidebarOpened === true ? 'show' : 'hidden'
          }`}
        >
          <nav className="tabs">{state?.sidebar?.map(item => item)}</nav>
        </div>
      </div>
    </DiscodataSqlBuilderView>
  );
};

export default compose(
  connect(
    (state, props) => ({
      location: state.router.location,
      content:
        state.prefetch?.[state.router.location.pathname] || state.content.data,
      lang: state.intl.locale,
      navigation: getNavigationByParent(
        state.navigation.items,
        props.data?.parent?.value,
      ),
      discodata_resources: state.discodata_resources,
      discodata_query: state.discodata_query,
    }),
    {
      getDiscodataResource,
      setQueryParam,
      deleteQueryParam,
    },
  ),
)(View);
