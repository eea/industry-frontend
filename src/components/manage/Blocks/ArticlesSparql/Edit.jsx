/**
 * Edit map block.
 * @module components/manage/Blocks/Maps/Edit
 */
import React, { useState } from 'react';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { SidebarPortal } from '@plone/volto/components';
import View from './View';
import getSchema from './schema';

const Edit = (props) => {
  const [state, setState] = useState({
    schema: getSchema(props),
  });

  const handleChangeBlock = (id, value) => {
    const { data } = props;
    props.onChangeBlock(props.block, {
      ...data,
      [id]: value,
    });
  };

  return (
    <div>
      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={state.schema}
          title={state.schema.title}
          onChangeField={handleChangeBlock}
          formData={props.data}
          block={props.block}
        />
      </SidebarPortal>
      <View {...props} mode="edit" />
    </div>
  );
};

export default Edit;
