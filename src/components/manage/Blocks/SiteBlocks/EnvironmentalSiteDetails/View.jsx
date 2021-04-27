import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setQueryParam, deleteQueryParam } from 'volto-datablocks/actions';
import CompetentAuthority from '../CompetentAuthority';
import { getDate, getLonLat } from '../helpers';
import { Grid } from 'semantic-ui-react';
import qs from 'querystring';
import '../style.css';

const getAllIndexes = (arr, val) => {
  const indexes = [];
  let i = -1;
  while ((i = arr.indexOf(val, i + 1)) !== -1) {
    indexes.push(i);
  }
  return indexes;
};

const View = (props) => {
  const [siteDetails, setSiteDetails] = React.useState({});
  const [facilities, setFacilities] = React.useState([]);
  const { provider_data = {} } = props;
  const query = { ...props.query, ...props.discodata_query.search };
  const siteReportingYear = parseInt(query.siteReportingYear || '');

  const facilityList = [
    ...new Set(facilities.map((facility) => facility.facilityInspireId).sort()),
  ];

  const competentAuthority = facilities
    .filter((facility) => facility.facilityOrganizationName)
    .map((facility, index) => ({
      facilityInspireId: facility.facilityInspireId,
      organizationName: facility.facilityOrganizationName,
      contactPerson: facility.facilityContactPerson,
      address: facility.facilityAddress,
      email: facility.facilityContactMail,
      authLastUpdated: getDate(facility.authLastUpdated),
      nth: `${facilityList.indexOf(facility.facilityInspireId) + 1}.`,
    }));

  React.useEffect(() => {
    const keys = Object.keys(provider_data || {});
    if (keys.length) {
      const indexes = getAllIndexes(
        provider_data?.euregReportingYear || [],
        siteReportingYear,
      );
      const newSiteDetails = {};
      const newFacilities = [];
      indexes.forEach((index, i) => {
        newFacilities[i] = {};
        keys.forEach((key) => {
          if (i === 0) {
            newSiteDetails[key] = provider_data[key][index];
          }
          newFacilities[i][key] = provider_data[key][index];
        });
      });
      setSiteDetails(newSiteDetails);
      setFacilities(
        newFacilities.sort((a, b) =>
          a.facilityInspireId > b.facilityInspireId
            ? 1
            : b.facilityInspireId > a.facilityInspireId
            ? -1
            : 0,
        ),
      );
    }
  }, [provider_data, provider_data?.euregReportingYear, siteReportingYear]);

  return props.mode === 'edit' ? (
    <p>{props.blockTitle}</p>
  ) : (
    <div className="site-block">
      {/* BLUE BANNER */}
      {siteDetails.authLastUpdated ? (
        <div className="eprtrBanner blue">
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={siteDetails.eprtrReportingYear ? 6 : 12}>
                <p className="lighter mb-0">Last report was submitted on:</p>
                <p className="bold" style={{ marginBottom: '0' }}>
                  {getDate(siteDetails.authLastUpdated)}
                </p>
              </Grid.Column>
              {siteDetails.eprtrReportingYear ? (
                <Grid.Column mobile={6}>
                  <p className="lighter mb-0">EPRTR reporting year</p>
                  <p className="bold" style={{ marginBottom: '0' }}>
                    {siteDetails.eprtrReportingYear}
                  </p>
                </Grid.Column>
              ) : (
                ''
              )}
            </Grid.Row>
          </Grid>
        </div>
      ) : (
        ''
      )}
      <div className="title">
        <h3 className="blue">Site details</h3>
      </div>

      {/* SITE DETAILS */}
      <Grid columns={12}>
        <Grid.Row>
          <Grid.Column mobile={6}>
            <p className="bold mb-0">Coordinates</p>
            <p className="info">
              {getLonLat(siteDetails.shape_wm_as_text) || '-'}
            </p>
          </Grid.Column>
          <Grid.Column mobile={6}>
            <p className="bold mb-0">NUTS Region</p>
            <p className="info">{siteDetails.NUTS || '-'}</p>
          </Grid.Column>
          <Grid.Column mobile={6}>
            <p className="bold mb-0">National ID</p>
            <p className="info">{siteDetails.nationalId || '-'}</p>
          </Grid.Column>
          <Grid.Column mobile={6}>
            <p className="bold mb-0">River Basin District</p>
            <p className="info">{siteDetails.riverBasin || '-'}</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <CompetentAuthority competentAuthority={competentAuthority} type="site" />
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: qs.parse(state.router.location.search.replace('?', '')),
      discodata_query: state.discodata_query,
    }),
    {
      setQueryParam,
      deleteQueryParam,
    },
  ),
)(View);
