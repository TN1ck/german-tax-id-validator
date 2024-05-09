var should = require('chai').should(),
taxValidator = require('../index');

var TEST_DATA = {
    valid_id_2015: '12345678911',
    invalid_not_enough_unique: '12345678811',
    invalid_wrong_checksum: '12345678912',
    invalid_id_too_long: '123456789111',
    invalid_id_too_short: '123456789',
    invalid_id_leading_zero: '02345678112',
    valid_id_2016: '12345678114',
    invalid_input_1: undefined,
    invalid_input_2: {a: 'test'}
};

describe('#validate', function() {
    it('correctly validates a valid tax-id', function() {
        taxValidator
        .validate(TEST_DATA.valid_id_2015)
        .should.equal(true);
    });
    it('correctly validates a valid 2016-tax-id', function() {
        taxValidator
        .validate(TEST_DATA.valid_id_2016)
        .should.equal(true);
    });
    it('correctly invalidate a valid 2016-tax-id if the flag is set to true', function() {
        taxValidator
        .validate(TEST_DATA.valid_id_2016, false, true)
        .should.equal(false);
    });
    it('correctly validate a valid 2016-tax-id if the flag is set to false', function() {
        taxValidator
        .validate(TEST_DATA.valid_id_2016, false, false)
        .should.equal(true);
    });
    it('correctly invalidate a valid 2015-tax-id if the flag is set', function() {
        taxValidator
        .validate(TEST_DATA.valid_id_2015, true, false)
        .should.equal(false);
    });
    it('correctly invalidate a tax-id with a wrong checksum', function () {
        taxValidator
        .validate(TEST_DATA.invalid_wrong_checksum)
        .should.equal(false);
    });
    it('correctly invalidate a tax-id with with not enough unique numbers', function () {
        taxValidator
        .validate(TEST_DATA.invalid_not_enough_unique)
        .should.equal(false);
    });
    it('correctly invalidates a tax-id that is too long', function() {
        taxValidator
        .validate(TEST_DATA.invalid_id_too_long)
        .should.equal(false);
    });
    it('correctly invalidates a tax-id that is too short', function() {
        taxValidator
        .validate(TEST_DATA.invalid_id_too_short)
        .should.equal(false);
    });
    it('correctly invalidates a tax-id that has no leading zero', function() {
        taxValidator
        .validate(TEST_DATA.invalid_id_no_leading_zero)
        .should.equal(false);
    });
    it('does not crash with invalid input', function() {
        taxValidator
        .validate(TEST_DATA.invalid_input_1)
        .should.equal(false);
    });
    it('does not crash with invalid input', function() {
        taxValidator
        .validate(TEST_DATA.invalid_input_2)
        .should.equal(false);
    });
});
