import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid } from 'semantic-ui-react';
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
  const childrenLinks = props.data.childrenLinks || null;
  const { columns } = props.data;
  return (
    (childrenLinks && childrenLinks.length && (
      <div className="children-links-container">
        <div className="grid-layout">
          <div className="row">
            {childrenLinks.map((child) => (
              <div className="column text-align-center">
                <div className="children-link-container">
                  <Link
                    target="_blank"
                    className="children-link"
                    to={getPath(child?.['@id'] || '')}
                  >
                    {child.title}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )) || (
      <p className="children-links-placeholder">Select a page from sidebar</p>
    )
  );
};

export default injectIntl(View);
