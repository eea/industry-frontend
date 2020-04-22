/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Button, Input } from 'semantic-ui-react';

class BrowseView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: null,
        };
    }

    render() {
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
                    <div>
                        <button className="browse-button red-selected">MAP</button>
                        <button className="browse-button red">TABLE</button>
                    </div>
                    <div>
                        <button className="browse-button red-selected">ADVANCED FILTERING OPTIONS</button>
                        <button className="browse-button blue">SEARCH</button>
                    </div>
                </Grid.Row>
                <Grid.Row>
                    <div style={{ padding: "10px", width: "100%", position: 'relative' }}>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d252073.50646166946!2d24.240267324149645!3d45.730190540367225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sro!4v1587553242878!5m2!1sen!2sro"
                            width="100%"
                            height="900"
                            frameborder="0"
                            //  style="border:0;" 
                            allowfullscreen="false"
                            aria-hidden="false"
                            tabindex="0"></iframe>
                        <div style={{
                            position: "absolute",
                            top: "10px",
                            background: "white",
                            left: "10%",
                            height: "100%",
                            width: "250px",
                            padding: "10px 40px",
                        }}>
                            <Grid.Column>
                                <p>Dynamic filter
                                </p>
                                <p>Reporting year</p>
                            </Grid.Column>
                        </div>
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