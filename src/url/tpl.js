export default () => {
    const loadImg = (info) => {
        return new Promise((resolve) => {
            const img = document.createElement('img');
            img.onload = () => resolve({img, name: info.name});
            img.onerror = () => resolve(null);
            img.src = info.url;
        });
    };
    const imgList = window.top.sketchMeasureCompare.tplImgList || [];
    if (imgList.length) {
        Promise.all(imgList.map(loadImg)).then((imgs) => {
            const data = {
                resolution: 1,
                unit: 'px',
                colorFormat: 'color-hex',
                artboards: imgs.filter(Boolean).map(({img,name}) => {
                    const width = window.top.sketchMeasureCompare.config.width || img.width;
                    const scale = width / img.width;
                    return {
                        notes: [],
                        layers: [],
                        name: name,
                        pageName: '',
                        width,
                        height: img.height * scale,
                        imagePath: img.src,
                        imageIconPath: img.src,
                    }
                }),
            };
            meaxure.render(data);
        });
    }
};