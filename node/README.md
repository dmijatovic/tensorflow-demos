# Tensorflow with NodeJS

This module uses tensorflow js with Node.

I tried to use module [with gpu support](https://www.tensorflow.org/js/tutorials/setup) without success. I was not able to install module via NPM. I was gettig access denied on specific c header file.

```bash
# EACCES: permission denied, @tensorflow/tfjs-node/deps/include/tensorflow/c/c_api.h
```

## Setup

```bash
# install required libs
npm i -s lodash shuffle-seed @tensorflow/tfjs

```
