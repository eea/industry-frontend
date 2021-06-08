import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import RenderFields from '@eeacms/volto-datablocks/Utils/RenderFields';
import View from './View';
import config from '@plone/volto/registry';

const getSchema = (props) => {
  return {
    draggable: {
      type: 'boolean',
      title: 'Drraggable',
      defaultValue: false,
    },
    hasPopups: {
      type: 'boolean',
      title: 'Has popups',
      defaultValue: false,
    },
    hasSidebar: {
      type: 'boolean',
      title: 'Has sidebar',
      defaultValue: false,
    },
    hasRegionsFeatures: {
      type: 'boolean',
      title: 'Has regions features',
      defaultValue: false,
    },
    privacy: {
      type: 'array',
      title: 'Privacy',
      choices: [
        ['small', 'Small'],
        ['big', 'Big'],
      ],
    },
    filterSource: {
      type: 'array',
      title: 'Filter source',
      choices: [
        ['eprtr_filters', 'EPRTR filters'],
        ['query_params', 'Query params'],
      ],
    },
    query: {
      title: 'Query parameters',
      type: 'schema',
      fieldSetTitle: 'Query metadata',
      fieldSetId: 'query-metadata',
      fieldSetSchema: {
        fieldsets: [
          {
            id: 'default',
            title: 'title',
            fields: ['title', 'id', 'param'],
          },
        ],
        properties: {
          title: {
            type: 'string',
            title: 'Query title',
          },
          id: {
            type: 'string',
            title: 'Query id',
            description: 'This will be used as query parameter key',
          },
          param: {
            type: 'string',
            title: 'Query to use',
          },
        },
        required: ['id', 'title', 'param'],
      },
      editFieldset: false,
      deleteFieldset: false,
    },
  };
};

const Edit = (props) => {
  const [state, setState] = useState({
    schema: getSchema({ ...props, providerUrl: config.settings.providerUrl }),
    id: _uniqueId('block_'),
  });
  useEffect(() => {
    setState({
      ...state,
      schema: getSchema({
        ...props,
      }),
    });
    /* eslint-disable-next-line */
  }, [props.data.isExpandable]);
  return (
    <>
      <RenderFields
        schema={state.schema}
        {...props}
        title="Discodata openlayers map"
      />
      <View {...props} id={state.id} mode="edit" />
    </>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
  })),
)(Edit);
