import React, { useState } from 'react';
import { Grid, Dropdown, Radio } from 'semantic-ui-react';
import { options, sites, quickFacts, tableItems } from './browseConstants';
import MapModal from './MapModal';
import MapView from 'volto-addons/WebMap/WebMap';

const BrowseMap = () => {
  const [mapModal, setMapModal] = useState(undefined);
  const [checkedSite, setCheckedSite] = useState({
    label: 'Show All',
    value: 'all',
  });

  return (
    <React.Fragment>
      {/* <iframe src="https://maps.eea.europa.eu/EEAViewer/?appid=dee1fa0f864e4f8a9e088c83231a9f02&embed=true"
                width="100%"
                height="900"
                frameBorder="0"
                //  style="border:0;" 
                allowFullScreen="false"
                aria-hidden="false"
                tabIndex="0"></iframe> */}
      <MapView
        mapId="8672e3aa1a0d4f47a3a538a27140d67f"
        showLegend={false}
        // showLayers={true}
        //   props.showCoordWidget,
        zoom={10}
        portalUrl="https://eea.maps.arcgis.com"
        //   props.latitude,
        //   props.longitude,
      />
      <div className="search-map-menu">
        <Grid.Column>
          <p className="menu-title">Dynamic filter</p>
          <p className="menu-label">Reporting year</p>
          <Dropdown
            fluid
            selection
            value="All reporting years"
            options={options}
          />
          <p className="menu-label">Industrial sites in this area</p>
          {sites.map((item, index) => (
            <Grid.Row>
              <Radio
                key={index}
                label={item.label}
                value={item.value}
                className="menu-radio"
                checked={checkedSite.value === item.value}
                onChange={() => setCheckedSite(item)}
              />
            </Grid.Row>
          ))}
          <p className="menu-title">Quick facts</p>
          {quickFacts.map(fact => (
            <div className="quick-fact-card">
              <p className="menu-label">{fact.title}</p>
              <p className="card-content">
                {fact.reportingSites} reporting sites
              </p>
              <p className="card-content">
                Most common industry: {fact.commonIndustry} industry
              </p>
              <p className="card-content">
                Most common pollutant: {fact.commonPollutant}
              </p>
            </div>
          ))}
        </Grid.Column>
      </div>
      <button
        className="map-modal-button"
        onClick={() => setMapModal(tableItems[0])}
      >
        Map Detail
      </button>
      {mapModal && (
        <MapModal mapModal={mapModal} onClose={() => setMapModal(undefined)} />
      )}
    </React.Fragment>
  );
};

export default BrowseMap;
