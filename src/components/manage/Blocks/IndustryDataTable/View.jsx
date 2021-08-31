import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Icon, UniversalLink } from '@plone/volto/components';
import { Table, Menu, Loader, Dimmer } from 'semantic-ui-react';
import cx from 'classnames';
import RenderComponent from '@eeacms/volto-datablocks/components/manage/Blocks/SimpleDataTable/components';
import { ConnectorContext } from '@eeacms/volto-datablocks/hocs';
import { setQueryParam } from '@eeacms/volto-datablocks/actions';

import leftSVG from '@plone/volto/icons/left-key.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';
import upSVG from '@plone/volto/icons/up-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';

const isNotEmpty = (item) => {
  if (!item) return false;
  if (Array.isArray(item) && item.filter((i) => i).length === 0) return false;
  if (item === undefined || item === null) return false;
  if (typeof item === 'object' && Object.keys(item).length === 0) return false;
  return true;
};

const getQuery = (query) => {
  const obj = {
    ...(isNotEmpty(query.pollutant)
      ? { 'pollutants[like]': query.pollutant }
      : {}),
    ...(isNotEmpty(query.pollutantGroup)
      ? { 'air_groups[like]': query.pollutantGroup }
      : {}),
    ...(isNotEmpty(query.permitYear)
      ? { 'permit_years[like]': query.permitYear }
      : {}),
    ...(isNotEmpty(query.permitType)
      ? { 'permit_types[like]': query.permitType }
      : {}),
    ...(isNotEmpty(query.batConclusion)
      ? { 'bat_conclusions[like]': query.batConclusion }
      : {}),
    ...(isNotEmpty(query.reportingYear)
      ? { 'Site_reporting_year[in]:list': query.reportingYear }
      : {}),
    ...(isNotEmpty(query.nuts_latest)
      ? { 'nuts_regions[like]': query.nuts_latest }
      : {}),
    ...(isNotEmpty(query.siteCountry)
      ? { 'countryCode[in]:list': query.siteCountry }
      : {}),
    ...(isNotEmpty(query.siteTerm) ? { siteName: query.siteTerm } : {}),
  };

  return obj;
};

