export default () => {
    const uploader = document.getElementById('uploader');
    const iframe = document.getElementById('iframe');
    const placeholder = document.getElementById('placeholder');
    let fileList = [];
    uploader.onchange = ({ target: { files } }) => {
        if (!files.length) {
            return;
        }
        fileList = Array.from(files);
        const isIncludeIndex = !!fileList.find((t) => t.name === 'index.html');
        const imgList = fileList.filter((t) => /image/.test(t.type));
        if (!isIncludeIndex && !imgList.length) {
            uploader.value = '';
            alert('WRONG FOLDER!');
            return;
        }
        if (!isIncludeIndex && imgList.length) {
            window.top.sketchMeasureCompare.tplImgList = imgList.map(img => ({
                name: img.name.replace(/\.[^\.]+$/g,''),
                url: `${URL.createObjectURL(img)}#`,
            }));
        }
        const pathPrefix = fileList.find((t) => t.name === 'index.html')?.webkitRelativePath?.replace?.('index.html', '') ?? '';
        const pathRegExp = new RegExp(`^${pathPrefix}`);
        fileList = fileList.map((file) => ({
            name: file.name,
            path: file.webkitRelativePath.replace(pathRegExp, ''),
            url: URL.createObjectURL(file),
        }));
        const index = fileList.find((t) => t.name === 'index.html') || {url: window.top.sketchMeasureCompare.tpl};
        if (index) {
            fetch(index.url)
                .then((res) => res.text())
                .then((res) => {
                    fileList.forEach((file) => {
                        const path = file.path
                            .split('/')
                            .map(encodeURIComponent)
                            .join('/');
                        res = res.replace(path, `${file.url}#`);
                    });
                    res = res.replace(/\.\/blob/g, 'blob');
                    return res;
                })
                .then((res) => {
                    res = res
                        .replace(
                            '</head>',
                            `<script src="${window.top.sketchMeasureCompare.sketchMeasure}"></script></head>`
                        )
                        .replace(
                            'meaxure.render(data)',
                            `
                            meaxure.render({
                                ...data,
                                artboards: (data.artboards || []).map((t) => {
                                    const width = window.top.sketchMeasureCompare.config.width || t.width;
                                    const scale = width / t.width;
                                    return {
                                        ...t,
                                        width,
                                        height: t.height * scale,
                                        layers: (t.layers || []).map((l) => ({
                                            ...l,
                                            rect: {
                                                x: l.rect.x * scale,
                                                y: l.rect.y * scale,
                                                width: l.rect.width * scale,
                                                height: l.rect.height * scale,
                                            },
                                        })),
                                    };
                                }),
                            });
                            `
                        );
                    return res;
                })
                .then((res) => {
                    const blob = new Blob([res], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    iframe.src = url;
                    placeholder.style.display = 'none';
                    iframe.style.display = 'block';
                });
        }
    };
    const handleClear = () => {
        window.top.sketchMeasureCompare.config.enableBlockClose = false;
        URL.revokeObjectURL(iframe.src);
        fileList.forEach((file) => {
            URL.revokeObjectURL(file.url);
        });
        (window.top.sketchMeasureCompare.tplImgList || []).forEach(t => URL.revokeObjectURL(t.url));
        delete window.top.sketchMeasureCompare.tplImgList;
        fileList = [];
        iframe.src = '';
        uploader.value = '';
        placeholder.style.display = 'block';
        iframe.style.display = 'none';
    };
    document.addEventListener('beforeunload', handleClear);
    window.addEventListener('message', ({ data }) => {
        if (!data || !data.msg) {
            return;
        }
        const { msg } = data;
        if (msg === 'CLEAR UI') {
            handleClear();
        }
    });
    const configHandler = {
        get(target, property) {
            return target[property];
        },
        set(target, property, value) {
            target[property] = value;
            if (property === 'width') {
                const enableBlockClose = window.top.sketchMeasureCompare.config.enableBlockClose;
                window.top.sketchMeasureCompare.config.enableBlockClose = false;
                const src = iframe.src;
                iframe.src = '';
                iframe.src = src;
                window.top.sketchMeasureCompare.config.enableBlockClose = enableBlockClose;
            }
        },
    };
    window.top.sketchMeasureCompare.config = new Proxy(
        window.top.sketchMeasureCompare.config,
        configHandler
    );
};
