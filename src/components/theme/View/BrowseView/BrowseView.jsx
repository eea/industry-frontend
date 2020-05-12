/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Input } from 'semantic-ui-react';
import BrowseTable from './BrowseTable';
import BrowseMap from './BrowseMap';

class BrowseView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'map',
        };
    }

    handleSelector(selectedTab) {
        if (selectedTab === 'map') { this.setState({ selectedTab }) }
        if (selectedTab === 'table') { this.setState({ selectedTab }) }
    }

    render() {
        const { selectedTab } = this.state;

        const isMap = selectedTab === 'map';

        return (
            <div className="browse-area">
                <div className="header-bar">
                    <div className="header-wrapper">
                        <p className="bar-item selected">Industrial emissions</p>
                        <p className="bar-item">Diffuse emissions</p>
                    </div>
                </div>
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
                        <div className="browse-content-area">
                            {isMap &&
                                <BrowseMap />
                            }
                            {!isMap &&
                                <BrowseTable />
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