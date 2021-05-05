import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Grid, Dropdown } from 'semantic-ui-react';
import { setQueryParam } from 'volto-datablocks/actions';
import qs from 'querystring';
import './style.css';

const getQueryString = (query) => {
  if (!Object.keys(query).length) return '';
  return '?' + qs.stringify(query);
};

const getSiteByYear = (provider_data, year) => {
  const index = provider_data?.euregReportingYear?.indexOf(year);
  const keys = Object.keys(provider_data || {});
  const site = {};
  if (keys?.length) {
    keys.forEach((key) => {
      site[key] = provider_data[key][index];
    });
  }
  return site;
};

const View = (props) => {
  const [siteHeader, setSiteHeader] = React.useState({});
  const { provider_data = {} } = props;
  const query = { ...props.query };
  const siteReportingYear = parseInt(query.siteReportingYear || '');

  const reportingYears = provider_data?.euregReportingYear?.length
    ? provider_data.euregReportingYear
        .filter((year) => year)
        .sort()
        .map((year) => ({
          key: year,
          value: year,
          text: year,
        }))
    : [];

  React.useEffect(() => {
    if (
      siteHeader?.siteName &&
      siteReportingYear &&
      (siteHeader.siteName !== props.discodata_query.siteTerm ||
        siteReportingYear !== props.discodata_query.reportingYear?.[0])
    ) {
      props.setQueryParam({
        queryParam: {
          siteTerm: siteHeader.siteName,
          reportingYear: [siteReportingYear],
          ...(props.discodata_query.siteTerm
            ? {
                filtersCounter:
                  (props.discodata_query['filtersCounter'] || 0) + 1,
              }
            : {}),
        },
      });
    }
    /* eslint-disable-next-line */
  }, [JSON.stringify(siteHeader)]);

  React.useEffect(() => {
    setSiteHeader(getSiteByYear(provider_data, siteReportingYear));
    /* eslint-disable-next-line */
  }, [JSON.stringify(provider_data), siteReportingYear]);

  return props.mode === 'edit' ? (
    <p>Site header</p>
  ) : Object.keys(siteHeader)?.length ? (
    <div className="site-header">
      <h3 className="title">{siteHeader.siteName}</h3>
      <Grid columns={12}>
        <Grid.Row>
          <Grid.Column mobile={6} tablet={3} computer={3}>
            <p className="label">Country</p>
            <p className="info">{siteHeader.countryCode}</p>
          </Grid.Column>
          <Grid.Column mobile={6} tablet={3} computer={3}>
            <p className="label">Regulation</p>
            {siteHeader.count_factype_EPRTR ? (
              <p className="info">
                {siteHeader.count_factype_EPRTR} EPRTR{' '}
                {siteHeader.count_factype_EPRTR > 1 ? 'Facilities' : 'Facility'}
              </p>
            ) : (
              ''
            )}
            {siteHeader.count_factype_NONEPRTR ? (
              <p className="info">
                {siteHeader.count_factype_NONEPRTR} NON-EPRTR{' '}
                {siteHeader.count_factype_NONEPRTR > 1
                  ? 'Facilities'
                  : 'Facility'}
              </p>
            ) : (
              ''
            )}
            {siteHeader.count_instype_IED ? (
              <p className="info">
                {siteHeader.count_instype_IED} IED Installation
                {siteHeader.count_instype_IED > 1 ? 's' : ''}
              </p>
            ) : (
              ''
            )}
            {siteHeader.count_instype_NONIED ? (
              <p className="info">
                {siteHeader.count_instype_NONIED} NON-IED Installation
                {siteHeader.count_instype_NONIED > 1 ? 's' : ''}
              </p>
            ) : (
              ''
            )}
            {siteHeader.count_plantType_LCP ? (
              <p className="info">
                {siteHeader.count_plantType_LCP} Large combustion plant
                {siteHeader.count_plantType_LCP > 1 ? 's' : ''}
              </p>
            ) : (
              ''
            )}
            {siteHeader.count_plantType_WI ? (
              <p className="info">
                {siteHeader.count_plantType_WI} Waste incinerator
                {siteHeader.count_plantType_WI > 1 ? 's' : ''}
              </p>
            ) : (
              ''
            )}
            {siteHeader.count_plantType_coWI ? (
              <p className="info">
                {siteHeader.count_plantType_coWI} Co-waste incinerator
                {siteHeader.count_plantType_WI > 1 ? 's' : ''}
              </p>
            ) : (
              ''
            )}
          </Grid.Column>
          <Grid.Column mobile={6} tablet={3} computer={3}>
            <p className="label">Inspire id</p>
            <p className="info">{siteHeader.siteInspireId}</p>
          </Grid.Column>
          <Grid.Column mobile={6} tablet={3} computer={3}>
            <p className="label">Reporting year</p>
            <div className="custom-selector grey">
              <Dropdown
                selection
                onChange={(event, data) => {
                  const newSite = getSiteByYear(provider_data, data.value);
                  props.history.push({
                    pathname: props.location.pathname,
                    search: getQueryString({
                      ...props.query,
                      siteReportingYear: data.value,
                      siteName: newSite.siteName,
                    }),
                    state: {
                      ignoreScrollBehavior: true,
                    },
                  });
                }}
                placeholder={'Select'}
                options={reportingYears}
                value={siteReportingYear}
                aria-label="Reporting year selector"
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  ) : (
    ''
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: qs.parse(state.router.location.search.replace('?', '')),
      discodata_query: state.discodata_query.search,
    }),
    { setQueryParam },
  ),
)(View);
