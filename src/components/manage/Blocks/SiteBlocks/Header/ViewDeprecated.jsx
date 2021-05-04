import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import QueryBuilder from '../QueryBuilder';
import { setQueryParam, deleteQueryParam } from 'volto-datablocks/actions';
import './style.css';

const View = (props) => {
  const {
    siteInspireId = null,
    siteReportingYear = null,
  } = props.discodata_query.search;
  const {
    site_header = {},
    reporting_years = [],
  } = props.discodata_resources.data;
  const site = site_header[siteInspireId] || null;
  const options = reporting_years
    .filter((item) => item.reportingYear)
    .map((item, index) => ({
      key: item.reportingYear || index,
      value: item.reportingYear || index,
      text: item.reportingYear || index,
    }));

  return props.mode === 'edit' ? (
    <p>Site Header</p>
  ) : (
    <div>
      <QueryBuilder />
      {site ? (
        <div className="site-header">
          <h3 className="title">{site.siteName}</h3>
          <div className="row">
            <div className="detail xs-6 sm-6 md-3 lg-3">
              <p className="bold mb-0">Country</p>
              <p className="info">{site.countryCode}</p>
            </div>

            <div className="detail xs-6 sm-6 md-3 lg-3">
              <p className="bold mb-0">Regulation</p>
              {site.count_factype_EPRTR ? (
                <p className="info mb-0">
                  {site.count_factype_EPRTR} EPRTR{' '}
                  {site.count_factype_EPRTR > 1 ? 'Facilities' : 'Facility'}
                </p>
              ) : (
                ''
              )}
              {site.count_factype_NONEPRTR ? (
                <p className="info mb-0">
                  {site.count_factype_NONEPRTR} NON-EPRTR{' '}
                  {site.count_factype_NONEPRTR > 1 ? 'Facilities' : 'Facility'}
                </p>
              ) : (
                ''
              )}
              {site.count_instype_IED ? (
                <p className="info mb-0">
                  {site.count_instype_IED} IED Installation
                  {site.count_instype_IED > 1 ? 's' : ''}
                </p>
              ) : (
                ''
              )}
              {site.count_instype_NONIED ? (
                <p className="info mb-0">
                  {site.count_instype_NONIED} NON-IED Installation
                  {site.count_instype_NONIED > 1 ? 's' : ''}
                </p>
              ) : (
                ''
              )}
              {site.count_plantType_LCP ? (
                <p className="info mb-0">
                  {site.count_plantType_LCP} Large combustion plant
                  {site.count_plantType_LCP > 1 ? 's' : ''}
                </p>
              ) : (
                ''
              )}
              {site.count_plantType_WI ? (
                <p className="info mb-0">
                  {site.count_plantType_WI} Waste incinerator
                  {site.count_plantType_WI > 1 ? 's' : ''}
                </p>
              ) : (
                ''
              )}
              {site.count_plantType_coWI ? (
                <p className="info mb-0">
                  {site.count_plantType_coWI} Co-waste incinerator
                  {site.count_plantType_WI > 1 ? 's' : ''}
                </p>
              ) : (
                ''
              )}
            </div>

            <div className="detail xs-6 sm-6 md-3 lg-3">
              <p className="bold mb-0">Inspire id</p>
              <p className="info">{site.siteInspireId}</p>
            </div>

            <div className="detail xs-6 sm-6 md-3 lg-3 custom-selector grey">
              <p className="bold mb-0">Reporting year</p>
              <Dropdown
                selection
                onChange={(event, data) => {
                  props.setQueryParam({
                    queryParam: {
                      siteReportingYear: data.value,
                    },
                  });
                }}
                placeholder={'Select'}
                options={options}
                value={siteReportingYear}
                aria-label="Reporting year selector"
              />
            </div>
          </div>
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
