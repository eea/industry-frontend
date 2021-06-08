import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Tableau from '@eeacms/volto-tableau/Tableau/View';
import config from '@plone/volto/registry';
import { getLatestTableauVersion } from 'tableau-api-js';
import { connectBlockToProviderData } from '@eeacms/volto-datablocks/hocs';
import qs from 'querystring';
import '@eeacms/volto-tableau/less/tableau.less';

const getDevice = (config, width) => {
  const breakpoints = config.blocks.blocksConfig.tableau_block.breakpoints;
  let device = 'default';
  Object.keys(breakpoints).forEach((breakpoint) => {
    if (
      width <= breakpoints[breakpoint][0] &&
      width >= breakpoints[breakpoint][1]
    ) {
      device = breakpoint;
    }
  });
  return device;
};

const View = (props) => {
  const [error, setError] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [extraFilters, setExtraFilters] = React.useState({});
  const { data = {}, query = {}, screen = {}, provider_data = null } = props;
  const {
    disabledKey = null,
    breakpointUrls = [],
    urlParameters = [],
    title = null,
    description = null,
  } = data;
  const version =
    props.data.version ||
    config.settings.tableauVersion ||
    getLatestTableauVersion();
  const device = getDevice(config, screen.screenWidth || Infinity);
  const breakpointUrl = breakpointUrls.filter(
    (breakpoint) => breakpoint.device === device,
  )[0]?.url;
  const url = breakpointUrl || data.url;
  const disabled = disabledKey ? !provider_data?.[disabledKey]?.[0] : false;

  React.useEffect(() => {
    setMounted(true);
    /* eslint-disable-next-line */
  }, []);

  React.useEffect(() => {
    const newExtraFilters = { ...extraFilters };
    urlParameters.forEach((element) => {
      if (element.field && typeof query[element.urlParam] !== 'undefined') {
        newExtraFilters[element.field] = query[element.urlParam];
      } else if (newExtraFilters[element.field]) {
        delete newExtraFilters[element.field];
      }
    });
    setExtraFilters(newExtraFilters);
    /* eslint-disable-next-line */
  }, [JSON.stringify(query), JSON.stringify(urlParameters)]);

  return mounted ? (
    <div className="tableau-block">
      {props.mode === 'edit' ? (
        <div className="tableau-info">
          <h3 className="tableau-version">== Tableau {version} ==</h3>
          {!props.data.url ? <p className="tableau-error">URL required</p> : ''}
          {error ? <p className="tableau-error">{error}</p> : ''}
        </div>
      ) : (
        ''
      )}
      {!disabled ? (
        <>
          {loaded && title ? <h3 className="tableau-title">{title}</h3> : ''}
          {loaded && description ? (
            <p className="tableau-description">{description}</p>
          ) : (
            ''
          )}
          <Tableau
            {...props}
            canUpdateUrl={!breakpointUrl}
            extraFilters={extraFilters}
            extraOptions={{ device }}
            error={error}
            loaded={loaded}
            setError={setError}
            setLoaded={setLoaded}
            version={version}
            url={url}
          />
        </>
      ) : (
        ''
      )}
    </div>
  ) : (
    ''
  );
};

export default compose(
  connect((state, props) => ({
    query: {
      ...(qs.parse(state.router.location?.search?.replace('?', '')) || {}),
      ...(state.discodata_query?.search || {}),
    },
    tableau: state.tableau,
    screen: state.screen,
  })),
)(connectBlockToProviderData(View));
