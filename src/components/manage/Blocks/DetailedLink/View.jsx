import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { settings } from '~/config';
import cx from 'classnames';
import './style.css';
import { deleteQueryParam } from 'volto-datablocks/actions';

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
      className={cx(
        'detailed-link-container display-flex flex-column',
        `text-align-${textAlign || 'left'}`,
      )}
    >
      {(detailedLink && (
        <>
          {!hideTitle ? (
            <div className={cx('detailed-link-title', titleClassname || '')}>
              {title || detailedLink.title || ''}
            </div>
          ) : (
            ''
          )}
          {!hideDescription && (description || detailedLink.description) ? (
            <p
              className={cx(
                'detailed-link-description',
                descriptionClassname || '',
              )}
            >
              {description || detailedLink.description || ''}
            </p>
          ) : (
            ''
          )}
          <div>
            <Link
              className={cx(
                'detailed-link-button display-inline-block',
                buttonClassname || '',
              )}
              onClick={(e) => {
                if (
                  props.discodata_query.search.facilityInspireId ||
                  props.discodata_query.search.installationInspireId ||
                  props.discodata_query.search.lcpInspireId
                ) {
                  props.deleteQueryParam({
                    queryParam: [
                      'facilityInspireId',
                      'installationInspireId',
                      'lcpInspireId',
                    ],
                  });
                }
                return e.preventDefault;
              }}
              to={getPath(detailedLink.path)}
            >
              <span>{buttonTitle || detailedLink.title || 'Go'}</span>
            </Link>
          </div>
        </>
      )) || (
        <p className="detailed-link-placeholder">Select a page from sidebar</p>
      )}
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      discodata_query: state.discodata_query,
    }),
    { deleteQueryParam },
  ),
)(View);
