import React from 'react';
import { injectIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { settings } from '~/config';

const getPath = url => {
  if (!url) return '';
  return url
    .replace(settings.apiPath, '')
    .replace(settings.internalApiPath, '');
};

const View = props => {
  return (
    <div>
      {(props.data?.detailedLink && (
        <div>
          <div className="detailed-link-block-item-title">
            {props.data.detailedLink.title || props.data.detailedLink.text}
          </div>
          <p>{props.data.detailedLink.description || ''}</p>
          <Link
            className="detailed-link-block"
            onClick={e => e.preventDefault}
            to={getPath(props.data.detailedLink.value)}
          >
            <Button basic>Read more</Button>
          </Link>
        </div>
      )) ||
        'Select a page from sidebar'}
    </div>
  );
};

export default injectIntl(View);
