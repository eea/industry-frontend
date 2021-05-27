import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import about from './images/about.png';
import analyse from './images/analyse.png';
import download from './images/download.png';
import explore from './images/explore.png';

import './styles.css';

const View = (props) => {
  return (
    <Grid className="explore-eprtr" columns="12">
      <Grid.Row>
        <Grid.Column
          className="explore-map"
          widescreen="8"
          largeScreen="8"
          computer="8"
          tablet="7"
          mobile="12"
        >
          <Link to="/explore">
            <img src={explore} alt="Explore the data" />
          </Link>
        </Grid.Column>
        <Grid.Column
          className="description"
          widescreen="4"
          largeScreen="4"
          computer="4"
          tablet="5"
          mobile="12"
        >
          <Link to="/analyse">
            <div className="explore-tile">
              <img src={analyse} alt="Analyse" />
              <div>
                <p className="title">ANALYSE</p>
                <p>
                  Find the biggest polluters and compare data across countries
                </p>
              </div>
            </div>
          </Link>
          <Link to="/download">
            <div className="explore-tile">
              <img src={download} alt="Download" />
              <div>
                <p className="title">DOWNLOAD</p>
                <p>Work with raw datasheets on your own choice of software</p>
              </div>
            </div>
          </Link>
          <Link to="/about">
            <div className="explore-tile">
              <img src={about} alt="About" />

              <div>
                <p className="title">ABOUT</p>
                <p>New to this topic?</p>
                <p>Understand the Industry portal</p>
              </div>
            </div>
          </Link>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default View;
