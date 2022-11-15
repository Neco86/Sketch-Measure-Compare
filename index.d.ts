interface Config {
    zIndex?: number;
    enableDomRulers?: Boolean;
    enableTextReplace?: Boolean;
    offsetY?: number;
    width?: number;
    enableBlockClose?: boolean;
}

interface SketchMeasureCompare {
    init: (config?: Config) => void;
}

declare module 'sketch-measure-compare' {
    const sketchMeasureCompare: SketchMeasureCompare;
    export = sketchMeasureCompare;
}