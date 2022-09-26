#!/usr/bin/env bash
set -e

echo "Release name: $RELEASE_NAME"
echo "Release number: $RELEASE_NUMBER"

echo "Creating temp dir: $TMP_DIR"
mkdir "$TMP_DIR"

SUB_DIRS="bc cc pc is digital"
for subDir in $SUB_DIRS
do
  cd "$TMP_DIR"
  echo "Creating subdirectory: $subDir"
  mkdir "$subDir"
  echo "Downloading files from the S3 bucket"
  if [[ "$subDir" == "digital" ]]; then
    aws s3 cp s3://tenant-doctools-omega2-andromeda-builds/cloud/dx/ $subDir/ --recursive --exclude "*" --include "**/$RELEASE_NUMBER/*.pdf"
  else
    aws s3 cp s3://tenant-doctools-omega2-andromeda-builds/cloud/$subDir/$RELEASE_NUMBER/ $subDir/ --recursive --exclude "*" --include "*.pdf"
  fi
done

for subDir in $SUB_DIRS
do
  cd "$TMP_DIR"
  echo "Creating ZIP archives"
  if [[ "$subDir" == "digital" ]]; then
      for d in $(find "$subDir" -name "*" -maxdepth 1 -mindepth 1 -type d)
      do
         d_name=${d/$subDir\//}
         d_name_clean=${d_name/-/}
         zip -j ${subDir}_${d_name_clean}_${RELEASE_NAME}_pdfs.zip $(find "$d" -name "*.pdf")
      done
  else
    zip -j ${subDir}_${RELEASE_NAME}_pdfs.zip $(find "$subDir" -name "*.pdf")
  fi
done

zip -j ${ZIP_ARCHIVE_NAME} $(find "$TMP_DIR" -name "*.zip" -maxdepth 1)