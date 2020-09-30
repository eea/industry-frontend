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

const View = ({ content, ...props }) => {
  const { data } = props;
  const [state, setState] = useState({
    activeItem: '',
  });
  const parent = data.parent?.value;
  const preset = data.preset?.value;
  const history = useHistory();
  return props.navigation?.items?.length && parent ? (
    <div className="tabs-view-menu">
      <Menu
        widths={props.navigation.items.length}
        className={
          props.data.className?.value ? props.data.className.value : ''
        }
      >
        {props.navigation.items.map((item, index) => {
          const url = getBasePath(item.url);
          const name = item.title;
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
          return (
            <Menu.Item
              className={cx(
                index > 0 ? 'sibling-on-left' : '',
                index < props.navigation.items.length - 1
                  ? 'sibling-on-right'
                  : '',
              )}
              name={name}
              key={url}
              active={state.activeItem === url}
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
      navigation: getNavigationByParent(
        state.navigation.items,
        props.data?.parent?.value,
      ),
    }),
    { deleteQueryParam },
  ),
)(View);
