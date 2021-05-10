import React from 'react';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import config from '@plone/volto/registry';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import getSchema from './schema';
import View from './View';

const Edit = (props) => {
  const { provider_data = null, data = {} } = props;
  const provider_keys = Object.keys(provider_data || {});
  const [schema, setSchema] = React.useState(getSchema(config, provider_keys));

  /**
Provider name: Site flags
Provider path: /data-connectors/site-flags
SELECT *
FROM (
    SELECT *, CONVERT(varchar(4), euregReportingYear) AS siteReportingYear
    FROM [IED].[latest].[Browse5_Header] as B5H
    LEFT JOIN [IED].[latest].[site_flags] as SF
        ON B5H.[siteInspireId] = SF.[Site Inspire ID]
) as B5H
*/

  React.useEffect(() => {
    if (!data.provider_url) {
      props.onChangeBlock(props.block, {
        ...props.data,
        provider_url:
          config.blocks.blocksConfig.site_tableau_block.defaultProviderUrl,
      });
    }
    /* eslint-disable-next-line */
  }, []);

  React.useEffect(() => {
    setSchema(getSchema(config, provider_keys));
    /* eslint-disable-next-line */
  }, [JSON.stringify(provider_keys)]);

  return (
    <>
      <View {...props} mode="edit" />

      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            props.onChangeBlock(props.block, {
              ...props.data,
              [id]: value,
            });
          }}
          formData={props.data}
        />
      </SidebarPortal>
    </>
  );
};

export default connectBlockToProviderData(Edit);
