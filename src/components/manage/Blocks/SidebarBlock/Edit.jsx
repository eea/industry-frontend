import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import qs from 'query-string';
import View from './View';
import DiscodataSqlBuilderEdit from 'volto-datablocks/DiscodataSqlBuilder/Edit';

const makeChoices = keys => keys && keys.map(k => [k, k]);

const getSchema = props => {
  const { query } = props;
  const { search } = props.discodata_query;
  const { data } = props.discodata_resources;
  const globalQuery = { ...query, ...search };
  /* ===================== */
  /* ===================== */
  const resourcePackageKey = props.data.resource_package_key?.value;
  const key = props.data.key?.value;
  const selectedResource =
    resourcePackageKey && !key
      ? data[resourcePackageKey]
      : resourcePackageKey && key
      ? data[resourcePackageKey]?.[globalQuery[key]]
      : data;
  return {
    parent: {
      type: 'link',
      title: 'Parent page',
    },
    multiply: {
      type: 'boolean',
      title: 'Multiply',
    },
    depth_of_multiplication: {
      type: 'text',
      title: 'Depth of multiplication',
    },
    resource_package_key: {
      title: 'Resource package key',
      type: 'array',
      choices: data ? makeChoices(Object.keys(data)) : [],
    },
    key: {
      title: 'Query to use',
      type: 'array',
      choices: globalQuery ? makeChoices(Object.keys(globalQuery)) : [],
    },
    source: {
      title: 'Source',
      type: 'array',
      choices: selectedResource
        ? makeChoices(Object.keys(selectedResource))
        : [],
    },
    query_parameter: {
      type: 'text',
      title: 'Query identifier',
    },
    query_parameters: {
      title: 'Queries to set',
      type: 'schema',
      fieldSetTitle: 'Queries metadata',
      fieldSetId: 'queries_metadata',
      fieldSetSchema: {
        fieldsets: [
          {
            id: 'default',
            title: 'title',
            fields: ['title', 'id', 'queryParam', 'universalQuery'],
          },
        ],
        properties: {
          title: {
            title: 'Title',
            type: 'text',
          },
          id: {
            title: 'Id',
            type: 'text',
          },
          queryParam: {
            title: 'Query param',
            type: 'text',
            // type: formData => (!formData.urlQuery ? 'text' : 'array'),
            // choices: formData => {
            //   if (!formData.urlQuery) return undefined;
            //   let keys = query ? Object.keys(query) : [];
            //   Object.keys(search).forEach(key => {
            //     if (keys.indexOf(key) === -1) keys.push(key);
            //   });
            //   return [...makeChoices(keys)];
            // },
          },
          universalQuery: {
            title: 'Universal query',
            type: 'boolean',
          },
        },
        required: ['id', 'title', 'queryParam'],
      },
      editFieldset: false,
      deleteFieldset: false,
    },
  };
};

const Edit = props => {
  const [state, setState] = useState({
    schema: getSchema({ ...props }),
    id: _uniqueId('block_'),
  });
  useEffect(() => {
    props.onChangeBlock(props.block, {
      ...props.data,
      hide_block: {
        selector: '.sidebar-block-container .sidebar',
        hiddenClassName: 'hidden',
        event: 'sidebarToggle',
      },
    });
    /* eslint-disable-next-line */
  }, [])
  useEffect(() => {
    setState({
      ...state,
      schema: getSchema({
        ...props,
      }),
    });
    /* eslint-disable-next-line */
  }, [state.item, props.data, props.discodata_resources, props.discodata_query.search])
  return (
    <DiscodataSqlBuilderEdit
      {...props}
      optionalSchema={state.schema}
      title="Discodata components block"
    >
      <View {...props} />
    </DiscodataSqlBuilderEdit>
  );
};

export default compose(
  connect((state, props) => ({
    query: qs.parse(state.router.location.search),
    pathname: state.router.location.pathname,
    discodata_resources: state.discodata_resources,
    discodata_query: state.discodata_query,
  })),
)(Edit);
