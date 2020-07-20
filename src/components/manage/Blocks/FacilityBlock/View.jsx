import React, { useState } from 'react';
import moment from 'moment';

import DefaultView from '../DefaultView';
import '../style.css';

//  STATIC DATA
//  ==================
const metadata = [
  { label: 'Name', id: 'siteName' },
  { label: 'Contact Person', id: 'ContactPerson' },
  { label: 'Phone', id: 'ContactPhone', default: '++421-2-59415291' },
  { label: 'Address', id: 'Auth Address' },
  { label: 'E-mail', id: 'ContactMail' },
];
//  ==================

const View = props => {
  const [state, setState] = useState({
    items: [],
    onChange: newState => {
      setState({ ...state, ...newState });
    },
  });
  const view = (
    <div className="facility-block-wrapper">
      <div className="flex flex-row align-center space-between responsive">
        <div className="flex flex-column mr-3 w-40">
          <h1 className="mb-0 bold light-blue">[facilityName1]</h1>
          <p className="mb-0 bold light-blue">Industrial activity</p>
          <p>{state.items?.[0]?.mainActivity}</p>
        </div>
        <div className="banner flex">
          <div className="flex-item">
            <p className="lighter">Last report was submitted on:</p>
            <p className="bold">
              {moment(state.items?.[0]?.eprtrReportingDate).format(
                'DD MMM YYYY',
              )}
            </p>
          </div>
          <div className="flex-item">
            <p className="bold">Reporting year</p>
            <p className="lighter">{state.items?.[0]?.eprtrReportingYear}</p>
          </div>
          <div className="flex-item">
            <p className="bold">Publish date</p>
            <p className="lighter">
              {moment(state.items?.[0]?.eprtrReportingDate).format(
                'DD MMM YYYY',
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h1 className="mb-0 bold light-blue">Competent Authority</h1>
        <p className="info">
          Last updated:{' '}
          {moment(state.items?.[0]?.authLastUpdated).format('DD MMM YYYY')}
        </p>
      </div>
      <div className="mt-2 grid grid-cl-3 responsive metadata">
        {metadata.map(meta =>
          state.items?.[0]?.[meta.id] ? (
            <div>
              <p className="bold mb-0">{meta.label}</p>
              <p className="info dark">{state.items?.[0]?.[meta.id]}</p>
            </div>
          ) : meta.default ? (
            <div>
              <p className="bold mb-0">{meta.label}</p>
              <p className="info dark">{meta.default}</p>
            </div>
          ) : (
            ''
          ),
        )}
      </div>
    </div>
  );
  return <DefaultView {...props} view={view} onChange={state.onChange} />;
};

export default View;
