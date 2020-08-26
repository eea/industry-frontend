import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Tab, Menu } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { setActiveTab } from '@eeacms/volto-tabs-block/actions';
import { blocks, settings } from '~/config';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { getBlocksFieldname, getBaseUrl } from '@plone/volto/helpers';
import { isEqual } from '@eeacms/volto-tabs-block/Tabs/utils';
import { arrayToTree } from 'performant-array-to-tree';
import '@eeacms/volto-tabs-block/Tabs/public.less';

import { isObject, isArray } from 'lodash';

import qs from 'query-string';
import { getNavigationByParent } from 'volto-tabsview/helpers';
import {
  getDiscodataResource,
  setQueryParam,
  deleteQueryParam,
} from 'volto-datablocks/actions';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

const flattenArray = (array, depth = 0) => {
  let flattenedArray = [];
  array.forEach((item) => {
    if (item.children?.length > 0) {
      flattenedArray.push({ ...item, depth });
      flattenedArray = [
        ...flattenedArray,
        ...flattenArray(item.children, depth + 1),
      ];
    } else {
      flattenedArray.push({ ...item, depth });
    }
  });
  return flattenedArray;
};

const hasChildActive = (tabs, tab, activeTabIndex) => {
  const activeTab = tabs[activeTabIndex];
  if (activeTab?.parentTitle === tab?.title) return true;
  if (tab.children) {
    let active = false;
    tab.children.forEach((child) => {
      active = hasChildActive(tabs, child, activeTabIndex);
    });
    return active;
  }
  return false;
};

const isHidden = (tabs, tab, activeTabIndex) => {
  if (!hasChildActive(tabs, tab, activeTabIndex)) {
    const activeTab = tabs[activeTabIndex];
    if (tab.title === activeTab?.title) return false;
    if (tab.parentTitle === activeTab?.title) return false;
    if (tab.depth > 0) return true;
    return false;
  }
  return false;
};

const _flattenArray = (array, prevItem = {}, depth = 0) => {
  let flattenedArray = [];
  if (!array) return flattenedArray;
  array.forEach((item) => {
    if (item.items?.length > 0) {
      flattenedArray.push({ ...item, parent: prevItem.url || null, depth });
      flattenedArray = [
        ...flattenedArray,
        ..._flattenArray(item.items, item, depth + 1),
      ];
    } else {
      flattenedArray.push({ ...item, parent: prevItem.url || null, depth });
    }
  });
  return flattenedArray;
};

const _hasChildActive = (tabs, tab, pathname) => {
  const activeChildTab = tabs.filter(
    (child) => child.parent === tab.url && child.url === pathname,
  )[0];
  if (!activeChildTab) return false;
  return true;
};

const _hasParentActive = (tabs, tab, pathname) => {
  if (!tab.parent) return -1;
  const parentTab = tabs.filter((parentTab) => parentTab.url === tab.parent)[0];
  if (parentTab && pathname === parentTab.url) return 1;
  return 0;
};

const _isHidden = (tabs, tab, pathname) => {
  if (!_hasChildActive(tabs, tab, pathname)) {
    if (tab.url === pathname) return false;
    if (_hasParentActive(tabs, tab, pathname) === 1) return false;
    if (tab.depth > 0) return true;
    return false;
  }
  return false;
};

