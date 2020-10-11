/* REACT */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
/* SEMANTIC UI */
import { Menu } from 'semantic-ui-react';
/* HELPERS */
import cx from 'classnames';
import {
  isActive,
  getNavigationByParent,
  getBasePath,
} from 'volto-tabsview/helpers';
import { deleteQueryParam } from 'volto-datablocks/actions';
import { useEffect } from 'react';

const View = ({ content, ...props }) => {
  const { data } = props;
  const [state, setState] = useState({
    activeItem: '',
  });
  const [navigationItems, setNavigationItems] = useState([]);
  const [pages, setPages] = useState([]);
  const parent = data.parent?.value;
  const history = useHistory();

  useEffect(() => {
    const pagesProperties = data.pages?.value
      ? JSON.parse(data.pages?.value)?.properties || {}
      : {};
    const newPages =
      Object.keys(pagesProperties).map((page) => pagesProperties[page]) || [];
    setPages(newPages);
    setNavigationItems([...(props.navigation?.items || []), ...newPages]);
  }, [data.pages?.value]);

  return (props.navigation?.items?.length && parent) || pages.length ? (
    <div className="tabs-view-menu">
      <Menu
        widths={
          navigationItems.length ||
          props.navigation?.items?.length ||
          pages.length
        }
        className={
          props.data.className?.value ? props.data.className.value : ''
        }
      >
        {navigationItems.map((item, index) => {
          const url = getBasePath(item.url);
          const name = item.title;
          if (
            props.navigation?.items?.filter(
              (navItem) => navItem.title === item.title,
            ).length
          ) {
            if (isActive(url, props.pathname) && url !== state.activeItem) {
              setState({
                ...state,
                activeItem: url,
              });
            } else if (
              !isActive(url, props.pathname) &&
              url === state.activeItem
            ) {
              setState({
                ...state,
                activeItem: '',
              });
            }
          }
          if (
            props.discodata_query.search.siteInspireId &&
            props.flags.items.sites?.[
              props.discodata_query.search.siteInspireId
            ] &&
            item.title === 'Regulatory information' &&
            !props.flags.items.sites?.[
              props.discodata_query.search.siteInspireId
            ]?.has_installations
          ) {
            return '';
          }
          if (
            props.discodata_query.search.siteInspireId &&
            props.flags.items.sites?.[
              props.discodata_query.search.siteInspireId
            ] &&
            item.title === 'Large-scale fuel combustion' &&
            !props.flags.items.sites?.[
              props.discodata_query.search.siteInspireId
            ]?.has_lcps
          ) {
            return '';
          }

          return (
            <Menu.Item
              className={cx(
                index > 0 ? 'sibling-on-left' : '',
                index < navigationItems.length - 1 ? 'sibling-on-right' : '',
              )}
              name={name}
              key={url}
              active={
                state.activeItem
                  ? state.activeItem === url
                  : !url
                  ? isActive(url, props.pathname)
                  : false
              }
              onClick={() => {
                history.push(`${url}${props.query}`);
                if (
                  props.discodata_query.search.facilityInspireId ||
                  props.discodata_query.search.installationInspireId ||
                  props.discodata_query.search.lcpInspireId
                ) {
                  props.deleteQueryParam({
                    queryParam: [
                      'facilityInspireId',
                      'installationInspireId',
                      'lcpInspireId',
                    ],
                  });
                }
              }}
            />
          );
        })}
      </Menu>
    </div>
  ) : (
    <p>
      There are no pages inside of selected page. Make sure you add pages or
      delete the block
    </p>
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: state.router.location.search,
      content:
        state.prefetch?.[state.router.location.pathname] || state.content.data,
      pathname: state.router.location.pathname,
      discodata_query: state.discodata_query,
      flags: state.flags,
      navigation: getNavigationByParent(
        state.navigation.items,
        props.data?.parent?.value,
      ),
    }),
    { deleteQueryParam },
  ),
)(View);
