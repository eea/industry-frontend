/* REACT */
import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setFlags } from '~/actions';
import './style.css';

const View = (props) => {
  const flags = props.flags;
  const siteInspireId = props.discodata_query.search.siteInspireId;
  const site = props.discodata_resources.data.site_header?.[siteInspireId];
  const facilities =
    props.discodata_resources.data.site_details_1?.[siteInspireId]
      ?.facilities || {};

  useEffect(() => {
    if (site && siteInspireId && !flags.items.sites?.[siteInspireId]) {
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
    }

    if (
      Object.keys(facilities).length &&
      (!flags.items.facilities ||
        (flags.items.facilities &&
          Object.keys(flags.items.facilities).filter((facility) =>
            Object.keys(facilities).includes(facility),
          ).length !== Object.keys(facilities).length))
    ) {
      const facilitiesFlags = {};
      Object.entries(facilities).forEach(([id, facility]) => {
        if (
          facility[0] &&
          !flags.items.facilities?.[facility[0].facilityInspireId] &&
          !facilitiesFlags[facility[0].facilityInspireId]
        ) {
          facilitiesFlags[facility[0].facilityInspireId] = {
            has_fuel_data: facility[0].has_fuel_data,
            has_installations: facility[0].has_installations,
            has_lcps: facility[0].has_lcps,
            has_ophours_data: facility[0].has_ophours_data,
            has_release_data: facility[0].has_release_data,
            has_transfer_data: facility[0].has_transfer_data,
            has_waste_data: facility[0].has_waste_data,
          };
        }
      });
      props.setFlags('facilities', null, facilitiesFlags);
    }
  }, [siteInspireId, JSON.stringify(site), JSON.stringify(facilities)]);

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