const View = ({
  id,
  onTabChange,
  data,
  mode = 'view',
  properties,
  intl,
  location,
  navigation,
  ...rest
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const pathKey = useSelector((state) => state.router.location.key);
  const tabsState = useSelector((state) => state.tabs_block[pathKey] || {});
  const mounted = React.useRef();
  const saved_blocks_layout = React.useRef([]);
  const blocks_layout = properties.blocks_layout?.items;
  const pathname = location.pathname.replace(/\/$/, '');
  const [navTabs, setNavTabs] = useState(_flattenArray(navigation.items));
  const { useNavigation = false, tabsLayout = [] } = data;
  const globalActiveTab = tabsState[id] || 0;
  const tabs = data.tabs
    ? [
        ...data.tabs.map((tab, index) => ({
          ...tab,
          index,
          id: tab.title,
          parentId:
            tab.parentTitle !== tab.title ? tab.parentTitle || null : null,
        })),
      ]
    : [];
  const orderedTabs = flattenArray(arrayToTree(tabs, { dataField: null }));
  // We have the following "racing" condition:
  // The tabsblockview is mounted sometime before the GET_CONTENT_SUCCESS
  // action is triggered, so even if we "fix" the display,
  // the global state.data.blocks_layout will be overwritten with the "wrong"
  // content. So we need to watch if the blocks_layout is rewritten, to trigger
  // the tab change again
  React.useEffect(() => {
    if (!mounted.current && mode === 'view') {
      const newTabsState = {};
      Object.keys(tabsState).forEach((blockid) => {
        newTabsState[blockid] = 0;
      });
      dispatch(setActiveTab(id, 0, mode, newTabsState, pathKey));
      mounted.current = true;
    }
    if (
      mode === 'view' &&
      !isEqual(blocks_layout, saved_blocks_layout.current)
    ) {
      const newTabsState = {};
      saved_blocks_layout.current = blocks_layout;
      Object.keys(tabsState).forEach((blockid) => {
        newTabsState[blockid] = 0;
      });
      dispatch(setActiveTab(id, 0, mode, newTabsState, pathKey));
    }
  }, [dispatch, id, mode, tabsState, blocks_layout, pathKey]);

  React.useEffect(() => {
    setNavTabs(_flattenArray(navigation.items));
  }, [navigation]);

  const blocksFieldname = getBlocksFieldname(properties);

  const renderTab = React.useCallback(
    (tab, index = 0) => {
      const blockIds = tabsLayout[index] || [];
      return (
        <Tab.Pane>
          {blockIds.map((block) => {
            const Block =
              blocks.blocksConfig[
                properties[blocksFieldname]?.[block]?.['@type']
              ]?.['view'] || null;
            return Block !== null ? (
              <>
                <Block
                  key={block}
                  id={block}
                  properties={properties}
                  data={properties[blocksFieldname][block]}
                  path={getBaseUrl(location?.pathname || '')}
                />
              </>
            ) : (
              <div key={block}>
                {intl.formatMessage(messages.unknownBlock, {
                  block: properties[blocksFieldname]?.[block]?.['@type'],
                })}
              </div>
            );
          })}
        </Tab.Pane>
      );
    },
    [tabsLayout, blocksFieldname, intl, location?.pathname, properties], // TODO: fill in the rest of the array
  );

  const menu = { pointing: true };
  const grid = { paneWidth: 9, tabWidth: 3, stackable: true };
  const position = data?.position || 'top';
  if (mode === 'edit') {
    menu.attached = false;
    menu.tabular = false;
  } else {
    switch (position) {
      case 'top':
        break;
      case 'bottom':
        menu.attached = 'bottom';
        break;
      case 'left':
        menu.fluid = true;
        menu.vertical = true;
        menu.tabular = true;
        break;
      case 'right':
        menu.fluid = true;
        menu.vertical = true;
        menu.tabular = 'right';
        break;
      default:
    }
  }
  if (!useNavigation) {
    return (
      <div className={cx('tabsblock', data.css_class)}>
        <div className={`ui container ${mode}`}>
          {tabs.length ? (
            <Tab
              grid={grid}
              menu={menu}
              onTabChange={(event, { activeIndex }) => {
                dispatch(
                  setActiveTab(id, activeIndex, mode, tabsState, pathKey),
                );
              }}
              activeIndex={globalActiveTab}
              panes={orderedTabs.map((child, index) => {
                const menuItemClassName = `${position} ${mode} ${
                  hasChildActive(orderedTabs, child, globalActiveTab)
                    ? 'active by-child'
                    : ''
                } ${
                  isHidden(orderedTabs, child, globalActiveTab) ? 'hidden' : ''
                } depth_${child.depth || 0}`;
                return {
                  render: () =>
                    mode === 'view' && renderTab(child, child.index),
                  menuItem: (
                    <Menu.Item
                      key={`menu-item-${child.index}-${child.title}`}
                      className={menuItemClassName}
                      active={globalActiveTab === index}
                      index={index}
                    >
                      {child.title}
                    </Menu.Item>
                  ),
                };
              })}
            />
          ) : (
            <>
              <hr className="block section" />
              {mode === 'view' ? renderTab(0, {}) : ''}
            </>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className={cx('tabsblock', data.css_class)}>
      <div className={`ui container ${mode}`}>
        {navTabs.length ? (
          <Tab
            grid={grid}
            menu={menu}
            onTabChange={(event, { activeIndex }) => {
              const item = navTabs[activeIndex];
              history.push(item.url === '' ? '/' : item.url);
              // dispatch(setActiveTab(id, activeIndex, mode, tabsState, pathKey));
            }}
            activeIndex={globalActiveTab}
            panes={navTabs.map((child, index) => {
              const menuItemClassName = `${position} ${mode} ${
                _isHidden(navTabs, child, pathname) ? 'hidden' : ''
              } depth_${child.depth || 0}`;
              return {
                render: () => mode === 'view' && renderTab(child),
                menuItem: (
                  <Menu.Item
                    as={NavLink}
                    to={child.url === '' ? '/' : child.url}
                    key={`menu-navlink-${index}-${child.title}`}
                    className={menuItemClassName}
                    active={child.url === pathname}
                  >
                    {child.title}
                  </Menu.Item>
                ),
              };
            })}
          />
        ) : (
          <>
            <hr className="block section" />
            {mode === 'view' ? renderTab({}) : ''}
          </>
        )}
      </div>
    </div>
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
        props.data?.parent,
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
