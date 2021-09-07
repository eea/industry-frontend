import React, { useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { Placeholder } from 'semantic-ui-react';
import cookie from 'react-cookie';
import ReactTooltip from 'react-tooltip';
import { Button, Checkbox, Message } from 'semantic-ui-react';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import infoSVG from '@plone/volto/icons/info.svg';
import config from '@plone/volto/registry';

import '@eeacms/volto-embed/css/embed-styles.css';

const key = (domain_key) => `accept-${domain_key}`;

const getExpDays = () =>
  typeof config.settings.embedCookieExpirationDays !== 'undefined'
    ? config.settings.embedCookieExpirationDays
    : 90;

function saveCookie(domain_key) {
  const date = new Date();
  date.setDate(date.getDate() + getExpDays());

  cookie.save(key(domain_key), 'true', {
    path: '/',
    expires: date,
  });
}

function canShow(domain_key) {
  return cookie.load(key(domain_key)) === 'true';
}

export default ({ children, data = {}, block, onShow, ...rest }) => {
  const { dataprotection = {} } = data;
  const [visible, setVisibility] = useState(false);
  const defaultShow = canShow(dataprotection.privacy_cookie_key);
  const [show, setShow] = useState(defaultShow);
  const [remember, setRemember] = useState(true);

  return (
    <VisibilitySensor
      onChange={(isVisible) => {
        !visible && isVisible && setVisibility(true);
      }}
      partialVisibility={true}
      offset={{ bottom: 200 }}
    >
      {visible ? (
        <>
          {!dataprotection.enabled || show ? (
            children
          ) : (
            <div
              className="privacy-protection"
              style={{
                backgroundImage: `url(${dataprotection.placeholder_image})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            >
              <div className="overlay">
                <div className="wrapped">
                  {dataprotection.type === 'big' ? (
                    <Message>
                      <div
                        className="privacy-statement"
                        dangerouslySetInnerHTML={{
                          __html: dataprotection.privacy_statement,
                        }}
                      />
                    </Message>
                  ) : (
                    ''
                  )}
                  <div className="privacy-button">
                    {dataprotection.type === 'small' ? (
                      <span
                        className="floating-icon mr-1"
                        data-tip={dataprotection.privacy_statement}
                      >
                        <Icon name={infoSVG} size="20px" color="#D63D27" />
                      </span>
                    ) : (
                      ''
                    )}
                    <Button
                      primary
                      onClick={() => {
                        setShow(true);
                        if (onShow) {
                          onShow();
                        }
                        if (remember) {
                          saveCookie(dataprotection.privacy_cookie_key);
                        }
                      }}
                    >
                      Show external content
                    </Button>
                  </div>

                  <div className="privacy-toggle">
                    <Checkbox
                      toggle
                      label="Remember my choice"
                      id={`remember-choice-${block}`}
                      onChange={(ev, { checked }) => {
                        setRemember(checked);
                      }}
                      checked={remember}
                    />
                  </div>

                  <p className="discreet">
                    Your choice will be saved in a cookie managed by{' '}
                    {config.settings.ownDomain || '.eea.europa.eu'} that will
                    expire in {getExpDays()} days.
                  </p>
                </div>
              </div>
            </div>
          )}
          <ReactTooltip />
        </>
      ) : (
        <Placeholder style={{ height: '100%', width: '100%' }}>
          <Placeholder.Image rectangular />
        </Placeholder>
      )}
    </VisibilitySensor>
  );
};
