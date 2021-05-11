/* REACT */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
/* SEMANTIC UI */
import { Menu } from 'semantic-ui-react';
/* HELPERS */
import cx from 'classnames';
import { isActive, getNavigationByParent, getBasePath } from '~/helpers';
import { deleteQueryParam, setQueryParam } from 'volto-datablocks/actions';
import qs from 'querystring';

const View = ({ content, ...props }) => {
  const history = useHistory();
  const { data } = props;
  const [navigationItems, setNavigationItems] = useState([]);
  const [pages, setPages] = useState([]);
  const parent = data.parent?.value;

  useEffect(() => {
    const pagesProperties = data.pages?.value
      ? JSON.parse(data.pages?.value)?.properties || {}
      : {};
    const newPages =
      Object.keys(pagesProperties).map((page) => pagesProperties[page]) || [];
    setPages(newPages);
    setNavigationItems([...(props.navigation?.items || []), ...newPages]);
  }, [props.navigation, data.pages?.value]);

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

          return (
            <Menu.Item
              className={cx(
                index > 0 ? 'sibling-on-left' : '',
                index < navigationItems.length - 1 ? 'sibling-on-right' : '',
              )}
              key={url}
              active={isActive(url, props.path)}
              onClick={() => {
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
                history.push(`${url}?${qs.stringify(props.query)}`);
              }}
            >
              {name}
            </Menu.Item>
          );
        })}
      </Menu>
    </div>
  ) : props.mode === 'edit' ? (
    <p>
      There are no pages inside of selected page. Make sure you add pages or
      delete the block
    </p>
  ) : (
    ''
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: qs.parse(state.router.location.search.replace('?', '')),
      discodata_query: state.discodata_query,
      navItems: state.navigation.items,
      navigation: getNavigationByParent(
        state.navigation.items,
        props.data?.parent?.value,
      ),
    }),
    { deleteQueryParam, setQueryParam },
  ),
)(View);
