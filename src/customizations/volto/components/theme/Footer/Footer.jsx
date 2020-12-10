/**
 * Footer component.
 * @module components/theme/Footer/Footer
 */

import React from 'react';
import { Container, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import eeaLogo from '../Header/eea.png';
import eclogo from '../Header/ec.png';

/**
 * Component to display the footer.
 * @function Footer
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component
 */
const Footer = ({ intl }) => (
  <Segment
    role="contentinfo"
    vertical
    padded
    inverted
    className="footerWrapper"
  >
    <Container>
      <div className="ui vertically divided grid">
        <div className="three column row">
          <div className="three wide column">
            <ul className="unlist">
              <li>
                <Link className="item" to="/">
                  <FormattedMessage id="home" defaultMessage="Home" />
                </Link>
              </li>

              <li>
                <Link className="item" to="/browse/industrial-emissions/map">
                  <FormattedMessage
                    id="data"
                    defaultMessage="Browse the data"
                  />
                </Link>
              </li>

              <li>
                <Link className="item" to="/raw-data">
                  <FormattedMessage id="datasets" defaultMessage="Raw data" />
                </Link>
              </li>
              <li>
                <Link className="item" to="/glossary">
                  <FormattedMessage id="glossary" defaultMessage="Glossary" />
                </Link>
              </li>
              <li>
                <Link className="item" to="/about">
                  <FormattedMessage id="about" defaultMessage="About" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="six wide column">
            <div className="ui vertically divided grid" style={{ margin: 0 }}>
              <div
                className="two column row"
                style={{ gap: '1rem', paddingTop: 0, paddingBottom: 0 }}
              >
                <div className="logo">
                  <a href="https://ec.europa.eu/" title="European Commission">
                    <img
                      className="footerLogo"
                      style={{ height: '50px' }}
                      src={eeaLogo}
                      alt="EEA"
                      title="EEA"
                    />
                  </a>
                  <img
                    className="footerLogo"
                    style={{ height: '50px' }}
                    src={eclogo}
                    alt="EC"
                    title="EC"
                  />
                </div>
                <p>
                  European Environment Agency (EEA)
                  <br />
                  Kongens Nytrov 6
                  <br />
                  1050 Copenhagen K
                  <br />
                  Denmark
                  <br />
                  <a
                    href="mailto:industry.helpdesk@eea.europa.eu"
                    target="_blank"
                  >
                    industry.helpdesk@eea.europa.eu
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="three wide column">
            <p>
              The European Environment Agency (EEA) is an agency of the European
              Union.
            </p>
            <div className="display-flex flex-flow-column">
              <Link className="item" to="/legal_notice">
                <FormattedMessage
                  id="legal_notice"
                  defaultMessage="Legal notice"
                />
              </Link>
              <Link className="item" to="/privacy-statement">
                <FormattedMessage
                  id="privacy_statement"
                  defaultMessage="Privacy statement"
                />
              </Link>
              <a className="item" href="https://status.eea.europa.eu">
                EEA systems status
              </a>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </Segment>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Footer.propTypes = {
  /**
   * i18n object
   */
};

export default injectIntl(Footer);
