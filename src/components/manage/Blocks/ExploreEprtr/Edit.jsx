import React from 'react';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import ExploreEprtrView from './View';
import schema from './schema';
import { connectBlockToProviderData } from '@eeacms/volto-datablocks/hocs';

const Edit = (props) => {
  const { data = {}, block = null, selected = false, onChangeBlock } = props;

  return (
    <>
      <ExploreEprtrView {...props} mode="edit" />

      <SidebarPortal selected={selected}>
        <InlineForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
        />
      </SidebarPortal>
    </>
  );
};

export default connectBlockToProviderData(Edit);
