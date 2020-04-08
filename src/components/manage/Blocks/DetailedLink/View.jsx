/**
 * Edit map block.
 * @module components/manage/Blocks/Maps/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import './style.css';
import { settings } from '~/config';
import { BodyClass } from '@plone/volto/helpers';

// import { Dropdown, Segment, Checkbox, Input, Button } from 'semantic-ui-react';
// import AddLinkForm from './AddLinkForm';

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
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
      catalogue: props.data.catalogue || false,
      catalogueList: this.props.data.catalogueList || [],
      catalogueSelectionList: this.props.data.catalogueSelectionList || [],
      details: [],
    };
  }
  getPath(url) {
    if (!url) return '';
    return url
      .replace(settings.apiPath, '')
      .replace(settings.internalApiPath, '');
  }
  componentDidMount() {
    this.setInitialCatalogueSelectionList();
  }

  setInitialCatalogueSelectionList = () => {
    const catalogueSelectionListFromChildren =
      (this.props.properties.items.length &&
        this.props.properties.items.map(item => ({
          key: this.getPath(item['@id']),
          text: item.title || item.Title,
          value: this.getPath(item['@id']),
          description: item.description,
          image: this.getPath(item.image?.download),
        }))) ||
      [];
    const catalogueSelectionList = removeDuplicates(
      [
        ...catalogueSelectionListFromChildren,
        ...this.state.catalogueSelectionList,
      ],
      'key',
    );
    console.log('initial', this.state.catalogueSelectionList);
    this.setState({ catalogueSelectionList });
  };

  render() {
    const childrenToDisplay = this.state.catalogue
      ? this.state.catalogueSelectionList.filter(item =>
          this.state.catalogueList.includes(item.value),
        )
      : this.state.catalogueSelectionList;
    return (
      <div>
        <BodyClass className="center-heading" />
        {!this.state.catalogueSelectionList &&
          !this.state.catalogueSelectionList.length && <div>No children</div>}
        {this.state.catalogue && !this.state.catalogueList.length && (
          <div>Please select items to display for catalogue intro</div>
        )}
        {childrenToDisplay.length && (
          <div className="catalogue-listing-block">
            {childrenToDisplay.map((item, i) => (
              <div className="catalogue-listing-block-item" key={i}>
                <Link key={item.value} to={item.value}>
                  <div className="catalogue-listing-block-item-title">
                    {item.text}
                  </div>
                  {item.description && <p>{item.description}</p>}
                  {item.image && (
                    <img
                      style={{ maxWidth: '100%' }}
                      src={item.image}
                      alt="icon"
                    />
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default injectIntl(View);
