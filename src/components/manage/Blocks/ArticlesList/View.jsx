/**
 * Edit map block.
 * @module components/manage/Blocks/Maps/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Grid } from 'semantic-ui-react';

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

  render() {
    return (
      <Grid columns={1}>
        <Grid.Column>
          {this.props.data.list &&
            this.props.data.list.map((item) => (
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

export default injectIntl(View);
