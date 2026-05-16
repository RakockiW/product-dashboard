const API_URL = '/api/stats'

async function loadStats () {
    const res = await fetch(API_URL);
    const data = await res.json();
    
    const stats = data.stats;
    let html= `<h1> Product quantity: ${stats.products_count}</h1>`;
    html += `<h2> Average price: ${stats.avg_price}</h2>`;
    html += `<h3> Backend instance ID: ${data.instance}</h3>`;

    document.getElementById('stats').innerHTML = html;
}

window.onload = loadStats;