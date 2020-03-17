## Energy Union: Volto Frontend

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=energy-union%2Fenergy_union_frontend%2Fmaster&subject=pipeline)](https://ci.eionet.europa.eu/view/Github/job/energy-union/job/energy_union_frontend/job/master/display/redirect)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/eea/energy_union_frontend?sort=semver)](https://github.com/eea/energy_union_frontend/releases)


A frontend component for the Energy Union website.

## Quick Start

Below is a list of commands you will probably find useful.

### `yarn start`

Runs the project in development mode.
You can view your application at `http://localhost:3000`

The page will reload if you make edits.

### `yarn build`

Builds the app for production to the build folder.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

### `yarn start:prod`

Runs the compiled app in production.

You can again view your application at `http://localhost:3000`

### `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

### `yarn i18n`

Runs the test i18n runner which extracts all the translation strings and
generates the needed files.

## Production

We use [Docker](https://www.docker.com/), [Rancher](https://rancher.com/) and [Jenkins](https://jenkins.io/) to deploy this application in production.

### Deploy

* Within `Rancher > Catalog > EEA` deploy [Volto - Energy Union](https://github.com/eea/eea.rancher.catalog/tree/master/templates/volto-energy-union)

### Release

* Create a new release of this code via `git tag` command or [Draft new release](https://github.com/eea/energy_union_frontend/releases/new) on Github.
  * A new Docker image is built and released automatically on [DockerHub](https://hub.docker.com/r/eeacms/energy-union-frontend) based on this tag.
  * A new entry is automatically added to [Volto - Energy Union](https://github.com/eea/eea.rancher.catalog/tree/master/templates/volto-energy-union) `EEA Rancher Catalog`
  * The [Jenkins job](https://ci.eionet.europa.eu/blue/organizations/jenkins/energy-union%2Fenergy_union_frontend/)

### Upgrade

* Within your Rancher environment click on the `Upgrade available` yellow button next to your stack.

* Confirm the upgrade

* Or roll-back if something went wrong and abort the upgrade procedure.
