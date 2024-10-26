const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');

function displayCartItems() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cartItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <h2>${item.name}</h2>
            <p><strong>Цена:</strong> ${item.price} руб.</p>
            <button onclick="removeFromCart(${index})">Удалить</button>
        `;
        cartItemsContainer.appendChild(itemElement);
        total += item.price;
    });

    totalPriceElement.textContent = `${total} руб.`;
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCartItems();
}

function checkout() {
    alert('Ваш заказ оформлен!');
    localStorage.removeItem('cart');
    displayCartItems();
}

displayCartItems();
