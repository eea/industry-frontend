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
import './style.css';
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
      // catalogueList: this.props.data.catalogueList || [],
      // catalogueSelectionList: this.props.data.catalogueSelectionList || [],
      // details: [],
      link: this.props.data.link
    };
  }
  getPath(url) {
    if (!url) return '';
    return url
      .replace(settings.apiPath, '')
      .replace(settings.internalApiPath, '');
  }

  componentDidMount() {
    console.log('-----', this.props.properties);
    // this.setInitialCatalogueSelectionList();
  }

  // resetCatalogueSelectionList = () => {
  //   const catalogueSelectionList =
  //     (this.props.properties.items.length &&
  //       this.props.properties.items.map(item => ({
  //         key: this.getPath(item['@id']),
  //         text: item.title || item.Title,
  //         value: this.getPath(item['@id']),
  //         description: item.description,
  //         image: this.getPath(item.image?.download),
  //       }))) ||
  //     [];
  //   this.setState({ catalogueSelectionList });
  // };

  // setInitialCatalogueSelectionList = () => {
  //   const catalogueSelectionListFromChildren =
  //     (this.props.properties.items.length &&
  //       this.props.properties.items.map(item => ({
  //         key: this.getPath(item['@id']),
  //         text: item.title || item.Title,
  //         value: this.getPath(item['@id']),
  //         description: item.description,
  //         image: this.getPath(item.image?.download),
  //       }))) ||
  //     [];
  //   const catalogueSelectionList = removeDuplicates(
  //     [
  //       ...catalogueSelectionListFromChildren,
  //       ...this.state.catalogueSelectionList,
  //     ],
  //     'key',
  //   );
  //   console.log('initial', this.state.catalogueSelectionList);
  //   this.setState({ catalogueSelectionList });
  // };

  // componentDidUpdate(prevProps, prevState) {
  //   if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
  //     this.onChangeData();
  //   }
  // }

  onChangeData() {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      link: this.state.link,
      // catalogueList: this.state.catalogueList,
      // catalogueSelectionList: this.state.catalogueSelectionList,
    });
  }

  // onChangeCatalogue = (event, data) => {
  //   this.setState({
  //     catalogue: data.checked,
  //   });
  // };

  // onChangeCatalogueListing = (event, data) => {
  //   this.setState({
  //     catalogueList: data.value,
  //   });
  // };

  onAddLink = link => {
    this.setState({
      link
    });
  };

  render() {
    // text: item.title || item.Title,
  //         value: this.getPath(item['@id']),
  //         description: item.description,
  //         image: this.getPath(item.image?.download),
    return (
      <div>
        asdasdas
        {this.state.link && (
          <div fluid className="catalogue-listing-block">
              <div className="catalogue-listing-block-item">
                <Link to={this.getPath(this.state.link['@id'])}>
                  <div className="catalogue-listing-block-item-title">
                    {this.state.link.title || this.state.link.Title}
                  </div>
                  {this.state.link.description && <p>{this.state.link.description}</p>}
                  {this.state.link.image && (
                    <img
                      style={{ maxWidth: '100%' }}
                      src={this.getPath(this.state.link.image.download)}
                      alt="icon"
                    />
                  )}
                </Link>
              </div>
          </div>
        ) || 'select a link from sidebar'}
        {/* <SidebarPortal selected={true}> */}
          <Segment.Group raised>
            <header className="header pulled">
              <h2> Detailed Link </h2>
            </header>
            <Segment className="form sidebar-image-data">
              <div className="segment-row">
                <p>Non-children links</p>
                <AddLinkForm onAddLink={this.onAddLink} />
              </div>
            </Segment>
          </Segment.Group>
        {/* </SidebarPortal> */}
      </div>
    );
  }
}

export default injectIntl(Edit);
