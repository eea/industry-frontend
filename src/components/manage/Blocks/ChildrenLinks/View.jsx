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
        <Grid columns={columns || 1}>
          <Grid.Row>
            {childrenLinks.map((child) => (
              <Grid.Column>
                <div className="children-link-container">
                  <Link
                    target="_blank"
                    className="children-link"
                    to={getPath(child?.['@id'] || '')}
                  >
                    {child.title}
                  </Link>
                </div>
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
      </div>
    )) || (
      <p className="children-links-placeholder">Select a page from sidebar</p>
    )
  );
};

export default injectIntl(View);
