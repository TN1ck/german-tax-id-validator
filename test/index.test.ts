import { expect, describe, it } from 'vitest'
import taxValidator from '../index'

const TEST_DATA = {
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
        expect(taxValidator.validate(TEST_DATA.valid_id_2015)).toBe(true);
    });
    it('correctly validates a valid 2016-tax-id', function() {
        expect(taxValidator.validate(TEST_DATA.valid_id_2016)).toBe(true);
    });
    it('correctly invalidate a valid 2016-tax-id if the flag is set to true', function() {
        expect(taxValidator.validate(TEST_DATA.valid_id_2016, false, true)).toBe(false);
    });
    it('correctly validate a valid 2016-tax-id if the flag is set to false', function() {
        expect(taxValidator.validate(TEST_DATA.valid_id_2016, false, false)).toBe(true);
    });
    it('correctly invalidate a valid 2015-tax-id if the flag is set', function() {
        expect(taxValidator.validate(TEST_DATA.valid_id_2015, true, false)).toBe(false);
    });
    it('correctly invalidate a tax-id with a wrong checksum', function () {
        expect(taxValidator.validate(TEST_DATA.invalid_wrong_checksum)).toBe(false);
    });
    it('correctly invalidate a tax-id with with not enough unique numbers', function () {
        expect(taxValidator.validate(TEST_DATA.invalid_not_enough_unique)).toBe(false);
    });
    it('correctly invalidates a tax-id that is too long', function() {
        expect(taxValidator.validate(TEST_DATA.invalid_id_too_long)).toBe(false);
    });
    it('correctly invalidates a tax-id that is too short', function() {
        expect(taxValidator.validate(TEST_DATA.invalid_id_too_short)).toBe(false);
    });
    it('correctly invalidates a tax-id that has no leading zero', function() {
        expect(taxValidator.validate(TEST_DATA.invalid_id_leading_zero)).toBe(false);
    });
    it('does not crash with invalid input', function() {
        expect(taxValidator.validate(TEST_DATA.invalid_input_1 as any)).toBe(false);
    });
    it('does not crash with invalid input', function() {
        expect(taxValidator.validate(TEST_DATA.invalid_input_2 as any)).toBe(false);
    });
});
