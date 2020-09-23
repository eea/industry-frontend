/**
 * Root reducer.
 * @module reducers/root
 */

import defaultReducers from '@plone/volto/reducers';
import section_tabs from './section_tabs';
import parent_folder_data from './parent_folder_data';
import pages from './pages';
import sparql from './sparql';
import contentType from './contentType';
/**
 * Root reducer.
 * @function
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
const reducers = {
  section_tabs,
  parent_folder_data,
  pages,
  sparql,
  contentType,
  ...defaultReducers,
  // Add your reducers here
};

export default reducers;
