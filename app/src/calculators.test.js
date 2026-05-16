const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { calculateAvgPrice, calculateTotalValue, subtract, calculateTotalQuantity } = require('./calculators.js');
const { multiply } = require('lodash');


describe('calculateAvgPrice', () => {
    test('returns 0 for empty array', () => {
        assert.equal(calculateAvgPrice([]), 0);
    });

    test('returns 0 for non-array input', () => {
        assert.equal(calculateAvgPrice(null), 0);
    });

    test('returns correct average for single product', () => {
        assert.equal(calculateAvgPrice([{ price: 9.99 }]), 9.99);
    });

    test('returns correct average for multiple products', () => {
        const products = [{ price: 10 }, { price: 20 }, { price: 30 }];
        assert.equal(calculateAvgPrice(products), 20);
    });

    test('rounds to 2 decimal places', () => {
        const products = [{ price: 10 }, { price: 20 }, { price: 11 }];
        // (41 / 3) = 13.6666... → 13.67
        assert.equal(calculateAvgPrice(products), 13.67);
    });

    test('handles string prices', () => {
        const products = [{ price: '5.00' }, { price: '15.00' }];
        assert.equal(calculateAvgPrice(products), 10);
    });
});

describe('calculateTotalValue', () => {
    test('returns 0 for empty array', () => {
        assert.equal(calculateTotalValue([]), 0);
    });

    test('calculates price × quantity for one product', () => {
        assert.equal(calculateTotalValue([{ price: 10, quantity: 3 }]), 30);
    });

    test('sums across multiple products', () => {
        const products = [
            { price: 10, quantity: 2 },
            { price: 5,  quantity: 4 },
        ];
        assert.equal(calculateTotalValue(products), 40);
    });

    test('treats missing quantity as 0', () => {
        assert.equal(calculateTotalValue([{ price: 99 }]), 0);
    });
});

describe('subtract', () => {
    test('subtracts two positive numbers', () => {
        assert.equal(subtract(10, 3), 7);
    });

    test('returns negative when b > a', () => {
        assert.equal(subtract(0, 5), -5);
    });

    test('handles negative operands', () => {
        assert.equal(subtract(-2, -3), 1);
    });

    test('returns 0 for equal operands', () => {
        assert.equal(subtract(42, 42), 0);
    });
});

describe('multiply', () => {
    test('multiplies two positive numbers', () => {
        assert.equal(multiply(10, 5), 50);
    });
})
describe('calculateTotalQuantity', () => {
    test('returns 0 for empty array', () => {
        assert.equal(calculateTotalQuantity([]), 0);
    });

    test('sums quantities', () => {
        const products = [{ quantity: 5 }, { quantity: 10 }, { quantity: 15 }];
        assert.equal(calculateTotalQuantity(products), 30);
    });

    test('handles string quantities', () => {
        assert.equal(calculateTotalQuantity([{ quantity: '3' }, { quantity: '7' }]), 10);
    });
});
