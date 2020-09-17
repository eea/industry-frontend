/* REACT */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { NavLink } from 'react-router-dom';

import infoSVG from '@plone/volto/icons/info.svg';

function isColor(strColor) {
  return /^#[0-9A-F]{6}$/i.test(strColor);
}

const components = {
  bold: (bold, text) => {
    if (bold) return <b>{text}</b>;
    return text;
  },
  h1: (text, bold, color, tooltip = false, tooltipText = '') => (
    <h1 className="query-param-text" style={{ color: color }}>
      {components.bold(bold, text)}
      {tooltip && tooltipText ? (
        <span data-tip={tooltip && tooltipText ? tooltipText : false}>
          <Icon name={infoSVG} size="20" color={color} />
        </span>
      ) : (
        ''
      )}
    </h1>
  ),
  h2: (text, bold, color) => (
    <h2 className="query-param-text" style={{ color: color }}>
      {components.bold(bold, text)}
    </h2>
  ),
  h3: (text, bold, color) => (
    <h3 className="query-param-text" style={{ color: color }}>
      {components.bold(bold, text)}
    </h3>
  ),
  p: (text, bold, color) => (
    <p className="query-param-text" style={{ color: color }}>
      {components.bold(bold, text)}
    </p>
  ),
  link: (text, internalLink, linkTarget, link, color) => {
    return internalLink ? (
      <NavLink
        as="a"
        target={linkTarget}
        to={link === '' ? '/' : link}
        key={link}
        style={{ color }}
      >
        {text}
      </NavLink>
    ) : (
      <a href={link} target={linkTarget}>
        {text}
      </a>
    );
  },
};

const View = ({ content, ...props }) => {
  const [discodataValues, setDiscodataValues] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { data } = props;
  const { resources = [], subResources = [], queryParameters = [] } = data;
  const {
    visible = 'always',
    component = 'h1',
    leftText = '',
    rightText = '',
    color = '#000',
    order = 'dq',
    bold = false,
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
        const discodataPackage =
          resources.filter(
            (resource) => resource.package === subResource.package,
          )[0] || {};
        if (props.search[discodataPackage?.queryParameter]) {
          newDiscodataValues.push(
            props.discodata_resources[discodataPackage?.package]?.[
              props.search[discodataPackage?.queryParameter]
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
  }, [props.search, props.discodata_resources, JSON.stringify(props.data)])

  const queryParametersText = queryParameters
    ? queryParameters
        .map((value) => {
          return props.search[value.queryParameter];
        })
        .filter((value) => value)
        .join(' ')
    : '';

  const discodataText = discodataValues.join(' ');

  const byOrder =
    order === 'dq'
      ? `${discodataText} ${queryParametersText}`
      : `${queryParametersText} ${discodataText}`;

  const text = `${leftText} ${byOrder} ${rightText}`;

  const hasText = leftText || discodataText || queryParametersText || rightText;

  const textMayRender =
    (visible === 'always' && hasText) ||
    (visible === 'hasQuery' && queryParametersText) ||
    (visible === 'hasDiscodata' && discodataText);

  const renderLinks = {
    _all: (
      <span>
        {components.link(
          `${leftText} ${byOrder} ${rightText}`,
          internalLink,
          linkTarget,
          link,
          color,
        )}
      </span>
    ),
    _query: (
      <span>
        {leftText}
        {order === 'dq' ? discodataText : ''}
        {components.link(
          `${queryParametersText}`,
          internalLink,
          linkTarget,
          link,
          color,
        )}
        {order === 'dq' ? '' : 'discodataText'}
        {rightText}
      </span>
    ),
    _discodata: (
      <span>
        {leftText} {order === 'qd' ? queryParametersText : ''}
        {components.link(
          `${discodataText}`,
          internalLink,
          linkTarget,
          link,
          color,
        )}
        {order === 'qd' ? '' : queryParametersText} {rightText}
      </span>
    ),
    _left: (
      <span>
        {components.link(`${leftText}`, internalLink, linkTarget, link, color)}{' '}
        {byOrder} {rightText}
      </span>
    ),
    _right: (
      <span>
        {leftText} {byOrder}{' '}
        {components.link(`${rightText}`, internalLink, linkTarget, link, color)}
      </span>
    ),
  };

  return (
    <>
      {props.mode === 'edit' ? (
        !textMayRender ? (
          <p>Discodata component text</p>
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {textMayRender && components[component]
        ? components[component](
            isLink ? renderLinks[triggerOn] : text,
            bold,
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
