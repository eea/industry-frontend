import React from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import {
  setQueryParam,
  deleteQueryParam,
} from '@eeacms/volto-datablocks/actions';
import _uniqueId from 'lodash/uniqueId';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import CompetentAuthority from '../CompetentAuthority';
import { getDate, getLonLat } from '../helpers';
import cx from 'classnames';
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

  const competentAuthority =
    siteReportingYear && data_1?.euregReportingYears?.[siteReportingYear]
      ? data_1.euregReportingYears[siteReportingYear]
          .filter(
            (report) =>
              report.euregReportingYears === siteReportingYear &&
              report.organizationName,
          )
          .map((report) => ({
            organizationName: report.organizationName,
            contactPerson: report.contactPerson,
            address: report.authAddress,
            email: report.contactMail,
            authLastUpdated: getDate(report.authLastUpdated),
          }))
      : [];

  return props.mode === 'edit' ? (
    <p>Site details</p>
  ) : (
    <>
      {Object.keys(site).length ? (
        <div className="site-details">
          {/* BLUE BANNER */}
          {site.authLastUpdated ? (
            <div className="eprtrBanner blue pa-1 pl-3-super pr-3-super">
              <div className="row">
                <div
                  className={cx(
                    site.eprtrReportingYear
                      ? 'xs-6 sm-6 md-6 lg-6'
                      : 'xs-12 sm-12 md-12 lg-12',
                    'mb-0',
                  )}
                >
                  {/* <span
                    className="floating-icon"
                    data-tip={'This is a tooltip'}
                  >
                    <Icon
                      className="firefox-icon"
                      name={infoSVG}
                      size="20"
                      color="#fff"
                    />
                  </span> */}
                  <p className="lighter mb-0">Last report was submitted on:</p>
                  <p className="bold" style={{ marginBottom: '0' }}>
                    {getDate(site.authLastUpdated)}
                  </p>
                </div>
                {site.eprtrReportingYear ? (
                  <div className="xs-6 sm-6 md-6 lg-6">
                    <p className="lighter mb-0">EPRTR reporting year</p>
                    <p className="bold" style={{ marginBottom: '0' }}>
                      {site.eprtrReportingYear}
                    </p>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          ) : (
            ''
          )}
          {/* FACILITIES LIST */}
          <h3 className="blue mt-2 mb-0">List of facilities</h3>
          <ol className="list mb-2">
            {Object.keys(facilities).map((facility) => (
              <li key={_uniqueId('li-')}>
                <button
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    props.setQueryParam({
                      queryParam: {
                        facilityInspireId: facility,
                      },
                    });
                    if (
                      props.path !==
                      '/industrial-site/pollutant-releases-and-transfers/site-overview/facility-overview'
                    ) {
                      history.push(
                        '/industrial-site/pollutant-releases-and-transfers/site-overview/facility-overview',
                      );
                    }
                  }}
                >
                  {facility}
                </button>
              </li>
            ))}
          </ol>
          {/* SITE DETAILS */}
          <div className="row mb-1">
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">Coordinates</p>
              <p className="info">{getLonLat(site.shape_wm_as_text)}</p>
            </div>
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">NUTS Region</p>
              <p className="info">{site.NUTS}</p>
            </div>
          </div>
          <div className="row mb-1">
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">National ID</p>
              <p className="info">{site.nationalId}</p>
            </div>
            <div className="detail xs-6 sm-6 md-6 lg-6">
              <p className="bold mb-0">River Basin District</p>
              <p className="info">{site.riverBasin}</p>
            </div>
          </div>
          <div className="row mb-2">
            <div className="detail xs-12 sm-12 md-12 lg-12">
              <p className="bold mb-0">Main Activity</p>
              <p className="info">{site.mainActivity}</p>
            </div>
          </div>
          <CompetentAuthority competentAuthority={competentAuthority} />
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
