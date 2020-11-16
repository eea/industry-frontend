import React from 'react';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import RenderTable from './RenderTable';
import cx from 'classnames';
import infoSVG from '@plone/volto/icons/info.svg';

const PermitingAuthority = (props) => {
  const permitingAuthority = props.permitingAuthority;

  return (
    <div>
      <div className={cx('header-tooltip', 'mb-1')}>
        <h3 className="blue">Permiting Authority</h3>
        <span className="floating-icon" data-tip={'This is a tooltip'}>
          <Icon
            className="firefox-icon"
            name={infoSVG}
            size="20"
            color="#D63D27"
          />
        </span>
      </div>
      {permitingAuthority.length === 0 ? (
        <p className="info mb-1-super">
          No information provided about permiting authority
        </p>
      ) : (
        ''
      )}
      {permitingAuthority.length > 1 ? (
        <div className="industrial-site">
          <RenderTable
            className="description-table"
            celled={false}
            headless={false}
            headers={[
              { key: 'permitUpdated', value: 'Permit updated' },
              { key: 'permitingAuthority', value: 'Permiting authority' },
              { key: 'permitAvailable', value: 'Permit available' },
              { key: 'seveso', value: 'Seveso' },
              { key: 'entityStatus', value: 'Status' },
            ]}
            rows={permitingAuthority}
          />
        </div>
      ) : permitingAuthority.length === 1 ? (
        <div className="industrial-site">
          <div className="row mb-1">
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">Permit updated</p>
              <p className="info">
                {permitingAuthority[0].permitUpdated || '-'}
              </p>
            </div>
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">Permiting authority</p>
              <p className="info">
                {permitingAuthority[0].permitingAuthority || '-'}
              </p>
            </div>
          </div>
          <div className="row mb-1">
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">Permit available</p>
              <p className="info">
                {permitingAuthority[0].permitAvailable || '-'}
              </p>
            </div>
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">Seveso</p>
              <p className="info">{permitingAuthority[0].seveso || '-'}</p>
            </div>
          </div>
          <div className="row mb-1">
            <div className="detail xs-12 sm-12 md-12 lg-12">
              <p className="bold mb-0">Status</p>
              <p className="info">
                {permitingAuthority[0].entityStatus || '-'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default PermitingAuthority;
