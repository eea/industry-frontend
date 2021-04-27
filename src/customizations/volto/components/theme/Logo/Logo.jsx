/**
 * Logo component.
 * @module components/theme/Logo/Logo
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import { Image } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
// import Icon from '@plone/volto/components/theme/Icon/Icon';
import config from '@plone/volto/registry';

import logo from '~/icons/logo-white.png';

const messages = defineMessages({
  site: {
    id: 'Site',
    defaultMessage: 'Site',
  },
  plonesite: {
    id: 'Plone Site',
    defaultMessage: 'Plone Site',
  },
  industrialEmissions: {
    id: 'Industrial Emissions',
    defaultMessage: 'Industrial Emissions Portal',
  },
});

/**
 * Logo component class.
 * @function Logo
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component.
 */
const Logo = () => {
  const lang = useSelector((state) => state.intl.locale);
  const intl = useIntl();

  return (
    <Link
      to={config.settings.isMultilingual ? `/${lang}` : '/'}
      title={intl.formatMessage(messages.site)}
    >
      {/* <Icon
        name={logo}
        size={70}
        title={intl.formatMessage(messages.industrialEmissions)}
      /> */}
      <Image
        src={logo}
        alt={intl.formatMessage(messages.industrialEmissions)}
        title={intl.formatMessage(messages.industrialEmissions)}
        height={70}
      />
    </Link>
  );
};

export default Logo;
