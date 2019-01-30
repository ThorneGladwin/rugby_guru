#!/bin/bash
set -o pipefail

# get environment variables from .env
[ -f .env ] && source .env

localOrCloud="cloud"

# check we have the skill id
if [ -z $SKILL_LAMBDA_FUNCTION ]; then 
    echo "Please add SKILL_LAMBDA_FUNCTION env file in your .env."
    exit 1
fi
echo "Get lambda funtion: $SKILL_LAMBDA_FUNCTION"

# check we have lambda code folder
if [ -z $SKILL_LAMBDA_FOLDER ]; then
    echo "No lambda code folder provided on .env. Default is lambda/custom"
    codeFolder="$PWD/lambda/custom"
else
    codeFolder="$PWD/$SKILL_LAMBDA_FOLDER"
fi
echo "Lambda code folder: $codeFolder"

if [ ! -d $codeFolder ]; then
    echo "$codeFolder doesn't exists. Creating it..."
    mkdir -p $codeFolder;
fi

# Create backup folder
source $PWD/scripts/backup-helper.sh
cloudBackupFolder=$(createBackupFolder $localOrCloud $SKILL_LAMBDA_FOLDER)
echo "Backup folder created on $localOrCloud for $SKILL_LAMBDA_FOLDER: $cloudBackupFolder"

# Get lambda function (for backup)
response=`aws lambda get-function --function-name $SKILL_LAMBDA_FUNCTION` 
codeUrl=$(echo "$response" | grep Location | awk '{ print $2 }' | sed s/\"//g | sed s/,//g)
echo "Downloading lambda code..."
curl -o "$cloudBackupFolder/lambdaFunction.zip" $codeUrl
echo "Unziping code..."
unzip -qq "$cloudBackupFolder/lambdaFunction.zip" -d "$cloudBackupFolder" 
echo "Deleting temp..."
rm -f "$cloudBackupFolder/lambdaFunction.zip"


# uploading current dev version of lambda to cloud
echo "Uploading current version of lambda code from ($codeFolder)..."
oldPWD=$PWD
rm -f "lambdaFunctionCode.zip"
echo "Go to code folder: $codeFolder"
cd $codeFolder
echo "remove node_modules folder"
rm -rf node_modules
echo "npm install"
npm install
echo "Zipping file: $oldPWD/lambdaFunctionCode.zip"
zip -X -r -qq "$oldPWD/lambdaFunctionCode.zip" *
cd $oldPWD
echo "Uploading the code to aws..."
aws lambda update-function-code --function-name $SKILL_LAMBDA_FUNCTION --zip-file fileb://lambdaFunctionCode.zip
echo "Deleting temp .zip..."
rm -f "lambdaFunctionCode.zip"

echo "Done!"