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
                });
            }
        }
    );
};

const setConfig = (config) => {
    zIndex.value = config.zIndex;
    offsetY.value = config.offsetY;
    enableDomRulers.checked = config.enableDomRulers;
    enableTextReplace.checked = config.enableTextReplace;
    chrome.storage.local.set({ sketchMeasureCompareConfig: config });
};

const DEFAULT_CONFIG = {
    zIndex: 10000,
    offsetY: 0,
    enableDomRulers: false,
    enableTextReplace: false,
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
});

fetch(chrome.runtime.getURL('package.json')).then(res => res.json()).then(res => {
    version.innerHTML = `v${res.version}`;
})

apply.onclick = () => {
    const config = {
        zIndex: +zIndex.value || 10000,
        offsetY: +offsetY.value || 0,
        enableDomRulers: enableDomRulers.checked,
        enableTextReplace: enableTextReplace.checked,
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
