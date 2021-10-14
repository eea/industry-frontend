import React, { Component } from 'react';
import config from '@plone/volto/registry';
import TableauReport from './TableauReport';

class TableauBlockView extends Component {
  constructor(props) {
    super(props);

    let data = this.props.data || {};
    let filters =
      data.filters && data.sheetname ? data.filters[data.sheetname] : {};
    this.state = {
      url: data.url || '',
      sheetname: data.sheetname || '',
      filters: data.filters || '',
      options:
        { hideTabs: data.hideTabs, hideToolbars: data.hideToolbars } || '',
      hideShare: data.hideShare || false,
    };
  }
  render() {
    if (__SERVER__) return '';
    return (
      <div
        className="chartWrapperView"
        style={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        {this.state.url ? (
          <TableauReport
            url={this.state.url}
            tableauVersion={
              this.props.data.tableauVersion || config.settings.tableauVersion
            }
            filters={this.state.filters}
            sheetname={this.state.sheetname}
            options={this.state.options}
            hideShare={this.state.hideShare}
          />
        ) : (
          <div>Invalid or missing data.</div>
        )}
      </div>
    );
  }
}

export default TableauBlockView;
