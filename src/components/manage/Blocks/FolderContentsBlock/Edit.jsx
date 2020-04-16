/**
 * Edit map block.
 * @module components/manage/Blocks/Maps/Edit
 */

import React, { Component } from 'react';
import PropTypes, { array } from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon, SidebarPortal, TextWidget } from '@plone/volto/components';
import { Dropdown, Segment, Checkbox, Input, Button } from 'semantic-ui-react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { Card } from 'semantic-ui-react';
import { settings } from '~/config';
import AddLinkForm from './AddLinkForm';

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    pathname: PropTypes.string.isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      link: this.props.data.link
    };
  }
  getPath(url) {
    if (!url) return '';
    return url
      .replace(settings.apiPath, '')
      .replace(settings.internalApiPath, '');
  }


  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
      this.onChangeData();
    }
  }

  onChangeData() {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      link: this.state.link,
    });
  }


  onAddLink = link => {
    this.setState({
      link
    });
  };

  render() {
    return (
      <div>
        {this.state.link && (
          <Link className="detailed-link-block" onClick={(e) => e.preventDefault} to={this.getPath(this.state.link.value)}>
            <div className="detailed-link-block-item-title">
              {this.state.link.text}
            </div>
            <p>
            {this.state.link.description && <p>{this.state.link.description}</p>}
            </p>
              <Button basic>Read more</Button>
          </Link>
        ) || 'Select a page from sidebar'}
        <SidebarPortal selected={true}>
          <Segment.Group raised>
            <header className="header pulled">
              <h2> Detailed Link </h2>
            </header>
            <Segment className="form sidebar-image-data">
              <div className="segment-row">
                <AddLinkForm onAddLink={this.onAddLink} />
              </div>
            </Segment>
            <Segment>
              {/* <input
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                ref={this.onRef}
                type="text"
                value={value.title}
                placeholder={this.props.intl.formatMessage(messages.placeholder)}
              /> */}
            </Segment>
          </Segment.Group>
        </SidebarPortal>
      </div>
    );
  }
}

export default injectIntl(Edit);
