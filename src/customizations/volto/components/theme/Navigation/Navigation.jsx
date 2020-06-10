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
import { Menu } from 'semantic-ui-react';
import cx from 'classnames';
import { getBaseUrl } from '@plone/volto/helpers';
import { settings } from '~/config';
import { Portal } from 'react-portal';

import { getNavigation } from '@plone/volto/actions';

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
    if (!settings.contentExpand.includes('navigation'))
      this.props.getNavigation(getBaseUrl(this.props.pathname), 3);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !settings.contentExpand.includes('navigation') &&
      nextProps.pathname !== this.props.pathname
    ) {
      this.props.getNavigation(getBaseUrl(nextProps.pathname), 3);
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
    console.log('navigation', this.props.items);

    return (
      <nav className="navigation">
        <div className="hamburger-wrapper mobile tablet only">
          <button
            className={cx('hamburger hamburger--collapse', {
              'is-active': this.state.isMobileMenuOpen,
            })}
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
        <Menu
          stackable
          pointing
          secondary
          className={
            this.state.isMobileMenuOpen
              ? 'open'
              : 'computer large screen widescreen only'
          }
          onClick={this.closeMobileMenu}
        >
          {this.props.items.map(item =>
            item.title === 'Glossary' ? (
              <React.Fragment>
                <NavLink
                  to={item.url === '' ? '/' : item.url}
                  key={item.url}
                  className="item"
                  activeClassName="active"
                  exact={
                    settings.isMultilingual
                      ? item.url === `/${lang}`
                      : item.url === ''
                  }
                >
                  {item.title}
                </NavLink>
                {item.items?.length &&
                document.querySelector('.tabs.section-tabs') &&
                document.querySelector('.page-document-sidebar .tabs')
                  ? item.items.map(secondLevelItem => (
                      <React.Fragment>
                        <Portal
                          node={
                            __CLIENT__ &&
                            document.querySelector('.tabs.section-tabs')
                          }
                        >
                          <NavLink
                            to={
                              secondLevelItem.items?.length
                                ? secondLevelItem.items[0].url
                                : secondLevelItem.url
                            }
                            key={secondLevelItem.url}
                            className="tabs__item"
                            activeClassName="tabs__item_active"
                            exact={
                              settings.isMultilingual
                                ? secondLevelItem.url === `/${lang}`
                                : secondLevelItem.url === ''
                            }
                          >
                            {secondLevelItem.title}
                          </NavLink>
                        </Portal>
                        {secondLevelItem.items?.length &&
                        document.querySelector(
                          '.page-document-sidebar .tabs',
                        ) ? (
                          <Portal
                            node={
                              __CLIENT__ &&
                              document.querySelector(
                                '.page-document-sidebar .tabs',
                              )
                            }
                          >
                            {secondLevelItem.items.map(thirdLevelItem => (
                              <NavLink
                                to={
                                  thirdLevelItem.url === ''
                                    ? '/'
                                    : thirdLevelItem.url
                                }
                                key={thirdLevelItem.url}
                                className="tabs__item"
                                activeClassName="tabs__item_active"
                                exact={
                                  settings.isMultilingual
                                    ? thirdLevelItem.url === `/${lang}`
                                    : thirdLevelItem.url === ''
                                }
                              >
                                {thirdLevelItem.title}
                              </NavLink>
                            ))}
                          </Portal>
                        ) : (
                          ''
                        )}
                      </React.Fragment>
                    ))
                  : ''}
              </React.Fragment>
            ) : (
              <NavLink
                to={item.url === '' ? '/' : item.url}
                key={item.url}
                className="item"
                activeClassName="active"
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
      </nav>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    state => ({
      items: state.navigation.items,
      lang: state.intl.locale,
    }),
    { getNavigation },
  ),
)(Navigation);
