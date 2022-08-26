import rulers from './url/rulers';
import sketchMeasure from './url/sketchMeasure';
import index from './url/index';
import css from './url/index.css';
import html from './url/index.html';
import tplIndex from './url/tpl';
import tpl from './url/tpl.html';
import init from './init';

class SketchMeasureCompare {
    constructor() {
        this.init = init;
    }
}
SketchMeasureCompare.prototype.rulers = rulers;
SketchMeasureCompare.prototype.sketchMeasure = sketchMeasure;
SketchMeasureCompare.prototype.index = index;
SketchMeasureCompare.prototype.css = css;
SketchMeasureCompare.prototype.html = html;
SketchMeasureCompare.prototype.tplIndex = tplIndex;
SketchMeasureCompare.prototype.tpl = tpl;

if (!window.top.sketchMeasureCompare) {
    const sketchMeasureCompare = new SketchMeasureCompare();
    window.top.sketchMeasureCompare = sketchMeasureCompare;

    if (process.env.NODE_ENV === 'development') {
        console.log(sketchMeasureCompare);
        sketchMeasureCompare.init({ zIndex: 10000, enableDomRulers: true });
    }
}

export default window.top.sketchMeasureCompare;