import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import {
  setQueryParam,
  deleteQueryParam,
} from 'volto-datablocks/actions';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import infoSVG from '@plone/volto/icons/info.svg';
import CompetentAuthority from '../CompetentAuthority';
import { getDate } from '../helpers';
import './style.css';

const View = (props) => {
  const {
    siteInspireId = null,
    facilityInspireId = null,
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
  const facility = data_2?.facilities?.[facilityInspireId] || [];

  const competentAuthority =
    siteReportingYear && facility
      ? facility
          .filter(
            (report) =>
              report.euregReportingYears === siteReportingYear &&
              report.facilityOrganizationName,
          )
          .map((report) => ({
            organizationName: report.facilityOrganizationName,
            contactPerson: report.facilityContactPerson,
            address: report.facilityAddress,
            email: report.facilityContactMail,
            authLastUpdated: getDate(report.eprtrAuthLastUpdated),
          }))
      : [];

  return props.mode === 'edit' ? (
    <p>Facility details</p>
  ) : (
    <>
      {Object.keys(site).length ? (
        <div className="facility-details">
          {facility?.[0] ? (
            <div>
              <h3 className="blue mb-0">{facility[0]?.facilityName}</h3>
              <p className="light-blue bold mb-0">Industrial activity</p>
              <p className="info mb-1-super display-flex">
                <span style={{ marginRight: '0.3rem' }}>
                  {facility[0]?.facilityIndustrialActivity}{' '}
                  {facility[0]?.facilityMainActivity}
                </span>
                {/* <span
                  className="floating-icon"
                  data-tip={'This is a tooltip 2'}
                >
                  <Icon
                    className="firefox-icon"
                    name={infoSVG}
                    size="20"
                    color="#D63D27"
                  />
                </span> */}
              </p>
            </div>
          ) : (
            ''
          )}
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
