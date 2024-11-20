const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Método para abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex";
});

// Método para fechar o modal quando clicar fora do modal
cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

// Função para fechar o modal ao clicar no botão fechar
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
});

// Função para adicionar produtos ao carrinho
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1, image });
    }
    updateCartModal();
}

// Função para atualizar o modal do carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 mr-3 rounded-2xl">
                    <div>
                        <p class="font-medium">${item.name}</p>
                        <p class="font-medium"> Qtd: ${item.quantity}</p>
                        <p class="font-medium text-gray-900 mt-2">${item.price.toFixed(2)} kz</p>
                    </div>
                </div>
                <button><i class="remove-from-cart-btn text-lg fa fa-times text-red-500 px-2" data-name="${item.name}"></i></button>
            </div>
        `;
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("en-US", { style: "currency", currency: "USD" });
    cartCounter.textContent = cart.length;
}

// Função de pegar o nome e preço dos produtos
menu.addEventListener("click", function(event) {
    const parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        const image = parentButton.getAttribute("data-image"); // Captura a imagem
        addToCart(name, price, image); // Passa a imagem para a função
    }
});

// Função para remover o produto do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

// Função para remover item do carrinho
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

// Função para validar o endereço
addressInput.addEventListener("input", function(event) {
    const inputValue = event.target.value;
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});


//Produtos destacados gerados dinamicamente
const slider_produtos = [
    { nome: "Hambúrguer Smash", img: "assets/hamb-1.png", descricao: "Mate a fome com o Smash!", preco: "1000" },
    { nome: "Hambúrguer Duplo", img: "assets/hamb-3.png", descricao: "Mate a gula com o Duplo!", preco: "1000" },
    { nome: "Hambúrguer da Casa", img: "assets/hamb-7.png", descricao: "Triplique o sabor com o da Casa!", preco: "1000" },
    { nome: "Hambúrguer Salad", img: "assets/hamb-6.png", descricao: "Sinta no seu paladar o Especial!", preco: "1000" },
    { nome: "Hambúrguer Triplo", img: "assets/hamb-2.png", descricao: "Mate a fome com o Triplo!", preco: "1000" }
];

slider_produtos.forEach(produto => {
    document.querySelector('.swiper-wrapper').innerHTML += `
        <div class="swiper-slide flex flex-col items-center bg-white justify-center rounded-lg min-[320px]:p-4 drop-shadow-sm">
            <div class="object-cover rounded-lg">
                <img src="${produto.img}" alt="${produto.nome}" class="max-w-full md:w-96   h-auto rounded-2xl">
            </div>
            <div class="text-content mt-2 flex flex-col items-center">
                <h4 class="text-xl  font-bold">${produto.nome}</h4>
                <h2 class="text-lg text-center text-gray-500"><span>${produto.descricao}</span></h2>
            </div>
        </div>`;
});



const swiper =  new Swiper('.swiper-container', {

    slidesPerView: 1,
    spaceBetween: 10,    
    autoHeight: false,
    centeredSlides: true,
    loop:true,
    
    // Se precisarmos de setas de navegação
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    /*autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },*/
    breakpoints: {
        481: {
            slidesPerView: 2,
            slidesPerGroup: 1,
            centeredSlides: false,
        },
        640: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            centeredSlides: false,
            
        },
        992: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            centeredSlides: false,
        },
    },
});



/*const swiper = new Swiper('.swiper-container', {
    // Paramentos opcionais
    loop: true,
    autoHeight: true,
    autoWidth: true,

    // se precisarmos de paginação
    pagination: {
        el: '.swiper-pagination',
    },
});
*/


// Função para finalizar pedido dos produtos
checkoutBtn.addEventListener("click", function() {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }
    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    // Enviar o pedido para a API do WhatsApp
    const cartItems = cart.map(item => `${item.name}, Quantidade: (${item.quantity}) Preço: ${item.price}kz |`).join("");
    const message = encodeURIComponent(cartItems);
    const phone = "+244922987493";
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

    cart = [];
    updateCartModal();
});

// Verificar a hora e manipular o card horário
function checkRestaurantOpen() {
    const hora = new Date().getHours();
    return hora >= 8 && hora < 21; // true = restaurante está aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();
spanItem.classList.toggle("bg-green-600", isOpen);
spanItem.classList.toggle("bg-red-600", !isOpen);
