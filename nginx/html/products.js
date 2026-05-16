const API_URL = '/api/items'

async function loadProducts () {
    const res = await fetch(API_URL);
    const data = await res.json();
    
    const products = data.products;
    let html= '<table>';
    html += '<tr><th>ID</th><th>Name</th><th>Price</th><th>Quantity</th></tr>';

    products.forEach(p => {
        html += `<tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.quantity}</td>
            </tr>`;
    });

    html += '</table>';
    document.getElementById('product-list').innerHTML = html;
}

async function addProduct() {

    const name = document.getElementById('name').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity, price })
    });

    if (res.ok) {
        document.getElementById('product-form').reset();
        loadProducts();
    }
}

document.getElementById('product-form')
    .addEventListener('submit', (e) => {
        e.preventDefault();
        addProduct();
    });

window.onload = loadProducts;