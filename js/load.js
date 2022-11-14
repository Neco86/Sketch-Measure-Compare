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

    const applyConfig = () => {
        if (!window.top.sketchMeasureCompare?.config) {
            return;
        }
        try {
            const iframe = Array
                .from(document.querySelectorAll('iframe'))
                .filter(t => t.src === window.top.sketchMeasureCompare.html)[0]
                .contentDocument
                .querySelectorAll('iframe')[0]
                .contentDocument
                .querySelectorAll('iframe')[0];
            if (iframe.contentDocument) {
                const src = iframe.src;
                iframe.contentWindow.onbeforeunload = () => {};
                iframe.src = '';
                iframe.src = src;
            }
        } catch (error) {
            // do nothing
        }
    }

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
                                window.top.sketchMeasureCompare.config[key] =
                                    config[key];
                            });
                            applyConfig();
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
