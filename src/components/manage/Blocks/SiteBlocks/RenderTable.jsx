import React from 'react';
import { Table, Popup } from 'semantic-ui-react';
import { UniversalLink } from '@plone/volto/components';
import cx from 'classnames';
import './style.css';

const RenderTable = (props) => {
  const { headless = false, headers = [], rows = [] } = props;
  return (
    <Table
      unstackable
      celled={props.celled}
      className={cx(props.className, headless ? 'headless' : '')}
      columns={headers.length}
    >
      {!headless && headers.length > 0 && (
        <Table.Header>
          <Table.Row>
            {headers.map((header, headerIndex) => (
              <Table.HeaderCell key={`${headerIndex}_header`}>
                {header.value}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
      )}
      <Table.Body>
        {rows.length > 0 &&
          headers.length > 0 &&
          rows.map((row, rowIndex) => (
            <Table.Row key={`${rowIndex}_row`}>
              {headers.map((header, headerIndex) => (
                <Table.Cell key={`${headerIndex}_cell`}>
                  {row[header.key] && header.link ? (
                    <UniversalLink
                      href={row[header.key] || '#'}
                      openLinkInNewTab={true}
                      title={row[header.key]}
                      style={{ ...(header.style || {}) }}
                    >
                      {header.link.text || row[header.key]}
                    </UniversalLink>
                  ) : header.popup?.key ? (
                    <Popup
                      position="top left"
                      content={row[header.popup.key]}
                      trigger={<p>{row[header.key] || '-'}</p>}
                    />
                  ) : (
                    <p>{row[header.key] || '-'}</p>
                  )}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

export default RenderTable;
