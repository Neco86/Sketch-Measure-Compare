(() => {
    init(document);

    function addMouseHoverEvent(doc) {
        doc.querySelectorAll('*').forEach((node) => {
            if (node.isInitSketchMeasureNode) {
                return;
            }
            node.isInitSketchMeasureNode = true;
            node.addEventListener('mouseenter', () => {
                window.parent.postMessage(
                    {
                        msg: 'updateRulers',
                        payload: node.getBoundingClientRect(),
                    },
                    '*'
                );
            });
            node.addEventListener('mouseleave', () => {
                window.parent.postMessage(
                    {
                        msg: 'updateRulers',
                        payload: { width: 0, height: 0, top: 0, left: 0 },
                    },
                    '*'
                );
            });
        });
    }

    function init(doc) {
        if (doc.isInitSketchMeasureDoc) {
            return;
        }
        doc.isInitSketchMeasureDoc = true;
        const handleDocumentChange = () => {
            addMouseHoverEvent(doc);
            const iframeList = document.querySelectorAll('iframe');
            iframeList.forEach((iframe) => {
                init(iframe.contentWindow.document);
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
})();
