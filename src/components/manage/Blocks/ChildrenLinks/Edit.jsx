import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import AddLinkForm from '../DetailedLink/AddLinkForm';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getParentFolderData } from '~/actions';
import { Link } from 'react-router-dom';
import _ from 'lodash'


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
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.childrenLinks !== this.props.childrenLinks) {
      this.onEditData()
    }
  }

  handleLinkData = (link) => {
    this.props.getParentFolderData(link.value)

  }

  onEditData() {
    const childrenLinks = this.props.childrenLinks;
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      links: childrenLinks,
    });
  }

  render() {

    const childrenLinks = this.props.data.links;

    return (
      <Grid columns={1}>
        <Grid.Row>
          {childrenLinks &&
            childrenLinks.map(child =>
              <div className="child-container">
                <Link target="_blank" className="child-link" to={child.url}>
                  {_.capitalize(child.title)}
                </Link>
              </div>
            )
          }
        </Grid.Row>
        <Grid.Column>
            <p className="search-text">Search page</p>
            <AddLinkForm onAddLink={this.handleLinkData} />
        </Grid.Column>
      </Grid>
    );
  }
}



const mapDispatchToProps = {
  getParentFolderData,
}

export default compose(
  injectIntl,
  connect(
    state => ({
      state,
      childrenLinks: state.parent_folder_data.items
    }),
    mapDispatchToProps,
  )
)(Edit)