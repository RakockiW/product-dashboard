'use strict';

function calculateAvgPrice(products) {
    if (!Array.isArray(products) || products.length === 0) return 0;
    const total = products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);
    return parseFloat((total / products.length).toFixed(2));
}

function calculateTotalValue(products) {
    if (!Array.isArray(products) || products.length === 0) return 0;
    const total = products.reduce(
        (sum, p) => sum + parseFloat(p.price || 0) * parseInt(p.quantity || 0, 10),
        0
    );
    return parseFloat(total.toFixed(2));
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function calculateTotalQuantity(products) {
    if (!Array.isArray(products) || products.length === 0) return 0;
    return products.reduce((sum, p) => sum + parseInt(p.quantity || 0, 10), 0);
}

module.exports = { calculateAvgPrice, calculateTotalValue, subtract, calculateTotalQuantity };