const View = (props) => {
  const context = React.useContext(ConnectorContext);
  const [openedRow, setOpenedRow] = React.useState(null);
  const {
    data = {},
    getAlignmentOfColumn,
    getNameOfColumn,
    getTitleOfColumn,
    has_pagination,
    pagination = {},
    placeholder,
    row_size,
    selectedColumns,
    show_header,
    tableData,
    discodata_query = {},
    updatePagination = () => {},
  } = props;

  React.useEffect(() => {
    const extent = discodata_query?.extent || [
      -10686671.0000035,
      -2430148.00000588,
      6199975.99999531,
      10421410.9999871,
    ];

    context.setState({
      ...context.state,
      extraQuery: {
        ...getQuery(discodata_query || {}),
        'shape_wm.STX[gte]:float': extent[0],
        'shape_wm.STX[lte]:float': extent[2],
        'shape_wm.STY[gte]:float': extent[1],
        'shape_wm.STY[lte]:float': extent[3],
      },
    });
    /* eslint-disable-next-line */
  }, [JSON.stringify(discodata_query)])

  return (
    <div className="industry-table">
      {row_size && tableData ? (
        <Table
          textAlign="left"
          striped={data.striped}
          className={`unstackable ${data.bordered ? 'no-borders' : ''}
          ${data.compact_table ? 'compact-table' : ''}`}
        >
          {show_header ? (
            <Table.Header>
              <Table.Row>
                {selectedColumns.map((colDef, j) => (
                  <Table.HeaderCell
                    key={getNameOfColumn(colDef)}
                    className={getAlignmentOfColumn(colDef, j)}
                  >
                    {getTitleOfColumn(colDef)}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
          ) : null}
          <Table.Body>
            {Array(Math.max(0, row_size))
              .fill()
              .map((_, i) => {
                const countFactypeEprtr =
                  tableData?.['count_factype_EPRTR']?.[i];
                const countFactypeNonEprtr =
                  tableData?.['count_factype_NONEPRTR']?.[i];
                const countInstypeIed = tableData?.['count_instype_IED']?.[i];
                const countInstypeNonIed =
                  tableData?.['count_instype_NONIED']?.[i];
                const countPlantypeLcp =
                  tableData?.['count_plantType_LCP']?.[i];
                const countPlantypeCoWi =
                  tableData?.['count_plantType_coWI']?.[i];
                const countPlantypeWi = tableData?.['count_plantType_WI']?.[i];
                return (
                  <React.Fragment key={`row-${i}`}>
                    <Table.Row>
                      {selectedColumns.map((colDef, j) => (
                        <Table.Cell
                          key={`${i}-${getNameOfColumn(colDef)}`}
                          textAlign={getAlignmentOfColumn(colDef, j)}
                        >
                          <RenderComponent
                            tableData={tableData}
                            colDef={colDef}
                            row={i}
                            {...props}
                          />
                        </Table.Cell>
                      ))}
                      <Table.Cell>
                        <button
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setOpenedRow(openedRow === i ? null : i);
                          }}
                        >
                          <Icon
                            name={openedRow === i ? upSVG : downSVG}
                            size="3em"
                          />
                        </button>
                      </Table.Cell>
                    </Table.Row>
                    {/* ==== TABLE HIDDEN ROW ==== */}
                    <Table.Row
                      className={cx('hidden-row', {
                        show: openedRow === i,
                        hide: openedRow !== i,
                      })}
                    >
                      <Table.Cell colSpan={selectedColumns.length + 1}>
                        <div className="hidden-row-container">
                          <div className="table-flex-container white">
                            <div>
                              <span className="header">Regulation</span>
                              <div className="flex column">
                                {countFactypeEprtr ? (
                                  <p className="mb-0">
                                    {`${countFactypeEprtr} ${
                                      countFactypeEprtr === 1
                                        ? 'EPRTR Facility'
                                        : 'EPRTR Facilities'
                                    }`}
                                  </p>
                                ) : (
                                  ''
                                )}

                                {countFactypeNonEprtr ? (
                                  <p className="mb-0">
                                    {`${countFactypeNonEprtr} ${
                                      countFactypeNonEprtr === 1
                                        ? 'NON-EPRTR Facility'
                                        : 'NON-EPRTR Facilities'
                                    }`}
                                  </p>
                                ) : (
                                  ''
                                )}

                                {countInstypeIed ? (
                                  <p className="mb-0">
                                    {`${countInstypeIed} ${
                                      countInstypeIed === 1
                                        ? 'IED Installation'
                                        : 'IED Installations'
                                    }`}
                                  </p>
                                ) : (
                                  ''
                                )}

                                {countInstypeNonIed ? (
                                  <p className="mb-0">
                                    {`${countInstypeNonIed} ${
                                      countInstypeNonIed === 1
                                        ? 'NON-IED Installation'
                                        : 'NON-IED Installations'
                                    }`}
                                  </p>
                                ) : (
                                  ''
                                )}

                                {countPlantypeLcp ? (
                                  <p className="mb-0">
                                    {`${countPlantypeLcp} ${
                                      countPlantypeLcp === 1
                                        ? 'Large combustion plant'
                                        : 'Large combustion plants'
                                    }`}
                                  </p>
                                ) : (
                                  ''
                                )}

                                {countPlantypeCoWi ? (
                                  <p className="mb-0">
                                    {`${countPlantypeCoWi} ${
                                      countPlantypeCoWi === 1
                                        ? 'Co-waste incinerator'
                                        : 'Large combustion plants'
                                    }`}
                                  </p>
                                ) : (
                                  ''
                                )}

                                {countPlantypeWi ? (
                                  <p className="mb-0">
                                    {`${countPlantypeWi} ${
                                      countPlantypeWi === 1
                                        ? 'Co-waste incinerator'
                                        : 'Co-waste incinerator'
                                    }`}
                                  </p>
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                            <div>
                              <span className="header">
                                Pollutant emissions
                              </span>
                              <div className="flex column">
                                <p className="mb-0">
                                  {tableData?.['pollutants']?.[i] ||
                                    'Not reported'}
                                </p>
                              </div>
                            </div>
                            <div>
                              <span className="header">
                                Regulatory Informations
                              </span>
                              <div className="flex column">
                                <p className="mb-0">
                                  Operating since:{' '}
                                  {tableData?.['dateOfLatestOpStart']?.[i] ||
                                    'not reported'}
                                </p>
                                <p className="mb-0">
                                  Last operating permit issued:{' '}
                                  {tableData?.['dateOfLatestPermit']?.[i] ||
                                    'not reported'}
                                </p>
                                <p className="mb-0">
                                  Number of inspections:{' '}
                                  {tableData?.['numInspections']?.[i] ||
                                    'not reported'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="table-flex-container action">
                            <div>
                              <div className="flex column">
                                <div className="flex align-center flex-grow">
                                  <UniversalLink
                                    className="solid red"
                                    href={`${data.link || '/'}?siteInspireId=${
                                      tableData?.['Site Inspire ID']?.[i]
                                    }&siteName=${
                                      tableData?.['siteName']?.[i]
                                    }&siteReportingYear=${
                                      tableData?.['Site_reporting_year']?.[i]
                                    }`}
                                  >
                                    Site details
                                  </UniversalLink>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  </React.Fragment>
                );
              })}
          </Table.Body>
          {has_pagination ? (
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell
                  colSpan={selectedColumns.length}
                  style={{ textAlign: 'center' }}
                >
                  <Menu pagination>
                    <Menu.Item
                      as="a"
                      icon
                      disabled={props.isPending || pagination.activePage === 1}
                      onClick={() => {
                        if (pagination.activePage > 1) {
                          updatePagination({
                            activePage: pagination.activePage - 1,
                          });
                        }
                      }}
                    >
                      <Icon name={leftSVG} size="24px" />
                    </Menu.Item>
                    <Menu.Item fitted>
                      <Loader
                        disabled={!props.isPending}
                        active
                        inline
                        size="tiny"
                      />
                    </Menu.Item>
                    <Menu.Item
                      as="a"
                      icon
                      disabled={
                        props.isPending ||
                        pagination.activePage === pagination.lastPage
                      }
                      onClick={() => {
                        if (row_size === pagination.itemsPerPage) {
                          updatePagination({
                            activePage: pagination.activePage + 1,
                          });
                        }
                      }}
                    >
                      <Icon name={rightSVG} size="24px" />
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          ) : null}
        </Table>
      ) : tableData ? (
        // TODO: find a better solution to keep headers
        <Table
          textAlign="left"
          striped={data.striped}
          className={`unstackable ${data.bordered ? 'no-borders' : ''}
        ${data.compact_table ? 'compact-table' : ''}`}
        >
          {show_header ? (
            <Table.Header>
              <Table.Row>
                {data?.columns?.map((header) => (
                  <Table.HeaderCell
                    key={header.column}
                    className={header.textAlign || 'left'}
                  >
                    {header.title}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
          ) : null}
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan={data?.columns?.length || 1}>
                <p>{placeholder}</p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      ) : (
        <Dimmer active={true} inverted>
          <Loader inverted>European Environment Agency</Loader>
        </Dimmer>
      )}
    </div>
  );
};

export default compose(
  connect(
    (state) => ({
      discodata_query: state.discodata_query?.search,
    }),
    { setQueryParam },
  ),
)(View);
