import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card } from 'semantic-ui-react';
import config from '@plone/volto/registry';

class BlockView extends Component {
  getPath(url) {
    return url
      .replace(config.settings.apiPath, '')
      .replace(config.settings.internalApiPath, '');
  }

  render() {
    return (
      <div>
        <Grid>
          <Grid.Row>
            {this.props.properties.items.length === 0 && <div>No children</div>}
            {this.props.properties.items.map((item) => (
              <Grid.Column width={6} style={{ margin: '1rem 0' }}>
                <Card.Group centered>
                  <Card>
                    <Card.Content style={{ textAlign: 'center' }}>
                      <Link key={item.url} to={this.getPath(item['@id'])}>
                        <h3 style={{ margin: 0 }}>
                          {item.title || item.Title}
                        </h3>
                      </Link>
                    </Card.Content>
                  </Card>
                </Card.Group>
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default BlockView;
