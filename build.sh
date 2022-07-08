rm -rf ./dist
mkdir dist
cp index.html ./dist/index.html
yarn uglifycss ./index.css --expand-vars --output ./dist/index.min.css
yarn uglifyjs index.js  -cm -o ./dist/index.min.js
yarn uglifyjs inject.js -cm -o ./dist/inject.min.js
yarn uglifyjs rulers.js  -cm -o ./dist/rulers.min.js
yarn uglifyjs sketchMeasure.js -cm -o ./dist/sketchMeasure.min.js
grep -rl '.css' ./dist  | xargs sed -i "" "s/.css/.min.css/g"
grep -rl '.js' ./dist  | xargs sed -i "" "s/.js/.min.js/g"
