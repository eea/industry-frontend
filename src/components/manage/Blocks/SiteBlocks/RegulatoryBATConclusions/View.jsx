import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import BatConclusions from '../BatConclusions';
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
  const [batConclusions, setBatConclusions] = React.useState({});
  const [installationsNth, setInstallationsNth] = React.useState({});
  const { provider_data = {} } = props;
  const query = { ...props.query };
  const siteReportingYear = parseInt(query.siteReportingYear || '');

  React.useEffect(() => {
    const keys = Object.keys(provider_data || {});
    if (keys.length) {
      const indexes = getAllIndexes(
        provider_data?.EUregReportingYear || [],
        siteReportingYear,
      );
      const facilities = [
        ...new Set(provider_data?.facilityInspireId || []),
      ].sort();
      let newBatConclusions = {};
      const counter = {};
      const nth = {};
      indexes.forEach((index, i) => {
        const obj = {};
        const installation = provider_data['installationInspireId'][index];
        const batConclusionName = provider_data['BATConclusionName'][index];
        if (!newBatConclusions[installation]) {
          newBatConclusions[installation] = {
            facility: provider_data['facilityInspireId'][index],
          };
        }
        if (
          batConclusionName &&
          !newBatConclusions[installation][batConclusionName]
        ) {
          newBatConclusions[installation][batConclusionName] = [];
          keys.forEach((key) => {
            obj[key] = provider_data[key][index];
          });
          newBatConclusions[installation][batConclusionName].push({ ...obj });
        }
      });

      Object.keys(newBatConclusions)
        .sort()
        .forEach((id, index) => {
          const installation = newBatConclusions[id];
          const facility = installation.facility;
          if (!nth[id]) {
            counter[facility] = (counter[facility] || 0) + 1;
            nth[id] = `${facilities.indexOf(facility) + 1}.${
              counter[facility]
            }.`;
          }
          delete installation.facility;
        });
      setInstallationsNth(nth);
      setBatConclusions(newBatConclusions);
    }
    /* eslint-disable-next-line */
  }, [provider_data, provider_data?.EUregReportingYear, siteReportingYear]);

  return props.mode === 'edit' ? (
    <p>{props.blockTitle}</p>
  ) : (
    <div className="site-block">
      <BatConclusions
        data={batConclusions}
        installationsNth={installationsNth}
        entity={props.data.entity}
      />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    query: qs.parse(state.router.location.search.replace('?', '')),
  })),
)(View);
