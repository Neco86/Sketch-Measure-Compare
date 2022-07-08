(() => {
    if (!window.top.SKETCH_MEASURE_COMPARE) {
        window.top.SKETCH_MEASURE_COMPARE = {};
        const iframe = document.createElement('iframe');
        const setStyle = (ele, obj) => {
            Object.keys(obj).forEach((key) => {
                ele.style[key] = obj[key];
            });
        };

        setStyle(iframe, {
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            top: '0',
            left: '0',
            border: 'none',
            zIndex: '10000',
            display: 'none',
        });

        const toggleBtnWrapper = document.createElement('div');
        setStyle(toggleBtnWrapper, {
            position: 'fixed',
            zIndex: '10000',
            width: '100vw',
            height: '0',
            top: '0',
            left: '0'
        });

        const toggleBtn = document.createElement('div');
        setStyle(toggleBtn, {
            position: 'fixed',
            zIndex: '10000',
            right: '0',
            bottom: '40px',
            backgroundColor: '#04BE02',
            padding: '2px 14px',
            borderRadius: '3px',
            color: '#fff',
            height: '26px',
            lineHeight: '26px',
            fontSize: '16px',
            userSelect: 'none',
            webkitUserSelect: 'none'
        });
        toggleBtn.innerText = 'UI';

        let shiftX = 0;
        let shiftY = 0;
        let isMoving = false;
        let mouseDownX = 0;
        let mouseDownY = 0;
        let screenHeight = 0;
        let screenWidth = 0;

        toggleBtn.onclick = (e) => {
            const { left, top } = toggleBtn.getBoundingClientRect();
            const isClick = Math.abs(left - mouseDownX) < 1 || Math.abs(top - mouseDownY) < 1 || !e?.isTrusted;
            if (isClick) {
                iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
            }
        };

        const handleMouseDown = (e) => {
            toggleBtnWrapper.style.height = '100vh';
            const { left, top, width, height } = toggleBtn.getBoundingClientRect();
            const { width: wrapperWidth, height: wrapperHeight } = toggleBtnWrapper.getBoundingClientRect();
            mouseDownX = left;
            mouseDownY = top;
            screenHeight = wrapperHeight;
            screenWidth = wrapperWidth;
            const clientX = e?.touches?.[0]?.clientX ?? e?.clientX;
            const clientY = e?.touches?.[0]?.clientY ?? e?.clientY;
            shiftX = clientX - mouseDownX - width;
            shiftY = clientY - mouseDownY - height;
            isMoving = true;
        };

        const handleMouseUp = () => {
            toggleBtnWrapper.style.height = '0';
            isMoving = false;
        }

        const handleMouseMove = (e) => {
            e.preventDefault();
            if (isMoving) {
                const clientX = e?.touches?.[0]?.clientX ?? e?.clientX;
                const clientY = e?.touches?.[0]?.clientY ?? e?.clientY;
                toggleBtn.style.right = screenWidth - clientX + shiftX + 'px';
                toggleBtn.style.bottom = screenHeight - clientY + shiftY + 'px';
            }
        }

        toggleBtn.onmousedown = handleMouseDown;
        toggleBtnWrapper.onmousemove = handleMouseMove;
        toggleBtnWrapper.onmouseup = handleMouseUp;
        toggleBtn.ontouchstart = handleMouseDown;
        toggleBtnWrapper.ontouchmove = handleMouseMove;
        toggleBtnWrapper.ontouchend = handleMouseUp;

        toggleBtnWrapper.appendChild(toggleBtn);

        fetch('https://neco86.github.io/Sketch-Measure-Compare/')
            .then((res) => res.text())
            .then((html) => {
                const blob = new Blob([html], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                iframe.src = url;
                document.body.appendChild(iframe);
                document.body.appendChild(toggleBtnWrapper);
                window.top.SKETCH_MEASURE_COMPARE.iframe = iframe;
                window.top.SKETCH_MEASURE_COMPARE.toggleBtn = toggleBtn;
            });

        document.addEventListener('beforeunload', () => {
            URL.revokeObjectURL(iframe.src);
        });
    }
})();
