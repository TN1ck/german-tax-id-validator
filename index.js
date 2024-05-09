/**
 * german-tax-id-validator
 * https://github.com/LIQIDTechnology/german-tax-id-validator
 *
 * Licensed under the MIT license.
*/

// some functional utilities, check the lodash-docs to see what they are doing
var groupBy = function(arr, grouper) {
    var map = {};
    (arr || []).forEach(function(element) {
        var key = grouper(element);
        map[key] = map[key] || [];
        map[key].push(element);
    });
    return map;
 };

var pairs = function (obj) {
    return Object.keys(obj || {}).map(function (key) {
        return [key, obj[key]];
    });
};

var isNumber = function (n) {
    return typeof n === 'number' && !isNaN(n);
};

var every = function (arr, predicate) {
    return (arr || []).reduce(function (a, b) {
        return a && predicate(b);
    }, true);
};

var identity = function (_) {
    return _;
};

var last = function (arr) {
    arr = arr || [];
    var lastIndex = arr.length - 1;
    return lastIndex >= 0 ? arr[lastIndex] : null;
};

module.exports = {
    /**
     * Description of what this does.
     *
     * @param {string} taxId The Tax-id you want to validate
     * @param {boolean} [false] doNotValidate2015 Specify if you do not want to validate ids that are only valid since 2015
     * @param {boolean} [false] doNotValidate2016 Specify if you do not want to validate ids that are only valid since 2016
     * @returns {boolean}
     */
    validate: function (taxId, doNotValidate2015, doNotValidate2016) {
        // https://de.wikipedia.org/wiki/Steuerliche_Identifikationsnummer#Aufbau_der_Identifikationsnummer

        // make sure it is a string
        taxId = String(taxId);
        // make sure doNotValidate2016 is a boolean
        doNotValidate2016 = doNotValidate2016 || false;

        // create array of strings out of array
        taxId = taxId.split('');

        // taxId has to have exactly 11 digits
        if (taxId.length !== 11) {
            return false;
        }

        // first cannot be 0
        if (taxId[0] === '0') {
            return false;
        }

        // parse to numbers
        taxId = taxId.map(function(n) {
            return parseInt(n, 10);
        });

        // check if every character is a number
        if (!every(taxId, isNumber)) {
            return false;
        }

        // make sure that within the first ten digits:
        var firstTen = taxId.slice(0, 10);

        // group the string by the occuring charaters, the result is an array of tuples
        // like ['1', ['1']] where the second entry holds the occurences
        var groupedByIdentiy = pairs(groupBy(firstTen, identity));
        // now we group by the number of occurences
        var groupedByNumberOfOccurence = groupBy(groupedByIdentiy, function (pair) {
            return pair[1].length;
        });

        var correct = false;

        if (
            !doNotValidate2015 &&
            // 1. one digit appears zero times
            groupedByIdentiy.length === 9 &&
            // 2. one digit appears exactly twice
            groupedByNumberOfOccurence[2] && groupedByNumberOfOccurence[2].length === 1 &&
            // 3. and all other digits appear exactly once
            groupedByNumberOfOccurence[1] && groupedByNumberOfOccurence[1].length === 8
        ) {
            correct = true;
        // since 2016 the following is also valid
        } else if (
            !doNotValidate2016 &&
            // 1. two digits appear zero times
            groupedByIdentiy.length === 8 &&
            // 2. one digit appears exactly three times
            groupedByNumberOfOccurence[3] && groupedByNumberOfOccurence[3].length === 1 &&
            // 3. and all other digits appear exactly once
            groupedByNumberOfOccurence[1] && groupedByNumberOfOccurence[1].length === 7
        ) {
            correct = true;
        }

        // calculate the checksum
        if (correct) {
            var sum = 0;
            var product = 10;
            for (var i = 0; i <= 9; i++) {
                sum = (firstTen[i] + product) % 10;
                if (sum === 0) {
                    sum = 10;
                }
                product = (sum * 2) % 11;
            }

            var checksum = 11 - product;
            if (checksum === 10) {
                checksum = 0;
            }
            if (checksum === last(taxId)) {
                return true;
            }
        }

        return false;


    }
};
