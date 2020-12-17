import React from 'react';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import RenderTable from './RenderTable';
import cx from 'classnames';
import infoSVG from '@plone/volto/icons/info.svg';

const CompetentAuthority = (props) => {
  const competentAuthority = props.competentAuthority;

  return (
    <div>
      <div
        className={cx(
          'header-tooltip',
          competentAuthority.length > 1 ? 'mb-1' : '',
        )}
      >
        <h3 className="blue">Competent Authority</h3>
        <span
          className="floating-icon"
          data-tip={
            'Authority, body or bodies responsible for regulating the facility and reporting the associated E-PRTR data, as designated by the reporting country'
          }
        >
          <Icon
            className="firefox-icon"
            name={infoSVG}
            size="20"
            color="#D63D27"
          />
        </span>
      </div>
      {competentAuthority.length === 0 ? (
        <p className="info mb-1-super">
          No information provided about competent authority
        </p>
      ) : (
        ''
      )}
      {competentAuthority.length === 1 ? (
        <p className="info mb-1">
          Last updated: {competentAuthority[0].authLastUpdated}
        </p>
      ) : (
        ''
      )}
      {competentAuthority.length > 1 ? (
        <div className="industrial-site">
          <RenderTable
            className="description-table"
            celled={false}
            headless={false}
            headers={[
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
        <div className="industrial-site">
          <div className="row mb-1">
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">Organization Name</p>
              <p className="info">{competentAuthority[0].organizationName}</p>
            </div>
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">Contact Person</p>
              <p className="info">{competentAuthority[0].contactPerson}</p>
            </div>
          </div>
          <div className="row mb-2">
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">Address</p>
              <p className="info">{competentAuthority[0].address}</p>
            </div>
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">E-mail</p>
              <p className="info">{competentAuthority[0].email}</p>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default CompetentAuthority;
