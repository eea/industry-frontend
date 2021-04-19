import React from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateIntl } from 'react-intl-redux';
import cookie from 'react-cookie';
import config from '@plone/volto/registry';

let locales = {};

if (config.settings) {
  config.settings.supportedLanguages.forEach((lang) => {
    import('~/../locales/' + lang + '.json').then((locale) => {
      locales = { ...locales, [lang]: locale.default };
    });
  });
}

const MultilingualRedirector = (props) => {
  const { pathname, children } = props;
  const currentLanguage =
    cookie.load('lang') || config.settings.defaultLanguage;
  const redirectToLanguage = config.settings.supportedLanguages.includes(
    currentLanguage,
  )
    ? currentLanguage
    : config.settings.defaultLanguage;
  const dispatch = useDispatch();

  React.useEffect(() => {
    // ToDo: Add means to support language negotiation (with config)
    // const detectedLang = (navigator.language || navigator.userLanguage).substring(0, 2);
    if (config.settings.isMultilingual && pathname === '/') {
      dispatch(
        updateIntl({
          locale: redirectToLanguage,
          messages: locales[redirectToLanguage],
        }),
      );
    }
  }, [pathname, dispatch, redirectToLanguage]);

  return pathname === '/' && config.settings.isMultilingual ? (
    <Redirect to={`/${redirectToLanguage}`} />
  ) : (
    <>{children}</>
  );
};

export default MultilingualRedirector;
