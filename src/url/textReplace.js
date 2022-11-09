export default () => {
    init(document);

    function addRightClickEvent(doc) {
        Array.from(doc.querySelectorAll('*')).filter(
            (t) =>
                !['SCRIPT', 'STYLE', 'TITLE'].includes(t.nodeName) &&
                t.childNodes.length === 1 &&
                t.childNodes[0].nodeName === '#text'
        ).forEach(textNode => {
            if (textNode.isInitSketchMeasureTextPlaceNode) {
                return;
            }
            textNode.isInitSketchMeasureTextPlaceNode = true;
            textNode.addEventListener('contextmenu', e => {
                e.preventDefault();
            });
            textNode.addEventListener('mousedown', e => {
                if(e.button === 2){
                    const content = window.parent['content'];
                    if (content) {
                        e.target.innerHTML = content.innerHTML.replace(/\s/g, '');
                    }
                }
            });
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
