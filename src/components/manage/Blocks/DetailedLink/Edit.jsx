/**
 * Edit map block.
 * @module components/manage/Blocks/Maps/Edit
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import { SidebarPortal } from '@plone/volto/components';
import { Segment } from 'semantic-ui-react';

import AddLinkForm from './AddLinkForm';
import View from './View';

import { getPage } from '~/actions';

const Edit = props => {
  const [state, setState] = useState({
    link: null,
  });
  useEffect(() => {
    if (props.pages && props.pages?.[state.link?.value]) {
      props.onChangeBlock(props.block, {
        ...props.data,
        detailedLink: {
          ...props.data.detailedLink,
          ...props.pages[state.link.value],
        },
      });
    }
    /* eslint-disable-next-line */
  }, [props.pages])
  return (
    <div>
      <SidebarPortal selected={props.selected}>
        <Segment.Group raised>
          <header className="header pulled">
            <h2>{'Detailed Link'}</h2>
          </header>
          <Segment className="form sidebar-image-data">
            <div className="segment-row">
              <AddLinkForm
                onAddLink={link => {
                  setState({ ...state, link });
                  props.dispatch(getPage(link.value));
                  props.onChangeBlock(props.block, {
                    ...props.data,
                    detailedLink: {
                      ...props.data.detailedLink,
                      ...link,
                    },
                  });
                }}
                initialValue={props.data?.link?.text}
              />
            </div>
          </Segment>
        </Segment.Group>
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
