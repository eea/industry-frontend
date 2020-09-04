/* REACT */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

function isColor(strColor) {
  return /^#[0-9A-F]{6}$/i.test(strColor);
}

const components = {
  h1: (text, color, tooltip = false, tooltipText = '') => (
    <h1
      className="query-param-text"
      data-tip={tooltip && tooltipText ? tooltipText : false}
      style={{ color: color }}
    >
      {text}
    </h1>
  ),
  h2: (text, color) => (
    <h2 className="query-param-text" style={{ color: color }}>
      {text}
    </h2>
  ),
  h3: (text, color) => (
    <h3 className="query-param-text" style={{ color: color }}>
      {text}
    </h3>
  ),
  p: (text, color) => (
    <p className="query-param-text" style={{ color: color }}>
      {text}
    </p>
  ),
};

const View = ({ content, ...props }) => {
  const [discodataValues, setDiscodataValues] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { data } = props;
  const { resources = [], subResources = [] } = data;
  const {
    visible = 'always',
    component = 'h1',
    leftText = '',
    rightText = '',
    color = '#000',
    order = 'dq',
  } = data;
  const {
    isLink = false,
    internalLink = false,
    linkTarget = '_blank',
    link = '/',
    triggerOn = '_all',
  } = data;
  const { tooltip = false, tooltipText = '' } = data;

  const updateDiscodataValues = (mounted) => {
    if (props.discodata_resources && props.search && mounted) {
      let newDiscodataValues = [];
      const selectedSubResources = subResources.map((subResource) => {
        const keyValue = subResource.package?.split('@') || [null, null];
        return {
          package: keyValue[0],
          query: keyValue[1],
        };
      });
      selectedSubResources.forEach((subResource) => {
        const discodataPackage = resources.filter(
          (resource) => resource.package === subResource.package,
        )[0];
        if (props.search[discodataPackage.queryParameter]) {
          newDiscodataValues.push(
            props.discodata_resources[discodataPackage.package]?.[
              props.search[discodataPackage.queryParameter]
            ]?.[subResource.query],
          );
        }
      });
      setDiscodataValues(newDiscodataValues);
    }
  };

  useEffect(() => {
    setMounted(true);
    updateDiscodataValues(true);
    /* eslint-disable-next-line */
  }, []);

  useEffect(() => {
    updateDiscodataValues(mounted);
    /* eslint-disable-next-line */
  }, [props.search, props.discodata_resources])

  const queryParametersText = props.data.queryParameters
    .map((value) => {
      return props.search[value.queryParameter];
    })
    .filter((value) => value)
    .join(' ');

  const discodataText = discodataValues.join(' ');

  const text = `${leftText} ${
    order === 'dq'
      ? `${discodataText} ${queryParametersText}`
      : `${queryParametersText} ${discodataText}`
  } ${rightText}`;

  const hasText = leftText || discodataText || queryParametersText || rightText;

  const textMayRender =
    (visible === 'always' && hasText) ||
    (visible === 'hasQuery' && queryParametersText) ||
    (visible === 'hasDiscodata' && discodataText);

  return (
    <>
      {props.mode === 'edit' ? (
        !textMayRender ? (
          <p>Query param text</p>
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {textMayRender && components[component]
        ? components[component](
            text,
            isColor(color) ? color : '#000',
            tooltip,
            tooltipText,
          )
        : ''}
      <ReactTooltip />
    </>
  );
};

export default compose(
  connect((state, props) => ({
    query: state.router.location.search,
    search: state.discodata_query.search,
    discodata_resources: state.discodata_resources.data,
  })),
)(View);
