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
  } = data;
  const queryText = props.search[queryParam];

  const text = `${leftText} ${queryText} ${rightText}`;

  let parsedInlineStyle;
  try {
    parsedInlineStyle = JSON.parse(inlineStyle);
  } catch {
    parsedInlineStyle = {};
  }

  return (
    <div>
      {props.mode === 'edit' ? !queryText ? <p>Query param button</p> : '' : ''}
      {queryText ? (
        <button
          className={className}
          style={parsedInlineStyle}
          onClick={() => {
            if (page) {
              history.push(page);
            }
          }}
        >
          {text}
        </button>
      ) : (
        ''
      )}
    </div>
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
