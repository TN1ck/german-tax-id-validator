# German Tax Id Validator

This library validates german tax identification numbers, more infos here: http://www.bzst.de/EN/Steuern_National/Steueridentifikationsnummer/steuerid_node.html.

## How to use
First you neeed to install the package via npm:

```
npm install --save german-tax-id-validator
```

```js
var taxValidator = require('german-tax-id-validator');
// validate has the follwing signature:
// validate(taxId, doNotValidate2015, doNotValidate2016), only taxId is required
var isValid = taxValidator.validate('01234567811');
```

The `validate`-method accepts only strings;

You can further specify wich versions of valid tax-ids you want to test,
because since 2016, another set of tax-ids is valid. You can use the optional parameters to
test for a specific version of the tax-id.

```js
// only validate pre 2016-ids
var isValid = taxValidator.validate('01234567811', false, true);
// only validate post 2016-ids
var isValid = taxValidator.validate('01234567811', true, false);
```
