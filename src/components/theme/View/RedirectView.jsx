import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

class RedirectView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
    console.log('topicsView');
  }
  static propTypes = {
    content: PropTypes.shape({
      title: PropTypes.string,

      description: PropTypes.string,

      items: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          description: PropTypes.string,
          url: PropTypes.string,
          image: PropTypes.object,
          image_caption: PropTypes.string,
          '@type': PropTypes.string,
        }),
      ),
    }).isRequired,
  };

  componentDidMount() {
    const mainItem = this.props.content.items[0];
    const mainUrl = mainItem && mainItem.url;
    console.log('mainitem,mainurl', mainItem, mainUrl);
    if (__CLIENT__ && mainUrl && window) {
      this.setState({ redirect: mainUrl });
    } else {
      this.setState({ redirect: false });
    }
  }

  render() {
    console.log('redirect state', this.state.redirect);
    if (this.state.redirect) {
      return <Redirect to={{ pathname: this.state.redirect }} />;
    } else {
      return '';
    }
  }
}

export default RedirectView;