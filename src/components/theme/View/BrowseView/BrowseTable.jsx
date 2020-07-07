import React from 'react';
import TableBlock from 'volto-addons/TableBlock/View';

const schema = {
  fieldsets: [
    {
      id: 'table-metadata',
      title: 'Metadata',
      fields: [
        'title',
        'postal_code',
        'address',
        'town_village',
        'activity',
        'country',
        'facilities',
        'pollutant_emissions',
        'large_combustion_plants',
        'regulatory_information',
        'url',
      ],
    },
  ],
  properties: {
    title: {
      title: 'Site',
      tableType: 'Table header',
      dataType: 'string',
      show: 'value',
      hiddenRowType: '',
    },
    postal_code: {
      title: 'Postal code',
      tableType: 'Table header',
      dataType: 'string',
      show: 'value',
      hiddenRowType: '',
    },
    address: {
      title: 'Address',
      tableType: 'Table header',
      dataType: 'string',
      show: 'value',
      hiddenRowType: '',
    },
    town_village: {
      title: 'Town/Village',
      tableType: 'Table header',
      dataType: 'string',
      show: 'value',
      hiddenRowType: '',
    },
    activity: {
      title: 'Activity',
      tableType: 'Table header',
      dataType: 'string',
      show: 'value',
      hiddenRowType: '',
    },
    country: {
      title: 'Country',
      tableType: 'Table header',
      dataType: 'string',
      show: 'value',
      hiddenRowType: '',
    },
    facilities: {
      title: 'Facilities',
      tableType: 'Hidden row',
      dataType: 'object',
      show: 'link_length',
      urlFieldId: 'url',
      hiddenRowType: 'Site contents',
    },
    pollutant_emissions: {
      title: 'Pollutant emissions',
      tableType: 'Hidden row',
      dataType: 'object',
      show: 'link_keys',
      urlFieldId: 'url',
      hiddenRowType: 'Pollutant emissions',
    },
    large_combustion_plants: {
      title: 'Large combustion plants',
      tableType: 'Hidden row',
      dataType: 'object',
      show: 'link_length',
      urlFieldId: 'url',
      hiddenRowType: 'Site contents',
    },
    regulatory_information: {
      title: 'Regulatory information',
      tableType: 'Hidden row',
      dataType: 'textarea',
      show: 'link_value',
      urlFieldId: 'url',
      hiddenRowType: 'Regulatory information',
    },
    url: {
      title: 'VIEW SITE DETAIL',
      tableType: 'Hidden row',
      dataType: 'button',
      show: 'link_value',
      urlFieldId: 'url',
      hiddenRowType: 'Action',
    },
  },
};

const BrowseTable = props => {
  return (
    <div className={`browse-table ${props.className}`}>
      <TableBlock
        data={{
          metadata: {
            value: { ...schema },
          },
          path: {
            value: 'industrial-sites',
          },
        }}
      />
    </div>
  );
};

export default BrowseTable;
