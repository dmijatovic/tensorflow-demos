# Tensorflow webpack demo

This repo is uses tensorflow for image recognition of cats?!?

In this demo I tried to use web worker for tensorflow activities but faced important challenge.
The mobilenet model I use here requires browser image object. This object cannot be passed to web worker. Also passing loaded tf or model library to main thread after loding is not possible. The error message indicates that functions `can not be cloned`.

So far I have not found a way to use web worker with tf for image recognition. The tools seem not to be optimized for this approach. Therefore first example of image recognition with tensorflow is in main thread.

## Setup

```bash
# 1. tensorflow
npm i -s  @tensorflow/tfjs @tensorflow-models/mobilenet
# 2. install webpack modules
npm i -D webpack@latest webpack-cli@latest webpack-dev-server@latest webpack-bundle-analyzer@latest
# 3. install webpack plugins for html and static assets copying
npm i -D html-webpack-plugin@latest copy-webpack-plugin@latest
# 4. more webpack plugins - not used during test
npm i -D url-loader@latest file-loader@latest uglifyjs-webpack-plugin clean-webpack-plugin
# 5 @dv4all modules
npm i -s @dv4all/icons@latest @dv4all/loaders@latest @dv4all/web-components@latest

```

## Development

- clone repo

```bash
# install
npm install

# run in dev
npm run dev

# run build
npm run build

```

- import tensorflow modules

```javascript
import * as tfjs from "@tensorflow/tfjs";
```
