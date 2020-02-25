#!/bin/bash
set -o pipefail

# get environment variables from .env
[ -f .env ] && source .env

localOrCloud="cloud"

# check we have the profile
if [ -z $SKILL_PROFILE ]; then 
    echo "Please add SKILL_PROFILE env file in your .env."
    exit 1
fi

# check we have lambda code folder
if [ -z $SKILL_LAMBDA_FOLDER ]; then
    echo "No lambda code folder provided on .env. Default is lambda/custom"
    codeFolder="$PWD/lambda/custom"
else
    codeFolder="$PWD/$SKILL_LAMBDA_FOLDER"
fi

if [ ! -d $codeFolder ]; then
    echo "$codeFolder doesn't exists. Creating it..."
    mkdir -p $codeFolder;
fi

# Create backup folder
source $PWD/scripts/backup-helper.sh
localBackupFolder=$(createBackupFolder $localOrCloud $SKILL_LAMBDA_FOLDER)
echo "Backup folder created on $localOrCloud for $SKILL_LAMBDA_FOLDER: $cloudBackupFolder"

cp -R "$codeFolder/." "$localBackupFolder"
echo "If there are any problems, please check the backup folder: $localBackupFolder"

ask lambda download --function $SKILL_LAMBDA_FUNCTION --dest $localBackupFolder

# uploading current dev version of lambda to cloud
echo "Uploading current version of lambda code from ($codeFolder)..."
oldPWD=$PWD
echo "Go to code folder: $codeFolder"
cd $codeFolder
echo "remove node_modules folder"
rm -rf node_modules
echo "npm install"
npm install
cd $oldPWD
echo "Uploading the lambda function..."
ask deploy -t lambda -p $SKILL_PROFILE

echo "Done!"