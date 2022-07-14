import tpl from './tpl.html';

const func = () => {
    const loadImg = (info) => {
        const img = document.createElement('img');
        img.src = info.url;
        return new Promise((resolve) => {
            img.onload = () => resolve({img, name: info.name});
            img.onerror = () => resolve(null);
        });
    };
    const imgList = window.top.sketchMeasureCompare.tplImgList || [];
    if (imgList.length) {
        Promise.all(imgList.map(loadImg)).then((imgs) => {
            const data = {
                resolution: 1,
                unit: 'px',
                colorFormat: 'color-hex',
                artboards: imgs.filter(Boolean).map(({img,name}) => ({
                    notes: [],
                    layers: [],
                    name: name,
                    pageName: '',
                    width: img.width,
                    height: img.height,
                    imagePath: img.src,
                    imageIconPath: img.src,
                })),
            };
            meaxure.render(data);
        });
    }
};

const funcUrl = URL.createObjectURL(
    new Blob([`(${func})();`], { type: 'text/javascript' })
);

export default URL.createObjectURL(
    new Blob([tpl.replace('$FUNC', funcUrl)], { type: 'text/html' })
);
