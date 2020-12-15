/**
 * Edit map block.
 * @module components/manage/Blocks/Maps/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { settings } from '~/config';
import { BodyClass } from '@plone/volto/helpers';

import { Button } from 'semantic-ui-react';
// import AddLinkForm from './AddLinkForm';

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

class View extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    // pathname: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      link: this.props.data.link,
    };
  }
  getPath(url) {
    if (!url) return '';
    return url
      .replace(settings.apiPath, '')
      .replace(settings.internalApiPath, '');
  }

  render() {
    return (
      <div>
        {(this.state.link && (
          <Link
            className="detailed-link-block"
            onClick={(e) => e.preventDefault}
            to={this.getPath(this.state.link.value)}
          >
            <div className="detailed-link-block-item-title">
              {this.state.link.text}
            </div>
            <p>
              {this.state.link.description && (
                <p>{this.state.link.description}</p>
              )}
            </p>
            <Button basic>Read more</Button>
          </Link>
        )) ||
          'Select a page from sidebar'}
      </div>
    );
  }
}

export default injectIntl(View);
