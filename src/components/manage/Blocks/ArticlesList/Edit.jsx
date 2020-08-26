import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import articles from './articles.json';
import { Grid } from 'semantic-ui-react';

const items = articles.items;

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
      list: items,
    };
  }

  componentDidMount() {
    this.onChangeData();
  }

  onChangeData() {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      list: this.state.list,
    });
  }

  render() {
    return (
      <Grid columns={1}>
        <Grid.Column>
          {items &&
            items.map((item) => (
              <div className="article-list-row">
                <img className="article-img" src={item.imgUrl} />
                <Grid.Column>
                  <p className="article-title">{item.title}</p>
                  <p className="article-date">{item.date}</p>
                  <p className="article-description">{item.description}</p>
                  <a className="read-article" target="_blank" href={item.url}>
                    READ ARTICLE
                  </a>
                </Grid.Column>
              </div>
            ))}
        </Grid.Column>
      </Grid>
    );
  }
}

export default injectIntl(Edit);
