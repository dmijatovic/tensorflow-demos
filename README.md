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

### Batch and stochastic gradient descent

- batch (mini-batch): split data into smaller batches and update weights after each batch. Here we use epochs to indicate how many runs we do?
- stochastic: update weights on each record, can be seen as batch with batch size of 1 record.

## Logistic regression

Classification problem. There is definitive amount of labels (classes) that model can choose from.

### Sigmoid function

It produces the values between 0 and 1.

Sig = 1 / (1 + e\*\*z)

- e: Oieler constant (2.718)
- z: is the value based on linear regression formula
