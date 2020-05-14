/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from '@plone/volto/helpers';
import { compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';

import { map } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { blocks } from '~/config';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
} from '@plone/volto/helpers';
import { flattenToAppURL } from '@plone/volto/helpers';
import { setSectionTabs } from '~/actions';
import { Redirect } from 'react-router-dom';

const mapDispatchToProps = {
  setSectionTabs,
};
const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

class DefaultView extends Component {
  constructor(props) {
    super(props);
    // this.renderTabs = this.renderTabs.bind(this);
    this.state = {
      tabs: null,
    };
  }

  static defaultProps = {
    parent: null,
  };
  static propTypes = {
    tabs: PropTypes.array,
    content: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      text: PropTypes.shape({
        data: PropTypes.string,
      }),
    }).isRequired,
    localNavigation: PropTypes.any,
  };

  // componentWillReceiveProps(nextProps) {
  //   console.log('herere', nextProps.parent, this.props.parent);
  //   if (nextProps.parent && nextProps.parent.id !== this.props.parent?.id) {

  //     const pathArr = nextProps.location.pathname.split('/');
  //     pathArr.length = 4;
  //     const path = pathArr.join('/');
  //     const tabsItems = nextProps.parent.items.map(i => {
  //       return {
  //         url: `${path}/${i.id}`,
  //         title: i.title,
  //         '@type': i['@type'],
  //       };
  //     });
  //     this.props.setFolderTabs(tabsItems);
  //   }
  // }

  computeFolderTabs = siblings => {
    const tabsItems =
      siblings &&
      siblings.items?.map(i => {
        return {
          url: flattenToAppURL(i.url),
          title: i.name,
        };
      });
    console.log('--------------', this.props.pathname);
    if (this.props.pathname && this.props.pathname.split('/').length === 3) {
      this.props.setSectionTabs(tabsItems);
    }
    return tabsItems;
  };

  render() {
    const content = this.props.content;
    const intl = this.props.intl;
    const blocksFieldname = getBlocksFieldname(content);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
    const tabs = this.computeFolderTabs(content['@components'].siblings);
    const mainItem = content.items[0];
    const mainUrl =
      mainItem && mainItem['@id'] && flattenToAppURL(mainItem['@id']);
    console.log('mainitem,mainurl', mainItem, mainUrl);
    let redirect = false;
    if (__CLIENT__ && mainUrl && window) {
      redirect = true;
    }
    return (
      hasBlocksData(content) && (
        <div id="page-document" className="ui wrapper">
          {/* <button onClick={() => this.props.setSectionTabs(tabs)}>asd</button> */}
          {tabs && tabs.length && redirect ? (
            <Redirect to={{ pathname: mainUrl }} />
          ) : (
            ''
          )}
          <Helmet title={content.title} />
          {map(content[blocksLayoutFieldname].items, block => {
            const Block =
              blocks.blocksConfig[
                (content[blocksFieldname]?.[block]?.['@type'])
              ]?.['view'] || null;
            return Block !== null ? (
              <Block
                key={`block-${block}`}
                blockID={block}
                properties={content}
                data={content[blocksFieldname][block]}
              />
            ) : (
              <div key={`blocktype-${block}`}>
                {intl.formatMessage(messages.unknownBlock, {
                  block: content[blocksFieldname]?.[block]?.['@type'],
                })}
              </div>
            );
          })}
        </div>
      )
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      pathname: props.location.pathname,
      content:
        state.prefetch?.[state.router.location.pathname] || state.content.data,
    }),
    mapDispatchToProps,
  ),
)(DefaultView);
