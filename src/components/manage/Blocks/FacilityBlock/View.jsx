import React, { useState } from 'react';
import DB from '~/components/manage/DataBase/DB';

import DefaultView from '../DefaultView';

import moment from 'moment';
import './style.css';

//  STATIC DATA
//  ==================
const facility = {
  siteName: ' "ASM BRESCIA" - BOSCO SELLA',
  countryCode: 'IT',
  'Site Inspire ID': '2',
  mainActivity:
    '1(c) Thermal power stations and other combustion installations',
  Regulation: 'regulatoryType',
  shape_wm_as_text: 'POINT (1122835 5710975)',
  NUTS: 'Nord-Ovest, Lombardia, Brescia',
  riverBasin: 'RBD PADANO',
  'Facility Main Activity':
    'Thermal power stations and other combustion installations',
  nationalId: '250452007.SITE',
  OrganizationName: 'ISPRA',
  ContactMail: 'protocollo.ispra@ispra.legalmail.it',
  'Auth Address': 'ISPRA Via Vitaliano Brancati 48 Roma 00144',
  ContactPerson: 'ISPRA',
  authLastUpdated: '2018-05-15T06:37:00',
  eprtrReportingDate: '2020-05-15T06:37:00',
  eprtrReportingYear: 2020,
  'Facility inspire ID': '2007000854',
};
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
    onChange: newState => {
      setState({ ...state, ...newState });
    },
  });
  const view = (
    <div className="facility-block-wrapper">
      <div className="flex flex-row align-center space-between responsive">
        <div className="flex flex-column">
          <h1 className="mb-0 bold light-blue">[facilityName1]</h1>
          <p>Industrial activity</p>
          <p>{facility.mainActivity}</p>
        </div>
        <div className="banner flex">
          <div className="flex-item">
            <p className="lighter">Last report was submitted on:</p>
            <p className="bold">
              {moment(facility.eprtrReportingDate).format('DD MMM YYYY')}
            </p>
          </div>
          <div className="flex-item">
            <p className="bold">Reporting year</p>
            <p className="lighter">{facility.eprtrReportingYear}</p>
          </div>
          <div className="flex-item">
            <p className="bold">Publish date</p>
            <p className="lighter">
              {moment(facility.eprtrReportingDate).format('DD MMM YYYY')}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h1 className="mb-0 bold light-blue">Competent Authority</h1>
        <p className="info">
          Last updated: {moment(facility.authLastUpdated).format('DD MMM YYYY')}
        </p>
      </div>
      <div className="mt-2 grid grid-cl-3 responsive metadata">
        {metadata.map(meta =>
          facility[meta.id] ? (
            <div>
              <p className="bold mb-0">{meta.label}</p>
              <p className="info dark">{facility[meta.id]}</p>
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
  return view;
  // return (
  //   <DefaultView
  //     {...props}
  //     schema={schema}
  //     view={view}
  //     onChange={state.onChange}
  //   />
  // );
};

export default View;
