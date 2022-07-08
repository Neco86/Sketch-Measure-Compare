rm -rf ./dist
mkdir dist
cp ./src/index.html ./dist/index.html
yarn uglifycss ./src/index.css --expand-vars --output ./dist/index.min.css
yarn uglifyjs ./src/index.js  -cm -o ./dist/index.min.js
yarn uglifyjs ./src/inject.js -cm -o ./dist/inject.min.js
yarn uglifyjs ./src/rulers.js  -cm -o ./dist/rulers.min.js
yarn uglifyjs ./src/sketchMeasure.js -cm -o ./dist/sketchMeasure.min.js
