# Sketch-Measure-Compare

A tool for easy comparison of UI and web pages

## Guide

### Step1: Installation
#### Method 1: Using CDN in HTML (Recommend)
```js
const script = document.createElement('script');
script.onload = () => {
    // sketchMeasureCompare.init();
    // or init with options
    sketchMeasureCompare.init({
      zIndex: 10000,
      width: 0,
      enableDomRulers: false,
      enableTextReplace: false,
      offsetY: 0
    });
};
script.src = "https://unpkg.com/sketch-measure-compare@latest/index.min.js";
document.head.appendChild(script);
```

Available CDN:

- https://unpkg.com/sketch-measure-compare@latest/index.min.js
- https://cdn.jsdelivr.net/gh/Neco86/Sketch-Measure-Compare@latest/index.min.js

Backup:

- https://neco86.github.io/Sketch-Measure-Compare/index.min.js

#### Method 2: Using Chrome Extension
Download and unzip: https://github.com/Neco86/Sketch-Measure-Compare/archive/refs/heads/extension.zip

[Load the unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)


### Step2: Click the UI button to switch page

### Step3: Choose files

Click `upload` button to upload local sketch measure folder;

### Step4: Compare UI and your website page

![demo](https://raw.githubusercontent.com/Neco86/Sketch-Measure-Compare/main/demo.png)
