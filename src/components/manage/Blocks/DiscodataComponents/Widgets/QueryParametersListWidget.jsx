import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import './style.css';

import { widgets } from '~/config';

import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

const QueryParametersListWidget = (props) => {
  const ObjectList = widgets.widget.object_list;
  const search = props.discodata_query.search || {};

  return (
    <div className="query-parameters-list-widget">
      <p>This are all query parameters available right now:</p>
      {search && Object.keys(search).length ? (
        <ul className="query-parameters-list">
          {Object.keys(search).map((key) => (
            <li key={key}>
              <button
                onClick={() => {
                  const queryParameters = props.value || [];
                  const index = queryParameters
                    .map((query) => query.queryParameter)
                    .indexOf(key);
                  if (index > -1) {
                    queryParameters.splice(index, 1);
                  } else {
                    queryParameters.push({ queryParameter: key });
                  }
                  props.onChange(props.id, queryParameters);
                }}
              >
                {key}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        ''
      )}
      {props.schema && ObjectList ? (
        <ObjectList
          schema={props.schema}
          title={props.schema.title}
          value={props.value}
          onChange={(event, value) => {
            props.onChange(props.id, value);
          }}
          onDelete={() => {}}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
    discodata_query: state.discodata_query,
  })),
)(QueryParametersListWidget);
