/**
 * Navigation components.
 * @module components/theme/Navigation/Navigation
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import { Menu, Button } from 'semantic-ui-react';
import cx from 'classnames';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { getBaseUrl } from '@plone/volto/helpers';
import { settings } from '~/config';

import { getNavigation } from '@plone/volto/actions';
import { resetQueryParam } from 'volto-datablocks/actions';

import clearSVG from '@plone/volto/icons/clear.svg';

const messages = defineMessages({
  closeMobileMenu: {
    id: 'Close menu',
    defaultMessage: 'Close menu',
  },
  openMobileMenu: {
    id: 'Open menu',
    defaultMessage: 'Open menu',
  },
});

/**
 * Navigation container class.
 * @class Navigation
 * @extends Component
 */
class Navigation extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getNavigation: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      }),
    ).isRequired,
    lang: PropTypes.string.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Navigation
   */
  constructor(props) {
    super(props);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
    this.state = {
      isMobileMenuOpen: false,
    };
  }

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  UNSAFE_componentWillMount() {
    this.props.getNavigation(
      getBaseUrl(this.props.pathname),
      settings.navDepth,
    );
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      this.props.getNavigation(
        getBaseUrl(nextProps.pathname),
        settings.navDepth,
      );
    }
  }

  /**
   * Toggle mobile menu's open state
   * @method toggleMobileMenu
   * @returns {undefined}
   */
  toggleMobileMenu() {
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen });
  }

  /**
   * Close mobile menu
   * @method closeMobileMenu
   * @returns {undefined}
   */
  closeMobileMenu() {
    if (!this.state.isMobileMenuOpen) {
      return;
    }
    this.setState({ isMobileMenuOpen: false });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { lang } = this.props;

    return (
      <nav className="navigation">
        <div className="hamburger-wrapper mobile tablet only">
          <button
            className={cx('hamburger hamburger--collapse')}
            aria-label={
              this.state.isMobileMenuOpen
                ? this.props.intl.formatMessage(messages.closeMobileMenu, {
                    type: this.props.type,
                  })
                : this.props.intl.formatMessage(messages.openMobileMenu, {
                    type: this.props.type,
                  })
            }
            title={
              this.state.isMobileMenuOpen
                ? this.props.intl.formatMessage(messages.closeMobileMenu, {
                    type: this.props.type,
                  })
                : this.props.intl.formatMessage(messages.openMobileMenu, {
                    type: this.props.type,
                  })
            }
            type="button"
            onClick={this.toggleMobileMenu}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button>
        </div>
        <div className={this.state.isMobileMenuOpen ? 'open menu-wrapper' : ''}>
          <Menu
            stackable
            pointing
            secondary
            className={
              this.state.isMobileMenuOpen
                ? 'open'
                : 'computer large screen widescreen only'
            }
          >
            <Button
              icon
              basic
              title="Close menu"
              className="close-button"
              onClick={this.closeMobileMenu}
            >
              <Icon name={clearSVG} size="32px" />
            </Button>
            {this.props.items.map(
              (item) =>
                !settings.excludeFromNavigation.includes(item.url) && (
                  <NavLink
                    to={item.url === '' ? '/' : item.url}
                    key={item.url}
                    className="item"
                    activeClassName="active"
                    onClick={() => {
                      if (
                        !item.url.includes('/industrial-site') &&
                        !item.url.includes('/analysis')
                      ) {
                        this.props.resetQueryParam();
                      }
                      this.closeMobileMenu();
                    }}
                    exact={
                      settings.isMultilingual
                        ? item.url === `/${lang}`
                        : item.url === ''
                    }
                  >
                    {item.title}
                  </NavLink>
                ),
            )}
          </Menu>
        </div>
      </nav>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state) => ({
      items: state.navigation.items,
      lang: state.intl.locale,
      discodata_query: state.discodata_query,
    }),
    { getNavigation, resetQueryParam },
  ),
)(Navigation);
