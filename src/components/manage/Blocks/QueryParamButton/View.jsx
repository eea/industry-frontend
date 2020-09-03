/* REACT */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

const View = ({ content, ...props }) => {
  const history = useHistory();
  const { data } = props;
  const {
    queryParam = '',
    leftText = '',
    rightText = '',
    className = '',
    inlineStyle = '',
    page = '',
    link = '',
    linkTarget = '_self',
    use = '',
  } = data;
  const queryText = props.search[queryParam] || '';

  const text = `${leftText} ${queryText} ${rightText}`;

  const hasText = leftText || queryText || rightText;

  let parsedInlineStyle;
  try {
    parsedInlineStyle = JSON.parse(inlineStyle);
  } catch {
    parsedInlineStyle = {};
  }

  return (
    <>
      {props.mode === 'edit' && !hasText ? <p>Query param button</p> : ''}
      {hasText ? (
        <button
          className={className}
          style={parsedInlineStyle}
          onClick={() => {
            if (use === 'page') {
              history.push(page);
            } else if (use === 'link') {
              try {
                new URL(link);
                const linkElement = document.createElement('a');
                linkElement.href = link;
                linkElement.target = linkTarget;
                linkElement.click();
              } catch {
                console.log('NOT URL');
              }
            }
          }}
        >
          {text}
        </button>
      ) : (
        ''
      )}
    </>
  );
};

export default compose(
  connect((state, props) => ({
    query: state.router.location.search,
    content:
      state.prefetch?.[state.router.location.pathname] || state.content.data,
    search: state.discodata_query.search,
  })),
)(View);
