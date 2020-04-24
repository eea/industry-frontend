/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Button, Input, Dropdown, Radio } from 'semantic-ui-react';
import downSVG from '@plone/volto/icons/down-key.svg';
import { Icon } from '@plone/volto/components';
import { options, sites, quickFacts, tableItems } from './browseConstants';

class BrowseView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'map',
            checkedSite: {
                label: "Show All",
                value: "all"
            },
            selectedTableItem: undefined
        };
    }

    handleSelector(selectedTab) {
        if (selectedTab === 'map') { this.setState({ selectedTab }) }
        if (selectedTab === 'table') { this.setState({ selectedTab }) }
    }

    handleSelectSite(site) {
        this.setState({ checkedSite: site })
    }

    handleContentDetail(item) {
        console.log(item)
        this.setState({ selectedTableItem: item })
    }

    render() {
        const isMap = this.state.selectedTab === 'map';


        return (
            <div className="browse-area">
                <Grid>
                    <Grid.Row centered verticalAlign="middle">
                        <button className="view-button">
                            VIEW YOUR AREA
                        </button>
                        <p className="browse-text">or</p>
                        <Input className="browse-input" icon='search' iconPosition='left' placeholder='Try searching for a facility name, country, city, region or ZIP code' />
                    </Grid.Row>
                    <Grid.Row centered>
                        <div className='centered-selector-row'>
                            <button onClick={() => this.handleSelector("map")} className={`browse-button ${isMap ? "red-selected" : "red"}`}>MAP</button>
                            <button onClick={() => this.handleSelector("table")} className={`browse-button ${!isMap ? "red-selected" : "red"}`}>TABLE</button>
                        </div>
                        <div className="spaced-row">
                            <button className="browse-button advanced-red">ADVANCED FILTERING OPTIONS</button>
                            <button className="browse-button blue">SEARCH</button>
                        </div>
                    </Grid.Row>
                    <Grid.Row>
                        <div style={{ padding: "10px", width: "100%", position: 'relative' }}>
                            {isMap &&
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
                                                        checked={this.state.checkedSite.value === item.value}
                                                        onChange={() => this.handleSelectSite(item)}
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
                                </React.Fragment>
                            }
                            {!isMap &&
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
                                                        <a style={{ cursor: "pointer" }} onClick={() => this.handleContentDetail(item)}>
                                                            <Icon color="red" name={downSVG} size="3em" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </Grid.Row>
                                            {this.state.selectedTableItem && this.state.selectedTableItem.id === item.id &&
                                                <Grid.Row stretched width={8}>

                                                    <Grid.Column stretched={false} width={2}>
                                                        <p className="details-title">Facility Contents</p>
                                                        {item.facilityContents &&
                                                            item.facilityContents.map(content =>
                                                                <a className="details-content" href={content.url}>{content.title}</a>
                                                            )
                                                        }
                                                    </Grid.Column>
                                                    <Grid.Column stretched={false} width={2}>
                                                        <p className="details-title">Pollutant emissions</p>
                                                        {item.pollutantEmissions &&
                                                            item.pollutantEmissions.map(pollutants =>
                                                                <p className="details-content">{pollutants}</p>
                                                            )
                                                        }
                                                    </Grid.Column>
                                                    <Grid.Column stretched={false} width={2}>
                                                        <p className="details-title">Regulatory information</p>
                                                        <p className="details-content">Operating since: {item.regulatoryInformation.operatingSince}</p>
                                                        <p className="details-content">Last operating permit issued: {item.regulatoryInformation.lastPermit}</p>
                                                        <p className="details-content">Last inspection: {item.regulatoryInformation.lastInspection}</p>
                                                    </Grid.Column>
                                                    <Grid.Column stretched={false} width={2}>
                                                        <button className="details-button"> VIEW FACILITY DETAIL </button>
                                                    </Grid.Column>

                                                </Grid.Row>
                                            }
                                        </React.Fragment>
                                    )}
                                </Grid>
                            }
                        </div>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

export default compose(
    injectIntl,
    connect((state, props) => ({
        pathname: props.location.pathname,
    })),
)(BrowseView);