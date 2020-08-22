/**
 * Footer component.
 * @module components/theme/Footer/Footer
 */

import React from 'react';
import { Container, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import eeaLogo from '../Header/eea.png';

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
                <Link className="item" to="/data">
                  <FormattedMessage
                    id="data"
                    defaultMessage="Explore the data"
                  />
                </Link>
              </li>

              <li>
                <Link className="item" to="/datasets">
                  <FormattedMessage id="datasets" defaultMessage="Datasets" />
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
            <div className="ui vertically divided grid">
              <div className="two column row">
                <div className="four wide column">
                  <a href="https://ec.europa.eu/" title="European Commission">
                    <img
                      className="footerLogo"
                      style={{ height: '50px' }}
                      src={eeaLogo}
                      alt="EEA"
                      title="EEA"
                    />
                  </a>
                </div>
                <div className="eight wide column">
                  <p>
                    European Environment Agency (EEA)
                    <br />
                    Kongens Nytrov 6
                    <br />
                    1050 Copenhagen K
                    <br />
                    Denmark
                    <br />
                    Phone: +4533367100
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="three wide column">
            <p>
              The European Environment Agency (EEA) is an agency of the European
              Union.
            </p>
            <Link className="item" to="/legal_notice">
              <FormattedMessage
                id="legal_notice"
                defaultMessage="Legal notice"
              />
            </Link>
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
