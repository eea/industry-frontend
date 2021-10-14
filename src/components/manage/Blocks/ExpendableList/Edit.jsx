import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { SidebarPortal } from '@plone/volto/components';
import View from './ViewEdit';
import config from '@plone/volto/registry';
import { makeSchema } from './schema';

const Edit = (props) => {
  const [state, setState] = useState({
    schema: makeSchema({ ...props, providerUrl: config.settings.providerUrl }),
    id: _uniqueId('block_'),
  });
  useEffect(() => {
    setState({
      ...state,
      schema: makeSchema({
        ...props,
      }),
    });
    /* eslint-disable-next-line */
  }, [props.data.isExpandable]);
  return (
    <div>
      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={state.schema}
          title={state.schema.title}
          onChangeField={(field, data) => {
            props.onChangeBlock(props.block, {
              ...(props.data || {}),
              [field]: data,
            });
          }}
          formData={props.data || {}}
          block={props.block}
        />
      </SidebarPortal>
      <View {...props} id={state.id} mode="edit" />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
  })),
)(Edit);
