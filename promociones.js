// --- BASE DE DATOS DE PRODUCTOS ---
// Extraje todos los productos de tus archivos HTML
const products = [
    // Básicos
    { name: "Musculosa Lisboa", price: 25990 },
    { name: "Musculosa Mónaco", price: 23990 },
    { name: "Camiseta Oslo", price: 28990 },
    { name: "Sueter Helsiniki", price: 48990 },
    // Camisas
    { name: "Camisa Estambul", price: 35990 },
    { name: "Camisa Santorini", price: 30990 },
    { name: "Camisa Edimburgo", price: 28990 },
    { name: "Camisa Granada", price: 38990 },
    { name: "Camisa Copenhague", price: 33990 },
    // Denim
    { name: "Jean Los Ángeles", price: 65990 },
    { name: "Jean Tokio", price: 60990 },
    { name: "Mono Paris", price: 88990 },
    { name: "Pollera Chicago", price: 58990 },
    { name: "Pollera Berlin", price: 64990 },
    { name: "Campera de Jean Londres", price: 78990 }
];

// --- FUNCIONES GENERALES ---

// Función para formatear a moneda
const formatMoney = (value) => `$ ${new Intl.NumberFormat('es-AR').format(value)}`;

// Función para llenar un menú <select> con productos
function populateSelect(selectElement) {
    products.forEach(product => {
        const option = document.createElement('option');
        // Guardamos el precio en 'value' y el nombre en el texto visible
        option.value = product.price;
        option.textContent = `${product.name} - ${formatMoney(product.price)}`;
        option.dataset.name = product.name; // Guardamos el nombre por separado
        selectElement.appendChild(option);
    });
}

// --- LÓGICA PARA CADA PROMOCIÓN ---

// Promo 1: 50% OFF en el segundo
const promo1Prod1 = document.getElementById('promo1-prod1');
const promo1Prod2 = document.getElementById('promo1-prod2');
const calcPromo1Btn = document.getElementById('calc-promo1');

populateSelect(promo1Prod1);
populateSelect(promo1Prod2);

calcPromo1Btn.addEventListener('click', () => {
    const price1 = parseFloat(promo1Prod1.value);
    const price2 = parseFloat(promo1Prod2.value);
    const resultDiv = document.getElementById('result-promo1');

    const subtotal = price1 + price2;
    const discount = Math.min(price1, price2) * 0.50;
    const total = subtotal - discount;

    resultDiv.innerHTML = `
        <p><strong>Subtotal:</strong> ${formatMoney(subtotal)}</p>
        <p><strong>Descuento (50% en el 2do):</strong> -${formatMoney(discount)}</p>
        <p class="final-price"><strong>Total a Pagar:</strong> ${formatMoney(total)}</p>
    `;
});

// Promo 2: 3x2
const promo2Select = document.getElementById('promo2-select');
let promo2Items = []; // Array para guardar los productos de la lista

populateSelect(promo2Select);

document.getElementById('add-promo2').addEventListener('click', () => {
    const selectedOption = promo2Select.options[promo2Select.selectedIndex];
    const name = selectedOption.dataset.name;
    const price = parseFloat(selectedOption.value);
    
    promo2Items.push({ name, price });
    updateItemsList('promo2-selected-items', promo2Items);
});

document.getElementById('clear-promo2').addEventListener('click', () => {
    promo2Items = [];
    updateItemsList('promo2-selected-items', promo2Items);
    document.getElementById('result-promo2').innerHTML = '';
});

document.getElementById('calc-promo2').addEventListener('click', () => {
    const resultDiv = document.getElementById('result-promo2');
    if (promo2Items.length < 3) {
        alert('Necesitás agregar al menos 3 productos para la promo 3x2.');
        return;
    }

    // Ordenamos los productos de más barato a más caro
    promo2Items.sort((a, b) => a.price - b.price);
    
    const freeItemsCount = Math.floor(promo2Items.length / 3);
    let discount = 0;
    for (let i = 0; i < freeItemsCount; i++) {
        discount += promo2Items[i].price; // El descuento es la suma de los más baratos
    }
    
    const subtotal = promo2Items.reduce((sum, item) => sum + item.price, 0);
    const total = subtotal - discount;

    resultDiv.innerHTML = `
        <p><strong>Subtotal:</strong> ${formatMoney(subtotal)}</p>
        <p><strong>Descuento (te llevás ${freeItemsCount} gratis):</strong> -${formatMoney(discount)}</p>
        <p class="final-price"><strong>Total a Pagar:</strong> ${formatMoney(total)}</p>
    `;
});

// Promo 3: 10% OFF en compras > $100.000
const promo3Select = document.getElementById('promo3-select');
let promo3Items = []; // Array para la lista de esta promo

populateSelect(promo3Select);

document.getElementById('add-promo3').addEventListener('click', () => {
    const selectedOption = promo3Select.options[promo3Select.selectedIndex];
    const name = selectedOption.dataset.name;
    const price = parseFloat(selectedOption.value);

    promo3Items.push({ name, price });
    updateItemsList('promo3-selected-items', promo3Items);
});

document.getElementById('clear-promo3').addEventListener('click', () => {
    promo3Items = [];
    updateItemsList('promo3-selected-items', promo3Items);
    document.getElementById('result-promo3').innerHTML = '';
});

document.getElementById('calc-promo3').addEventListener('click', () => {
    const resultDiv = document.getElementById('result-promo3');
    const minPurchase = 100000;
    
    const subtotal = promo3Items.reduce((sum, item) => sum + item.price, 0);
    let discount = 0;

    if (subtotal > minPurchase) {
        discount = subtotal * 0.10;
    } else {
        alert(`Tu compra de ${formatMoney(subtotal)} no supera los ${formatMoney(minPurchase)} para aplicar el descuento.`);
    }
    
    const total = subtotal - discount;

    resultDiv.innerHTML = `
        <p><strong>Subtotal:</strong> ${formatMoney(subtotal)}</p>
        <p><strong>Descuento (10% OFF):</strong> -${formatMoney(discount)}</p>
        <p class="final-price"><strong>Total a Pagar:</strong> ${formatMoney(total)}</p>
    `;
});


// Función para mostrar la lista de productos agregados en la interfaz
function updateItemsList(elementId, items) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = '<h4>Productos en la lista:</h4>'; // Limpia y resetea el título
    if (items.length === 0) {
        listElement.innerHTML += '<p>Todavía no agregaste productos.</p>';
    } else {
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'selected-item';
            itemDiv.textContent = `${item.name} - ${formatMoney(item.price)}`;
            listElement.appendChild(itemDiv);
        });
    }
}