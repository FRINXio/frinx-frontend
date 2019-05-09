# Frinx UniConfig tool

## Installation 

#### Requirements
* [Docker](https://www.docker.com/)
* [Docker Compose](https://github.com/docker/compose)

#### `sudo ./install.sh [--odl]` <br>
Creates docker container with installation of UniConfig-UI. <br>
##### Options: <br>
* `--odl / -o` - Sets ODL host address with following format: `http://${address}:${port}`, 

## Startup

In the project directory, run: 

#### `sudo ./startup.sh [--odl]` <br>
Starts the UniConfig-UI container using ODL host defined at installation (if --odl option is not used).
#### Options: <br>
* `--odl / -o` - Sets ODL host address with following format: `http://${address}:${port}`

Alternatively, ODL host can be set in `./env` file located in project directory. 
