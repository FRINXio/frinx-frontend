#!/bin/sh
# install.sh - installation script of UniConfig-UI container

ODL=
ODL_HOST_DEFAULT="localhost:8080"

while [ "$1" != "" ]; do
    case $1 in
        -o | --odl)
            ODL=$2
        break;;
        -h | --help )
            echo "Usage: $0 [...option]"
            echo "  -o | --odl       Sets ODL host address."
        exit;;
        *)
        echo "$0: illegal option $1"
        exit 1;;
    esac
done

echo "Setting up UniConfig UI ..."

if [ -z "$ODL" ]; then
    echo "\e[93mUsing ${ODL_HOST_DEFAULT} as default, please set your ODL host address.\e[0m"
  else
    sed -i 's,.*ODL_HOST=.*,ODL_HOST='"http://""$ODL"',' ./.env
    echo "\e[35mUsing ODL at host: '$ODL' \e[0m"
fi

sudo docker-compose build uniconfig-ui

