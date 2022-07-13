import rulers from './url/rulers';
import sketchMeasure from './url/sketchMeasure';
import js from './url/js';
import css from './url/css';
import html from './url/html';
import init from './init';

class SketchMeasureCompare {
    constructor() {
        this.init = init;
    }
}
SketchMeasureCompare.prototype.rulers = rulers;
SketchMeasureCompare.prototype.sketchMeasure = sketchMeasure;
SketchMeasureCompare.prototype.js = js;
SketchMeasureCompare.prototype.css = css;
SketchMeasureCompare.prototype.html = html;

if (!window.top.sketchMeasureCompare) {
    const sketchMeasureCompare = new SketchMeasureCompare();
    window.top.sketchMeasureCompare = sketchMeasureCompare;

    if (process.env.NODE_ENV === 'development') {
        console.log(sketchMeasureCompare);
        sketchMeasureCompare.init({ zIndex: 10000 });
    }
}
