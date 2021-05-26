import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { removeTralingSlash } from '~/helpers';
import qs from 'querystring';
import cx from 'classnames';
import './style.css';

/*
SELECT facilities.siteName,
  facilities.siteInspireId,
  facilities.facilityInspireId,
  installations.installationInspireId,
  lcps.lcpInspireId
FROM [IED].[latest].[Browse6Header] as facilities
LEFT JOIN [IED].[latest].[Browse8Header] as installations
  ON facilities.facilityInspireId = installations.facilityInspireId
LEFT JOIN [IED].[latest].[Browse10_Header] as lcps
  ON installations.installationInspireId = lcps.installationInspireId
GROUP BY facilities.siteName,
  facilities.siteInspireId,
  facilities.facilityInspireId,
  installations.installationInspireId,
  lcps.lcpInspireId
*/

const getQueryString = (query) => {
  if (!Object.keys(query).length) return '';
  return '?' + qs.stringify(query);
};

const View = (props) => {
  const [siteStructure, setSiteStructure] = React.useState(null);
  const [siteDetails, setSiteDetails] = React.useState({});
  const { provider_data = {} } = props;
  const provider_data_string = JSON.stringify(provider_data);
  const dataReady = provider_data?.siteInspireId?.length > 0;
  const pathname = removeTralingSlash(props.location.pathname || '');
  const query = qs.parse(props.location?.search?.replace('?', ''));
  const newQuery = qs.parse(props.location?.search?.replace('?', ''));
  delete newQuery.facilityInspireId;
  delete newQuery.installationInspireId;
  delete newQuery.lcpInspireId;

  React.useEffect(() => {
    setSiteDetails({
      ...siteDetails,
      siteName: provider_data?.siteName?.[0],
      siteInspireId: provider_data?.siteInspireId?.[0],
    });
    if (dataReady) {
      const newSiteStructure = {
        facilities: [],
        installations: {},
        lcps: {},
      };
      provider_data.facilityInspireId.forEach((facility, index) => {
        const installation = provider_data.installationInspireId[index];
        const lcp = provider_data.lcpInspireId[index];
        // Add facilities
        if (!newSiteStructure.facilities.includes(facility)) {
          newSiteStructure.facilities.push(facility);
        }
        // Add installations
        if (facility && !newSiteStructure.installations[facility]) {
          newSiteStructure.installations[facility] = [];
        }
        if (
          installation &&
          !newSiteStructure.installations[facility].includes(installation)
        ) {
          newSiteStructure.installations[facility].push(installation);
        }
        // Add lcps
        if (!newSiteStructure.lcps[installation]) {
          newSiteStructure.lcps[installation] = [];
        }
        if (lcp && !newSiteStructure.lcps[installation].includes(lcp)) {
          newSiteStructure.lcps[installation].push(lcp);
        }
      });
      setSiteStructure({
        ...newSiteStructure,
        facilities: newSiteStructure.facilities.sort(),
      });
    }
    /* eslint-disable-next-line */
  }, [provider_data_string]);

  return props.mode === 'edit' ? (
    <div className="sidebar-block" style={{ padding: '1rem' }}>
      <p>Sidebar edit</p>
    </div>
  ) : (
    <div className="sidebar-block">
      <Menu
        className={
          props.data.className?.value ? props.data.className.value : ''
        }
      >
        <Menu.Item className="site-name">
          <span title={siteDetails.siteName}>{siteDetails.siteName}</span>
        </Menu.Item>

        {dataReady && siteStructure
          ? siteStructure.facilities?.length
            ? siteStructure.facilities.map((facility, facilityIndex) => (
                <Menu
                  key={`facility_${facility}`}
                  className="entity facilities"
                >
                  {facilityIndex === 0 ? (
                    <>
                      <div className="entity-item">
                        <Link
                          className={cx({
                            item: true,
                            active:
                              pathname ===
                              '/industrial-site/environmental-information',
                          })}
                          to={{
                            pathname:
                              '/industrial-site/environmental-information',
                            search: getQueryString(newQuery),
                            state: {
                              ignoreScrollBehavior: true,
                            },
                          }}
                        >
                          <span>Environmental overview</span>
                        </Link>
                      </div>
                      <div className="entity-item">
                        <Link
                          className={cx({
                            item: true,
                            active:
                              pathname ===
                              '/industrial-site/regulatory-information',
                          })}
                          to={{
                            pathname: '/industrial-site/regulatory-information',
                            search: getQueryString(newQuery),
                            state: {
                              ignoreScrollBehavior: true,
                            },
                          }}
                        >
                          <span>Regulatory overview</span>
                        </Link>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                  <div className="entity-item">
                    <Link
                      className={cx({
                        item: true,
                        active:
                          pathname ===
                            '/industrial-site/environmental-information/facility-overview' &&
                          query.facilityInspireId === facility,
                      })}
                      to={{
                        pathname:
                          '/industrial-site/environmental-information/facility-overview',
                        search: getQueryString({
                          ...newQuery,
                          facilityInspireId: facility,
                        }),
                        state: {
                          ignoreScrollBehavior: true,
                        },
                      }}
                    >
                      <span title={facility}>
                        {facilityIndex + 1}. {facility}
                      </span>
                    </Link>
                    {siteStructure.installations?.[facility]?.length
                      ? siteStructure.installations?.[facility]?.map(
                          (installation, installationIndex) => (
                            <Menu
                              key={`installation_${installation}`}
                              className="entity installations"
                            >
                              <div className="entity-item">
                                <Link
                                  className={cx({
                                    item: true,
                                    active:
                                      pathname ===
                                        `/industrial-site/regulatory-information/installation-overview` &&
                                      query.installationInspireId ===
                                        installation,
                                  })}
                                  to={{
                                    pathname: `/industrial-site/regulatory-information/installation-overview`,
                                    search: getQueryString({
                                      ...newQuery,
                                      facilityInspireId: facility,
                                      installationInspireId: installation,
                                    }),
                                    state: {
                                      ignoreScrollBehavior: true,
                                    },
                                  }}
                                >
                                  <span title={installation}>
                                    {facilityIndex + 1}.{installationIndex + 1}.{' '}
                                    {installation}
                                  </span>
                                </Link>
                                {siteStructure.lcps?.[installation]?.length
                                  ? siteStructure.lcps?.[installation]?.map(
                                      (lcp, lcpIndex) => (
                                        <div
                                          key={`lcp_${lcp}`}
                                          className="entity-item"
                                        >
                                          <Link
                                            className={cx({
                                              item: true,
                                              active:
                                                pathname ===
                                                  `/industrial-site/environmental-information/lcp-overview` &&
                                                query.lcpInspireId === lcp,
                                            })}
                                            to={{
                                              pathname: `/industrial-site/environmental-information/lcp-overview`,
                                              search: getQueryString({
                                                ...newQuery,
                                                facilityInspireId: facility,
                                                installationInspireId: installation,
                                                lcpInspireId: lcp,
                                              }),
                                              state: {
                                                ignoreScrollBehavior: true,
                                              },
                                            }}
                                          >
                                            <span title={lcp}>
                                              {facilityIndex + 1}.
                                              {installationIndex + 1}.
                                              {lcpIndex + 1}. {lcp}
                                            </span>
                                          </Link>
                                        </div>
                                      ),
                                    )
                                  : ''}
                              </div>
                            </Menu>
                          ),
                        )
                      : ''}
                  </div>
                </Menu>
              ))
            : ''
          : ''}
      </Menu>
    </div>
  );
};

export default View;
