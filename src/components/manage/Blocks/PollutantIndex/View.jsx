import React, { useState, useEffect, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Tab, Dropdown, Table } from 'semantic-ui-react';
import DiscodataSqlBuilder from 'volto-datablocks/DiscodataSqlBuilder/View';
import { setQueryParam, deleteQueryParam } from 'volto-datablocks/actions';
import qs from 'query-string';
import cx from 'classnames';
import './style.css';

const panes = [
  {
    menuItem: 'General information',
    render: (props) => {
      const { pollutant = {} } = props.data;
      const classification = pollutant.classification
        ?.split('|')
        .map((category) => category.replace(/['"]+/g, ''))
        .join(', ');
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
      const main_methods_of_release =
        pollutant.health_affects
          ?.split('|')
          ?.map((item) => item.replace(/['"]+/g, '')) || [];
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
              { label: 'EC Number	', value: pollutant.ec_no || '-' },
              { label: 'SMILES tooltip', value: pollutant.smiles_code || '-' },
              { label: 'Chemspider id', value: pollutant.chemspider_id || '-' },
              { label: 'Formula', value: molecular_formula || '-' },
              {
                label: 'Classification',
                value: classification || '-',
              },
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
          {main_methods_of_release?.length > 0 ? (
            <div className="mb-1">
              <h3>Where do the releases originate?</h3>
              {main_methods_of_release.map((item, index) => (
                <p
                  key={`main_methods_of_release_${index}`}
                  dangerouslySetInnerHTML={{
                    __html: item,
                  }}
                />
              ))}
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
    menuItem: 'Pollutant Group',
    render: (props) => {
      const { pollutants = [], pollutant_group = {} } = props.data;
      const sub = pollutant_group.sub
        ?.split('|')
        ?.map((sub) => sub.replace(/['"]+/g, ''));
      const description = pollutant_group.description
        ?.replace(/['"]+/g, '')
        .split('\n')
        .map(
          (element, index) =>
            element + (sub?.[index] ? `<sub>${sub[index]}</sub>` : ''),
        )
        .join('');

      if (!pollutants?.length) return '';
      return (
        <Tab.Pane>
          {pollutant_group.name ? (
            <div className="mb-1">
              <h3>{`Pollutant Group - ${pollutant_group.name}`}</h3>
            </div>
          ) : (
            ''
          )}
          {description ? (
            <div className="mb-1">
              <p
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
            </div>
          ) : (
            ''
          )}
          {pollutants?.length > 0 ? (
            <div className="mb-1">
              <p className="bold">Group members</p>
              <ul className="pollutants-list">
                {pollutants.map((pollutant, index) => (
                  <li key={`${index}_${pollutant.code}_item`}>
                    {pollutant.name}
                  </li>
                ))}
              </ul>
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
  {
    menuItem: 'Measurements and calculations methods',
    render: (props) => {
      const { pollutant_iso = [] } = props.data;

      return (
        <Tab.Pane>
          <h3>Methods and uncertainty</h3>
          {pollutant_iso?.length > 0 ? (
            <RenderTable
              className="description-table"
              celled={false}
              headless={false}
              headers={[
                { key: 'standard', value: 'Standard' },
                { key: 'title', value: 'Title' },
                { key: 'target', value: 'Target' },
                { key: 'uncertainty', value: 'Uncertainty' },
              ]}
              rows={pollutant_iso.map((iso) => {
                const uncertainty_sup = iso.uncertainty_sup
                  ?.split('|')
                  ?.map((sub) => sub.replace(/['"]+/g, ''));
                const uncertainty_text = iso.uncertainty_text
                  ?.replace(/['"]+/g, '')
                  .split('\n')
                  .map(
                    (element, index) =>
                      element +
                      (uncertainty_sup?.[index]
                        ? `<sub>${uncertainty_sup[index]}</sub>`
                        : ''),
                  )
                  .join('');
                return {
                  standard: iso.standard,
                  title: iso.title,
                  target: iso.target,
                  uncertainty: uncertainty_text,
                };
              })}
            />
          ) : (
            ''
          )}

          <div>
            <p>Footnotes</p>
            <p>
              (*) indicates that performance information is included in the
              standard but not in a suitable form for inclusion.
            </p>
            <p>(-) Indicates that no information is available.</p>
            <p>
              Notes:This table is based on the following published information:
              the 2003 General Principles of Monitoring BREF{' '}
              <a href="http://eippcb.jrc.es/reference/">
                http://eippcb.jrc.es/reference/
              </a>
              ; CEN and ISO websites and those of their relevant Technical
              Committees (TCs) for details and publication dates ( i.e. CEN
              TC230 – water analysis and CEN TC 264 – air quality, ISO TC 147 –
              water quality and ISO TC 146 – air quality); and current UK
              guidance on monitoring for air and water for IPPC Directive
              installations (Environment Agency documents M2 Version 6 - January
              2010and M18 Version 2 - April 2009 covering air and water
              respectively) available on{' '}
              <a href="http://www.environment-agency.gov.uk/business/regulation/31831.aspx">
                http://www.environment-agency.gov.uk/business/regulation/31831.aspx
              </a>
              ).Standard numbers have been checked against CEN and ISO websites
              and, to best of our knowledge, are both available and consistent
              with EN or ISO publication dates.
            </p>
            <p>
              Information related to uncertainty is included where it is
              available, in a suitable form, in the standard.The information
              given for Stationary source emissions generally refers to sampling
              and analysis, that for Water quality data refers to the
              coefficient of variation of reproducibility - CVR - of the
              analysis alone.CVR is the reproducibility standard deviation/mean
              concentration, expressed as a %, this has been expressed to one
              significant decimal place %. Wherever possible we have taken the
              sample matrix most similar to the industrial discharges to be
              reported under the EPRTR Regulation.Where the Standard allows a
              choice of technique we have taken the &#39;worst&#39; case - on
              the basis that if an operator reports a discharge as having been
              measured in accordance with the Standard and not necessarily a
              particular variation of it.
            </p>
          </div>
        </Tab.Pane>
      );
    },
  },
  {
    menuItem: 'Synonyms or other commercial names',
    render: (props) => {
      const { pollutant = {} } = props.data;
      const synonyms = [];
      pollutant.synonyms &&
        pollutant.synonyms.split('|').forEach((synonym) => {
          synonyms.push(synonym.replace(/['"]+/g, ''));
        });
      return (
        <Tab.Pane>
          <h3>Synonyms or other commercial names</h3>
          <ul className="pollutants-list">
            {synonyms.map((synonym, index) => (
              <li key={`${index}_synonym`}>{synonym}</li>
            ))}
          </ul>
        </Tab.Pane>
      );
    },
  },
  {
    menuItem: 'Other relevant reporting requirements',
    render: (props) => {
      const { other_provisions = [] } = props.data;
      const provisionsOrder = [];
      const provisions = {};
      other_provisions.forEach((provision) => {
        if (!provisions[provision.other_provision_id]) {
          provisions[provision.other_provision_id] = {};
          provisionsOrder.push(provision.other_provision_id);
        }
        provisions[provision.other_provision_id][
          provision.other_provision_type
        ] = provision;
      });

      const getProvisionText = (sub, text) => {
        const parsed_sub = sub
          ?.split('|')
          ?.map((sub) => sub.replace(/['"]+/g, ''));
        return text
          ?.replace(/['"]+/g, '')
          .split('\n')
          .map(
            (element, index) =>
              element +
              (parsed_sub?.[index] ? `<sub>${parsed_sub[index]}</sub>` : ''),
          )
          .join('');
      };

      return (
        <Tab.Pane>
          <div>
            <h3 className="mb-0">
              Overview of relevant reporting requirements for the selected
              pollutant or compound set by European Regulations or Multilateral
              Environmental Agreements (MEAs).
            </h3>
            {provisionsOrder.map((provision, index) => (
              <div
                key={`${provision}_${index}_other_provision`}
                className="mt-1 mb-1"
              >
                {provisions[provision].other_provision_instrument
                  ?.other_provision_text ? (
                  <h3>
                    <i
                      dangerouslySetInnerHTML={{
                        __html: getProvisionText(
                          provisions[provision].other_provision_instrument
                            .other_provision_sub,
                          provisions[provision].other_provision_instrument
                            .other_provision_text,
                        ),
                      }}
                    />
                  </h3>
                ) : (
                  ''
                )}
                {provisions[provision].other_provision_overview
                  ?.other_provision_text ? (
                  <div className="mb-1">
                    <p className="bold">Overview</p>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: getProvisionText(
                          provisions[provision].other_provision_overview
                            .other_provision_sub,
                          provisions[provision].other_provision_overview
                            .other_provision_text,
                        ),
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
                {provisions[provision].other_provision_reporting
                  ?.other_provision_text ? (
                  <div className="mb-1">
                    <p className="bold">General Reporting</p>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: getProvisionText(
                          provisions[provision].other_provision_reporting
                            .other_provision_sub,
                          provisions[provision].other_provision_reporting
                            .other_provision_text,
                        ),
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
                {provisions[provision].other_provision_specific
                  ?.other_provision_text ? (
                  <div className="mb-1">
                    <p className="bold">Specific Reporting</p>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: getProvisionText(
                          provisions[provision].other_provision_specific
                            .other_provision_sub,
                          provisions[provision].other_provision_specific
                            .other_provision_text,
                        ),
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
              </div>
            ))}
          </div>
        </Tab.Pane>
      );
    },
  },
  {
    menuItem: 'Hazards and other technical characteristics',
    render: (props) => {
      const { pollutant = {} } = props.data;

      return (
        <Tab.Pane>
          <h3>Risk and Safety Phrases (R&S)</h3>
          <p>
            Risk and Safety phrases describe the risks of a substance and safety
            measures that should be taken.
          </p>
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
                label: 'R23/25',
                value: pollutant.pollutantId || '-',
              },
            ]}
          />
          <h3>Classification & Labelling</h3>
          <p>
            The Regulation (EC) No 1272/2008 establishes a standard
            classification and labelling system for substances distinguishing a)
            Hazard Class and b) Hazard Statements
          </p>
          <a href="https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2008:353:0001:1355:">
            Regulation (EC) No 1272/2008, OJ L 353
          </a>
          <h3>Hazard Class</h3>
          <h3>Hazard Statements</h3>
          <h3>Physical Properties</h3>
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
                label: 'State @ 20 °C & 101.3kPA',
                value: pollutant.state || '-',
              },
              {
                label: 'Melting / freezing point °C',
                value: pollutant.melt_freeze_point || '-',
              },
              {
                label: 'Boiling Point °C',
                value: pollutant.boiling_point || '-',
              },
              {
                label: 'Water solubility, mg/l @ 25 °C',
                value: pollutant.water_solubility || '-',
              },
              {
                label: 'Density g/cm³',
                value: pollutant.density || '-',
              },
            ]}
          />
          <h3>Human Health & Environmental Hazard Assessment</h3>
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
                label: 'Aquatic Toxicity LC50',
                value: pollutant.aquatic_tox_lc50 || '-',
              },
              {
                label: 'Toxicity LD50 / LC50 mg/kg, ppm (gases)',
                value: pollutant.toxicity || '-',
              },
            ]}
          />
        </Tab.Pane>
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
  const [initialized, setInitialized] = useState(false);
  const [currentPollutant, setCurrentPollutant] = useState(undefined);
  const [currentPollutantGroup, setCurrentPollutantGroup] = useState(undefined);
  const mounted = useRef(false);
  const indexPollutantId =
    props.discodata_query.search.index_pollutant_id || null;
  const indexPollutantGroupId =
    props.discodata_query.search.index_pollutant_group_id || null;
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
  const currentPollutants = indexPollutants.filter(
    (pollutant) => parseInt(pollutant.parentId) === indexPollutantGroupId,
  );

  useEffect(() => {
    const newPollutant = indexPollutants.filter(
      (pollutant) => pollutant.pollutantId === indexPollutantId,
    )?.[0];
    setCurrentPollutant(
      indexPollutantId !== null && indexPollutantId !== undefined
        ? newPollutant
        : undefined,
    );
    if (newPollutant && newPollutant.other_provisions) {
      props.setQueryParam({
        queryParam: {
          index_pollutant_other_provisions: newPollutant.other_provisions
            .split('|')
            .map((item) => item.replace(/['"]+/g, '')),
        },
      });
    }
  }, [indexPollutantId]);

  useEffect(() => {
    const newPollutantGroup = indexPollutantGroups.filter(
      (group) => parseInt(group.pollutantId) === indexPollutantGroupId,
    )?.[0];

    setCurrentPollutantGroup(
      indexPollutantGroupId !== null && indexPollutantGroupId !== undefined
        ? newPollutantGroup
        : undefined,
    );
  }, [indexPollutantGroupId]);

  useEffect(() => {
    if (
      mounted.current &&
      !initialized &&
      !indexPollutantGroupId &&
      indexPollutantGroups.length > 0 &&
      indexPollutants.length > 0
    ) {
      props.setQueryParam({
        queryParam: {
          index_pollutant_group_id: parseInt(indexPollutants[0].parentId),
          index_pollutant_id: parseInt(indexPollutants[0].pollutantId),
        },
      });
      setCurrentPollutantGroup(
        indexPollutantGroups.filter(
          (group) =>
            parseInt(group.pollutantId) ===
            parseInt(indexPollutants[0].parentId),
        )[0],
      );
      setInitialized(true);
    }
  }, [indexPollutantGroups?.length, indexPollutants?.length]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <div className="pollutant-index-container">
      <DiscodataSqlBuilder
        data={{
          '@type': 'discodata_sql_builder',
          sql: {
            value:
              '{"fieldsets":[{"id":"sql_metadata","title":"SQL","fields":["index_pollutant_groups","index_pollutants","index_pollutant_iso","index_pollutant_other_provisions"]}],"properties":{"index_pollutant_groups":{"title":"Index pollutant groups","isCollection":true,"hasPagination":false,"urlQuery":false,"sql":"SELECT POL.*, POL_GROUPS.sub, POL_GROUPS.description\\nFROM [IED].[latest].[LOV_POLLUTANT] as POL\\nLEFT JOIN [IED].[latest].[pollutants_groups_details_table]  as POL_GROUPS\\nON POL.pollutantId = POL_GROUPS.pollutant_group_id \\nWHERE [parentId] = \'NULL\'\\nORDER BY name"},"index_pollutant_iso":{"title":"Index pollutants iso","hasPagination":true,"urlQuery":false,"sql":"SELECT *\\nFROM [IED].[latest].[pollutants_iso_provisions_table]","packageName":"index_pollutant_id"},"index_pollutant_other_provisions":{"title":"index_pollutant_other_provisions","hasPagination":true,"urlQuery":false,"sql":"SELECT *\\nFROM [IED].[latest].[pollutants_other_provisions_table]","packageName":"index_pollutant_id"},"index_pollutants":{"title":"Index pollutants","isCollection":true,"hasPagination":false,"urlQuery":false,"sql":"SELECT POL.code,\\nPOL.name,\\nPOL.startYear,\\nPOL.endYear,\\nPOL.parentId,\\nPOL.cas,\\nPOL.eperPollutantId,\\nPOL.codeEPER,\\nPOL_DET.*\\nFROM [IED].[latest].[LOV_POLLUTANT] as POL\\nLEFT JOIN [IED].[latest].[pollutants_details_table] AS POL_DET\\nON POL.pollutantId = POL_DET.pollutantId\\nORDER BY name","packageName":"index_pollutant_group_id"}},"required":[]}',
          },
          where: {
            value:
              '{"fieldsets":[{"id":"where_statements_metadata","title":"Where statements","fields":["w1","w2"]}],"properties":{"w1":{"title":"W1","sqlId":"index_pollutant_iso","urlQuery":false,"key":"pollutantId","queryParam":"index_pollutant_id"},"w2":{"title":"W2","sqlId":"index_pollutant_other_provisions","urlQuery":false,"key":"other_provision_id","queryParam":"index_pollutant_other_provisions","isExact":true}},"required":[]}',
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
          placeholder={'Pollutant'}
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
