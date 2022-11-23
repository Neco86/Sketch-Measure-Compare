const sendMsg2Content = ({ msg, payload }) => {
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true,
        },
        (tabs) => {
            if (/^http/.test(tabs[0]?.url)) {
                if (typeof payload === 'object') {
                    payload = JSON.stringify(payload);
                }
                if (typeof payload === 'undefined') {
                    payload = '';
                }
                chrome.tabs.sendMessage(tabs[0].id, {
                    msg,
                    payload,
                }, () => chrome.runtime.lastError);
            }
        }
    );
};

const DEFAULT_CONFIG = {
    zIndex: 10000,
    width: 0,
    offsetY: 0,
    enableDomRulers: false,
    enableTextReplace: false,
};

const setConfig = (config) => {
    config.zIndex = +config.zIndex || DEFAULT_CONFIG.zIndex;
    config.width = +config.width || DEFAULT_CONFIG.width;
    config.offsetY = +config.offsetY || DEFAULT_CONFIG.offsetY;
    config.enableDomRulers = !!config.enableDomRulers;
    config.enableTextReplace = !!config.enableTextReplace;

    zIndex.value = config.zIndex;
    width.value = config.width;
    offsetY.value = config.offsetY;
    enableDomRulers.checked = config.enableDomRulers;
    enableTextReplace.checked = config.enableTextReplace;
    chrome.storage.local.set({ sketchMeasureCompareConfig: config });
};

const getConfig = (config) => {
    if (config) {
        return Promise.resolve(JSON.parse(config));
    }
    return new Promise((resolve) => {
        chrome.storage.local.get(['sketchMeasureCompareConfig'], (res) => {
            resolve(res.sketchMeasureCompareConfig || DEFAULT_CONFIG);
        });
    });
};

sendMsg2Content({
    msg: 'getConfig',
});
sendMsg2Content({
    msg: 'getScreenInfo',
});

let screenInfo = null;

chrome.runtime.onMessage.addListener((req) => {
    const { msg, payload } = req || {};
    if (msg === 'getConfig') {
        getConfig(payload).then((config) => {
            setConfig(config);
            setTimeout(() => {
                const style = document.createElement('style');
                style.innerHTML = `
                    .slider {
                        transition: 0.1s;
                    }
                    .slider:before {
                        transition: 0.1s;
                    }
                `;
                document.head.appendChild(style);
            }, 100);
        });
    }
    if (msg === 'getScreenInfo') {
        diff.style.display = 'initial';
        screenInfo = JSON.parse(payload);
    }
});


fetch(chrome.runtime.getURL('package.json')).then(res => res.json()).then(res => {
    version.innerHTML = `v${res.version}`;
})

apply.onclick = () => {
    const config = {
        zIndex: +zIndex.value || DEFAULT_CONFIG.zIndex,
        width: +width.value || DEFAULT_CONFIG.width,
        offsetY: +offsetY.value || DEFAULT_CONFIG.offsetY,
        enableDomRulers: !!enableDomRulers.checked,
        enableTextReplace: !!enableTextReplace.checked,
    };
    setConfig(config);
    sendMsg2Content({
        msg: 'load',
        payload: chrome.runtime.getURL('index.min.js'),
    });
    sendMsg2Content({
        msg: 'config',
        payload: config,
    });
    window.close();
};

diff.onclick = () => {
    if (screenInfo && !diff.disabled) {
        diff.disabled = true;
        chrome.tabs.captureVisibleTab({format: 'png'}, res => {
            const img = document.createElement('img');
            img.src = res;
            img.onload = () => {
                const {win, ui, web, title} = screenInfo;
                const scale = img.width / win.width;
                Object.keys(win).forEach(key => {
                    win[key] = win[key] * scale;
                });
                Object.keys(ui).forEach(key => {
                    ui[key] = ui[key] * scale;
                });
                Object.keys(web).forEach(key => {
                    web[key] = web[key] * scale;
                });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d', {willReadFrequently: true});
                canvas.width = ui.width * 3;
                canvas.height = ui.height;
                ctx.drawImage(
                    img,
                    ui.x,
                    ui.y,
                    ui.width,
                    ui.height,
                    0,
                    0,
                    ui.width,
                    ui.height
                );
                ctx.drawImage(
                    img,
                    web.x,
                    web.y,
                    web.width,
                    web.height,
                    ui.width,
                    0,
                    web.width,
                    web.height
                );
                const uiData = ctx.getImageData(
                    0,
                    0,
                    ui.width,
                    ui.height
                );
                const webData = ctx.getImageData(
                    ui.width,
                    0,
                    ui.width,
                    ui.height
                );
                const diffData = new ImageData(ui.width, ui.height);
                for (let i = 0; i < diffData.data.length; i += 4) {
                    const r = Math.abs(uiData.data[i] - webData.data[i]);
                    const g = Math.abs(uiData.data[i + 1] - webData.data[i + 1]);
                    const b = Math.abs(uiData.data[i + 2] - webData.data[i + 2]);
                    const MAX = 256;
                    const COLOR_MAX = 128;
                    const isDiff = r + g + b > MAX || r > COLOR_MAX || g > COLOR_MAX || b > COLOR_MAX;
                    diffData.data[i] = isDiff ? 255 : uiData.data[i];
                    diffData.data[i + 1] = isDiff ? 0 : uiData.data[i+1];
                    diffData.data[i + 2] = isDiff ? 255 : uiData.data[i+2];
                    diffData.data[i + 3] = 255;
                }
                ctx.putImageData(diffData, ui.width * 2, 0);
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, 50, 30);
                ctx.fillRect(ui.width, 0, 70, 30);
                ctx.fillRect(ui.width * 2, 0, 70, 30);
                ctx.fillStyle = '#f00';
                ctx.font = '20px Arial';
                ctx.fillText('UI', 10, 22);
                ctx.fillText('WEB', 10 + ui.width, 22);
                ctx.fillText('DIFF', 10 + ui.width * 2, 22);
                const a = document.createElement('a');
                a.href = canvas.toDataURL();
                a.download = `${title || 'page'}-diff.png`;
                a.click();
            }
        })
    }
}
