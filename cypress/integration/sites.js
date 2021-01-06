import { setupBeforeEach, tearDownAfterEach } from '../support';
import { changePageTitle, addBlock } from '../helpers';
import { openSidebarTab } from '../helpers';
import { setInputValue, filtersModal } from '../helpers/utils';
import { tableBlockData } from '../helpers/data';

describe('Sites in DiscodataTableBlock', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

  it('Add Blocks', () => {
    changePageTitle('Sites in DiscodataTableBlock');
    addBlock('Eprtr Blocks', 'eprtr_blocks', 'eprtr_filters_block');
    addBlock('Data blocks', 'data_blocks', 'discodata_table_block');
    openSidebarTab('Block');
    setInputValue(
      'textarea#field-field-widget-importExport',
      tableBlockData,
      'textarea',
    );
    cy.get('textarea#field-field-widget-importExport').type(' ');
    cy.get('#toolbar-save').click();
    cy.wait(2000);
    filtersModal.open();
    filtersModal.addFilter('#countries_0', 'Romania');
    filtersModal.addFilter('#reporting_years_0', '2018');
    filtersModal.triggerSearch();
    cy.get('.browse-table .ui.pagination.menu a:nth-last-child(2)').should(
      'have.text',
      '42',
    );
    cy.wait(2000);
    filtersModal.search('Site: 101AR0000.SITE');
    cy.get('.browse-table .ui.pagination.menu a:nth-last-child(2)').should(
      'have.text',
      '1',
    );
    cy.wait(2000);
    cy.get(
      '#page-document > div.browse-table > table > tbody > tr:nth-last-child(2) > td:nth-child(1) > p',
    ).should('have.text', 'Site: 101AR0000.SITE');
    filtersModal.open();
    filtersModal.triggerClear();
    filtersModal.triggerSearch();
  });
});
