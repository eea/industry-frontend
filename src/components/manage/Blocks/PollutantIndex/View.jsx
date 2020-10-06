/* REACT */
import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Tab, Dropdown, Table } from 'semantic-ui-react';
import qs from 'query-string';
import cx from 'classnames';
import './style.css';

const panes = [
  {
    menuItem: 'General information',
    render: (props) => {
      return (
        <Tab.Pane>
          <RenderTable
            className="description-table"
            celled={false}
            headless={true}
            headers={[
              { key: 'label', value: 'Label' },
              { key: 'value', value: 'Value' },
            ]}
            rows={[
              { label: 'E-PRTR Pollutant No', value: '9' },
              { label: 'IUPAC Name', value: 'Methane' },
              { label: 'IUPAC Name', value: 'Methane' },
            ]}
          />
          <h3>Description</h3>
          <h3>Main Uses</h3>
          <h3>Where do the releases originate?</h3>
          <h3>How do the releases affect you and your environment?</h3>
        </Tab.Pane>
      );
    },
  },
  {
    menuItem: 'Pollutant Group',
    render: () => (
      <Tab.Pane>
        <h3>Pollutant Group - Greenhouse Gases</h3>
        <p className="bold">Group members</p>
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Pollutant thresholds',
    render: () => (
      <Tab.Pane>
        <h3>Pollutant Group - Greenhouse Gases</h3>
        <p className="bold">Threshold for releases</p>
        <RenderTable
          celled={false}
          headless={false}
          headers={[
            { key: 'to_air', value: 'to air kg/year' },
            { key: 'to_water', value: 'to water kg/year' },
            { key: 'to_land', value: 'to land kg/year' },
          ]}
          rows={[
            { to_air: '100 000', to_water: '*', to_land: '*' },
            { to_air: '100 000', to_water: '*', to_land: '*' },
            { to_air: '100 000', to_water: '*', to_land: '*' },
          ]}
        />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Measurements and calculations methods',
    render: () => (
      <Tab.Pane>
        <h3>Methods and uncertainty</h3>
        <RenderTable
          className="description-table"
          celled={false}
          headless={false}
          headers={[
            { key: 'to_air', value: 'to air kg/year' },
            { key: 'to_water', value: 'to water kg/year' },
            { key: 'to_land', value: 'to land kg/year' },
          ]}
          rows={[
            { to_air: '100 000', to_water: '*', to_land: '*' },
            { to_air: '100 000', to_water: '*', to_land: '*' },
            { to_air: '100 000', to_water: '*', to_land: '*' },
          ]}
        />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Synonyms or other commercial names',
    render: () => <Tab.Pane>Tab 2 Content</Tab.Pane>,
  },
  {
    menuItem: 'Other relevant reporting requirements',
    render: () => <Tab.Pane>Tab 2 Content</Tab.Pane>,
  },
];

const RenderTable = (props) => {
  const { headless = false, headers = [], rows = [] } = props;
  return (
    <Table
      celled={props.celled}
      className={cx(props.className, headless ? 'headless' : '')}
      columns={headers.length}
    >
      {!headless && headers.length > 0 && (
        <Table.Header>
          <Table.Row>
            {headers.map((header, headerIndex) => (
              <Table.HeaderCell key={`${headerIndex}_header`}>
                {header.value}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
      )}
      <Table.Body>
        {rows.length > 0 &&
          headers.length > 0 &&
          rows.map((row, rowIndex) => (
            <Table.Row key={`${rowIndex}_row`}>
              {headers.map((header, headerIndex) => (
                <Table.Cell key={`${headerIndex}_cell`}>
                  {row[header.key]}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

const View = ({ content, ...props }) => {
  const [activeTab, setActiveTab] = useState(0);
  const pollutionType = [
    {
      key: 'airPollutionPerCapita',
      value: 'airPollutionPerCapita',
      text: 'Air',
      labelText: 'air pollution per capita',
    },
    {
      key: 'waterPollutionPerCapita',
      value: 'waterPollutionPerCapita',
      text: 'Water',
      labelText: 'water pollution per capita',
    },
  ];
  return (
    <div className="pollutant-index-container">
      <div className="custom-selector big blue display-flex">
        <Dropdown
          selection
          onChange={(event, data) => {}}
          placeholder={'Pollutant Group'}
          options={pollutionType}
        />
        <Dropdown
          selection
          onChange={(event, data) => {}}
          placeholder={'Pollutant'}
          options={pollutionType}
        />
      </div>
      <Tab
        activeIndex={activeTab}
        panes={panes}
        onTabChange={(event, data) => {
          setActiveTab(data.activeIndex);
        }}
      />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    query: state.router.location.search,
    search: state.discodata_query.search,
  })),
)(View);
