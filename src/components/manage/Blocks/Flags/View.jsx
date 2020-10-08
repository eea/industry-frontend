/* REACT */
import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setFlags } from '~/actions';
import './style.css';

const View = (props) => {
  const flags = props.flags;
  const siteInspireId = props.discodata_query.search.siteInspireId;
  const site = props.discodata_resources.data.sites_6?.[siteInspireId];
  const facilities = site?.results;
  useEffect(() => {
    if (site && siteInspireId && !flags.items.sites?.[siteInspireId]) {
      const facilitiesFlags = {};
      props.setFlags('sites', siteInspireId, {
        has_facilities: site.has_facilities,
        has_fuel_data: site.has_fuel_data,
        has_installations: site.has_installations,
        has_lcps: site.has_lcps,
        has_ophours_data: site.has_ophours_data,
        has_release_data: site.has_release_data,
        has_transfer_data: site.has_transfer_data,
        has_waste_data: site.has_waste_data,
      });
      facilities.forEach((facility) => {
        if (
          facility &&
          !flags.items.facilities?.[facility.facilityInspireId] &&
          !facilitiesFlags[facility.facilityInspireId]
        ) {
          facilitiesFlags[facility.facilityInspireId] = {
            has_fuel_data: facility.facility_has_fuel_data,
            has_installations: facility.facility_has_installations,
            has_lcps: facility.facility_has_lcps,
            has_ophours_data: facility.facility_has_ophours_data,
            has_release_data: facility.facility_has_release_data,
            has_transfer_data: facility.facility_has_transfer_data,
            has_waste_data: facility.facility_has_waste_data,
          };
        }
      });
      props.setFlags('facilities', null, facilitiesFlags);
    }
  }, [siteInspireId, JSON.stringify(site)]);

  return <div>{props.mode === 'edit' ? <p>Flags</p> : ''}</div>;
};

export default compose(
  connect(
    (state, props) => ({
      query: state.router.location.search,
      flags: state.flags,
      discodata_query: state.discodata_query,
      discodata_resources: state.discodata_resources,
    }),
    { setFlags },
  ),
)(View);
