/* REACT */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
/* SEMANTIC UI */
import { Menu } from 'semantic-ui-react';
/* HELPERS */
import {
  isActive,
  getNavigationByParent,
  getBasePath,
} from 'volto-tabsview/helpers';

const View = ({ content, ...props }) => {
  const { data } = props;
  const [state, setState] = useState({
    activeItem: '',
  });
  const parent = data.parent?.value;
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
              name={name}
              key={url}
              active={state.activeItem === url}
              onClick={() => {
                history.push(`${url}${props.query}`);
              }}
            />
          );
        })}
      </Menu>
    </div>
  ) : (
    ''
  );
};

export default compose(
  connect((state, props) => ({
    query: state.router.location.search,
    content:
      state.prefetch?.[state.router.location.pathname] || state.content.data,
    pathname: state.router.location.pathname,
    navigation: getNavigationByParent(
      state.navigation.items,
      props.data?.parent?.value,
    ),
  })),
)(View);
