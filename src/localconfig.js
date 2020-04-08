
import TabsView from '~/components/theme/View/TabsView';
import RedirectView from '~/components/theme/View/RedirectView';
import TabsChildView from '~/components/theme/View/TabsChildView';

import DetailedLinkView from '~/components/manage/Blocks/DetailedLink/View';
import DetailedLinkEdit from '~/components/manage/Blocks/DetailedLink/Edit';

import FolderContentsBlockView from '~/components/manage/Blocks/FolderContentsBlock/View';
import FolderContentsBlockEdit from '~/components/manage/Blocks/FolderContentsBlock/Edit';

const applyConfig = config => {
console.log('config', config)
  config.views = {
    ...config.views,
    layoutViews: {
      ...config.views.layoutViews,
      tabs_view: TabsView,
      tabs_child_view: TabsChildView,

      redirect_view: RedirectView,

    },
  };

  // console.log('children list edit', ChildrenListEdit)

  config.blocks.blocksConfig.detailed_link = {
    id: 'detailed_link',
    group: 'custom_addons',
    title: 'Detailed Link',
    view: DetailedLinkView,
    edit: DetailedLinkEdit,
    icon: config.blocks.blocksConfig.text.icon,
  };


  config.blocks.blocksConfig.folder_contents = {
    id: 'folder_contents',
    group: 'custom_addons',
    title: 'Folder Contents',
    view: FolderContentsBlockView,
    edit: FolderContentsBlockEdit,
    icon: config.blocks.blocksConfig.text.icon,
  };
  return config;
}

export default applyConfig