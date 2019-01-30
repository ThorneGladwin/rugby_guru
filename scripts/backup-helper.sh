#!/bin/bash
set -o pipefail

# get environment variables from .env
[ -f .env ] && source .env

function createBackupFolder {
    localOrCloud=$1
    target=$2

    # check we have backup folder
    if [ -z $SKILL_BACKUP_FOLDER ]; then
        backupFolder="$PWD/.backup"
    else
        backupFolder="$PWD/$SKILL_BACKUP_FOLDER"
    fi
    if [ ! -d $backupFolder ]; then
        mkdir -p $backupFolder;
    fi

    # creating backup from the cloud version
    dateYear=`date +%Y`
    dateMonth=`date +%m`
    dateDay=`date +%d`
    time=`date +%H.%M`
    cloudBackupFolder="$backupFolder/$localOrCloud/$dateYear/$dateMonth/$dateDay/$time/$target"
    mkdir -p "$cloudBackupFolder"
    echo $cloudBackupFolder
}