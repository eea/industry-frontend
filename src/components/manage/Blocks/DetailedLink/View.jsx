import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { settings } from '~/config';
import './style.css';

const getPath = (url) => {
  if (!url) return '';
  return url
    .replace(settings.apiPath, '')
    .replace(settings.internalApiPath, '');
};

const View = (props) => {
  const detailedLink = props.data.detailedLink || null;
  const { hideTitle = false, hideDescription = false } = props.data;
  const {
    textAlign = null,
    title = '',
    description = '',
    buttonTitle = '',
  } = props.data;
  const {
    titleClassname = '',
    descriptionClassname = '',
    buttonClassname = '',
  } = props.data;
  return (
    <div
      className={`detailed-link-container text-align-${textAlign || 'left'}`}
    >
      {(detailedLink && (
        <div>
          {!hideTitle ? (
            <div className={`detailed-link-title ${titleClassname || ''}`}>
              {title || detailedLink.title || ''}
            </div>
          ) : (
            ''
          )}
          {!hideDescription ? (
            <p
              className={`detailed-link-description ${
                descriptionClassname || ''
              }`}
            >
              {description || detailedLink.description || ''}
            </p>
          ) : (
            ''
          )}
          <Link
            className={`detailed-link-button ${buttonClassname || ''}`}
            onClick={(e) => e.preventDefault}
            to={getPath(detailedLink.path)}
          >
            {buttonTitle || detailedLink.title || 'Go'}
          </Link>
        </div>
      )) || (
        <p className="detailed-link-placeholder">Select a page from sidebar</p>
      )}
    </div>
  );
};

export default injectIntl(View);
