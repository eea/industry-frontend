import React, { useState, useEffect, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Tab, Dropdown, Table } from 'semantic-ui-react';
import { DiscodataSqlBuilderView } from '@eeacms/volto-datablocks/components';
import {
  setQueryParam,
  deleteQueryParam,
} from '@eeacms/volto-datablocks/actions';
import cx from 'classnames';
import './style.css';

const panes = [
  {
    menuItem: 'General information',
    render: (props) => {
      const { pollutant = {} } = props.data;
      // const classification = pollutant.classification
      //   ?.split('|')
      //   .map((category) => category.replace(/['"]+/g, ''))
      //   .join(', ');
      const molecular_formula_sub = pollutant.molecular_formula_sub
        ?.split('|')
        .map((sub) => sub.replace(/['"]+/g, ''));
      const molecular_formula = pollutant.molecular_formula
        ?.replace(/['"]+/g, '')
        .split('\n')
        .map(
          (element, index) =>
            element +
            (molecular_formula_sub?.[index]
              ? `<sub>${molecular_formula_sub[index]}</sub>`
              : ''),
        )
        .join('');
      const health_affects_sub = pollutant.health_affects_sub
        ?.split('|')
        ?.map((sub) => sub.replace(/['"]+/g, ''));
      const health_affects =
        pollutant.health_affects
          ?.split('|')
          ?.map((item, index) =>
            health_affects_sub?.[index]
              ? item
                  .replace(/['"]+/g, '')
                  .replace('\n', `<sub>${health_affects_sub[index]}</sub>`)
              : item.replace(/['"]+/g, ''),
          ) || [];
      const main_methods_of_release = pollutant.main_methods_of_release;
      if (!props.data.pollutant) return '';
      return (
        <Tab.Pane>
          <RenderTable
            className="description-table"
            celled={false}
            headless={true}
            headers={[
              { key: 'label', value: 'Label' },
              { key: 'value', value: 'Value' },
            ]}
            rows={[
              {
                label: 'E-PRTR Pollutant No',
                value: pollutant.pollutantId || '-',
              },
              { label: 'IUPAC Name', value: pollutant.IUPAC_Name || '-' },
              { label: 'CAS Number', value: pollutant.cas_no || '-' },
              // { label: 'EC Number	', value: pollutant.ec_no || '-' },
              // { label: 'SMILES tooltip', value: pollutant.smiles_code || '-' },
              // { label: 'Chemspider id', value: pollutant.chemspider_id || '-' },
              { label: 'Formula', value: molecular_formula || '-' },
              // {
              //   label: 'Classification',
              //   value: classification || '-',
              // },
            ]}
          />
          {pollutant.description ? (
            <div className="mb-1">
              <h3>Description</h3>
              <p>{pollutant.description}</p>
            </div>
          ) : (
            ''
          )}
          {pollutant.main_uses ? (
            <div className="mb-1">
              <h3>Main Uses</h3>
              <p>{pollutant.main_uses}</p>
            </div>
          ) : (
            ''
          )}
          {main_methods_of_release ? (
            <div className="mb-1">
              <h3>Where do the releases originate?</h3>
              <p
                dangerouslySetInnerHTML={{
                  __html: main_methods_of_release,
                }}
              />
            </div>
          ) : (
            ''
          )}
          {health_affects?.length > 0 ? (
            <div>
              <h3>How do the releases affect you and your environment?</h3>
              {health_affects.map((item, index) => (
                <p
                  key={`health_affects_${index}`}
                  dangerouslySetInnerHTML={{
                    __html: item,
                  }}
                />
              ))}
            </div>
          ) : (
            ''
          )}
        </Tab.Pane>
      );
    },
  },
  {
    menuItem: 'Pollutant thresholds',
    render: (props) => {
      const { pollutant = {} } = props.data;
      return pollutant.prtr_provision_air ||
        pollutant.prtr_provision_water ||
        pollutant.prtr_provision_land ? (
        <Tab.Pane>
          <h3>Provisions under E-PRTR Regulation</h3>
          <p className="bold">Threshold for releases</p>
          <RenderTable
            celled={false}
            headless={false}
            headers={[
              { key: 'prtr_provision_air', value: 'to air kg/year' },
              { key: 'prtr_provision_water', value: 'to water kg/year' },
              { key: 'prtr_provision_land', value: 'to land kg/year' },
            ]}
            rows={[
              {
                prtr_provision_air: pollutant.prtr_provision_air || '',
                prtr_provision_water: pollutant.prtr_provision_water || '',
                prtr_provision_land: pollutant.prtr_provision_land || '',
              },
            ]}
          />
          <div>
            <p>
              * - indicates that the parameter and medium in question do not
              trigger a reporting requirement.
            </p>
          </div>
        </Tab.Pane>
      ) : (
        ''
      );
    },
  },
];

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

const View = (props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentPollutant, setCurrentPollutant] = useState(undefined);
  const [currentPollutantGroup, setCurrentPollutantGroup] = useState(undefined);
  const mounted = useRef(false);
  const indexPollutantId =
    props.discodata_query.search.index_pollutant_id || null;
  const indexPollutantGroupId =
    props.discodata_query.search.index_pollutant_group_id || null;
  const [dataReady, setDataReady] = useState(
    indexPollutantId && indexPollutantGroupId,
  );
  const indexPollutantGroups =
    props.discodata_resources.data.index_pollutant_groups || [];
  const indexPollutants = props.discodata_resources.data.index_pollutants || [];
  const indexPollutantIso =
    props.discodata_resources.data.index_pollutant_iso?.[indexPollutantId]
      ?.results || [];
  const currentOtherProvisions =
    props.discodata_resources.data.index_pollutant_other_provisions?.[
      indexPollutantId
    ]?.results || [];
  const currentPhrases =
    props.discodata_resources.data.index_pollutant_phrases?.[indexPollutantId]
      ?.results || [];
  const currentPollutants = indexPollutants.filter(
    (pollutant) => parseInt(pollutant.parentId) === indexPollutantGroupId,
  );

  useEffect(() => {
    if (indexPollutants.length && indexPollutantGroups.length && !dataReady) {
      props.setQueryParam({
        queryParam: {
          index_pollutant_group_id: indexPollutants[0].parrentId,
          index_pollutant_id: indexPollutants[0].pollutantId,
        },
      });
      setDataReady(true);
    }
    /* eslint-disable-next-line */
  }, [indexPollutants, indexPollutantGroups]);

  useEffect(() => {
    const newPollutant = indexPollutants.filter(
      (pollutant) => pollutant.pollutantId === indexPollutantId,
    )?.[0];
    const newQueries = {};
    const phrasesKeys = newPollutant
      ? ['clp_phrases', 'ghs_phrases', 'r_phrases', 's_phrases']
      : [];
    const phrases = newPollutant
      ? phrasesKeys
          .filter(
            (phrase) =>
              newPollutant[phrase] && newPollutant[phrase] !== 'NoData',
          )
          .map((phrase) =>
            newPollutant[phrase]
              .split('|')
              .map((item) => item.replace(/['"]+/g, '')),
          )
      : [];

    setCurrentPollutant(
      indexPollutantId !== null && indexPollutantId !== undefined
        ? newPollutant
        : undefined,
    );

    if (newPollutant && newPollutant.other_provisions) {
      newQueries.index_pollutant_other_provisions = newPollutant.other_provisions
        .split('|')
        .map((item) => item.replace(/['"]+/g, ''));
    }

    if (newPollutant && phrases.length > 0) {
      newQueries.index_pollutant_phrases = phrases.join().split(',');
    }

    if (Object.keys(newQueries).length) {
      props.setQueryParam({
        queryParam: {
          ...newQueries,
        },
      });
    }
    /* eslint-disable-next-line */
  }, [indexPollutantId, JSON.stringify(indexPollutants)]);

  useEffect(() => {
    const newPollutantGroup = indexPollutantGroups.filter(
      (group) => parseInt(group.pollutantId) === indexPollutantGroupId,
    )?.[0];

    setCurrentPollutantGroup(
      indexPollutantGroupId !== null && indexPollutantGroupId !== undefined
        ? newPollutantGroup
        : undefined,
    );
    /* eslint-disable-next-line */
  }, [indexPollutantGroupId, JSON.stringify(indexPollutantGroups)]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <div className="pollutant-index-container">
      <DiscodataSqlBuilderView
        data={{
          '@type': 'discodata_sql_builder',
          sql: {
            value:
              '{"fieldsets":[{"id":"sql_metadata","title":"SQL","fields":["index_pollutant_groups","index_pollutants","index_pollutant_iso","index_pollutant_other_provisions","index_pollutant_phrases"]}],"properties":{"index_pollutant_groups":{"title":"Index pollutant groups","isCollection":true,"hasPagination":false,"urlQuery":false,"sql":"SELECT pollutant_group_id as pollutantId , * \\nFROM [IED].[latest].[Glo_PollutantsGroupsDetails]\\nORDER BY name"},"index_pollutants":{"title":"Index pollutants","isCollection":true,"hasPagination":false,"urlQuery":false,"sql":"SELECT POL.code,\\nPOL.name,\\nPOL.startYear,\\nPOL.endYear,\\nPOL.parentId,\\nPOL.cas,\\nPOL.eperPollutantId,\\nPOL.codeEPER,\\nPOL_DET.*\\nFROM [IED].[latest].[Glo_Pollutants] as POL\\nLEFT JOIN [IED].[latest].[Glo_PollutantsDetails] AS POL_DET\\nON POL.pollutantId = POL_DET.pollutantId\\nORDER BY name","packageName":"index_pollutant_group_id"},"index_pollutant_iso":{"title":"Index pollutants iso","hasPagination":true,"urlQuery":false,"sql":"SELECT *\\nFROM [IED].[latest].[Glo_PollutantsIsoProvision]","packageName":"index_pollutant_id"},"index_pollutant_other_provisions":{"title":"index_pollutant_other_provisions","hasPagination":true,"urlQuery":false,"sql":"SELECT *\\nFROM [IED].[latest].[Glo_PollutantsOtherProvisions]","packageName":"index_pollutant_id"},"index_pollutant_phrases":{"title":"index_pollutant_phrases","hasPagination":true,"urlQuery":false,"sql":"SELECT *\\nFROM [IED].[latest].[Glo_PollutantsPrase]","packageName":"index_pollutant_id"}},"required":[]}',
          },
          where: {
            value:
              '{"fieldsets":[{"id":"where_statements_metadata","title":"Where statements","fields":["w1","w2","w3"]}],"properties":{"w1":{"title":"W1","sqlId":"index_pollutant_iso","urlQuery":false,"key":"pollutantId","queryParam":"index_pollutant_id"},"w2":{"title":"W2","sqlId":"index_pollutant_other_provisions","urlQuery":false,"key":"other_provision_id","queryParam":"index_pollutant_other_provisions","isExact":true},"w3":{"title":"W3","sqlId":"index_pollutant_phrases","urlQuery":false,"key":"phrase_id","queryParam":"index_pollutant_phrases"}},"required":[]}',
          },
        }}
      />
      <div className="custom-selector big blue display-flex flex-flow-column">
        <Dropdown
          search
          selection
          onChange={(event, data) => {
            const pollutantId = data.options.filter((opt) => {
              return opt.value === data.value;
            })[0]?.value;
            const newPollutant = indexPollutants.filter(
              (pollutant) => pollutant.pollutantId === pollutantId,
            )?.[0];
            props.setQueryParam({
              queryParam: {
                index_pollutant_group_id: parseInt(newPollutant.parentId),
                index_pollutant_id: parseInt(pollutantId),
              },
            });
          }}
          placeholder={'Select pollutant'}
          options={indexPollutants
            .filter((pollutant) => pollutant.pollutantId)
            .map((pollutant) => ({
              key: pollutant.code,
              value: pollutant.pollutantId,
              text: pollutant.name,
            }))}
          value={indexPollutantId}
        />
      </div>
      <Tab
        activeIndex={activeTab}
        panes={panes}
        onTabChange={(event, data) => {
          setActiveTab(data.activeIndex);
        }}
        data={{
          pollutants: currentPollutants,
          pollutant: currentPollutant,
          pollutant_iso: indexPollutantIso,
          pollutant_group: currentPollutantGroup,
          other_provisions: currentOtherProvisions,
          phrases: currentPhrases,
        }}
      />
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: state.router.location.search,
      discodata_query: state.discodata_query,
      discodata_resources: state.discodata_resources,
    }),
    {
      setQueryParam,
      deleteQueryParam,
    },
  ),
)(View);
