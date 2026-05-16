function validateProduct({ name, price, quantity } = {}) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return { valid: false, error: 'name is required and must be a non-empty string' };
    }

    if (price === null || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
        return { valid: false, error: 'price is required and must be a non-negative number' };
    }

    if (quantity !== undefined && quantity !== null) {
        const qty = parseInt(quantity, 10);
        if (isNaN(qty) || qty < 0) {
            return { valid: false, error: 'quantity must be a non-negative integer' };
        }
    }

    return { valid: true, error: null };
}

function sanitizeProduct({ name, price, quantity } = {}) {
    return {
        name:     String(name).trim(),
        price:    parseFloat(price),
        quantity: parseInt(quantity, 10) || 0,
    };
}

module.exports = { validateProduct, sanitizeProduct };
