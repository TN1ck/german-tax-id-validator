/**
 * german-tax-id-validator
 * https://github.com/TN1ck/german-tax-id-validator
 *
 * Licensed under the MIT license.
*/

// Generic utility to group elements of an array by a key derived from each element
function groupBy<T, K extends keyof any>(arr: T[], grouper: (element: T) => K): Record<K, T[]> {
    const map: Record<K, T[]> = {} as Record<K, T[]>;
    (arr || []).forEach((element) => {
        const key = grouper(element);
        if (!map[key]) {
            map[key] = [];
        }
        map[key].push(element);
    });
    return map;
}

// Convert an object into an array of [key, value] pairs
function pairs<K extends keyof any, V>(obj: Record<K, V>): [K, V][] {
    return Object.keys(obj).map(key => [key as K, obj[key as K]]);
}

// Check if a value is a number
function isNumber(n: any): boolean {
    return typeof n === 'number' && !isNaN(n);
}

// Check if every element in an array satisfies a predicate
function every<T>(arr: T[], predicate: (value: T) => boolean): boolean {
    return (arr || []).reduce((a, b) => a && predicate(b), true);
}

// Identity function, returns whatever is passed to it
function identity<T>(x: T): T {
    return x;
}

// Get the last element of an array, or null if empty
function last<T>(arr: T[]): T | null {
    arr = arr || [];
    const lastIndex = arr.length - 1;
    return lastIndex >= 0 ? arr[lastIndex] : null;
}

/**
 * Validates a German tax-id (steuerliche Identifikationsnummer).
 * @param taxId The Tax-id you want to validate.
 * @param doNotValidate2015 Specify if you do not want to validate ids that are only valid since 2015.
 * @param doNotValidate2016 Specify if you do not want to validate ids that are only valid since 2016.
 * @returns true if the tax id is valid, false otherwise.
 */
function validate(taxId: string, doNotValidate2015: boolean = false, doNotValidate2016: boolean = false): boolean {
    // Normalize input to string
    taxId = String(taxId);
    // Split string into an array of characters
    const taxIdArray = taxId.split('');

    // taxId must have exactly 11 digits
    if (taxId.length !== 11) {
        return false;
    }

    // First digit cannot be '0'
    if (taxId[0] === '0') {
        return false;
    }

    // Convert each character to a number
    const taxIdNums = taxIdArray.map(n => parseInt(n, 10));

    // Verify each character is a valid number
    if (!every(taxIdNums, isNumber)) {
        return false;
    }

    // Evaluate the first ten digits
    const firstTen = taxIdNums.slice(0, 10);

    // Group the digits by their identity, then by the number of occurrences
    const groupedByIdentity = pairs(groupBy(firstTen, identity));
    const groupedByNumberOfOccurrence = groupBy(groupedByIdentity, pair => pair[1].length);

    let correct = false;

    // Check for patterns specific to validation rules from 2015 and 2016
    if (
        !doNotValidate2015 &&
        groupedByIdentity.length === 9 &&
        groupedByNumberOfOccurrence[2] && groupedByNumberOfOccurrence[2].length === 1 &&
        groupedByNumberOfOccurrence[1] && groupedByNumberOfOccurrence[1].length === 8
    ) {
        correct = true;
    } else if (
        !doNotValidate2016 &&
        groupedByIdentity.length === 8 &&
        groupedByNumberOfOccurrence[3] && groupedByNumberOfOccurrence[3].length === 1 &&
        groupedByNumberOfOccurrence[1] && groupedByNumberOfOccurrence[1].length === 7
    ) {
        correct = true;
    }

    // Calculate checksum if the format is correct
    if (correct) {
        let sum = 0;
        let product = 10;
        for (let i = 0; i <= 9; i++) {
            sum = (firstTen[i] + product) % 10;
            if (sum === 0) {
                sum = 10;
            }
            product = (sum * 2) % 11;
        }

        let checksum = 11 - product;
        if (checksum === 10) {
            checksum = 0;
        }
        if (checksum === last(taxIdNums)) {
            return true;
        }
    }

    return false;
}

export default { validate };
