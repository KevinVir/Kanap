// Récupération de l'url 

const url = window.location.search;
const params = new URLSearchParams(url);

// Récupération de l'order ID dans l'URL

const order = params.get('order.Id');

// Récupération de l'ID "orderId" de la classe "confirmation" pour afficher le numéro de commande sur la page confirmation

const finalOrder = document.getElementById('orderId')
finalOrder.innerText = order

// On supprime toutes les données du localStorage puisque la commande est passée

localStorage.clear();