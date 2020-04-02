# Tensorflow Regression

> Tensorflow basic regression model with nuxt

## Tensorflow

```bash
# install tf modules
npm i -s  @tensorflow/tfjs @tensorflow-models/mobilenet @tensorflow/tfjs-vis
# install dv4all modules
npm i -s @dv4all/icons@latest @dv4all/loaders@latest @dv4all/web-components@latest
```

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Methodology

The steps in training a [machine learning model include](https://codelabs.developers.google.com/codelabs/tfjs-training-regression/index.html#7)

### Formulate your task

Is it a regression problem or a classification one?
Can this be done with supervised learning or unsupervised learning?
What is the shape of the input data? What should the output data look like?

### Prepare your data

Clean your data and manually inspect it for patterns when possible
Shuffle your data before using it for training
Normalize your data into a reasonable range for the neural network. Usually 0-1 or -1-1 are good ranges for numerical data.
Convert your data into tensors

### Build and run your model

Define your model using tf.sequential or tf.model then add layers to it using tf.layers.\*
Choose an optimizer (adam is usually a good one), and parameters like batch size and number of epochs.
Choose an appropriate loss function for your problem, and an accuracy metric to help your evaluate progress. meanSquaredError is a common loss function for regression problems.
Monitor training to see whether the loss is going down

### Evaluate your model

Choose an evaluation metric for your model that you can monitor while training. Once it's trained, try making some test predictions to get a sense of prediction quality
