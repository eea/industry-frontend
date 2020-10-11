/* REACT */
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Iframe from 'react-iframe';
import qs from 'query-string';
import cx from 'classnames';
import './style.css';

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

const View = ({ content, ...props }) => {
  const [discodataQuery, setDiscodataQuery] = useState({});
  const [requiredQueries, setRequiredQueries] = useState([]);
  const [flags, setFlags] = useState({});
  const [windowWidth, windowHeight] = useWindowSize();
  const breakPoints = {
    desktop: [Infinity, 992],
    tablet: [991, 768],
    mobile: [767, 0],
  };
  const { data } = props;
  const {
    desktopUrl = '',
    tabletUrl = '',
    mobileUrl = '',
    iframeId = null,
    title = '',
    titleClassName = '',
    description = '',
    descriptionClassName = '',
    width = '100%',
    height = 'auto',
  } = data;
  const { hideToolbar = false, overflow = false, preset = null } = data;
  const url = {
    desktop: desktopUrl,
    tablet: tabletUrl || desktopUrl,
    mobile: mobileUrl || tabletUrl || desktopUrl,
  };

  useEffect(() => {
    if (props.data.queryParameters?.value) {
      try {
        const newDiscodataQuery = {};
        const properties = JSON.parse(props.data.queryParameters?.value)
          .properties;
        properties &&
          Object.entries(properties).forEach(([key, value]) => {
            if (props.search[value.queryParam]) {
              newDiscodataQuery[key] = props.search[value.queryParam] || '';
            }
          });
        if (
          JSON.stringify(Object.keys(properties)) !==
          JSON.stringify(requiredQueries)
        ) {
          setRequiredQueries(Object.keys(properties));
        }
        if (
          JSON.stringify(newDiscodataQuery) !== JSON.stringify(discodataQuery)
        ) {
          setDiscodataQuery(newDiscodataQuery);
        }
      } catch {
        setDiscodataQuery({});
      }
    }
    /* eslint-disable-next-line */
  }, [props.data.queryParameters, props.search])

  useEffect(() => {
    if (props.data.flags?.value) {
      try {
        const newFlags = {};
        const properties = JSON.parse(props.data.flags?.value).properties || {};
        Object.keys(properties).forEach((flag) => {
          const id = props.search[flag];
          if (
            id &&
            typeof props.flags.items[properties[flag].packageName]?.[id]?.[
              properties[flag].flag
            ] !== 'undefined'
          ) {
            newFlags[properties[flag].flag] =
              props.flags.items[properties[flag].packageName][id][
                properties[flag].flag
              ];
          }
        });
        setFlags({ ...newFlags });
      } catch {
        setFlags({});
      }
    }
  }, [props.data.flags, props.flags, props.search]);

  const flagsState =
    Object.keys(flags).filter((flag) => !flags[flag]).length > 0;

  useEffect(() => {
    if (props.mode === 'edit') {
      props.onChangeBlock(props.block, {
        ...props.data,
        desktopUrl: parseUrl(desktopUrl),
        tabletUrl: parseUrl(tabletUrl),
        mobileUrl: parseUrl(mobileUrl),
      });
    }

    /* eslint-disable-next-line */
  }, [desktopUrl, tabletUrl, mobileUrl])

  const getUrl = (url) => {
    const newUrl = new URL(url);
    return newUrl.protocol + '//' + newUrl.host + newUrl.pathname;
  };

  const getUrlByWidth = () => {
    return url[
      Object.keys(breakPoints).filter(
        (breakPoint) =>
          breakPoints[breakPoint][0] >= windowWidth &&
          breakPoints[breakPoint][1] <= windowWidth,
      )[0]
    ];
  };

  const applyQueryParameters = (url, query) => {
    try {
      new URL(url);
      const queryParameters = {
        ...query,
        ':toolbar': hideToolbar ? 'n' : 'y',
        ':embed': 'y',
      };
      return `${getUrl(url)}?${qs.stringify(queryParameters)}`;
    } catch {
      return '';
    }
  };

  const parseUrl = (url) => {
    try {
      new URL(url);
      const newUrl = getUrl(url);
      if (url !== newUrl) {
        return newUrl;
      }
      return url;
    } catch {
      return '';
    }
  };

  const getPresetQueries = () => {
    if (preset === 'site_tableau') {
      return {
        reportingYear: '2017,2018,2019',
      };
    }
    return {};
  };

  return (
    <div>
      {!flagsState &&
      requiredQueries.length ===
        requiredQueries.filter((query) => discodataQuery[query]).length ? (
        <div id={iframeId}>
          {title ? <h2 className={cx(titleClassName)}>{title}</h2> : ''}
          {description ? (
            <p className={cx(descriptionClassName)}>{description}</p>
          ) : (
            ''
          )}
          <Iframe
            title={title}
            url={applyQueryParameters(getUrlByWidth(), {
              ...discodataQuery,
              ...getPresetQueries(),
            })}
            width={width}
            height={height}
            className="embeded-iframe"
            display="initial"
            position="relative"
            overflow={overflow ? 'visible' : 'hidden'}
            scrolling={false}
          />
        </div>
      ) : (
        ''
      )}
      {props.mode === 'edit' && flagsState ? (
        <p className="mb-0-super">Tableau edit mode</p>
      ) : (
        ''
      )}
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    query: state.router.location.search,
    search: state.discodata_query.search,
    flags: state.flags,
  })),
)(View);
