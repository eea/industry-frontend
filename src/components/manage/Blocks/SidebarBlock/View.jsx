/* REACT */
import React, { useEffect, useState } from 'react';
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

import { setQueryParam, deleteQueryParam } from 'volto-datablocks/actions';

import { getFacilities, getInstallations, getLcps } from '~/helpers/api';

import './style.css';

const flattenArray = (array, prevItem = {}, depth = 0, maxDepth) => {
  let flattenedArray = [];
  if (!array) return flattenedArray;
  array.forEach((item) => {
    if (item.items?.length > 0) {
      flattenedArray.push({ ...item, parent: prevItem.url || null, depth });
      flattenedArray = [
        ...flattenedArray,
        ...(typeof maxDepth === 'number' && depth < maxDepth
          ? flattenArray(item.items, item, depth + 1, maxDepth)
          : typeof maxDepth !== 'number' && !maxDepth
          ? flattenArray(item.items, item, depth + 1, maxDepth)
          : []),
      ];
    } else {
      flattenedArray.push({ ...item, parent: prevItem.url || null, depth });
    }
  });
  return flattenedArray;
};

const hasAscendentActive = (tabs, tab, pathname) => {
  if (!tab.parent || pathname === tab.url) return -1;
  const parentTab = tabs.filter((parentTab) => parentTab.url === tab.parent)[0];
  if (parentTab && pathname === parentTab.url) {
    return 1;
  } else if (parentTab.parent) {
    return hasAscendentActive(tabs, parentTab, pathname);
  }
  return 0;
};

const hasDescendentActive = (tab, pathname) => {
  let ok = false;
  if (pathname === tab.url) return true;
  if (tab.items) {
    tab.items.forEach((item) => {
      if (hasDescendentActive(item, pathname) && !ok) {
        ok = true;
      }
    });
  }
  return ok;
};

