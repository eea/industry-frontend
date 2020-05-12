import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import downSVG from '@plone/volto/icons/down-key.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';
import { Icon } from '@plone/volto/components';
import { tableItems } from './browseConstants';

const BrowseTable = () => {

    const [selectedItem, setSelectedItem] = useState()

    return (
        <div className="browse-table">
            <Grid centered>
                <Grid.Row>
                    <div className="table-head">
                        <p style={{ width: "25.5%" }} className="table-title"> Facility </p>
                        <p style={{ width: "15%" }} className="table-title"> Postal Code </p>
                        <p style={{ width: "15%" }} className="table-title"> Address </p>
                        <p style={{ width: "15%" }} className="table-title"> Town/Village </p>
                        <p style={{ width: "15%" }} className="table-title"> Activity </p>
                        <p style={{ width: "15%" }} className="table-title"> Country </p>
                    </div>
                </Grid.Row>
                {tableItems.map(item =>
                    <React.Fragment>
                        <Grid.Row>
                            <div className="table-row">
                                <p style={{ width: "25%" }} className="table-content"> {item.facility} </p>
                                <p style={{ width: "15%" }} className="table-content"> {item.postal} </p>
                                <p style={{ width: "15%" }} className="table-content"> {item.adress} </p>
                                <p style={{ width: "15%" }} className="table-content"> {item.city} </p>
                                <p style={{ width: "15%" }} className="table-content"> {item.activity} </p>
                                <div style={{ width: "15%", display: 'flex' }}>
                                    <p className="table-content"> {item.Country} </p>
                                    <a style={{ cursor: "pointer" }} onClick={() => setSelectedItem(item)}>
                                        <Icon color="red" name={selectedItem && selectedItem.id === item.id ? downSVG : rightSVG} size="3em" />
                                    </a>
                                </div>
                            </div>
                        </Grid.Row>
                        {selectedItem && selectedItem.id === item.id &&
                            <Grid.Row style={{ paddingBottom: "50px" }} stretched width={8}>
                                <Grid.Column stretched={false} computer={2} mobile={8} tablet={8}>
                                    <p className="details-title">Facility Contents</p>
                                    {item.facilityContents &&
                                        item.facilityContents.map(content =>
                                            <a className="details-link" href={content.url}>{content.title}</a>
                                        )
                                    }
                                </Grid.Column>
                                <Grid.Column stretched={false} computer={2} mobile={8} tablet={8}>
                                    <p className="details-title">Pollutant emissions</p>
                                    {item.pollutantEmissions &&
                                        item.pollutantEmissions.map(pollutants =>
                                            <p className="details-content">{pollutants}</p>
                                        )
                                    }
                                    <a className="details-link" href={'google.com'}>15 more...</a>
                                </Grid.Column>
                                <Grid.Column stretched={false} computer={2} mobile={8} tablet={8}>
                                    <p className="details-title">Regulatory information</p>
                                    <p className="details-content">Operating since: {item.regulatoryInformation.operatingSince}</p>
                                    <p className="details-content">Last operating permit issued: {item.regulatoryInformation.lastPermit}</p>
                                    <p className="details-content">Last inspection: {item.regulatoryInformation.lastInspection}</p>
                                    <a className="details-link" href={'google.com'}>Find out more</a>
                                </Grid.Column>
                                <Grid.Column stretched={false} computer={2} mobile={8} tablet={8} >
                                    <button className="details-button"> VIEW FACILITY DETAIL </button>
                                </Grid.Column>

                            </Grid.Row>
                        }
                    </React.Fragment>
                )}
            </Grid>
        </div>
    );
}

export default BrowseTable;