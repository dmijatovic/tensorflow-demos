# Plinko example

This example is taken from Udemy's [machine learning training of Stephen Griner](https://www.udemy.com/course/machine-learning-with-javascript/).

The [original repo is avaliable on Github](https://github.com/stephengrider/mlkits) and includes other examples.

I have modified some parts to better fit mine usecase and JS stack I like to work with.

## Setup

I use Cypress to generate test data in the browser and then save it to JSON in data folder

```bash
# install dependencies
npm i -D serve cypress

```

## ML Problem solving process

- identify relevant data
- assemble data set
- decide on type of the output you want to predict
- pick correct the alorithm to detect correlation between 'features' and labels
- train the model
- use generated model to create prediction
