let dataStorage = JSON.parse(localStorage.getItem('products'));
console.log(dataStorage);

let cartItems = document.getElementById('cart__items');

for (let i = 0; i < dataStorage.length; i++) {

  cartItems.innerHTML +=
    `<article class="cart__item" data-id="${dataStorage[i]._id}" data-color="${dataStorage[i].couleur}">
<div class="cart__item__img">
  <img src="${dataStorage[i].imageUrl}" alt="${dataStorage[i].altTxt}">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>${dataStorage[i].name}</h2>
    <p>${dataStorage[i].couleur}</p>
    <p>${dataStorage[i].price}</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${dataStorage[i].quantite}">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem">Supprimer</p>
    </div>
  </div>
</div>
</article>`
}

// On déclare la fonction quantité

function quantity() {

  const total = [];

  // Récupérer la quantité de chaque éléments

  for (let i = 0; i < dataStorage.length; i++) {
    let quantityTotal = parseInt(dataStorage[i].quantite);

    // parseINT transforme une variable en int pour pouvoir effectuer des calculs

    // Ajouter les quantités de chaque éléments dans la variable total qui contient un tableau vide

    total.push(quantityTotal)
  }

  // On additionne toutes les quantités qu'il y'a dans le tableau [total]

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  let resTotal = total.reduce(reducer, 0);

  // Afficher les quantités total pour l'utilisateur

  let totalQuantity = document.getElementById('totalQuantity');
  totalQuantity.innerHTML = resTotal

}

quantity();

// On déclare la fonction prix

function price() {

  const total = [];
  quantity();

  // Récupérer les prix du panier

  for (let i = 0; i < dataStorage.length; i++) {
    let prixTotal = dataStorage[i].price * parseInt(dataStorage[i].quantite);

    // Ajouter les prix du panier dans la variable total qui contient un tableau vide

    total.push(prixTotal)
  }

  // On additionne tous les prix qu'il y'a dans le tableau [total]

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const resTotal = total.reduce(reducer, 0);

  // Afficher le résultat total pour l'utilisateur

  let totalPrice = document.getElementById('totalPrice');
  totalPrice.innerHTML = resTotal

}

price();

// On supprime un produit sélectionné par l'utilisateur via le bouton 'supprimer'

let deleteItem = document.querySelectorAll('.deleteItem');
console.log(deleteItem)

for (let i = 0; i < deleteItem.length; i++) {
  deleteItem[i].addEventListener('click', function () {

    dataStorage = dataStorage.filter((el) => el._id != dataStorage[i]._id || el.couleur != dataStorage[i].couleur)
    localStorage.setItem('products', JSON.stringify(dataStorage))
    location.reload()
  })
}

// Formulaire de commande

// On récupère l'ID du bouton submit "commander"

const order = document.getElementById('order');

// On écoute le clique du bouton submit "commander"

order.addEventListener('click', function (e) {
  e.preventDefault()

  // Contrôle validation formulaire

  const alertForm = function alerteForm(value) {
    return `Le champ ${value} n'est pas valide. Les caractères spéciaux ne sont pas autorisés \n Le nombre de caractère doit se situer entre 3 et 20.`
  }

  const regExPrenomNomVille = function regEx(value) {
    return /^[A-Za-zéèà-]{3,20}$/.test(value)
  }

  const regExAddress = function regEx(value) {
    return /^[A-Za-zéèçà0-9\s]{5,70}$/.test(value)
  }

  const regExEmail = function regEx(value) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
  }

  function firstNameControl() {
    const firstName = contact.firstName
    if (regExPrenomNomVille(firstName)) {
      return true;
    } else {
      alert(alertForm('Prenom'))
      return false;
    }
  }

  function lastNameControl() {
    const lastName = contact.lastName
    if (regExPrenomNomVille(lastName)) {
      return true;
    } else {
      alert(alertForm('Nom'))
      return false;
    }
  }

  function cityControl() {
    const city = contact.city
    if (regExPrenomNomVille(city)) {
      return true;
    } else {
      alert(alertForm('Ville'))
      return false;
    }
  }

  function emailControl() {
    const email = contact.email
    if (regExEmail(email)) {
      return true;
    } else {
      alert(`L'adresse email n'est pas valide.`)
      return false;
    }
  }

  function addressControl() {
    const address = contact.address
    if (regExAddress(address)) {
      return true;
    } else {
      alert(`L'adresse n'est pas valide. Elle ne doit contenir que des lettres et des chiffres, sans ponctuation.`)
      return false;
    }
  }

  // On envoie l'objet "contact" dans le localStorage si tous les champs sont correctement remplis

  const contact = {
    firstName: document.querySelector('#firstName').value,
    lastName: document.querySelector('#lastName').value,
    address: document.querySelector('#address').value,
    city: document.querySelector('#city').value,
    email: document.querySelector('#email').value
  }

  if (firstNameControl() && lastNameControl() && cityControl() && emailControl() && addressControl()) {
    localStorage.setItem('contact', JSON.stringify(contact))

  } else {
    alert('Veuillez remplir correctement tous les champs du formulaire')
  }

  // On fait un tableau vide où on enverra nos ID produits

  let products = []

  // On pousse nos ID dans notre tableau products

  dataStorage.forEach((element) => {
    products.push(element._id)
  });

  // Envoie de l'objet orderReady vers le serveur

  fetch(`http://localhost:3000/api/products/order`, {
    method: 'POST',
    body: JSON.stringify({ contact, products }),
    headers: {
      "Content-Type": "application/json"
    },
  })

    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (response) {
      window.location.href = 'confirmation.html?order.Id=' + response.orderId
      console.log(response)
    })
    .catch(function (err) {
      alert('Une erreur est survenue')
      console.log(err);
    });
})