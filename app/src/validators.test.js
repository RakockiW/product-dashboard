const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { validateProduct, sanitizeProduct } = require('./validators.js');


describe('validateProduct', () => {
    test('rejects empty name string', () => {
        const result = validateProduct({ name: '', price: 9.99 });
        assert.equal(result.valid, false);
        assert.ok(result.error.includes('name'));
    });

    test('rejects missing name (undefined)', () => {
        const result = validateProduct({ price: 9.99 });
        assert.equal(result.valid, false);
        assert.ok(result.error.includes('name'));
    });

    test('rejects whitespace-only name', () => {
        const result = validateProduct({ name: '   ', price: 9.99 });
        assert.equal(result.valid, false);
    });

    test('rejects null price', () => {
        const result = validateProduct({ name: 'Widget', price: null });
        assert.equal(result.valid, false);
        assert.ok(result.error.includes('price'));
    });

    test('rejects negative price', () => {
        const result = validateProduct({ name: 'Widget', price: -0.01 });
        assert.equal(result.valid, false);
    });

    test('rejects non-numeric price', () => {
        const result = validateProduct({ name: 'Widget', price: 'abc' });
        assert.equal(result.valid, false);
    });

    test('accepts zero price (free item)', () => {
        const result = validateProduct({ name: 'Free item', price: 0 });
        assert.equal(result.valid, true);
        assert.equal(result.error, null);
    });

    test('accepts valid product without quantity', () => {
        const result = validateProduct({ name: 'Widget', price: 9.99 });
        assert.equal(result.valid, true);
        assert.equal(result.error, null);
    });

    test('accepts valid product with quantity', () => {
        const result = validateProduct({ name: 'Gadget', price: 24.99, quantity: 10 });
        assert.equal(result.valid, true);
    });

    test('rejects negative quantity', () => {
        const result = validateProduct({ name: 'Widget', price: 5, quantity: -3 });
        assert.equal(result.valid, false);
        assert.ok(result.error.includes('quantity'));
    });

    test('rejects non-numeric quantity', () => {
        const result = validateProduct({ name: 'Widget', price: 5, quantity: 'many' });
        assert.equal(result.valid, false);
    });
});


describe('sanitizeProduct', () => {
    test('trims whitespace from name', () => {
        const result = sanitizeProduct({ name: '  Widget  ', price: '9.99', quantity: '5' });
        assert.equal(result.name, 'Widget');
    });

    test('converts price string to float', () => {
        const result = sanitizeProduct({ name: 'X', price: '14.50', quantity: '0' });
        assert.equal(result.price, 14.50);
        assert.equal(typeof result.price, 'number');
    });

    test('converts quantity string to integer', () => {
        const result = sanitizeProduct({ name: 'X', price: 1, quantity: '7' });
        assert.equal(result.quantity, 7);
        assert.equal(typeof result.quantity, 'number');
    });

    test('defaults quantity to 0 when undefined', () => {
        const result = sanitizeProduct({ name: 'X', price: 1 });
        assert.equal(result.quantity, 0);
    });
});
