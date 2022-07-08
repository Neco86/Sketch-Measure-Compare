# Sketch-Measure-Compare

A tool for easy comparison of UI and web pages

## Guide

### Step1: Installation

```js
const script = document.createElement('script');
script.src = "https://neco86.github.io/Sketch-Measure-Compare/inject.js";
script.onload = () => {
    sketchMeasureCompare.init({zIndex: 10000});
};
```

### Step2: Click the UI button to switch the current page to the file selection page

### Step3: Choose files

Click `upload` button to upload local sketch measure folder;

### Step4: Compare UI and your website page

![demo](https://neco86.github.io/Sketch-Measure-Compare/demo.png)
