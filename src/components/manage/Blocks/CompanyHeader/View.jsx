import React, { useState } from 'react';
import DB from '~/components/manage/DataBase/DB';

import DefaultView from '../DefaultView';

import moment from 'moment';
import './style.css';

//  STATIC DATA
//  ==================
const facility = {
  companyName: 'Test company',
  Address: 'Nord-Ovest, Lombardia, Brescia',
  countryCode: 'IT',
  'Site Inspire ID': '2',
  Country: "Austria",
  Regulation: 'regulatoryType',
  Website: 'test-website.com',
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
  { label: 'Name', id: 'companyName' },
  { label: 'Address', id: 'Address' },
  { label: 'Country', id: 'Country' },
  { label: 'Regulation', id: 'Regulation' },
  { label: 'Website', id: 'Website' },
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
          <h1 className="mb-0 bold light-blue">{facility.companyName}</h1>
          <p>{facility.mainActivity}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-row space-between responsive metadata">
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
