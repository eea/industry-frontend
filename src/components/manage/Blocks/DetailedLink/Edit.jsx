/**
 * Edit map block.
 * @module components/manage/Blocks/Maps/Edit
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { SidebarPortal } from '@plone/volto/components';
import View from './View';
import { getPage } from '~/actions';
import getSchema from './schema';

const Edit = (props) => {
  const [state, setState] = useState({
    schema: getSchema(props),
  });
  const pageLink = props.data.page;

  useEffect(() => {
    if (props.pages && props.pages?.[pageLink]) {
      handleChangeBlock('detailedLink', {
        ...props.data.detailedLink,
        title: props.pages[pageLink].title,
        description: props.pages[pageLink].description,
        path: pageLink,
      });
    }
    /* eslint-disable-next-line */
  }, [props.pages])

  useEffect(() => {
    if (pageLink) {
      props.dispatch(getPage(pageLink));
    }
    /* eslint-disable-next-line */
  }, [pageLink])

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
      <View {...props} />
    </div>
  );
};

export default compose(
  injectIntl,
  connect((state, props) => ({
    pages: state.pages.items,
  })),
)(Edit);