const makeNewNavigation = (
  items,
  preset,
  collection,
  search,
  history,
  dispatch,
) => {
  if (
    ['facilities', 'installations', 'lcps'].includes(preset) &&
    !collection.length
  ) {
    return [];
  }
  if (preset === 'facilities') {
    return items?.map((item) => ({
      ...item,
      onClick: () => {
        dispatch(deleteQueryParam({ queryParam: ['facilityInspireId'] }));
        history.push(item.url);
      },
      items: item.items
        ? collection.map((facility) => ({
            title: facility.facilityInspireId,
            url: facility.facilityInspireId,
            presetItem: true,
            onClick: (pathname) => {
              if (facility.facilityInspireId !== search.facilityInspireId) {
                dispatch(
                  setQueryParam({
                    queryParam: {
                      facilityInspireId: facility.facilityInspireId,
                    },
                  }),
                );
              }
              if (pathname !== item.items[0].url) {
                history.push(item.items[0].url);
              }
            },
            active: (pathname) => {
              return (
                search.facilityInspireId === facility.facilityInspireId &&
                pathname.includes(item.url)
              );
            },
            items: [
              ...item.items?.map((child) => ({
                ...child,
                redirect: (pathname) => {
                  // if (
                  //   search.facilityInspireId !== facility.facilityInspireId &&
                  //   pathname === child.url
                  // ) {
                  //   history.push(item.url);
                  // }
                },
                active: (pathname) => {
                  return (
                    search.facilityInspireId === facility.facilityInspireId &&
                    pathname.includes(child.url)
                  );
                },
                onClick: (pathname) => {
                  if (facility.facilityInspireId !== search.facilityInspireId) {
                    dispatch(
                      setQueryParam({
                        queryParam: {
                          facilityInspireId: facility.facilityInspireId,
                        },
                      }),
                    );
                  }
                  if (pathname !== child.url) {
                    history.push(child.url);
                  }
                },
              })),
            ],
          }))
        : [],
    }));
  } else if (preset === 'installations') {
    return items?.map((item) => ({
      ...item,
      onClick: () => {
        dispatch(
          deleteQueryParam({
            queryParam: ['facilityInspireId', 'installationInspireId'],
          }),
        );
        history.push(item.url);
      },
      items: item.items
        ? collection.map((facility) => ({
            title: facility.facilityInspireId,
            url: facility.facilityInspireId,
            presetItem: true,
            onClick: (pathname) => {
              if (facility.facilityInspireId !== search.facilityInspireId) {
                dispatch(
                  setQueryParam({
                    queryParam: {
                      facilityInspireId: facility.facilityInspireId,
                      installationInspireId: facility.installations[0],
                    },
                  }),
                );
              }
              if (pathname !== item.items[0].url) {
                history.push(item.items[0].url);
              }
            },
            active: (pathname) => {
              return (
                search.facilityInspireId === facility.facilityInspireId &&
                pathname.includes(item.url)
              );
            },
            items: [
              ...(facility.installations?.map((installation) => ({
                title: installation,
                url: installation,
                presetItem: true,
                onClick: (pathname) => {
                  if (
                    installation !== search.installationInspireId ||
                    facility.facilityInspireId !== search.facilityInspireId
                  ) {
                    dispatch(
                      setQueryParam({
                        queryParam: {
                          facilityInspireId: facility.facilityInspireId,
                          installationInspireId: installation,
                        },
                      }),
                    );
                  }
                  if (pathname !== item.items[0].url) {
                    history.push(item.items[0].url);
                  }
                },
                active: (pathname) => {
                  return (
                    search.installationInspireId === installation &&
                    pathname.includes(item.url)
                  );
                },
                items: [
                  ...item.items.map((child) => ({
                    ...child,
                    redirect: (pathname) => {
                      // if (
                      //   search.facilityInspireId !== facility.facilityInspireId &&
                      //   pathname === child.url
                      // ) {
                      //   history.push(item.url);
                      // }
                    },
                    active: (pathname) => {
                      return (
                        search.facilityInspireId ===
                          facility.facilityInspireId &&
                        search.installationInspireId === installation &&
                        pathname.includes(child.url)
                      );
                    },
                    onClick: (pathname) => {
                      if (
                        facility.facilityInspireId !==
                          search.facilityInspireId ||
                        installation !== search.installationInspireId
                      ) {
                        dispatch(
                          setQueryParam({
                            queryParam: {
                              facilityInspireId: facility.facilityInspireId,
                              installationInspireId: installation,
                            },
                          }),
                        );
                      }
                      if (pathname !== child.url) {
                        history.push(child.url);
                      }
                    },
                  })),
                ],
              })) || []),
            ],
          }))
        : [],
    }));
  } else if (preset === 'lcps') {
    return collection.length
      ? collection?.map((facility) => ({
          title: facility.facilityInspireId,
          url: facility.facilityInspireId,
          presetItem: true,
          onClick: (pathname) => {
            if (facility.facilityInspireId !== search.facilityInspireId) {
              dispatch(
                setQueryParam({
                  queryParam: {
                    facilityInspireId: facility.facilityInspireId,
                    installationInspireId:
                      facility.installations[0].installationInspireId,
                    lcpInspireId: facility.installations[0].lcps[0],
                  },
                }),
              );
            }
            if (pathname !== items[0].url) {
              history.push(items[0].url);
            }
          },
          active: (pathname) => {
            return (
              search.facilityInspireId === facility.facilityInspireId
              // && pathname.includes(item.url)
            );
          },
          items: [
            ...(facility.installations?.map((installation) => ({
              title: installation.installationInspireId,
              url: installation.installationInspireId,
              presetItem: true,
              onClick: (pathname) => {
                if (
                  installation.installationInspireId !==
                    search.installationInspireId ||
                  facility.facilityInspireId !== search.facilityInspireId
                ) {
                  dispatch(
                    setQueryParam({
                      queryParam: {
                        facilityInspireId: facility.facilityInspireId,
                        installationInspireId:
                          installation.installationInspireId,
                        lcpInspireId: installation.lcps[0],
                      },
                    }),
                  );
                }
                if (pathname !== items[0].url) {
                  history.push(items[0].url);
                }
              },
              active: (pathname) => {
                return (
                  search.installationInspireId ===
                  installation.installationInspireId
                  // && pathname.includes(item.url)
                );
              },
              items: [
                ...(installation.lcps?.map((lcp) => ({
                  title: lcp,
                  url: lcp,
                  presetItem: true,
                  onClick: (pathname) => {
                    if (
                      lcp !== search.lcpInspireId ||
                      installation.installationInspireId !==
                        search.installationInspireId ||
                      facility.facilityInspireId !== search.facilityInspireId
                    ) {
                      dispatch(
                        setQueryParam({
                          queryParam: {
                            facilityInspireId: facility.facilityInspireId,
                            installationInspireId:
                              installation.installationInspireId,
                            lcpInspireId: lcp,
                          },
                        }),
                      );
                    }
                    if (pathname !== items[0].url) {
                      history.push(items[0].url);
                    }
                  },
                  active: (pathname) => {
                    return (
                      search.lcpInspireId === lcp
                      // && pathname.includes(item.url)
                    );
                  },
                  items: [
                    ...items.map((child) => ({
                      ...child,
                      redirect: (pathname) => {
                        // if (
                        //   search.facilityInspireId !== facility.facilityInspireId &&
                        //   pathname === child.url
                        // ) {
                        //   history.push(item.url);
                        // }
                      },
                      active: (pathname) => {
                        return (
                          search.facilityInspireId ===
                            facility.facilityInspireId &&
                          search.installationInspireId ===
                            installation.installationInspireId &&
                          search.lcpInspireId === lcp &&
                          pathname.includes(child.url)
                        );
                      },
                      onClick: (pathname) => {
                        if (
                          lcp !== search.lcpInspireId ||
                          installation.installationInspireId !==
                            search.installationInspireId ||
                          facility.facilityInspireId !==
                            search.facilityInspireId
                        ) {
                          dispatch(
                            setQueryParam({
                              queryParam: {
                                facilityInspireId: facility.facilityInspireId,
                                installationInspireId:
                                  installation.installationInspireId,
                                lcpInspireId: lcp,
                              },
                            }),
                          );
                        }
                        if (pathname !== child.url) {
                          history.push(child.url);
                        }
                      },
                    })),
                  ],
                })) || []),
              ],
            })) || []),
          ],
        }))
      : [];
  }
};

