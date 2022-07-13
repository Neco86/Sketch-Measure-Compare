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

const html = `<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sketch Measure Compare</title>
    </head>
    <body>
        <div id="placeholder">
            <div>Please Choose UI Folder!</div>
            <br/>
            <input
                type="file"
                webkitdirectory
                id="uploader"
            />
        </div>
        <div id="clear">CLEAR UI</div>
        <iframe id="iframe"></iframe>
        <script src="${funcUrl}"></script>
    </body>
</html>
`
    .replace(/\n/g, '')
    .replace(/\s+/g, ' ');

export default URL.createObjectURL(new Blob([html], { type: 'text/html' }));
