# Sketch-Measure-Compare

A tool for easy comparison of UI and web pages

## Guide

### Step1: Installation

```js
const script = document.createElement('script');
script.onload = () => {
    sketchMeasureCompare.init({zIndex: 10000});
};
script.src = "https://cdn.jsdelivr.net/gh/Neco86/Sketch-Measure-Compare@latest/index.min.js";
document.head.appendChild(script);
```

Available CDN:

- https://unpkg.com/sketch-measure-compare@latest/index.min.js
- https://cdn.jsdelivr.net/gh/Neco86/Sketch-Measure-Compare@latest/index.min.js

Backup:

- https://neco86.github.io/Sketch-Measure-Compare/index.min.js

### Step2: Click the UI button to switch the current page to the file selection page

### Step3: Choose files

Click `upload` button to upload local sketch measure folder;

### Step4: Compare UI and your website page

![demo](https://raw.githubusercontent.com/Neco86/Sketch-Measure-Compare/main/demo.png)
