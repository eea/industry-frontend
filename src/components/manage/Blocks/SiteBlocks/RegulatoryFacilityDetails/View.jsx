import React from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { setQueryParam, deleteQueryParam } from 'volto-datablocks/actions';
import _uniqueId from 'lodash/uniqueId';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import RenderTable from '../RenderTable';
import moment from 'moment';
import cx from 'classnames';
import { getDate, getLonLat } from '../helpers';
import infoSVG from '@plone/volto/icons/info.svg';
import './style.css';

const View = (props) => {
  const history = useHistory();
  const {
    siteInspireId = null,
    siteReportingYear = null,
  } = props.discodata_query.search;
  const {
    site_details_1 = {},
    site_details_2 = {},
  } = props.discodata_resources.data;
  const data_1 = site_details_1[siteInspireId] || null;
  const data_2 = site_details_2[siteInspireId] || null;
  const site = {
    ...(data_1?.euregReportingYears?.[siteReportingYear]?.[0] || {}),
    ...(data_2?.euregReportingYears?.[siteReportingYear]?.[0] || {}),
  };
  const facilities = data_1?.facilities || {};

  return props.mode === 'edit' ? (
    <p>Site details</p>
  ) : (
    <div>
      {Object.keys(site).length ? (
        <div className="site-details">
          {/* ABOUT THE ENTITY */}
          <div className={cx('header-tooltip')}>
            <h3 className="blue">About the entity</h3>
            <span className="floating-icon" data-tip={'This is a tooltip'}>
              <Icon
                className="firefox-icon"
                name={infoSVG}
                size="20"
                color="#D63D27"
              />
            </span>
          </div>
          {/* BAT CONCLUSION */}
          <div className={cx('header-tooltip')}>
            <h3 className="blue">BAT conclusions</h3>
            <span className="floating-icon" data-tip={'This is a tooltip'}>
              <Icon
                className="firefox-icon"
                name={infoSVG}
                size="20"
                color="#D63D27"
              />
            </span>
          </div>
          {/* OPERATING PERMIT */}
          <div className={cx('header-tooltip')}>
            <h3 className="blue">Operating permit</h3>
            <span className="floating-icon" data-tip={'This is a tooltip'}>
              <Icon
                className="firefox-icon"
                name={infoSVG}
                size="20"
                color="#D63D27"
              />
            </span>
          </div>
          {/* BAT DEROGATIONS */}
          <div className={cx('header-tooltip')}>
            <h3 className="blue">BAT derogations</h3>
            <span className="floating-icon" data-tip={'This is a tooltip'}>
              <Icon
                className="firefox-icon"
                name={infoSVG}
                size="20"
                color="#D63D27"
              />
            </span>
          </div>
          <ReactTooltip />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: state.router.location.search,
      discodata_query: state.discodata_query,
      discodata_resources: state.discodata_resources,
    }),
    {
      setQueryParam,
      deleteQueryParam,
    },
  ),
)(View);
