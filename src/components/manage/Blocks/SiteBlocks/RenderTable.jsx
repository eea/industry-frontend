import React from 'react';
import { Table } from 'semantic-ui-react';
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
                  <p
                    dangerouslySetInnerHTML={{
                      __html: row[header.key],
                    }}
                  />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

export default RenderTable;
