(() => {
    let loadPromise = null;

    const sendMsgToContent = ({ msg, payload }) => {
        if (typeof payload === 'object') {
            payload = JSON.stringify(payload);
        }
        if (typeof payload === 'undefined') {
            payload = '';
        }
        window.postMessage({ to: 'content', msg, payload });
    };

    window.addEventListener('message', (e) => {
        const { msg, to, payload } = e.data || {};
        if (to === 'load') {
            if (msg === 'getConfig') {
                sendMsgToContent({
                    msg: 'getConfig',
                    payload: window.top.sketchMeasureCompare?.config,
                });
            }
            if (msg === 'config') {
                const config = JSON.parse(payload);
                if (loadPromise) {
                    loadPromise.then(() => {
                        console.log(
                            '%c\ud83c\udf89 Sketch Measure Compare Config Success!',
                            'color: #ffffff; background-color: #87d068; padding:4px 10px;'
                        );
                        if (window.top.sketchMeasureCompare?.config) {
                            Object.keys(config).forEach((key) => {
                                if (window.top.sketchMeasureCompare.config[key] !== config[key]) {
                                    window.top.sketchMeasureCompare.config[key] = config[key];
                                }
                            });
                        } else {
                            window.top.sketchMeasureCompare.init(config);
                        }
                    });
                }
            }
            if (msg === 'load' && !loadPromise) {
                loadPromise = new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = payload;
                    document.head.appendChild(script);
                    script.onload = resolve;
                });
            }
            if (msg === 'getScreenInfo') {
                try {
                    const screen = Array
                        .from(document.querySelectorAll('iframe'))
                        .filter(t => t.src === window.top.sketchMeasureCompare?.html)[0]
                        .contentDocument
                        .querySelectorAll('iframe')[0]
                        .contentDocument
                        .getElementById('screen')
                        .getBoundingClientRect();
                    if (screen
                            && screen.x + screen.width > 0
                            && screen.x + screen.width + 10 < window.innerWidth
                    ) {
                        const offsetY = window.top.sketchMeasureCompare.config.offsetY;
                        const screenOffset = offsetY > 0 ? offsetY : 0;
                        let minY = screen.y + screenOffset;
                        if (minY < 0) {
                            minY = 0;
                        }
                        let maxY = screen.y + screen.height;
                        if (maxY > window.innerHeight) {
                            maxY = window.innerHeight;
                        }
                        const height = maxY - minY;

                        let minX = screen.x;
                        if (minX < 0) {
                            minX = 0;
                        }
                        let maxX = screen.x + screen.width * 2 + 10;
                        if (maxX > window.innerWidth) {
                            maxX = window.innerWidth;
                        }
                        const uiWidth = screen.x + screen.width - minX;
                        const webWidth = maxX - (screen.x + screen.width + 10);
                        const width = Math.min(uiWidth, webWidth);

                        const res = {
                            win: {
                                width: window.innerWidth,
                                height: window.innerHeight
                            },
                            ui: {
                                x: screen.x + screen.width - width,
                                y: minY,
                                width,
                                height
                            },
                            web: {
                                x: screen.x + screen.width + 10,
                                y: minY,
                                width,
                                height
                            },
                            title: document.title
                        }
                        sendMsgToContent({
                            msg: 'getScreenInfo',
                            payload: res
                        });
                    }
                } catch {
                }
            }
        }
    });

    sendMsgToContent({
        msg: 'getConfig',
        payload: window.top.sketchMeasureCompare?.config,
    });
})();
