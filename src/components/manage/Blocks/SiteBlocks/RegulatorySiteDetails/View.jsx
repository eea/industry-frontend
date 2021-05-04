import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Grid, Popup } from 'semantic-ui-react';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { setQueryParam, deleteQueryParam } from 'volto-datablocks/actions';
import infoSVG from '@plone/volto/icons/info.svg';
import qs from 'querystring';
import '../style.css';

const View = (props) => {
  const [siteDetails, setSiteDetails] = React.useState({});
  const { provider_data = {} } = props;
  const query = { ...props.query, ...props.discodata_query.search };
  const siteReportingYear = parseInt(query.siteReportingYear || '');
  const index = provider_data?.euregReportingYear?.indexOf(siteReportingYear);

  React.useEffect(() => {
    const keys = Object.keys(provider_data || {});
    if (keys?.length) {
      const newSiteDetails = {};
      keys.forEach((key) => {
        newSiteDetails[key] = provider_data[key][index];
      });
      setSiteDetails(newSiteDetails);
    }
  }, [provider_data, index]);

  return props.mode === 'edit' ? (
    <p>{props.blockTitle}</p>
  ) : (
    <div className="site-block">
      <div className="title">
        <h3 className="blue">About the entity</h3>
        <Popup
          position="top left"
          content="Information regarding the facilities included in the industrial site"
          trigger={
            <div className="popup-svg">
              <Icon name={infoSVG} size={20} color="#D63D27" />
            </div>
          }
        />
      </div>
      <Grid columns={12}>
        <Grid.Row>
          <Grid.Column mobile={6}>
            <p className="label">Regulated activities</p>
            <p className="info">{siteDetails.regulatedActivities || '-'}</p>
          </Grid.Column>
          <Grid.Column mobile={6}>
            <p className="label">Status</p>
            <p className="info">{siteDetails.entityStatus || '-'}</p>
          </Grid.Column>
          <Grid.Column mobile={12}>
            <p className="label">seveso</p>
            <p className="info">{siteDetails.seveso || '-'}</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
