/**
 * Navigation components.
 * @module components/theme/Navigation/Navigation
 */

import React, { useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink } from 'react-router-dom';
import { isMatch } from 'lodash';
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
const Navigation = props => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tabsSection, setTabsSection] = useState(
    __CLIENT__ && document.querySelector('.tabs.section-tabs'),
  );
  const [childrenTabsSection, setChildrenTabsSection] = useState(
    __CLIENT__ && document.querySelector('.page-document-sidebar .tabs'),
  );

  useEffect(() => {
    props.getNavigation(getBaseUrl(props.pathname), 3);
  }, [props]);

  useLayoutEffect(() => {
    if (__CLIENT__) {
      setTabsSection(document.querySelector('.tabs.section-tabs'));
    }
    if (__CLIENT__) {
      setChildrenTabsSection(
        document.querySelector('.page-document-sidebar .tabs'),
      );
    }
  },[__CLIENT__ && document.querySelector('.page-document-sidebar .tabs'), __CLIENT__ && document.querySelector('.tabs.section-tabs')]);


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
          onClick={() => toggleMobileMenu}
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
        {props.items.map(item =>
          item.title === 'Glossary' ? (
            <React.Fragment>
              <NavLink
                to={
                  //   TODO: Refactor this
                  item.items?.length && item.items[0].items?.length
                    ? item.items[0].items[0].url
                    : item.items?.length
                    ? item.items[0].url
                    : item.url
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
              {item.items?.length && tabsSection && childrenTabsSection
                ? item.items.map(secondLevelItem => (
                    <React.Fragment>
                      <Portal node={__CLIENT__ && tabsSection}>
                        <NavLink
                          to={
                            secondLevelItem.items?.length
                              ? secondLevelItem.items[0].url
                              : secondLevelItem.url
                          }
                          key={secondLevelItem.url}
                          className={
                            isActive(secondLevelItem.url)
                              ? 'tabs__item tabs__item_active'
                              : 'tabs__item'
                          }
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
                      {secondLevelItem.items?.length && childrenTabsSection ? (
                        <Portal node={__CLIENT__ && childrenTabsSection}>
                          {secondLevelItem.items
                            .filter(
                              thirdLevelItem =>
                                thirdLevelItem.url.includes(
                                  secondLevelItem.url,
                                ) &&
                                props.pathname.includes(secondLevelItem.url),
                            )
                            .map(thirdLevelItem => (
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
