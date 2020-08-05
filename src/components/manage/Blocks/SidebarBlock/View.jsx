/* REACT */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
/* ROOT */
import { settings } from '~/config';
/* HELPERS */
import { getNavigationByParent } from 'volto-tabsview/helpers';
import {
  getDiscodataResource,
  setDiscodataQuery,
} from 'volto-datablocks/actions';

import './style.css';
const sidebarRef = React.createRef();
let unlisten;
const View = ({ content, ...props }) => {
  const { data } = props;
  const [state, setState] = useState({
    sidebar: [],
    sidebarOpened: true,
  });
  const history = useHistory();
  const { search, key, resourceKey } = props.discodata_query.data;
  const parent = data.parent?.value;
  const activeItem = search?.[props.data.discodata_resource_property?.value];

  // useEffect(() => {
  //   unlisten = this.props.history.listen((location, action) => {
  //     if (action === 'PUSH') {
  //       const nextPathname = location.pathname.split('/');
  //       const prevPathname = props.location.pathname.split('/');
  //       // if (
  //       //   props.location.search &&
  //       //   props.location.search !== location.search &&
  //       //   (location.pathname.includes(props.location.pathname) ||
  //       //     nextPathname[1] === prevPathname[1])
  //       // ) {
  //       //   props.history.push(
  //       //     `${location.pathname}${this.props.location.search}`,
  //       //   );
  //       // }
  //     }
  //   });
  //   return () => {
  //     unlisten();
  //   };
  //   /* eslint-disable-next-line */
  // }, [])

  useEffect(() => {
    if (props.navigation) {
      const sidebar = [];
      sidebar.push(...getSidebar(props.navigation, 1));
      setState({
        ...state,
        sidebar,
      });
    }
    /* eslint-disable-next-line */
  }, [ props.data, props.navigation, props.discodata_resources, props.discodata_query?.search]);

  const getSidebar = (item, depth) => {
    const sidebar = [];
    if (depth === 2 && props.data?.multiply_second_level?.value === true) {
      const selectedDiscodataResource =
        props.discodata_resources.data?.[resourceKey]?.[search?.[key]] || null;
      const selectedDiscodataResourceProperty =
        selectedDiscodataResource?.[
          props.data.discodata_resource_property?.value
        ];
      selectedDiscodataResourceProperty &&
        item?.items?.length &&
        Object.entries(selectedDiscodataResourceProperty).forEach(
          ([key, value]) => {
            sidebar.push(
              <button
                key={`${key}_button`}
                onClick={() => {
                  props.setDiscodataQuery({
                    ...props.discodata_query,
                    search: {
                      ...search,
                      [props.data.discodata_resource_property?.value]:
                        search?.[
                          props.data.discodata_resource_property?.value
                        ] !== key
                          ? key
                          : props.pathname !== item.url
                          ? key
                          : '',
                    },
                  });
                  history.push(item.url === '' ? '/' : item.url);
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
          },
        );
    } else {
      item?.items?.length &&
        item.items.forEach(nextItem => {
          sidebar.push(
            <NavLink
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
    <div className="sidebar-block-container">
      {/* <button
        style={{
          display: 'block',
          position: 'absolute',
        }}
        onClick={() => {
          const event = new Event('sidebarToggle');
          sidebarRef.current.dispatchEvent(event);
          const sidebarOpened = !state.sidebarOpened;
          setState({ ...state, sidebarOpened });
        }}
      >
        Toggle sidebar
      </button> */}
      <div
        ref={sidebarRef}
        className={`sidebar ${
          state.sidebarOpened === true ? 'show' : 'hidden'
        }`}
      >
        {props.navigation?.items?.length && parent ? (
          <nav className="tabs">{state?.sidebar?.map(item => item)}</nav>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      router: state.router,
      query: state.router.location.search,
      location: state.router.location,
      content:
        state.prefetch?.[state.router.location.pathname] || state.content.data,
      pathname: state.router.location.pathname,
      lang: state.intl.locale,
      navigation: getNavigationByParent(
        state.navigation.items,
        props.data?.parent?.value,
      ),
      discodata_resources: state.discodata_resources,
      discodata_query: state.discodata_query,
    }),
    { getDiscodataResource, setDiscodataQuery },
  ),
)(View);
