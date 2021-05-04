import React from 'react';
import { Popup, Grid } from 'semantic-ui-react';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { UniversalLink } from '@plone/volto/components';
import RenderTable from './RenderTable';
import cx from 'classnames';
import infoSVG from '@plone/volto/icons/info.svg';

const PermitingAuthority = (props) => {
  const { entity = '' } = props;
  const permitingAuthority = props.permitingAuthority;

  return (
    <div className="permiting-authority">
      <div
        className={cx({
          title: true,
          marginless: !permitingAuthority.length,
        })}
      >
        <h3 className="blue">Permiting Authority</h3>
        <Popup
          position="top left"
          content="Authority, body or bodies responsible for issuing a permit to a given facility"
          trigger={
            <div className="popup-svg">
              <Icon name={infoSVG} size="20px" color="#D63D27" />
            </div>
          }
        />
      </div>
      {!permitingAuthority.length ? (
        <p className="info">
          No information provided about permiting authority
        </p>
      ) : (
        ''
      )}
      {permitingAuthority.length > 1 ||
      (permitingAuthority.length === 1 && entity === 'site') ? (
        <div className="site-block-table">
          <RenderTable
            className="description-table"
            celled={false}
            headless={false}
            headers={[
              ...(entity === 'site'
                ? [
                    {
                      key: 'nth',
                      value: 'Installation',
                      popup: { key: 'installationInspireId' },
                    },
                  ]
                : []),
              { key: 'operatingSince', value: 'Operating since' },
              { key: 'permitUpdated', value: 'Permit updated' },
              { key: 'permitingAuthority', value: 'Permiting authority' },
              {
                key: 'permitAvailable',
                value: 'Permit available',
                link: { text: 'Permit link' },
              },
              { key: 'seveso', value: 'Seveso' },
              { key: 'entityStatus', value: 'Status' },
            ]}
            rows={permitingAuthority}
          />
        </div>
      ) : permitingAuthority.length === 1 ? (
        <div>
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={6}>
                <p className="label">Permit updated</p>
                <p className="info">
                  {permitingAuthority[0].permitUpdated || '-'}
                </p>
              </Grid.Column>
              <Grid.Column mobile={6}>
                <p className="label">Permiting authority</p>
                <p className="info">
                  {permitingAuthority[0].permitingAuthority || '-'}
                </p>
              </Grid.Column>
              <Grid.Column mobile={6}>
                <p className="label">Permit available</p>
                <p className="info">
                  {permitingAuthority[0].permitAvailable ? (
                    <UniversalLink
                      href={permitingAuthority[0].permitAvailable || '#'}
                      openLinkInNewTab={true}
                      title={permitingAuthority[0].permitAvailable}
                    >
                      {permitingAuthority[0].permitAvailable}
                    </UniversalLink>
                  ) : (
                    '-'
                  )}
                </p>
              </Grid.Column>
              <Grid.Column mobile={6}>
                <p className="label">Seveso</p>
                <p className="info">{permitingAuthority[0].seveso || '-'}</p>
              </Grid.Column>
              <Grid.Column mobile={12}>
                <p className="label">Status</p>
                <p className="info">
                  {permitingAuthority[0].entityStatus || '-'}
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default PermitingAuthority;
