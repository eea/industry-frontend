
import TabsView from '~/components/theme/View/TabsView';

const applyConfig = config => {
console.log('config', config)
  config.views = {
    ...config.views,
    layoutViews: {
      ...config.views.layoutViews,
      tabs_view: TabsView,
    },
  };


  // config.blocks.blocksConfig.collection_block = {
  //   id: 'collection_block',
  //   title: 'Collection Listing',
  //   view: CollectionBlockView,
  //   edit: CollectionBlockEdit,
  //   icon: chartIcon,
  //   group: 'custom_addons',
  // };
  return config;
}

export default applyConfig