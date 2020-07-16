import React from 'react';
import clearSVG from '@plone/volto/icons/clear.svg';
import { Icon } from '@plone/volto/components';
import { Grid } from 'semantic-ui-react';

const MapModal = ({ onClose, mapModal }) => {
  return (
    <div className="map-modal">
      <div className="modal-header">
        <p className="modal-title">Parent company name</p>
        <Icon
          onClick={() => onClose()}
          color="red"
          name={clearSVG}
          size="2em"
        />
      </div>
      <p className="modal-label">Chemical industry</p>
      <p style={{ marginBottom: '5px', borderBottom: '1px solid grey' }}>
        Address 1, Address 2
      </p>

      <Grid.Column stretched>
        <Grid.Row>
          <p className="modal-label">Site Contents</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {mapModal.facilityContents &&
              mapModal.facilityContents.map(content => (
                <a className="details-link" href={content.url}>
                  {content.title}
                </a>
              ))}
          </div>
        </Grid.Row>
        <Grid.Row>
          <p className="modal-label">Pollutant emissions</p>
          {mapModal.pollutantEmissions &&
            mapModal.pollutantEmissions.map(pollutants => (
              <p className="details-content">{pollutants}</p>
            ))}
          <a className="details-link" href={'google.com'}>
            15 more...
          </a>
        </Grid.Row>
        <Grid.Row>
          <p className="modal-label">Regulatory information</p>
          <p className="details-content">
            Operating since: {mapModal.regulatoryInformation.operatingSince}
          </p>
          <p className="details-content">
            Last operating permit issued:{' '}
            {mapModal.regulatoryInformation.lastPermit}
          </p>
          <p className="details-content">
            Last inspection: {mapModal.regulatoryInformation.lastInspection}
          </p>
          <a className="details-link" href={'google.com'}>
            Find out more
          </a>
        </Grid.Row>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="details-button"> VIEW SITE DETAIL </button>
        </div>
      </Grid.Column>
    </div>
  );
};

export default MapModal;
