import defaultReducers from '@plone/volto/reducers';
<<<<<<< Updated upstream

const reducers = {
    ...defaultReducers
}
=======
import section_tabs from './section_tabs';
import parent_folder_data from './parent_folder_data';
import pages from './pages';

const reducers = {
  section_tabs,
  parent_folder_data,
  pages,
  ...defaultReducers,
};
>>>>>>> Stashed changes

export default reducers;
