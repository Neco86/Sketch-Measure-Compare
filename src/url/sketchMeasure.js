export default () => {
    let isInit,
        wrapper,
        screen,
        rulers,
        flowMode,
        header,
        iframe,
        isInjectRules,
        isInjectTextReplace,
        newRulers,
        selectedRulers,
        ld,
        rd,
        bd,
        td,
        iframeSrc,
        newScreen,
        enableBlockClose,
        inspectorCenterTpl;

    const isReady = () => {
        wrapper = document.getElementsByClassName('screen-viewer-inner')?.[0];
        screen = document.getElementById('screen');
        rulers = document.getElementById('rulers');
        flowMode = document.getElementById('flow-mode');
        header = document.getElementsByClassName('header-center')?.[0];
        return wrapper && screen && rulers && flowMode && header;
    };

    const setStyle = (ele, obj) => {
        Object.keys(obj).forEach((key) => {
            ele.style[key] = obj[key];
        });
    };

    const fixStyle = () => {
        const style = document.createElement('style');
        style.innerHTML = `
        .layer {
            z-index: 1;
        }
        .color-bg {
            position: relative;
            background-color: #fff;
            background-image: linear-gradient(45deg, #dddadc 25%, transparent 25%, transparent 75%, #dddadc 75%, #dddadc), linear-gradient(45deg, #dddadc 25%, transparent 25%, transparent 75%, #dddadc 75%, #dddadc);
            background-size: 12px 12px;
            background-position: 0 0, 6px 6px;
            border-radius: 2px 0 0 2px;
            overflow: hidden;
            width: 24px;
            height: 24px;
        }
        .color-bg span {
            display: block;
            width: 24px;
            height: 24px;
        }
        `;
        document.head.appendChild(style);
    };

    const initClear = () => {
        const clearWrapper = document.createElement('div');
        const clear = document.createElement('div');
        clear.innerHTML = 'CLEAR UI';
        setStyle(clearWrapper, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 25px 0 10px',
            whiteSpace: 'nowrap',
        });
        setStyle(clear, {
            padding: '5px',
            border: '1px solid',
            cursor: 'pointer',
        });
        clear.onclick = () => {
            window.parent.postMessage(
                {
                    msg: 'CLEAR UI',
                },
                '*'
            );
        };
        clearWrapper.appendChild(clear);
        header.appendChild(clearWrapper);
    };

    const setOffsetY = () => {
        const offsetY = window.top.sketchMeasureCompare.config.offsetY;
        setStyle(iframe, {
            top: `${offsetY}px`,
            height: `calc(100% - ${offsetY}px)`,
        });
    };

    const closeBlock = () => {
        enableBlockClose =
            window.top.sketchMeasureCompare.config.enableBlockClose;
        window.top.sketchMeasureCompare.config.enableBlockClose = false;
    };

    const resetBlock = () => {
        window.top.sketchMeasureCompare.config.enableBlockClose =
            enableBlockClose;
    };

    const initIframe = () => {
        iframe = document.createElement('iframe');
        setOffsetY();
        setStyle(iframe, {
            border: 'none',
            position: 'absolute',
        });
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.src = window.top.location.href;
        iframe.onload = () => {
            setOffsetY();
            if (iframe.contentDocument) {
                if (window.top.sketchMeasureCompare.config.enableBlockClose) {
                    iframe.contentWindow.onbeforeunload = () => false;
                }
                isInjectRules =
                    window.top.sketchMeasureCompare.config.enableDomRulers;
                if (isInjectRules) {
                    const script = document.createElement('script');
                    script.src = window.top.sketchMeasureCompare.rulers;
                    iframe.contentDocument.head.appendChild(script);
                }
                isInjectTextReplace =
                    window.top.sketchMeasureCompare.config.enableTextReplace;
                if (isInjectTextReplace) {
                    const script = document.createElement('script');
                    script.src = window.top.sketchMeasureCompare.textReplace;
                    iframe.contentDocument.head.appendChild(script);
                }
            }
        };
    };

    const createRulers = (color) => {
        const newRulers = rulers.cloneNode(true);
        newRulers.appendChild(newRulers.childNodes[0].cloneNode(true));
        newRulers.appendChild(newRulers.childNodes[1].cloneNode(true));
        // left
        setStyle(newRulers.childNodes[0], {
            border: 'none',
            borderLeft: `1px dashed ${color}`,
            width: '0px',
        });
        // top
        setStyle(newRulers.childNodes[1], {
            border: 'none',
            borderTop: `1px dashed ${color}`,
            height: '0px',
        });
        // right
        setStyle(newRulers.childNodes[2], {
            border: 'none',
            borderRight: `1px dashed ${color}`,
            width: '0px',
        });
        // bottom
        setStyle(newRulers.childNodes[3], {
            border: 'none',
            borderBottom: `1px dashed ${color}`,
            height: '0px',
        });
        return newRulers;
    };

    const initDistance = () => {
        ld = document.getElementById('ld').cloneNode(true);
        td = document.getElementById('td').cloneNode(true);
        rd = document.getElementById('rd').cloneNode(true);
        bd = document.getElementById('bd').cloneNode(true);
    };

    const initIframeSrc = () => {
        iframeSrc = document.createElement('input');
        setStyle(iframeSrc, {
            border: 'none',
            outline: 'none',
            height: '20px',
        });
        iframeSrc.placeholder = 'url';
        iframeSrc.value = iframe.src;
        iframeSrc.oninput = (e) => {
            closeBlock();
            iframe.src = e.target.value;
            resetBlock();
        };
        iframeSrc.onkeyup = (e) => {
            if (e.key === 'Enter') {
                closeBlock();
                iframe.src = '';
                iframe.src = e.target.value;
                resetBlock();
            }
        };
    };

    const intNewScreen = () => {
        newScreen = screen.cloneNode(false);
        setStyle(newScreen, {
            backgroundImage: '',
        });
        newScreen.appendChild(iframe);
        newScreen.appendChild(newRulers);
        newScreen.appendChild(selectedRulers);
        newScreen.appendChild(ld);
        newScreen.appendChild(td);
        newScreen.appendChild(rd);
        newScreen.appendChild(bd);
        wrapper.appendChild(iframeSrc);
        wrapper.appendChild(newScreen);
    };

    const handleScreenChange = () => {
        const { width, height, marginTop } = screen.style;

        if (width !== newScreen.style.width) {
            closeBlock();
            iframe.src = '';
            iframe.src = iframeSrc.value;
            resetBlock();
        }

        setStyle(newScreen, {
            width,
            height,
            marginTop,
            marginLeft: flowMode.checked
                ? 0
                : `${parseFloat(width) / 2 + 10}px`,
            opacity: flowMode.checked ? 0.5 : 1,
        });
        newScreen.className = screen.className;

        setStyle(iframeSrc, {
            width,
            marginTop: `-${parseFloat(height) / 2 + 20 + 10}px`,
            marginLeft: flowMode.checked
                ? 0
                : `${parseFloat(width) / 2 + 10}px`,
        });
        iframeSrc.className = screen.className;

        setStyle(newRulers, rulers.style);
        setStyle(newRulers.childNodes[0], {
            left: rulers.childNodes[0].style.left,
        });
        setStyle(newRulers.childNodes[1], {
            top: rulers.childNodes[1].style.top,
        });
        setStyle(newRulers.childNodes[2], {
            left: `${
                parseFloat(rulers.childNodes[0].style.left) +
                parseFloat(rulers.childNodes[0].style.width)
            }px`,
        });
        setStyle(newRulers.childNodes[3], {
            top: `${
                parseFloat(rulers.childNodes[1].style.top) +
                parseFloat(rulers.childNodes[1].style.height)
            }px`,
        });

        const selectedInfo =
            document.getElementsByClassName('selected')?.[0]?.style;
        if (selectedInfo) {
            setStyle(selectedRulers, { display: '' });
            setStyle(selectedRulers.childNodes[0], {
                left: selectedInfo.left,
            });
            setStyle(selectedRulers.childNodes[1], {
                top: selectedInfo.top,
            });
            setStyle(selectedRulers.childNodes[2], {
                left: `${
                    parseFloat(selectedInfo.left) +
                    parseFloat(selectedInfo.width)
                }px`,
            });
            setStyle(selectedRulers.childNodes[3], {
                top: `${
                    parseFloat(selectedInfo.top) +
                    parseFloat(selectedInfo.height)
                }px`,
            });
        }

        if (flowMode.checked) {
            setStyle(rulers, { display: 'none' });
            setStyle(newRulers, { display: 'none' });
            setStyle(selectedRulers, { display: 'none' });
            setStyle(ld, { display: 'none' });
            setStyle(td, { display: 'none' });
            setStyle(rd, { display: 'none' });
            setStyle(bd, { display: 'none' });
            inspector.className = inspector.className.replace('active', '');
        }
    };

    const watchConfigChange = () => {
        const configHandler = {
            get(target, property) {
                return target[property];
            },
            set(target, property, value) {
                target[property] = value;
                if (property === 'offsetY') {
                    setOffsetY();
                }
                if (property === 'enableBlockClose') {
                    if (iframe.contentDocument) {
                        iframe.contentWindow.onbeforeunload = () => {
                            return value ? false : void 0;
                        };
                    }
                }
                if (property === 'enableDomRulers' && !isInjectRules) {
                    closeBlock();
                    const src = iframe.src;
                    iframe.src = '';
                    iframe.src = src;
                    resetBlock();
                }
                if (property === 'enableTextReplace' && !isInjectTextReplace) {
                    closeBlock();
                    const src = iframe.src;
                    iframe.src = '';
                    iframe.src = src;
                    resetBlock();
                }
            },
        };
        window.top.sketchMeasureCompare.config = new Proxy(
            window.top.sketchMeasureCompare.config,
            configHandler
        );
    };

    const watchScreenChange = () => {
        const screenObserver = new MutationObserver(handleScreenChange);
        screenObserver.observe(screen, {
            attributes: true,
            childList: true,
            subtree: true,
        });
        handleScreenChange();
    };

    const listenMessage = () => {
        window.addEventListener('message', ({ data }) => {
            if (!data || !data.msg) {
                return;
            }
            const { msg, payload } = data;
            const offsetY = window.top.sketchMeasureCompare.config.offsetY;
            if (msg === 'updateRulers') {
                setStyle(rulers, {
                    display: flowMode.checked ? 'none' : '',
                });
                setStyle(rulers.childNodes[0], {
                    left: `${payload.left}px`,
                    width: `${payload.width}px`,
                });
                setStyle(rulers.childNodes[1], {
                    top: `${payload.top + offsetY}px`,
                    height: `${payload.height}px`,
                });

                setStyle(newRulers, {
                    display: flowMode.checked ? 'none' : '',
                });
                // left
                setStyle(newRulers.childNodes[0], {
                    left: `${payload.left}px`,
                });
                // top
                setStyle(newRulers.childNodes[1], {
                    top: `${payload.top + offsetY}px`,
                });
                // right
                setStyle(newRulers.childNodes[2], {
                    left: `${payload.left + payload.width}px`,
                });
                // bottom
                setStyle(newRulers.childNodes[3], {
                    top: `${payload.top + payload.height + offsetY}px`,
                });

                const isSelected = selectedRulers.style.display !== 'none';
                if (isSelected) {
                    const left = parseFloat(
                        selectedRulers.childNodes[0].style.left
                    );
                    const top = parseFloat(
                        selectedRulers.childNodes[1].style.top
                    );
                    const right = parseFloat(
                        selectedRulers.childNodes[2].style.left
                    );
                    const bottom = parseFloat(
                        selectedRulers.childNodes[3].style.top
                    );

                    const hoverLeft = payload.left;
                    const hoverTop = payload.top + offsetY;
                    const hoverRight = payload.left + payload.width;
                    const hoverBottom = payload.top + payload.height + offsetY;

                    const isShow =
                        hoverLeft || hoverTop || hoverRight || hoverBottom;

                    if (hoverRight <= left) {
                        setStyle(ld, {
                            display: isShow ? '' : 'none',
                            left: `${hoverRight}px`,
                            top: `${top + (bottom - top) / 2}px`,
                            width: `${left - hoverRight}px`,
                        });
                    } else {
                        setStyle(ld, {
                            display: hoverLeft < right && isShow ? '' : 'none',
                            left: `${hoverLeft < left ? hoverLeft : left}px`,
                            top: `${top + (bottom - top) / 2}px`,
                            width: `${Math.abs(hoverLeft - left)}px`,
                        });
                    }
                    ld.childNodes[0].dataset.width = ld.style.width;

                    if (hoverLeft >= right) {
                        setStyle(rd, {
                            display: isShow ? '' : 'none',
                            left: `${right}px`,
                            top: `${top + (bottom - top) / 2}px`,
                            width: `${hoverLeft - right}px`,
                        });
                    } else {
                        setStyle(rd, {
                            display: hoverRight > left && isShow ? '' : 'none',
                            left: `${
                                hoverRight > right ? right : hoverRight
                            }px`,
                            top: `${top + (bottom - top) / 2}px`,
                            width: `${Math.abs(hoverRight - right)}px`,
                        });
                    }
                    rd.childNodes[0].dataset.width = rd.style.width;

                    if (hoverBottom <= top) {
                        setStyle(td, {
                            display: isShow ? '' : 'none',
                            left: `${left + (right - left) / 2}px`,
                            top: `${hoverBottom}px`,
                            height: `${top - hoverBottom}px`,
                        });
                    } else {
                        setStyle(td, {
                            display: hoverTop < bottom && isShow ? '' : 'none',
                            left: `${left + (right - left) / 2}px`,
                            top: `${hoverTop < top ? hoverTop : top}px`,
                            height: `${Math.abs(hoverTop - top)}px`,
                        });
                    }
                    td.childNodes[0].dataset.height = td.style.height;

                    if (hoverTop >= bottom) {
                        setStyle(bd, {
                            display: isShow ? '' : 'none',
                            left: `${left + (right - left) / 2}px`,
                            top: `${bottom}px`,
                            height: `${hoverTop - bottom}px`,
                        });
                    } else {
                        setStyle(bd, {
                            display: hoverBottom > top && isShow ? '' : 'none',
                            left: `${left + (right - left) / 2}px`,
                            top: `${
                                hoverBottom > bottom ? bottom : hoverBottom
                            }px`,
                            height: `${Math.abs(hoverBottom - bottom)}px`,
                        });
                    }
                    bd.childNodes[0].dataset.height = bd.style.height;
                }
            }
        });
    };

    const watchChosen = () => {
        document.onkeyup = (e) => {
            if (e.key === 'c' && !flowMode.checked) {
                const node = window.top.sketchMeasureCompare.hover;
                wrapper.click();
                setStyle(selectedRulers, { display: '' });
                // left
                setStyle(selectedRulers.childNodes[0], {
                    left: newRulers.childNodes[0].style.left,
                });
                // top
                setStyle(selectedRulers.childNodes[1], {
                    top: newRulers.childNodes[1].style.top,
                });
                // right
                setStyle(selectedRulers.childNodes[2], {
                    left: newRulers.childNodes[2].style.left,
                });
                // bottom
                setStyle(selectedRulers.childNodes[3], {
                    top: newRulers.childNodes[3].style.top,
                });
                const format = (num) => {
                    const res = +parseFloat(num).toFixed(2);
                    if (`${res}` === 'NaN') {
                        return num;
                    }
                    return `${res}px`;
                }
                if (node && inspectorCenterTpl && inspector) {
                    inspector.className = inspector.className + ' active';
                    const styles = getComputedStyle(node);
                    const props = {
                        width: format(styles.width),
                        height: format(styles.height),
                        marginTop: format(styles.marginTop),
                        marginBottom: format(styles.marginBottom),
                        marginRight: format(styles.marginRight),
                        marginLeft: format(styles.marginLeft),
                        paddingTop: format(styles.paddingTop),
                        paddingBottom: format(styles.paddingTop),
                        paddingRight: format(styles.paddingRight),
                        paddingLeft: format(styles.paddingLeft),
                        fontSize: format(styles.fontSize),
                        lineHeight: format(styles.lineHeight),
                        borderRadius: format(styles.borderRadius),
                        borderWidth: format(styles.borderWidth),
                        opacity: `${+styles.opacity * 100}%`,
                        fontFamily: styles.fontFamily.replace(/"/g, ''),
                        letterSpacing: styles.letterSpacing,
                        textAlign: styles.textAlign,
                        fontWeight: styles.fontWeight,
                        borderStyle: styles.borderStyle,
                        borderColor: styles.borderColor,
                        color: styles.color,
                        backgroundColor: styles.backgroundColor,
                        innerText: node.innerText.trim(),
                    };
                    inspectorCenter.innerHTML = eval(
                        '`' + inspectorCenterTpl + '`'
                    );
                }
            }
        };
    };

    const initInspector = () => {
        fetch(window.top.sketchMeasureCompare.inspectorCenterTpl)
            .then((res) => res.text())
            .then((res) => {
                inspectorCenterTpl = res;
            });
        wrapper.addEventListener('click', () => {
            inspector.className = inspector.className.replace('active', '');
        });
    }

    const init = () => {
        if (isInit) {
            return;
        }
        if (isReady()) {
            isInit = true;
            window.top.onbeforeunload = () => false;
            fixStyle();
            initClear();
            initIframe();
            newRulers = createRulers('#419bf9');
            selectedRulers = createRulers('#ee6723');
            initDistance();
            initIframeSrc();
            intNewScreen();
            initInspector();

            watchConfigChange();
            watchScreenChange();
            listenMessage();
            watchChosen();
        }
    };
    setTimeout(init, 220);
    setTimeout(init, 500);
    setTimeout(init, 1000);
    setTimeout(init, 3000);
    setTimeout(init, 5000);
};
