import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import RenderFields from 'volto-addons/Widgets/RenderFields';
import View from './View';

const makeChoices = keys => keys && keys.map(k => [k, k]);

const getSchema = props => {
  const { search, key, resourceKey } = props.discodata_query.data;
  const discodataResources = Object.keys(props.discodata_resources.data) || [];
  const selectedDiscodataResource =
    props.discodata_resources.data?.[resourceKey]?.[search?.[key]] || null;
  return {
    parent: {
      type: 'link',
      title: 'Parent page',
    },
    multiply_second_level: {
      type: 'boolean',
      title: 'Multiply second level',
    },
    discodata_resource: {
      type: 'array',
      title: 'Discodata resource',
      choices: makeChoices(discodataResources),
    },
    discodata_resource_property: {
      type: 'array',
      title: 'Source',
      // items: {
      choices: selectedDiscodataResource
        ? makeChoices(Object.keys(selectedDiscodataResource))
        : [],
      // },
    },
    query_parameter: {
      type: 'text',
      title: 'Query to set',
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
  }, [state.item, props.data, props.discodata_resources, props.discodata_query])
  return (
    <div>
      <RenderFields schema={state.schema} {...props} title="Navigation block" />
      <View {...props} id={state.id} />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
    discodata_resources: state.discodata_resources,
    discodata_query: state.discodata_query,
  })),
)(Edit);
