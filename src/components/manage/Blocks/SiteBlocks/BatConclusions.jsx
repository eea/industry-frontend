import React from 'react';
import { Popup, Grid } from 'semantic-ui-react';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { UniversalLink } from '@plone/volto/components';
import { getDate } from './helpers';
import cx from 'classnames';
import infoSVG from '@plone/volto/icons/info.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';

const View = (props) => {
  const [activeAels, setActiveAels] = React.useState({});
  const { data = {}, installationsNth = {}, entity = '' } = props;
  const installations = Object.keys(data).sort();

  return (
    <div className="bat-conclusions">
      <div
        className={cx({
          title: true,
          marginless: !installations.length,
        })}
      >
        <h3 className="blue">BAT conclusions</h3>
        <Popup
          position="top left"
          content="Number of individual conclusions that indicate which techniques or combinations of techniques are BAT for achieving a specific environmental objective"
          trigger={
            <div className="popup-svg">
              <Icon name={infoSVG} size={20} color="#D63D27" />
            </div>
          }
        />
      </div>

      {installations.length ? (
        <div className="bat-conclusions-wrapper">
          {installations.map((installation) => {
            const conclusions = Object.keys(data[installation] || {}).sort();

            return (
              <div
                key={installation}
                className="installation-conclusions-wrapper"
              >
                <h3 className="installation-id">
                  {entity === 'site'
                    ? `${installationsNth[installation]} ${installation}`
                    : ''}
                </h3>
                {conclusions.length
                  ? conclusions.map((conclusion) => {
                      const conclusionData =
                        data[installation][conclusion]?.[0];
                      const batAels = data[installation][conclusion]
                        .filter((ael) => ael.derogationBATAELName)
                        .sort((a, b) =>
                          a.derogationBATAELName > b.derogationBATAELName
                            ? 1
                            : b.derogationBATAELName > a.derogationBATAELName
                            ? -1
                            : 0,
                        );

                      return (
                        <div key={conclusion} className="conclusion-wrapper">
                          <div className="conclusion-title">
                            <h3>{conclusion}</h3>
                            {batAels.length ? (
                              <div style={{ display: 'flex' }}>
                                <Popup
                                  position="top center"
                                  content={
                                    activeAels[`${installation}.${conclusion}`]
                                      ? 'Hide BAT AELs'
                                      : 'Show BAT AELs'
                                  }
                                  trigger={
                                    <div className="popup-svg">
                                      <Icon
                                        className="button"
                                        name={
                                          activeAels[
                                            `${installation}.${conclusion}`
                                          ]
                                            ? downSVG
                                            : rightSVG
                                        }
                                        size={20}
                                        color="#D63D27"
                                        onClick={() => {
                                          if (
                                            !activeAels[
                                              `${installation}.${conclusion}`
                                            ]
                                          ) {
                                            setActiveAels({
                                              [`${installation}.${conclusion}`]: true,
                                            });
                                          } else {
                                            setActiveAels({});
                                          }
                                        }}
                                      />
                                    </div>
                                  }
                                />
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                          <Grid columns={12} className="conclusion-details">
                            <Grid.Row>
                              <Grid.Column mobile={6}>
                                <p className="label">Status</p>
                                <p className="info">
                                  {conclusionData.Status || '-'}
                                </p>
                              </Grid.Column>
                              <Grid.Column mobile={6}>
                                <p className="label">Status modified</p>
                                <p className="info">
                                  {conclusionData.StatusModifiedYear || '-'}
                                </p>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                          {batAels.length &&
                          activeAels[`${installation}.${conclusion}`] ? (
                            <div className="aels-wrapper">
                              <h3>BAT AELs</h3>
                              {batAels.map((ael) => {
                                return (
                                  <div
                                    key={ael.derogationBATAELName}
                                    className="ael"
                                  >
                                    <h4>
                                      <UniversalLink
                                        href={ael.derogationPublicReason || '#'}
                                        openLinkInNewTab={true}
                                        title={ael.derogationBATAELName}
                                      >
                                        {ael.derogationBATAELName}
                                      </UniversalLink>
                                    </h4>
                                    <Grid columns={12} className="ael-details">
                                      <Grid.Row>
                                        <Grid.Column mobile={6}>
                                          <p className="label">Start date</p>
                                          <p className="info">
                                            {getDate(ael.derogationStartDate) ||
                                              '-'}
                                          </p>
                                        </Grid.Column>
                                        <Grid.Column mobile={6}>
                                          <p className="label">End date</p>
                                          <p className="info">
                                            {getDate(ael.derogationEndDate)}
                                          </p>
                                        </Grid.Column>
                                        <Grid.Column mobile={12}>
                                          <p className="label">Status</p>
                                          <p className="info">
                                            {ael.Status || '-'}
                                          </p>
                                        </Grid.Column>
                                      </Grid.Row>
                                    </Grid>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      );
                    })
                  : ''}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="info">
          No information provided about competent authority
        </p>
      )}
    </div>
  );
};

export default View;
