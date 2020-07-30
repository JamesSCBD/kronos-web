
if [ ! -d "$PWD/dist" ]; then
  exit 0
fi
rm -rf .nuxt
NODE_ENV=development yarn nuxt build
cd $PWD/dist

echo $(pwd)
aws --profile scbd s3 sync . s3://scbd-static-sites/kronos-web.cbddev.xyz   --exclude ".*" --cache-control "60" --acl "public-read"
cd ..
cat $PWD
