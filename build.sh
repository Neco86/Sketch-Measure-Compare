rm -rf ./dist
mkdir dist
cp ./src/index.html ./dist/index.html
./node_modules/.bin/uglifycss ./src/index.css --expand-vars --output ./dist/index.min.css
./node_modules/.bin/uglifyjs ./src/index.js  -cm -o ./dist/index.min.js
./node_modules/.bin/uglifyjs ./src/inject.js -cm -o ./dist/inject.min.js
./node_modules/.bin/uglifyjs ./src/rulers.js  -cm -o ./dist/rulers.min.js
./node_modules/.bin/uglifyjs ./src/sketchMeasure.js -cm -o ./dist/sketchMeasure.min.js
