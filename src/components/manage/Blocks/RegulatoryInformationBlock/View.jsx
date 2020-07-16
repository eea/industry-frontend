import React, { useState } from 'react';
import { Table } from 'semantic-ui-react';

import DefaultView from '../DefaultView';
import '../style.css';

//  STATIC DATA
//  ==================
const operatingPermitMetadata = [
  { label: 'Permit updated', id: 'permitUpdated' },
  { label: 'Permitting authority', id: 'permitAuthority' },
  { label: 'Permit available', id: 'permitUrl' },
  { label: 'Seveso', id: 'seveso' },
  { label: 'Site visits in 2018', id: 'visits' },
];
const aboutEntityMetadata = [
  { label: 'Regulated activities', id: 'regulatedActivities' },
  { label: 'Status', id: 'statusType' },
  { label: 'Seveso', id: 'seveso' },
];

const batMetadata = [
  { label: 'Status', id: 'status' },
  { label: 'Status Modified', id: 'statusModified' },
];
//  ==================

const GridMetadata = props => {
  const { metadata, metadataKeys, gridColumns } = props;
  return (
    <div className={`grid grid-cl-${gridColumns}`}>
      {metadata &&
        metadataKeys.map((meta, index) =>
          metadata[meta.id] ? (
            <div key={`grid-${index}-${meta.id}`}>
              <p className="bold mb-0">{meta.label}</p>
              <p className="info dark">[{metadata[meta.id]}]</p>
            </div>
          ) : (
            ''
          ),
        )}
    </div>
  );
};

const View = props => {
  const [state, setState] = useState({
    items: [],
    onChange: newState => {
      setState({ ...state, ...newState });
    },
  });
  const view = (
    <div className="regulatory-information-block-wrapper">
      <div className="flex flex-column">
        <h1 className="bold light-blue">About the entity</h1>
        <GridMetadata
          gridColumns="2"
          metadata={state.items[0]}
          metadataKeys={aboutEntityMetadata}
        />
      </div>
      <div className="flex flex-column mt-2">
        <h1 className="bold light-blue">BAT Conlcussions</h1>
        <div className="bat-container">
          <a href={state.items[0]?.batPath} className="display-block mb-1">
            {state.items[0]?.batFileName}
          </a>
          <GridMetadata
            gridColumns="2"
            metadata={state.items[0]}
            metadataKeys={batMetadata}
          />
          <div className="hr mt-1 mb-1" />
          <div className="align-center">
            <a href={state.items[0]?.batPath}>View BAT AELs</a>
          </div>
        </div>
      </div>
      <div className="flex flex-column mt-2">
        <h1 className="bold light-blue">Operating permit</h1>
        <GridMetadata
          gridColumns="2"
          metadata={state.items[0]}
          metadataKeys={operatingPermitMetadata}
        />
      </div>
      <div className="flex flex-column mt-2">
        <h1 className="bold light-blue">BAT Derogations</h1>
        {/* <Table> */}
        {/* ==== TABLE HEADER ==== */}
        {/* <Table.Header>
            <Table.Row>
              {Object.keys(state.items[0]?.derogations[0]).map(header => (
                <Table.HeaderCell key={`header-${header}`}>
                  {header}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header> */}
        {/* ==== TABLE BODY ==== */}
        {/* <Table.Body>
            {state.items[0]?.derogations.map((row, index) => (
              <Table.Row key={`tr-${index}`}>
                {Object.keys(row).map(cell => (
                  <Table.Cell key={`cell-${cell}`}>{row[cell]}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table> */}
      </div>
    </div>
  );
  return <DefaultView {...props} view={view} onChange={state.onChange} />;
};

export default View;
