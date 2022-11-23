const script = document.createElement('script');
script.src = chrome.runtime.getURL('js/load.js');
document.head.appendChild(script);

const sendMsg2Load = ({ msg, payload }) => {
    window.postMessage({
        to: 'load',
        msg,
        payload,
    });
};

const sendMsg2Popup = ({ msg, payload }) => {
    chrome.runtime.sendMessage({ msg, payload }, () => chrome.runtime.lastError);
};

chrome.runtime.onMessage.addListener((req) => {
    sendMsg2Load(req);
});

window.addEventListener('message', (e) => {
    const { msg, to, payload } = e.data || {};
    if (to === 'content') {
        sendMsg2Popup({ msg, payload });
    }
});
