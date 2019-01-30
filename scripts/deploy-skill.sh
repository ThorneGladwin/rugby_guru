#!/bin/bash
set -o pipefail

# get environment variables from .env
[ -f .env ] && source .env

localOrCloud="cloud"
target="skill"

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
cloudBackupFolder=$(createBackupFolder $localOrCloud $target)
echo "Backup folder created on $localOrCloud for $target: $cloudBackupFolder"

# Get skill (for backup)
echo "Get skill for backup: $cloudBackupFolder/skill.json"
ask api get-skill -p $SKILL_PROFILE -s $SKILL_ID -g $SKILL_ENV > "$cloudBackupFolder/skill.json"

# Deploy the skill
echo "Deploying the $target"
ask deploy -t $target -p $SKILL_PROFILE

echo "Done!"