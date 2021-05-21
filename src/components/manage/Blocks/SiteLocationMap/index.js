import sliderSVG from '@plone/volto/icons/slider.svg';
import { getEncodedString } from '~/utils';
import SiteLocationMapEdit from './Edit';
import SiteLocationMapView from './View';

export const getSiteLocationURL = (siteInspireId) => {
  const condition = `(InspireSiteId LIKE '${getEncodedString(siteInspireId)}')`;
  return `https://air.discomap.eea.europa.eu/arcgis/rest/services/Air/IED_SiteMap/FeatureServer/0/query?f=json&where=${condition}&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=InspireSiteId&outSR=102100`;
};

export default (config) => {
  config.blocks.blocksConfig.site_location = {
    id: 'site_location',
    title: 'Site location',
    icon: sliderSVG,
    group: 'eprtr_blocks',
    edit: SiteLocationMapEdit,
    view: SiteLocationMapView,
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
