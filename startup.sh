#!/bin/sh
# startup.sh - script to set ODL host and start UI

# Check if ODL default host is set
ODL_HOST_DEFAULT=$(grep ODL_HOST .env | xargs)
ODL=

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

echo "Starting UniConfig UI ..."

cat << "EOF"

 _   _      _  ___           __ _          _   _ ___
| | | |_ _ (_)/ __|___ _ _  / _(_)__ _ ___| | | |_ _|
| |_| | ' \| | (__/ _ \ ' \|  _| / _` |___| |_| || |
 \___/|_||_|_|\___\___/_||_|_| |_\__, |    \___/|___|
                                 |___/

EOF

if [ -z "$ODL" ]; then
    echo "\e[35mUsing ${ODL_HOST_DEFAULT}\e[0m"
  else
    sed -i 's,.*ODL_HOST=.*,ODL_HOST='"$ODL"',' ./.env
    echo "\e[35mUsing ODL at host: '$ODL'\e[0m"
fi

sudo docker-compose up uniconfig-ui