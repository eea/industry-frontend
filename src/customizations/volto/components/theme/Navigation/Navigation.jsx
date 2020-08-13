/**
 * Navigation components.
 * @module components/theme/Navigation/Navigation
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink } from 'react-router-dom';
import { isMatch } from 'lodash';
import { defineMessages, injectIntl } from 'react-intl';
import { Menu } from 'semantic-ui-react';
import cx from 'classnames';
import { getBaseUrl } from '@plone/volto/helpers';
import { deepSearch } from '~/helpers';
import { settings } from '~/config';

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
const Navigation = props => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    props.getNavigation(getBaseUrl(props.pathname));
    /* eslint-disable-next-line */
  }, []);

  const isActive = url => {
    return (
      (url === '' && props.pathname === '/') ||
      (url !== '' && isMatch(props.pathname.split('/'), url.split('/')))
    );
  };
  /**
   * Toggle mobile menu's open state
   * @method toggleMobileMenu
   * @returns {undefined}
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  /**
   * Close mobile menu
   * @method closeMobileMenu
   * @returns {undefined}
   */
  const closeMobileMenu = () => {
    if (!isMobileMenuOpen) {
      return;
    }
    setIsMobileMenuOpen(false);
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  const { lang } = props;

  return (
    <nav className="navigation">
      <div className="hamburger-wrapper mobile tablet only">
        <button
          className={cx('hamburger hamburger--collapse', {
            'is-active': isMobileMenuOpen,
          })}
          aria-label={
            isMobileMenuOpen
              ? props.intl.formatMessage(messages.closeMobileMenu, {
                  type: props.type,
                })
              : props.intl.formatMessage(messages.openMobileMenu, {
                  type: props.type,
                })
          }
          title={
            isMobileMenuOpen
              ? props.intl.formatMessage(messages.closeMobileMenu, {
                  type: props.type,
                })
              : props.intl.formatMessage(messages.openMobileMenu, {
                  type: props.type,
                })
          }
          type="button"
          onClick={toggleMobileMenu}
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
          isMobileMenuOpen ? 'open' : 'computer large screen widescreen only'
        }
        onClick={() => closeMobileMenu}
      >
        {props.items.map(item => (
          <NavLink
            to={
              (['Glossary', 'Browse the data'].includes(item.title) &&
                deepSearch({
                  inputArray: item.items,
                  pattern: {
                    criteria: 'first',
                    validationType: 'hasItems',
                    propertyToValidate: 'items',
                    propertyToReturn: 'url',
                  },
                  depth: 2,
                })) ||
              (item.url === '' ? '/' : item.url)
            }
            key={item.url}
            className={isActive(item.url) ? 'item active' : 'item'}
            activeClassName="active"
            exact={
              settings.isMultilingual
                ? item.url === `/${lang}`
                : item.url === ''
            }
          >
            {item.title}
          </NavLink>
        ))}
      </Menu>
    </nav>
  );
};
/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Navigation.propTypes = {
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
