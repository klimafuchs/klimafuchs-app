#!/usr/bin/env bash
COPY_SHEET_URL="https://docs.google.com/spreadsheets/u/1/d/1Kge9H9MNjEFVsvL-HXzd9kbV9PBqQ-r223VQnDjtl3g/export?format=csv&id=1Kge9H9MNjEFVsvL-HXzd9kbV9PBqQ-r223VQnDjtl3g&gid=0"
DEST_FILE=./src/localization/locale.gen.json
LOCALE=$(curl --silent ${COPY_SHEET_URL} 2>&1 | csvtojson | ./genLocale.js)

echo "$LOCALE" > ${DEST_FILE}
