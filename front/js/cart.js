let dataStorage = JSON.parse(localStorage.getItem('products'));
console.log(dataStorage);


if (dataStorage) {
  for (let element of dataStorage) {
    let item = {
      idProduit: element.idProduit,
      colorProduit: element.colorProduit,
      quantityProduit: element.quantityProduit
    }
    console.log(item);

    fetch(`http://localhost:3000/api/products/` + item.idProduit)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })

      .then(function (element) {
        element = element

        let cartItems = document.getElementById('cart__items');

        // Création balise article

        let article = document.createElement('article');
        article.classList.add('cart__item');
        article.setAttribute('data-id', `${item.idProduit}`);
        article.setAttribute('data-color', `${item.colorProduit}`);
        cartItems.appendChild(article);

        // Création balise div avec img

        let divImg = document.createElement('div');
        divImg.classList.add('cart__item__img');
        article.appendChild(divImg);

        let imgDiv = document.createElement('img');
        imgDiv.setAttribute('src', `${element.imageUrl}`);
        imgDiv.setAttribute('alt', `${element.altTxt}`);
        divImg.appendChild(imgDiv);

        // Création balise div général

        let divContent = document.createElement('div');
        divContent.classList.add('cart__item__content');
        article.appendChild(divContent);

        // Création div contenant le nom, la couleur et le prix du produit

        let divInfo = document.createElement('div');
        divInfo.classList.add('cart__item__content__description');
        divContent.appendChild(divInfo);

        // Création balise h2 contenant le nom du produit

        let h2Name = document.createElement('h2');
        h2Name.textContent = element.name;
        divInfo.appendChild(h2Name);

        // Création de la balise p contenant la couleur du produit

        let colorP = document.createElement('p');
        colorP.textContent = item.colorProduit;
        divInfo.appendChild(colorP);

        // Création balise p contenant le prix du produit

        let priceP = document.createElement('p');
        priceP.textContent = element.price;
        divInfo.appendChild(priceP);

        // Création balise div englobant la quantité et le bouton delete

        let divSettings = document.createElement('div');
        divSettings.classList.add('cart__item__content__settings');
        divContent.appendChild(divSettings);

        // Création div quantité

        let divQuantity = document.createElement('div');
        divQuantity.classList.add('cart__item__content__settings__quantity');
        divSettings.appendChild(divQuantity);

        // Création balise p content la valeur de la quantité

        let quantityText = document.createElement('p');
        quantityText.textContent = `Qté :`;
        divQuantity.appendChild(quantityText);

        // Création de l'input contenant la quantité et le pouvoir de la modifier

        let inputQuantity = document.createElement('input');
        inputQuantity.classList.add('itemQuantity');
        inputQuantity.setAttribute('type', 'number');
        inputQuantity.setAttribute('name', 'itemQuantity');
        inputQuantity.setAttribute('min', '1');
        inputQuantity.setAttribute('max', '100');
        inputQuantity.setAttribute('value', item.quantityProduit);
        divQuantity.appendChild(inputQuantity);

        // Création balise div contenant l'élément du bouton delete

        let divDelete = document.createElement('div');
        divDelete.classList.add('cart__item__content__settings__delete');
        divSettings.appendChild(divDelete);

        // Création balise p du bouton delete

        let btnDelete = document.createElement('p');
        btnDelete.classList.add('deleteItem');
        btnDelete.textContent = `Supprimer`;
        divDelete.appendChild(btnDelete);

        //  On supprime un produit sélectionné par l'utilisateur via le bouton 'supprimer'

        let deleteItem = document.querySelectorAll('.deleteItem');
        console.log(deleteItem)

        for (let i = 0; i < deleteItem.length; i++) {
          deleteItem[i].addEventListener('click', function () {

            dataStorage = dataStorage.filter((el) => el.idProduit != dataStorage[i].idProduit || el.colorProduit != dataStorage[i].colorProduit)
            localStorage.setItem('products', JSON.stringify(dataStorage))
            location.reload()
            alert('Le produit a bien été supprimé')
          })
        }

        // On déclare la fonction quantité

        function quantity() {

          let total = 0;

          // Récupérer la quantité de chaque éléments

          for (let quantityData of dataStorage) {
            total += parseInt(quantityData.quantityProduit)
            console.log(total);
          }

          // Afficher les quantités total pour l'utilisateur

          let totalQuantity = document.getElementById('totalQuantity');
          totalQuantity.textContent = total

        };

        quantity();

        function price() {

          let total = [];

          let totalProductPrice = parseInt(item.quantityProduit) * parseInt(element.price);
          total.push(totalProductPrice);
          console.log("total");
          console.log(total);

          let totalPrice = document.getElementById('totalPrice');
          const reducer = (accumulator, currentValue) => accumulator + currentValue;
          const resTotal = total.reduce(reducer, 0);
          console.log("restotal");
          console.log(resTotal);
          totalPrice.innerHTML = resTotal;
        };

        price();

        inputQuantity.addEventListener('change', function () {

          //Selection de l'element à modifier en fonction de son id ET sa couleur

          let ModifValue = Number(inputQuantity.value);
          let idModif = item.idProduit;
          let colorModif = item.colorProduit;

          let cart =
            dataStorage.find((el) => el.idProduit === idModif) &&
            dataStorage.find((el) => el.colorProduit === colorModif);
          if (cart) {

            cart.quantityProduit = ModifValue;
            localStorage.setItem('products', JSON.stringify(dataStorage));

          } else {

            cart.push(element);
            localStorage.setItem('products', JSON.stringify(dataStorage));

          }

          location.reload();
        })

      })

      .catch(function (err) {
        alert('Une erreur est survenue')
        console.log(err);
      });
  }
}

// **********************************************************Formulaire de commande******************************************************************

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
    products.push(element.idProduit)
  });

  // Envoie de l'objet orderReady vers le serveur

  fetch(`http://localhost:3000/api/products/order`, {
    method: 'POST',
    body: JSON.stringify({ contact, products }),
    headers: {
      "Content-Type": "application/json"
    },
  })

    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })

    .then(function (response) {
      window.location.href = `confirmation.html?order.Id=` + response.orderId
      console.log(response)
    })

    .catch(function (err) {
      alert('Une erreur est survenue')
      console.log(err);
    });
})