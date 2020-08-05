import chartIcon from '@plone/volto/icons/world.svg';
import TabsView from '~/components/theme/View/TabsView';
import RedirectView from '~/components/theme/View/RedirectView';
import TabsChildView from '~/components/theme/View/TabsChildView';
import BrowseView from '~/components/theme/View/BrowseView/BrowseView';
import DiscodataView from '~/components/theme/View/DiscodataView';

import MosaicForm from 'volto-mosaic/components/manage/Form';

import DetailedLinkView from '~/components/manage/Blocks/DetailedLink/View';
import DetailedLinkEdit from '~/components/manage/Blocks/DetailedLink/Edit';

import FolderContentsBlockView from '~/components/manage/Blocks/FolderContentsBlock/View';
import FolderContentsBlockEdit from '~/components/manage/Blocks/FolderContentsBlock/Edit';

import ArticlesListView from '~/components/manage/Blocks/ArticlesList/View';
import ArticlesListEdit from '~/components/manage/Blocks/ArticlesList/Edit';

import ChildrenLinksView from '~/components/manage/Blocks/ChildrenLinks/View';
import ChildrenLinksEdit from '~/components/manage/Blocks/ChildrenLinks/Edit';

import FacilityBlockEdit from '~/components/manage/Blocks/FacilityBlock/Edit';
import FacilityBlockView from '~/components/manage/Blocks/FacilityBlock/View';

import RegulatoryInformationBlockEdit from '~/components/manage/Blocks/RegulatoryInformationBlock/Edit';
import RegulatoryInformationBlockView from '~/components/manage/Blocks/RegulatoryInformationBlock/View';

import CompanyHeaderEdit from '~/components/manage/Blocks/CompanyHeader/Edit';
import CompanyHeaderView from '~/components/manage/Blocks/CompanyHeader/View';

import EprtrSidebarBlockEdit from '~/components/manage/Blocks/SidebarBlock/Edit';
import EprtrSidebarBlockView from '~/components/manage/Blocks/SidebarBlock/View';

const applyConfig = config => {
  config.views = {
    ...config.views,
    layoutViews: {
      ...config.views.layoutViews,
      tabs_view: TabsView,
      glossaryview: TabsChildView,
      redirect_view: RedirectView,
      browse_view: BrowseView,
      discodata_view: DiscodataView,
    },
  };

  config.editForms = {
    ...config.editForms,
    byLayout: {
      ...config.editForms?.byLayout,
      discodata_view: MosaicForm,
    },
  };

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

  config.blocks.blocksConfig.articles_list = {
    id: 'articles_list',
    group: 'custom_addons',
    title: 'Articles List',
    view: ArticlesListView,
    edit: ArticlesListEdit,
    icon: config.blocks.blocksConfig.text.icon,
  };

  config.blocks.blocksConfig.children_links = {
    id: 'children_links',
    group: 'custom_addons',
    title: 'Children Links',
    view: ChildrenLinksView,
    edit: ChildrenLinksEdit,
    icon: config.blocks.blocksConfig.text.icon,
  };

  config.blocks.blocksConfig.facility_block = {
    id: 'facility_block',
    title: 'Facility block',
    view: FacilityBlockView,
    edit: FacilityBlockEdit,
    icon: chartIcon,
    group: 'data_blocks',
  };

  config.blocks.blocksConfig.regulatory_information_block = {
    id: 'regulatory_information_block',
    title: 'Regulatory information block',
    view: RegulatoryInformationBlockView,
    edit: RegulatoryInformationBlockEdit,
    icon: chartIcon,
    group: 'data_blocks',
  };

  config.blocks.blocksConfig.comany_header_block = {
    id: 'comany_header_block',
    title: 'Company header block',
    view: CompanyHeaderView,
    edit: CompanyHeaderEdit,
    icon: chartIcon,
    group: 'data_blocks',
  };

  config.blocks.blocksConfig.eprtr_sidebar_block = {
    id: 'eprtr_sidebar_block',
    title: 'Eprtr sidebar block',
    view: EprtrSidebarBlockView,
    edit: EprtrSidebarBlockEdit,
    icon: chartIcon,
    group: 'data_blocks',
  };

  return config;
};

export default applyConfig;
