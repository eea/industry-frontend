/* REACT */
import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Iframe from 'react-iframe';
import qs from 'query-string';
import './style.css';

const View = ({ content, ...props }) => {
  const [discodataQuery, setDiscodataQuery] = useState({});
  const { data } = props;
  const { url = '', title = '', width = '100%', height = 'auto' } = data;
  const { hideToolbar = false, overflow = false, preset = null } = data;
  console.log(discodataQuery);
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
    try {
      new URL(url);
      const newUrl = getUrl(url);
      if (props.mode === 'edit' && url !== newUrl) {
        props.onChangeBlock(props.block, {
          ...props.data,
          url: newUrl,
        });
      }
    } catch {}

    /* eslint-disable-next-line */
  }, [url])

  const getUrl = (url) => {
    const newUrl = new URL(url);
    return newUrl.protocol + '//' + newUrl.host + newUrl.pathname;
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
      <Iframe
        title={title}
        url={applyQueryParameters(url, {
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
  );
};

export default compose(
  connect((state, props) => ({
    query: state.router.location.search,
    search: state.discodata_query.search,
  })),
)(View);
