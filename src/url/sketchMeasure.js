export default () => {
    let isInit = false;
    const init = () => {
        if (isInit) {
            return;
        }
        const wrapper = document.getElementsByClassName(
            'screen-viewer-inner'
        )?.[0];
        const screen = document.getElementById('screen');
        const rulers = document.getElementById('rulers');
        const flowMode = document.getElementById('flow-mode');
        const header = document.getElementsByClassName('header-center')?.[0];
        if (wrapper && screen && rulers && flowMode && header) {
            isInit = true;
            const setStyle = (ele, obj) => {
                Object.keys(obj).forEach((key) => {
                    ele.style[key] = obj[key];
                });
            };

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
            clear.onclick = () =>
                window.parent.postMessage(
                    {
                        msg: 'CLEAR UI',
                    },
                    '*'
                );
            clearWrapper.appendChild(clear);
            header.appendChild(clearWrapper);

            const style = document.createElement('style');
            style.innerHTML = '.layer{z-index: 1;}';
            document.head.appendChild(style);

            window.top.onbeforeunload = function () {
                return false;
            };

            const iframe = document.createElement('iframe');
            setStyle(iframe, {
                border: 'none',
                position: 'absolute',
            });
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.src = window.top.location.href;
            iframe.onload = () => {
                if (iframe.contentDocument) {
                    if (
                        window.top.sketchMeasureCompare.config.enableDomRulers
                    ) {
                        const script = document.createElement('script');
                        script.src = window.top.sketchMeasureCompare.rulers;
                        iframe.contentDocument.head.appendChild(script);
                    }
                    if (
                        window.top.sketchMeasureCompare.config.enableTextReplace
                    ) {
                        const script = document.createElement('script');
                        script.src =
                            window.top.sketchMeasureCompare.textReplace;
                        iframe.contentDocument.head.appendChild(script);
                    }
                }
            };

            const iframeSrc = document.createElement('input');
            setStyle(iframeSrc, {
                border: 'none',
                outline: 'none',
                height: '20px',
            });
            iframeSrc.placeholder = 'url';
            iframeSrc.value = iframe.src;
            iframeSrc.oninput = (e) => {
                iframe.src = e.target.value;
            };
            iframeSrc.onkeyup = (e) => {
                if (e.key === 'Enter') {
                    iframe.src = '';
                    iframe.src = e.target.value;
                }
            };

            const newScreen = screen.cloneNode(false);
            setStyle(newScreen, {
                backgroundImage: '',
                overflow: 'hidden',
            });
            const newRulers = rulers.cloneNode(true);
            newRulers.appendChild(newRulers.childNodes[0].cloneNode(true));
            newRulers.appendChild(newRulers.childNodes[1].cloneNode(true));
            // left
            setStyle(newRulers.childNodes[0], {
                border: 'none',
                borderLeft: '1px dashed #419bf9',
                width: '0px',
            });
            // top
            setStyle(newRulers.childNodes[1], {
                border: 'none',
                borderTop: '1px dashed #419bf9',
                height: '0px',
            });
            // right
            setStyle(newRulers.childNodes[2], {
                border: 'none',
                borderRight: '1px dashed #419bf9',
                width: '0px',
            });
            // bottom
            setStyle(newRulers.childNodes[3], {
                border: 'none',
                borderBottom: '1px dashed #419bf9',
                height: '0px',
            });
            const selectedRulers = rulers.cloneNode(true);
            selectedRulers.appendChild(
                selectedRulers.childNodes[0].cloneNode(true)
            );
            selectedRulers.appendChild(
                selectedRulers.childNodes[1].cloneNode(true)
            );
            // left
            setStyle(selectedRulers.childNodes[0], {
                border: 'none',
                borderLeft: '1px dashed #ee6723',
                width: '0px',
            });
            // top
            setStyle(selectedRulers.childNodes[1], {
                border: 'none',
                borderTop: '1px dashed #ee6723',
                height: '0px',
            });
            // right
            setStyle(selectedRulers.childNodes[2], {
                border: 'none',
                borderRight: '1px dashed #ee6723',
                width: '0px',
            });
            // bottom
            setStyle(selectedRulers.childNodes[3], {
                border: 'none',
                borderBottom: '1px dashed #ee6723',
                height: '0px',
            });

            const ld = document.getElementById('ld').cloneNode(true);
            const td = document.getElementById('td').cloneNode(true);
            const rd = document.getElementById('rd').cloneNode(true);
            const bd = document.getElementById('bd').cloneNode(true);

            newScreen.appendChild(iframe);
            newScreen.appendChild(newRulers);
            newScreen.appendChild(selectedRulers);
            newScreen.appendChild(ld);
            newScreen.appendChild(td);
            newScreen.appendChild(rd);
            newScreen.appendChild(bd);
            wrapper.appendChild(iframeSrc);
            wrapper.appendChild(newScreen);

            const handleScreenChange = () => {
                const { width, height, marginTop } = screen.style;

                if (width !== newScreen.style.width) {
                    iframe.src = '';
                    iframe.src = iframeSrc.value;
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
                }
            };
            handleScreenChange();

            window.addEventListener('message', ({ data }) => {
                if (!data || !data.msg) {
                    return;
                }
                const { msg, payload } = data;
                if (msg === 'updateRulers') {
                    setStyle(rulers, {
                        display: flowMode.checked ? 'none' : '',
                    });
                    setStyle(rulers.childNodes[0], {
                        left: `${payload.left}px`,
                        width: `${payload.width}px`,
                    });
                    setStyle(rulers.childNodes[1], {
                        top: `${payload.top}px`,
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
                        top: `${payload.top}px`,
                    });
                    // right
                    setStyle(newRulers.childNodes[2], {
                        left: `${payload.left + payload.width}px`,
                    });
                    // bottom
                    setStyle(newRulers.childNodes[3], {
                        top: `${payload.top + payload.height}px`,
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
                        const hoverTop = payload.top;
                        const hoverRight = payload.left + payload.width;
                        const hoverBottom = payload.top + payload.height;

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
                                display:
                                    hoverLeft < right && isShow ? '' : 'none',
                                left: `${
                                    hoverLeft < left ? hoverLeft : left
                                }px`,
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
                                display:
                                    hoverRight > left && isShow ? '' : 'none',
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
                                display:
                                    hoverTop < bottom && isShow ? '' : 'none',
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
                                display:
                                    hoverBottom > top && isShow ? '' : 'none',
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

            document.onkeyup = (e) => {
                if (e.key === 'c' && !flowMode.checked) {
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
                    wrapper.click();
                }
            };

            const screenObserver = new MutationObserver(handleScreenChange);
            screenObserver.observe(screen, {
                attributes: true,
                childList: true,
                subtree: true,
            });
        }
    };
    setTimeout(init, 220);
    setTimeout(init, 500);
    setTimeout(init, 1000);
    setTimeout(init, 3000);
    setTimeout(init, 5000);
};
