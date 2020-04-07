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
