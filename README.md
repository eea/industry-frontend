# Industry: Volto frontend
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto/industry-frontend/master&subject=pipeline)](https://ci.eionet.europa.eu/view/Github/job/volto/job/industry-frontend/job/master/display/redirect)
[![Release](https://img.shields.io/github/v/release/eea/industry-frontend?sort=semver)](https://github.com/eea/industry-frontend/releases)

## Documentation

A training on how to create your own website using Volto is available as part of the Plone training at [https://training.plone.org/5/volto/index.html](https://training.plone.org/5/volto/index.html).


## Getting started

1. Install `nvm`

        touch ~/.bash_profile
        curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

        source ~/.bash_profile
        nvm version

1. Install latest `NodeJS 12.x`:

        nvm install 12
        nvm use 12
        node -v
        v12.16.2

1. Install `yarn`

        curl -o- -L https://yarnpkg.com/install.sh | bash
        yarn -v

1. Clone:

        git clone https://github.com/eea/industry-frontend.git
        cd industry-frontend

1. Install

        yarn build

1. Start backend

        docker-compose up -d
        docker-compose logs -f backend

1. Start frontend

        yarn start:prod

1. See application at http://localhost:3000

## Try it

1. Install [Docker](https://docs.docker.com/install/)
1. Install [Docker Compose](https://docs.docker.com/compose/install/)
1. Start:

        git clone https://github.com/eea/industry-frontend.git
        cd industry-frontend

        docker-compose pull
        docker-compose up -d

    optionally change `PORTS` via `.env`:

        FRONTEND=9000 BACKEND=9100 docker-compose up -d

1. See application at http://localhost:4000

## Production

We use [Docker](https://www.docker.com/), [Rancher](https://rancher.com/) and [Jenkins](https://jenkins.io/) to deploy this application in production.

### Release

* Create a new release of this code via `git tag` command or [Draft new release](https://github.com/eea/industry-frontend/releases/new) on Github.
  * A new Docker image is built and released automatically on [DockerHub](https://hub.docker.com/r/eeacms/industry-frontend) based on this tag.

### Upgrade

* Within your Rancher environment click on the `Upgrade available` yellow button next to your stack.

* Confirm the upgrade

* Or roll-back if something went wrong and abort the upgrade procedure.