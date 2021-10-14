import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
// import { Promise } from 'es6-promise';
import shallowequal from 'shallowequal';
import tokenizeUrl from './tokenizeUrl';

const mappedCountries = [
  { country: 'Belgium', code: 'BE' },
  { country: 'Germany', code: 'GE' },
  { country: 'Romania', code: 'RO' },
];

const propTypes = {
  filters: PropTypes.object,
  tableauVersion: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  parameters: PropTypes.object,
  options: PropTypes.object,
  token: PropTypes.string,
  onLoad: PropTypes.func,
  query: PropTypes.string,
};

const defaultProps = {
  loading: false,
  parameters: {},
  filters: {},
  options: {},
};

class TableauReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: props.filters,
      parameters: props.parameters,
      saveData: {
        url: props.url,
        filters: {},
      },
      query: '?:embed=yes',
      activeSheet: '',
    };

    if (!__SERVER__ && this.props.tableauVersion) {
      this.api = require(`./tableau-${this.props.tableauVersion}`);
    }

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.api) {
      this.initTableau();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const isTabsChanged =
      prevProps.options.hideTabs !== this.props.options.hideTabs;
    const isReportChanged = prevProps.url !== this.props.url;
    const isToolbarsChanged =
      prevProps.options.hideToolbars !== this.props.options.hideToolbars;

    const isParametersChanged = !shallowequal(
      this.props.parameters,
      this.props.parameters,
    );
    const isLoading = this.state.loading;

    const isShareChanged = prevProps.hideShare !== this.props.hideShare;

    const isFiltersChanged =
      //Object.keys(this.props.options)[0] !== Object.keys(prevProps.options)[0];
      this.props.filters !== prevProps.filters;

    if (
      isTabsChanged ||
      isReportChanged ||
      isToolbarsChanged ||
      isShareChanged
    ) {
      console.log(
        'reloading because',
        isTabsChanged,
        isReportChanged,
        isToolbarsChanged,
        isShareChanged,
      );
      this.initTableau(this.props.url);
    }
    // Only filters are changed, apply via the API
    if (!isReportChanged && isFiltersChanged && !isLoading) {
      this.applyFiltersInside(this.props.filters);
    }

    // Only parameters are changed, apply via the API
    if (!isReportChanged && isParametersChanged && !isLoading) {
      this.applyParameters(this.props.parameters);
    }

    // token change, validate it.
    if (prevProps.token !== this.props.token) {
      this.setState({ didInvalidateToken: false });
    }
    //hidetoolbars from query
    // if (isToolbarsChanged) {
    //   const toolbarQuery = this.props.options.hideToolbars
    //     ? '&:toolbar=no'
    //     : '&:toolbar=yes';
    // }
    //  Select tableau version and update tableau
    if (
      prevProps.tableauVersion !== this.props.tableauVersion &&
      this.props.tableauVersion
    ) {
      this.api = require(`./tableau-${this.props.tableauVersion}`);
      this.initTableau();
    }
  }

  onChange() {
    this.props.callback && this.props.callback(this.state.saveData);
  }

  /**
   * Compares the values of filters to see if they are the same.
   * @param  {Array<Number>} a
   * @param  {Array<Number>} b
   * @return {Boolean}
   */
  compareArrays(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.sort().toString() === b.sort().toString();
    }

    return undefined;
  }

  /**
   * Execute a callback when an array of promises complete, regardless of
   * whether any throw an error.
   */
  onComplete(promises, cb) {
    Promise.all(promises).then(() => cb(), () => cb());
  }

  /**
   * Returns a vizUrl, tokenizing it if a token is passed and immediately
   * invalidating it to prevent it from being used more than once.
   */
  getUrl(nextUrl) {
    const newUrl = nextUrl || this.props.url;
    const token = this.props.token;
    const parsed = url.parse(newUrl, true);

    if (!this.state.didInvalidateToken && token) {
      this.invalidateToken();
      const tokenizedUrl = tokenizeUrl(newUrl, token);
      const queriedUrl = this.applyQueryParameters(tokenizedUrl);
      return queriedUrl;
    }

    return this.applyQueryParameters(
      parsed.protocol + '//' + parsed.host + parsed.pathname,
    );
  }

  applyQueryParameters = url => {
    const toolbarQuery = this.props.options.hideToolbars
      ? '&:toolbar=no'
      : '&:toolbar=yes';
    const hideShareQuery =
      this.props.hideShare && !this.props.options.hideToolbars
        ? '&:showShareOptions=false'
        : '';
    const queriedUrl = url + '?:embed=yes' + toolbarQuery + hideShareQuery;

    console.log('thequeriedurl', queriedUrl);
    return queriedUrl;
  };

  applyFiltersInside(filters) {
    console.log('the filters', filters);

    const asyncFilter = mappedCountries.filter(
      country => country.code === filters['Member State'][0],
    )[0];

    if (this.viz && asyncFilter) {
      var worksheet = this.viz
        .getWorkbook()
        .getActiveSheet()
        .getWorksheets()[0];

      worksheet
        .applyFilterAsync('Member State', asyncFilter.country, 'REPLACE')
        .then(res => console.log(res));
    }

    console.log('asyncu', asyncFilter);
  }

  // invalidateToken() {
  //   this.setState({ didInvalidateToken: true });
  // }

  /**
   * Asynchronously applies filters to the worksheet, excluding those that have
   * already been applied, which is determined by checking against state.
   * @param  {Object} filters
   * @return {void}
   */
  // applyFilters(filters) {
  //   const REPLACE = tableau.FilterUpdateType.REPLACE;
  //   const promises = [];
  //
  //   this.setState({ loading: true });
  //
  //   for (const key in filters) {
  //     if (
  //       !this.state.filters.hasOwnProperty(key) ||
  //       !this.compareArrays(this.state.filters[key], filters[key])
  //     ) {
  //       promises.push(this.sheet.applyFilterAsync(key, filters[key], REPLACE));
  //     }
  //   }
  //
  //   this.onComplete(promises, () => this.setState({ loading: false, filters }));
  // }
  //
  // applyParameters(parameters) {
  //   const promises = [];
  //
  //   for (const key in parameters) {
  //     if (
  //       !this.state.parameters.hasOwnProperty(key) ||
  //       this.state.parameters[key] !== parameters[key]
  //     ) {
  //       const val = parameters[key];
  //       // Ensure that parameters are applied only when we have a workbook
  //       if (this.workbook && this.workbook.changeParameterValueAsync) {
  //         promises.push(this.workbook.changeParameterValueAsync(key, val));
  //       }
  //     }
  //   }
  //
  //   this.onComplete(promises, () =>
  //     this.setState({ loading: false, parameters }),
  //   );
  // }

  /**
   * Initialize the viz via the Tableau JS API.
   * @return {void}
   */
  initTableau(nextUrl) {
    if (__SERVER__) return;
    const { filters, parameters } = this.props;
    const vizUrl = this.getUrl(nextUrl);
    const options = {
      ...filters,
      ...parameters,
      ...this.props.options,
      onFirstInteractive: () => {
        console.log('On first interactive');
        this.workbook = this.viz.getWorkbook();
        let activeSheet = this.workbook.getActiveSheet();

        let saveData = JSON.parse(JSON.stringify(this.state.saveData));
        saveData['url'] = this.viz.getUrl();
        saveData['sheetname'] = activeSheet.getName();
        saveData.filters = this.props.filters[activeSheet.getName()];

        console.log('urls', this.props.url, this.state.saveData.url);

        if (this.props.url !== this.state.saveData.url) {
          this.setState({ saveData }, this.onChange);
        } else {
          this.setState({ saveData });
        }

        this.viz.addEventListener(
          this.api.tableauSoftware.TableauEventName.TAB_SWITCH,
          e => {
            let sheetname = e.getNewSheetName();

            this.viz.getCurrentUrlAsync().then(r => {
              const save = {
                ...this.state.saveData,
                sheetname: sheetname,
                url: r,
                filters: {
                  ...this.state.saveData.filters,
                },
              };
              this.setState({ saveData: save }, this.onChange);
            });
          },
        );
        this.viz.addEventListener(
          this.api.tableauSoftware.TableauEventName.FILTER_CHANGE,
          e => {
            console.log('changed filter');

            e.getFilterAsync().then(r => {
              console.log('filter async', r);
              let name = r.$caption;
              let values = r.$appliedValues.map(e => e.value);
              let sheetname = this.state.saveData.sheetname;
              let filters = { [r.$caption]: [r.$appliedValues[0].value] };
              this.setState({ filters });
              const save = {
                ...this.state.saveData,
                filters: {
                  ...this.state.filters,
                },
              };
              this.setState({ saveData: save }, this.onChange);
            });
          },
        );
      },
    };

    console.log('the options', options);

    if (this.viz) {
      this.viz.dispose();
      this.viz = null;
    }

    this.viz = new this.api.tableauSoftware.Viz(
      this.container,
      vizUrl,
      options,
    );
  }

  render() {
    if (__SERVER__) return '';
    return <div ref={c => (this.container = c)} />;
  }
}

TableauReport.propTypes = propTypes;
TableauReport.defaultProps = defaultProps;

export default TableauReport;
