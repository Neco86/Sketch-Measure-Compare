(() => {
    const uploader = document.getElementById('uploader');
    const iframe = document.getElementById('iframe');
    const placeholder = document.getElementById('placeholder');
    const clear = document.getElementById('clear');
    let fileList = [];
    uploader.onchange = ({ target: { files } }) => {
        if (!files.length) {
            return;
        }
        fileList = [...files].map((file) => ({
            name: file.name,
            path: file.webkitRelativePath.replace(/^.*?\//, ''),
            url: URL.createObjectURL(file),
        }));
        const index = fileList.find((t) => t.name === 'index.html');
        if (index) {
            fetch(index.url)
                .then((res) => res.text())
                .then((res) => {
                    fileList.forEach((file) => {
                        const path = file.path
                            .split('/')
                            .map(encodeURIComponent)
                            .join('/');
                        res = res.replace(path, `${file.url}#`);
                    });
                    res = res.replace(/\.blob/g, 'blob');
                    return res;
                })
                .then((res) => {
                    res = res.replace(
                        '</head>',
                        `<script src="https://neco86.github.io/Sketch-Measure-Compare/sketchMeasure.js"><\/script></head>`
                    );
                    return res;
                })
                .then((res) => {
                    const blob = new Blob([res], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    iframe.src = url;
                    placeholder.style.display = 'none';
                    iframe.style.display = 'block';
                    clear.style.display = 'block';
                });
        }
    };
    const handleClear = () => {
        URL.revokeObjectURL(iframe.src);
        fileList.forEach((file) => {
            URL.revokeObjectURL(file.url);
        });
        fileList = [];
        iframe.src = '';
        uploader.value = '';
        placeholder.style.display = 'block';
        iframe.style.display = 'none';
        clear.style.display = 'none';
    };
    document.addEventListener('beforeunload', handleClear);
    clear.onclick = handleClear;
})();
