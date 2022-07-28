interface Config {
    zIndex?: number;
}

interface SketchMeasureCompare {
    init: (config?: Config) => void;
}

declare module 'sketch-measure-compare' {
    const sketchMeasureCompare: SketchMeasureCompare;
    export = sketchMeasureCompare;
}
