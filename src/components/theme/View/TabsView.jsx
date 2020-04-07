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
    const tabsItems = siblings.items.map(i => {
      return {
        url: flattenToAppURL(i.url),
        title: i.name,
      };
    });
    return tabsItems;
  };

  render() {
    const content = this.props.content;
    const intl = this.props.intl;
    const blocksFieldname = getBlocksFieldname(content);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
    const tabs = this.computeFolderTabs(content['@components'].siblings);

    // const currentUrl = this.props.content?.['@id'];
    // const shouldRenderRoutes =
    //   typeof currentUrl !== 'undefined' &&
    //   samePath(currentUrl, this.props.pathname)
    //     ? true
    //     : false;
    //
    // if (shouldRenderRoutes === false)
    //   return (
    //     <div className="lds-default">
    //       <div />
    //       <div />
    //       <div />
    //       <div />
    //       <div />
    //       <div />
    //       <div />
    //       <div />
    //       <div />
    //       <div />
    //       <div />
    //       <div />
    //     </div>
    //   );

    return (
      hasBlocksData(content) && (
        <div id="page-document" className="ui wrapper">
          {tabs && tabs.length ? (
            <nav className="tabs">
              {tabs.map(tab => (
                <Link
                  key={`localtab-${tab.url}`}
                  className={`tabs__item${(tab.url ===
                    this.props.location.pathname &&
                    ' tabs__item_active') ||
                    ''}`}
                  to={tab.url}
                  title={tab.title}
                >
                  {tab.title}
                </Link>
              ))}
            </nav>
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
  connect((state, props) => ({
    pathname: props.location.pathname,
    content:
      state.prefetch?.[state.router.location.pathname] || state.content.data,
  })),
)(DefaultView);