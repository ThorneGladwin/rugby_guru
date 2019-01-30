#!/bin/bash
set -o pipefail

# get environment variables from .env
[ -f .env ] && source .env

localOrCloud="local"
target="models"

# check we have the profile
if [ -z $SKILL_PROFILE ]; then 
    echo "Please add SKILL_PROFILE env file in your .env."
    exit 1
fi

# check we have the skill id
if [ -z $SKILL_ID ]; then 
    echo "Please add SKILL_ID env file in your .env."
    exit 1
fi
echo "Get model for skill: $SKILL_ID"

# Create backup folder
source $PWD/scripts/backup-helper.sh
localBackupFolder=$(createBackupFolder $localOrCloud $target)
echo "Backup folder created on $localOrCloud for $target: $cloudBackupFolder"

cp -R models/. "$localBackupFolder"
echo "If there are any problems, please check the backup folder: $localBackupFolder"

# get models
for file in models/*; do
    fileNoExt=${file##*/}
    language=${fileNoExt%.*}
    echo "Updating model for $language: $PWD/models/$language.json"
    ask api get-model -p $SKILL_PROFILE -s $SKILL_ID -g $SKILL_ENV -l $language > "$PWD/models/$language.json"
done

echo "Done!"