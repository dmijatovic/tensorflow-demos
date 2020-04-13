# Tensorflow testing

This repo is used to lern tensorflow and test use with

- JS/Webpack approach
- Test use of tfjs in web worker
- Test use of tfjs with SSR. Nuxt
- Test use of NodeJS as backend

## Regression

### MSE (Mean square error)

Basic regression approach using mean square error.

`mse = SUM((En - An)*2) / N`

- En - estimated case value
- An - actual case value
- N - number of cases

### R squared

Used to indicate fit of the model. The values are from -Infinity to 1, where 1 means perfect fit.

`Rsq = 1 - (SSres / SStot)`

- SStot: total squared sum of diff from avarage (actual - avergage)\*\*2
- SSres: total squared sum of diff from predicted (actual - predicted)\*\*2

### Learning rate optimization methods

- [adam](https://www.youtube.com/watch?v=JXQT_vxqwIs)
- adagrad
- [RMSprop](https://www.youtube.com/watch?v=_e-LFe_igno)
- [Momentum](https://www.youtube.com/watch?v=k8fTYJPd3_I)

In our project we used simple custom method to increase or descrese learning rate. The calculation is done in tf-utils.js tuneLearningRate function.

### Batch and stochastic gradient descent

- batch (mini-batch): split data into smaller batches and update weights after each batch. Here we use epochs to indicate how many runs we do?
- stochastic: update weights on each record, can be seen as batch with batch size of 1 record.

## Logistic regression

Classification problem. There is definitive amount of labels (classes) that model can choose from. The difference between linear and logistic regression approach:

<table>
  <tr>
    <td></td>
    <td>Linear</td>
    <td>Logistic</td>
  </tr>
  <tr>
    <td>Method</td>
    <td>MSE (mean-squared-error) = Sum(Guess(i) - Actual(i))**2 / no. cases</td>
    <td>Cross Entropy </td>
  </tr>
  <tr>
    <td>Predictor fn</td>
    <td>y = rc1 * X1 + rc2 * X2 ... + constant</td>
    <td>1 / (1 + e ** -y) </td>
  </tr>
</table>

### Sigmoid function

It produces the values between 0 and 1.

Sig = 1 / (1 + e\*\* -z)

- e: Oieler constant (2.718)
- z: is the value based on linear regression formula

Sigmoid function is built-in the tensorflow. The approach to gradient descent is similair to mse approach. The only difference, in our implementation, is that sigmoid function is applied on the regression guess in order to produce values between 0 and 1.

### Cross Entropy

Used in logistic regression to indicate how well predicition fits the actual values. Gradient descent function looks for minimum cross entropy value.

`CE = actual(i) x log(guess) + ((1 - actual(i)) x log(1 - guess)) / total cases`

## Cost function

This is general term for the formula to calculate deviation (error) between prediction and actual value (label). In linear regression model we use MSE (mean-square-error) as cost functions and with logistic regression we use Cross Entropy function. In both cases the goal of gradient descent is to reduce cost function value to minimum.

### [Softmax function](https://www.udemy.com/course/machine-learning-with-javascript/learn/lecture/12279784#overview)

Using sigmoid when clasifying estimation above binary distribution produces less reliable output. Sigmoid is used to calculate marginal probablity, eg. probability
of a single outcome (chance of item being true). When we want to predict one of the options which are mutualy exclusive, sigmoid produces combined probabilities which sum is > 1 (100%). To take other options into a cound, we use conditional probabilities function Softmax.

Smax = (e** mx+b) / Sum( (e** mx1+b1) + (e** mx2+b2) ... + (e** mxk+bk))

- k: klasses, number of categories we need to classify
- e: Oeiler constant
- mx+b: outcome of basic linear equation

The total value of all probabilites equals to 1 (100%).

#### argMax function

We are working with multiple categories in binary form (multiple colums with values 0 - 1). We can use argMax function of tensorflow to retreive one dimensional tensor with colom index value of the class with the highest probability value. This help us answer question: which category has the highest probability.

Other useful tensorflow functions are:

- notEqual

## Memory use of tensorflow

Tensorflow holds refrence to all tensors created in an session, even if these are created in local functions/method. In order to remove the tensors from the memory wrap the calculations into tidy() method.
