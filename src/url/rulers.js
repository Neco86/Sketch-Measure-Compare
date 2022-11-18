export default () => {
    init(document);

    function addMouseHoverEvent(doc) {
        Array.from(doc.querySelectorAll('*'))
            .filter(
                (t) =>
                    ![
                        'SCRIPT',
                        'STYLE',
                        'TITLE',
                        'HTML',
                        'HEAD',
                        'META',
                        'BODY',
                        'NOSCRIPT',
                    ].includes(t.nodeName)
            )
            .forEach((node) => {
                if (node.isInitSketchMeasureRulersNode) {
                    return;
                }
                node.isInitSketchMeasureRulersNode = true;
                node.addEventListener('mouseenter', () => {
                    window.top.sketchMeasureCompare.hover = node;
                    if (window.top.sketchMeasureCompare.config.enableDomRulers) {
                        window.parent.postMessage(
                            {
                                msg: 'updateRulers',
                                payload: node.getBoundingClientRect(),
                            },
                            '*'
                        );
                    }
                });
                node.addEventListener('mouseleave', () => {
                    window.top.sketchMeasureCompare.hover = null;
                    if (window.top.sketchMeasureCompare.config.enableDomRulers) {
                        window.parent.postMessage(
                            {
                                msg: 'updateRulers',
                                payload: { width: 0, height: 0, top: 0, left: 0 },
                            },
                            '*'
                        );
                    }
                });
            });
    }

    function init(doc) {
        if (doc.isInitSketchMeasureRulersDoc) {
            return;
        }
        doc.isInitSketchMeasureRulersDoc = true;
        const handleDocumentChange = () => {
            addMouseHoverEvent(doc);
            const iframeList = document.querySelectorAll('iframe');
            iframeList.forEach((iframe) => {
                if (iframe.contentDocument) {
                    init(iframe.contentDocument);
                }
            });
        };
        handleDocumentChange();
        const screenObserver = new MutationObserver(handleDocumentChange);
        screenObserver.observe(doc.documentElement, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    }
};
