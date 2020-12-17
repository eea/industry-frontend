import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom';
import {
  setQueryParam,
  deleteQueryParam,
} from '@eeacms/volto-datablocks/actions';
import './style.css';

const View = (props) => {
  const {
    siteInspireId = null,
    lcpInspireId = null,
    siteReportingYear = null,
  } = props.discodata_query.search;
  const { site_details_4 = {} } = props.discodata_resources.data;
  const data = site_details_4[siteInspireId] || null;
  const lcp = {
    ...(data?.euregReportingYears?.[siteReportingYear]?.filter(
      (part) => part.lcpInspireId === lcpInspireId,
    )?.[0] || {}),
  };
  return props.mode === 'edit' ? (
    <p>Lcp details</p>
  ) : (
    <>
      {Object.keys(lcp).length ? (
        <div className="lcp-details">
          <h3 className="blue mb-1">{lcp.installationPartName}</h3>
          <p className="info mb-0">
            This large-scale fuel combustion plant is linked to:
          </p>
          <p className="mb-1">
            <Link
              to={
                '/industrial-site/pollutant-releases-and-transfers/site-overview/facility-overview'
              }
              title={lcp.FacilityNameInspireID}
              onClick={() => {
                props.deleteQueryParam({
                  queryParam: ['installationInspireId', 'lcpInspireId'],
                });
              }}
            >
              {lcp.FacilityNameInspireID}
            </Link>
          </p>
          {/* LCP DETAILS */}
          <div className="row mb-1">
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">Plant Type</p>
              <p className="info">{lcp.plantType}</p>
            </div>
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">Total rated thermal input</p>
              <p className="info">
                {lcp.totalRatedThermalInput
                  ? lcp.totalRatedThermalInput
                  : 'unspecified'}
              </p>
            </div>
          </div>
          <div className="row mb-1">
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">Untreated municipal waste treate</p>
              <p className="info">
                {lcp.untreatedMunicipalWaste ? 'yes' : 'no'}
              </p>
            </div>
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">Specific conditions apply?</p>
              <p className="info">
                {lcp.specificConditions ? lcp.specificConditions : 'no'}
              </p>
            </div>
          </div>
          <div className="row mb-1">
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">
                Significant hazardous waste incinerated
              </p>
              <p className="info">
                {lcp.heatReleaseHazardousWaste ? 'yes' : 'no'}
              </p>
            </div>
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">Nominal capacity</p>
              <p className="info">
                {lcp.totalNominalCapacityAnyWaste
                  ? lcp.totalNominalCapacityAnyWaste
                  : 'unspecified'}
              </p>
            </div>
          </div>

          <ReactTooltip />
        </div>
      ) : (
        ''
      )}
    </>
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
