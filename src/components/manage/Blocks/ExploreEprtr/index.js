import worldSVG from '@plone/volto/icons/world.svg';
import ExploreEprtrEdit from './Edit';
import ExploreEprtrView from './View';

export default (config) => {
  config.blocks.blocksConfig.explore_eprtr = {
    id: 'explore_eprtr',
    title: 'Explore eprtr',
    icon: worldSVG,
    group: 'eprtr_blocks',
    view: ExploreEprtrView,
    edit: ExploreEprtrEdit,
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
