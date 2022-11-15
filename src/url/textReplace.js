export default () => {
    init(document);

    function addRightClickEvent(doc) {
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
                    ].includes(t.nodeName) &&
                    Array.from(t.childNodes).filter(
                        (t) =>
                            t.nodeName === '#text' || t.nodeName === '#comment'
                    ).length === t.childNodes.length
            )
            .forEach((textNode) => {
                if (textNode.isInitSketchMeasureTextPlaceNode) {
                    return;
                }
                textNode.isInitSketchMeasureTextPlaceNode = true;
                textNode.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                });
                textNode.addEventListener('mousedown', (e) => {
                    const content = window?.parent?.['content'];
                    if (
                        e.button === 2 &&
                        content &&
                        window.top.sketchMeasureCompare.config.enableTextReplace
                    ) {
                        e.preventDefault();
                        e.target.innerHTML = content.innerHTML.replace(
                            /\s/g,
                            ''
                        );
                    }
                });
                textNode.addEventListener('mouseenter', (e) => {
                    e.target.contentEditable = !!window.top.sketchMeasureCompare.config.enableTextReplace;
                });
                textNode.addEventListener('mouseleave', (e) => {
                    if (!e.target.isFocus) {
                        e.target.contentEditable = false;
                    }
                });
                textNode.addEventListener('focus', (e) => {
                    e.target.isFocus = true;
                });
                textNode.addEventListener('blur', (e) => {
                    e.target.isFocus = false;
                    e.target.contentEditable = false;
                });
                textNode.onclick = (e) => {
                    if (window.top.sketchMeasureCompare.config.enableTextReplace) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                };
            });
    }

    function init(doc) {
        if (doc.isInitSketchMeasureTextPlaceDoc) {
            return;
        }
        doc.isInitSketchMeasureTextPlaceDoc = true;
        const handleDocumentChange = () => {
            addRightClickEvent(doc);
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
