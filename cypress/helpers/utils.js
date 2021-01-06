// React overrides the DOM node's setter, so get the original, as per the linked Stack Overflow
const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLTextAreaElement.prototype,
  'value',
).set;
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  'value',
).set;

export const setInputValue = (selector, value, type = 'input') => {
  cy.get(selector).then(($input) => {
    return new Promise((resolve) => {
      const input = $input[0];
      input.value = value;
      if (type === 'input') {
        nativeInputValueSetter.call(input, value);
      } else if (type === 'textarea') {
        nativeTextAreaValueSetter.call(input, value);
      }
      input.dispatchEvent(new Event('input', { value, bubbles: true }));
      input.dispatchEvent(new Event('change', { value, bubbles: true }));
      resolve();
    });
  });
};

export const filtersModal = {
  addFilter: (id, value) => {
    cy.get(id).click();
    cy.get(`${id} > div.visible.menu.transition > div span`)
      .contains(value)
      .click();
  },
  open: () => {
    cy.get('button#modal-show-button', {
      timeout: 10000,
    }).click();
  },
  triggerSearch: () => {
    cy.get('button#modal-search-button', {
      timeout: 10000,
    }).click();
  },
  triggerClear: () => {
    cy.get('button#modal-clear-button', {
      timeout: 10000,
    }).click();
  },
  search: (text) => {
    cy.get('.filters-container .search-input-container input').type(text);
    cy.wait(2000);
    cy.get('.filters-container .search-input-container input').type('{enter}');
  },
};
