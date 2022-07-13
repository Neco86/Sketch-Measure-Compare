import html from './index.html';

const func = () => {
    const script = document.createElement('script');
    script.src = window.top.sketchMeasureCompare.js;
    document.body.appendChild(script);

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = window.top.sketchMeasureCompare.css;
    document.head.appendChild(css);
};

const funcUrl = URL.createObjectURL(
    new Blob([`(${func})();`], { type: 'text/javascript' })
);

export default URL.createObjectURL(new Blob([html.replace('$FUNC', funcUrl)], { type: 'text/html' }));
