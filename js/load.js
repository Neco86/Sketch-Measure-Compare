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
        }
    });
})();
