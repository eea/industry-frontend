import React, { useState } from 'react';
import { Grid, Dropdown, Radio } from 'semantic-ui-react';
import { options, sites, quickFacts, tableItems } from './browseConstants';
import MapModal from './MapModal';

const BrowseMap = () => {

    const [mapModal, setMapModal] = useState(undefined);
    const [checkedSite, setCheckedSite] = useState({label: "Show All",value: "all"})

    return (
        <React.Fragment>
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d252073.50646166946!2d24.240267324149645!3d45.730190540367225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sro!4v1587553242878!5m2!1sen!2sro"
                width="100%"
                height="900"
                frameBorder="0"
                //  style="border:0;" 
                allowFullScreen="false"
                aria-hidden="false"
                tabIndex="0"></iframe>
            <div className="search-map-menu">
                <Grid.Column>
                    <p className="menu-title">Dynamic filter
    </p>
                    <p className="menu-label">Reporting year</p>
                    <Dropdown
                        fluid
                        selection
                        value="All reporting years"
                        options={options}
                    />
                    <p className="menu-label">Industrial sites in this area</p>
                    {sites.map((item, index) =>
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
                    )}
                    <p className="menu-title">Quick facts</p>
                    {
                        quickFacts.map(fact =>
                            <div className="quick-fact-card">
                                <p className="menu-label">{fact.title}</p>
                                <p className="card-content">{fact.reportingSites} reporting sites</p>
                                <p className="card-content">Most common industry: {fact.commonIndustry} industry</p>
                                <p className="card-content">Most common pollutant: {fact.commonPollutant}</p>
                            </div>
                        )
                    }

                </Grid.Column>
            </div>
            <button className="map-modal-button" onClick={() => setMapModal(tableItems[0])}>Map Detail</button>
            {
                mapModal &&
                <MapModal mapModal={mapModal} onClose={() => setMapModal(undefined)} />
            }
        </React.Fragment>
    );
}

export default BrowseMap;