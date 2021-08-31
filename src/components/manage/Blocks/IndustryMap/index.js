import sliderSVG from '@plone/volto/icons/slider.svg';
import IndustryMapEdit from './Edit';
import IndustryMapView from './View';

const filters = [
  {
    queryKey: 'batConclusionCode',
    featureKey: 'batConclusionCode',
    op: 'like',
  },
  { queryKey: 'EEAActivity', featureKey: 'eea_activities', op: 'like' },
  { queryKey: 'nuts_latest', featureKey: 'nuts_regions', op: 'like' },
  { queryKey: 'permitType', featureKey: 'permit_types', op: 'like' },
  { queryKey: 'permitYear', featureKey: 'permitYears', op: 'like' },
  { queryKey: 'plantTypes', featureKey: 'plantTypes', op: 'like' },
  { queryKey: 'pollutant', featureKey: 'pollutants', op: 'like' },
  { queryKey: 'pollutantGroup', featureKey: 'air_groups', op: 'like' },
  { queryKey: 'reportingYear', featureKey: 'Site_reporting_year', op: 'eq' },
  { queryKey: 'riverBasin', featureKey: 'rbds', op: 'like' },
  { queryKey: 'siteCountry', featureKey: 'countryCode', op: 'like' },
  { queryKey: 'siteTerm', featureKey: 'siteName', op: 'like' },
];

export const getSitesUrl = (extent) => {
  return `https://air.discomap.eea.europa.eu/arcgis/rest/services/Air/IED_SiteMap/FeatureServer/0/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${encodeURIComponent(
    '{"xmin":' +
      extent[0] +
      ',"ymin":' +
      extent[1] +
      ',"xmax":' +
      extent[2] +
      ',"ymax":' +
      extent[3] +
      ',"spatialReference":{"wkid":102100}}',
  )}&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&outSR=102100`;
};

export const getLayerBase = () =>
  'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

export const filterFeature = (feature, query = {}) => {
  let ok = true;
  const properties = feature.getProperties();

  for (let filter = 0; filter < filters.length; filter++) {
    const { queryKey, featureKey, op } = filters[filter];
    if (!ok) {
      break;
    }
    if (Array.isArray(query[queryKey])) {
      for (let item = 0; item < query[queryKey].length; item++) {
        const value = query[queryKey][item];
        if (
          value &&
          ((op === 'like' && !properties[featureKey]?.includes(value)) ||
            (op === 'eq' && properties[featureKey] !== value))
        ) {
          ok = false;
          break;
        }
      }
    } else if (query[queryKey]) {
      const value = query[queryKey];
      if (
        (op === 'like' && !properties[featureKey]?.includes(value)) ||
        (op === 'eq' && properties[featureKey] !== value)
      ) {
        ok = false;
        break;
      }
    }
  }

  return ok;
};

export const getWhereStatement = (query = {}) => {
  let where = [];
  for (let filter = 0; filter < filters.length; filter++) {
    const { queryKey, featureKey, op } = filters[filter];
    if (Array.isArray(query[queryKey])) {
      where[filter] = [];
      for (let item = 0; item < query[queryKey].length; item++) {
        const value = query[queryKey][item];
        if (op === 'like' && value) {
          where[filter].push(`${featureKey} LIKE '%${value}%'`);
        } else if (op === 'eq' && value) {
          where[filter].push(`${featureKey} = ${value}`);
        }
      }
    } else if (query[queryKey]) {
      where[filter] = [];
      const value = query[queryKey];
      if (op === 'like' && value) {
        where[filter].push(`${featureKey} LIKE '%${value}%'`);
      } else if (op === 'eq' && value) {
        where[filter].push(`${featureKey} = ${value}`);
      }
    }
  }

  return where
    .filter((w) => w.length)
    .map((w) => `(${w.join(' OR ')})`)
    .join(' AND ');
};

export const getRegionsWhereStatement = (query = {}) => {
  let where = [];
  if (Array.isArray(query.siteCountry)) {
    for (let item = 0; item < query.siteCountry.length; item++) {
      const value = query.siteCountry[item];
      if (value) {
        where.push(`CNTR_CODE LIKE '%${value}%'`);
      }
    }
  }
  return where.join(' AND ');
};

export default (config) => {
  config.blocks.blocksConfig.industry_map = {
    id: 'industry_map',
    title: 'Industry map',
    icon: sliderSVG,
    group: 'eprtr_blocks',
    edit: IndustryMapEdit,
    view: IndustryMapView,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};
