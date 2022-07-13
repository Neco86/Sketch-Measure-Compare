import rulers from './url/rulers';
import sketchMeasure from './url/sketchMeasure';
import js from './url/js';
import css from './url/css';
import html from './url/html';
import init from './init';

const sketchMeasureCompare = {};

if (!window.top.sketchMeasureCompare) {
    window.top.sketchMeasureCompare = sketchMeasureCompare;

    sketchMeasureCompare.rulers = rulers;
    sketchMeasureCompare.sketchMeasure = sketchMeasure;
    sketchMeasureCompare.js = js;
    sketchMeasureCompare.css = css;
    sketchMeasureCompare.html = html;

    sketchMeasureCompare.init = init;

    if (process.env.NODE_ENV === 'development') {
        console.log(sketchMeasureCompare);
        sketchMeasureCompare.init({ zIndex: 10000 });
    }
}