const View = ({ content, ...props }) => {
  const customPresets = {
    facilities: {
      get: getFacilities,
      key: 'facilities',
    },
    installations: {
      get: getInstallations,
      key: 'installations',
    },
    lcps: {
      get: getLcps,
      key: 'lcps',
    },
  };
  const history = useHistory();
  const { data } = props;
  const [collection, setCollection] = useState([]);
  const pathname = props.pathname;
  const preset = customPresets[data.preset?.value] || {};
  const parent = data.parent?.value;
  let navigation = [];

  const updateCollcetion = () => {
    const newCollection =
      props.discodata_resources.data[preset?.key]?.[
        props.search.siteInspireId
      ] || [];
    if (JSON.stringify(newCollection) !== JSON.stringify(collection)) {
      setCollection(newCollection);
    }
  };

  useEffect(() => {
    updateCollcetion();
    /* eslint-disable-next-line */
  }, [])

  useEffect(() => {
    if (preset.get && preset.key) {
      const key = `${preset.key}-${props.search.siteInspireId}`;
      if (
        !props.discodata_resources.data[preset.key]?.[
          props.search.siteInspireId
        ] &&
        !props.discodata_resources.pendingRequests[key]
      ) {
        preset.get(props.dispatch, props.search.siteInspireId);
      }
    }
    /* eslint-disable-next-line */
  }, [preset])

  useEffect(() => {
    updateCollcetion();
    /* eslint-disable-next-line */
  }, [props.discodata_resources.data[preset?.key]?.[props.search.siteInspireId]])

  if (props.navigation?.items?.length && parent) {
    if (preset.key && collection.length) {
      navigation = flattenArray(
        makeNewNavigation(
          props.navigation.items,
          preset.key,
          collection,
          props.search,
          history,
          props.dispatch,
        ),
      );
    } else if (preset.key && !collection.length) {
      navigation = flattenArray(props.navigation.items, {}, 0, 0);
    } else {
      navigation = flattenArray(props.navigation.items);
    }
  }

  useEffect(() => {
    for (let i = 0; i < navigation.length; i++) {
      if (navigation[i].redirect) {
        navigation[i].redirect(pathname);
        break;
      }
    }
    /* eslint-disable-next-line */
  }, [navigation])
  return navigation.length ? (
    <div className="sidebar-block">
      <Menu
        className={
          props.data.className?.value ? props.data.className.value : ''
        }
      >
        {navigation.map((item, index) => {
          const url = !item.presetItem ? getBasePath(item.url) : '';
          const name = item.title;
          // const active = pathname.includes(item.url);
          const active = pathname === item.url;
          const hasDescendents = hasDescendentActive(item, pathname);
          const hasAscendents =
            hasAscendentActive(navigation, item, pathname) === 1;
          const isHidden = false;
          // !active && item.depth > 0
          //   ? !hasAscendents && !hasDescendents
          //   : false;
          return (
            <Menu.Item
              className={`depth__${item.depth} ${isHidden ? 'hidden' : ''}`}
              name={name}
              key={item.presetItem ? `${name}` : `${index}-${url}`}
              active={item.active ? item.active(pathname) : active}
              onClick={() => {
                item.onClick ? item.onClick(pathname) : history.push(url);
              }}
            />
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
  connect((state, props) => ({
    query: state.router.location.search,
    content:
      state.prefetch?.[state.router.location.pathname] || state.content.data,
    pathname: state.router.location.pathname,
    search: state.discodata_query.search,
    discodata_resources: state.discodata_resources,
    navigation: getNavigationByParent(
      state.navigation.items,
      props.data?.parent?.value,
    ),
  })),
)(View);
