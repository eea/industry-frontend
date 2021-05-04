import React from 'react';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { Popup, Grid } from 'semantic-ui-react';
import RenderTable from './RenderTable';
import infoSVG from '@plone/volto/icons/info.svg';

const CompetentAuthority = (props) => {
  const competentAuthority = props.competentAuthority;

  return (
    <div className="competent-authority">
      <div className="title marginless">
        <h3 className="blue">Competent Authority</h3>
        <Popup
          position="top left"
          content="Authority, body or bodies responsible for regulating the facility and reporting the associated E-PRTR data, as designated by the reporting country"
          trigger={
            <div className="popup-svg">
              <Icon name={infoSVG} size={20} color="#ed776a" />
            </div>
          }
        />
      </div>
      {competentAuthority.length === 0 ? (
        <p className="info">
          No information provided about competent authority
        </p>
      ) : (
        ''
      )}
      {competentAuthority.length === 1 ? (
        <p className="info">
          Last updated: {competentAuthority[0].authLastUpdated}
        </p>
      ) : (
        ''
      )}
      {competentAuthority.length > 1 ||
      (competentAuthority.length === 1 && props.type === 'site') ? (
        <div className="site-block-table">
          <RenderTable
            className="description-table"
            celled={false}
            headless={false}
            headers={[
              ...(props.type === 'site'
                ? [
                    {
                      key: 'nth',
                      value: 'Facility',
                      popup: { key: 'facilityInspireId' },
                    },
                  ]
                : []),
              { key: 'organizationName', value: 'Organization name' },
              { key: 'contactPerson', value: 'Contact person' },
              { key: 'address', value: 'Address' },
              { key: 'email', value: 'E-mail' },
              { key: 'authLastUpdated', value: 'Last updated' },
            ]}
            rows={competentAuthority}
          />
        </div>
      ) : competentAuthority.length === 1 ? (
        <Grid columns={12}>
          <Grid.Row>
            <Grid.Column mobile={6}>
              <p className="bold mb-0">Organization Name</p>
              <p className="info">{competentAuthority[0].organizationName}</p>
            </Grid.Column>
            <Grid.Column mobile={6}>
              <p className="bold mb-0">Contact Person</p>
              <p className="info">{competentAuthority[0].contactPerson}</p>
            </Grid.Column>
            <Grid.Column mobile={6}>
              <p className="bold mb-0">Address</p>
              <p className="info">{competentAuthority[0].address}</p>
            </Grid.Column>
            <Grid.Column mobile={6}>
              <p className="bold mb-0">E-mail</p>
              <p className="info">{competentAuthority[0].email}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      ) : (
        ''
      )}
    </div>
  );
};

export default CompetentAuthority;
