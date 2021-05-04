import sliderSVG from '@plone/volto/icons/slider.svg';
import TableauEdit from './Edit';
import TableauView from './View';

export default (config) => {
  config.blocks.blocksConfig.site_tableau_block = {
    id: 'site_tableau_block',
    title: 'Site tableau',
    icon: sliderSVG,
    group: 'data_blocks',
    edit: TableauEdit,
    view: TableauView,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    blocks: {},
    security: {
      addPermission: [],
      view: [],
    },
    breakpoints: {
      desktop: [Infinity, 982],
      tablet: [981, 768],
      mobile: [767, 0],
    },
  };
  return config;
};
