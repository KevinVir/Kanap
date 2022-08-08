// On récupère le localStorage

let dataStorage = JSON.parse(localStorage.getItem('products'));
console.log(dataStorage);


if (dataStorage) {
  for (let element of dataStorage) {

    let item = {
      idProduit: element.idProduit,
      colorProduit: element.colorProduit,
      quantityProduit: element.quantityProduit
    };

    console.log(item);

    fetch(`http://localhost:3000/api/products/` + item.idProduit)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })

      .then(function (element) {

        let itemS = {
          priceProduit: element.price
        }

        //**********************************************************************CREATION DANS LE HTML**************************************************************************

        let cartItems = document.getElementById('cart__items');

        // Création balise article

        var article = document.createElement('article');
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
        priceP.textContent = element.price + `€`;
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

        //****************************************************************************FIN DE LA CREATION DU HTML*************************************************************/

        //****************************************************************************AJOUT DU BOUTON SUPPRIMER*************************************************************/

        // On écoute le click du bouton supprimer

        btnDelete.addEventListener('click', function () {

          // Utilisation de la méthode filter

          dataStorage = dataStorage.filter((el) => el.idProduit !== item.idProduit || el.colorProduit !== item.colorProduit);

          // On enregistre les modifications dans le localStorage

          localStorage.setItem('products', JSON.stringify(dataStorage));

          // Si le localStorage se retrouve à 0 produit ou est égal à null alors on nettoie le localStorage pour éviter de se retrouver avec tableau vide

          if (dataStorage == 0 || dataStorage == null) {
            localStorage.clear();
          }

          // le produit a bien été supprimé

          location.reload();
          alert('Le produit a bien été supprimé');
        });

        //***********************************************************************FIN DE L'AJOUT DU BTN SUPPRIMER**************************************************************/

        //**********************************************************************MODIFICATIONS DES QUANTITES*******************************************************************/

        // On écoute le change effectué sur le input quantity

        inputQuantity.addEventListener('change', function () {

          let modifValue =

            // On utilise la méthode find qui nous renvoie la valeur du premier élément trouvé dans le localStorage

            dataStorage.find((el) => el.idProduit === item.idProduit) &&
            dataStorage.find((el) => el.colorProduit === item.colorProduit);

          // Si modifValue est trouvé, alors on applique le changement de quantité à l'élément qui a été change

          if (modifValue) {

            // Si le changement de quantité est supérieur ou égal à 1 alors on applique les modifications

            if (inputQuantity.value >= 1) {

              modifValue.quantityProduit = inputQuantity.value;

              // On enregistre les modifications de le localStorage

              localStorage.setItem('products', JSON.stringify(dataStorage));

            } else {

              // Si le changement de quantité est inférieur à 1 alors il ne se passe rien et on reste à la valeur initial avant le change

            };
          }

          location.reload();
        });

        //**********************************************************************FIN MODIFICATIONS DES QUANTITES*****************************************************************/

        //**********************************************************************QUANTITE ET PRIX TOTAL***************************************************************************/
        // On déclare la fonction quantité et prix

        function quantityAndPrice() {

          let totalQuantity = 0;

          // Récupérer la quantité de chaque éléments dans le localStorage

          for (let i = 0; i < dataStorage.length; i++) {
            totalQuantity += parseInt(dataStorage[i].quantityProduit)
          }

          // Afficher les quantités total pour l'utilisateur

          let totalQuantityDisplay = document.getElementById('totalQuantity');
          totalQuantityDisplay.textContent = totalQuantity

          // Création du prix total du panier

          // On récupère toutes les balises articles présents dans la page panier

          let article = document.querySelectorAll('.cart__item');

          // On crée une variable à 0 pour pouvoir lui injecter par la suite des nombres

          let totalPrix = 0;

          // On récupère l'id totalPrice qui contiendra le prix total du panier

          let totalPrice = document.getElementById('totalPrice');

          // On parcours une boucle des articles présent sur la page panier

          for (let i = 0; i < article.length; i++) {

            // On récupère le prix des articles ainsi que leurs quantités

            let prix = document.querySelectorAll('.cart__item__content__description :nth-child(3)');
            let qtt = document.querySelectorAll('.itemQuantity');

            // On ajoute dans la variable totalPrix qui était à 0 la multiplication des prix par leurs quantités

            totalPrix += parseInt(prix[i].textContent) * qtt[i].value
          };

          // On affiche le résultat pour l'utilisateur

          totalPrice.textContent = totalPrix;
        };

        quantityAndPrice();

        //**********************************************************************FIN QUANTITE ET PRIX TOTAL*************************************************************************/

      })

      .catch(function (err) {
        alert('Une erreur est survenue')
        console.log(err);
      });
  }
}

//**************************************************************************FORMULAIRE DE COMMANDE*******************************************************************************/

// On récupère nos inputs du formulaire

const prenom = document.querySelector('#firstName');
const nom = document.querySelector('#lastName');
const adresse = document.querySelector('#address');
const ville = document.querySelector('#city');
const mail = document.querySelector('#email');

let valuePrenom, valueNom, valueAdresse, valueVille, valueMail;

prenom.addEventListener('input', function (e) {
  valuePrenom;

  if (e.target.value.length == 0) {
    console.log('rien');
    document.getElementById('firstNameErrorMsg').textContent = ``
    valuePrenom = null;

  } else if (e.target.value.length < 3 || e.target.value.length > 20) {

    document.getElementById('firstNameErrorMsg').textContent = `Le champ Prénom n'est pas valide`;
    valuePrenom = null;
    console.log('trop court ou trop long');

  } if (e.target.value.match(/^[A-Za-zéè]{3,20}$/)) {
    document.getElementById('firstNameErrorMsg').textContent = ``
    valuePrenom = e.target.value;
    console.log('success');
    console.log(valuePrenom);

  } if (!e.target.value.match(/^[A-Za-zéè]{3,20}$/) && e.target.value.length > 3 && e.target.value.length < 25) {
    document.getElementById('firstNameErrorMsg').textContent = `Le champ Prénom ne peut pas contenir de caractères spéciaux`;
    valuePrenom = null;
  }
});

nom.addEventListener('input', function (e) {
  valueNom;

  if (e.target.value.length == 0) {
    console.log('rien');
    document.getElementById('lastNameErrorMsg').textContent = ``
    valueNom = null;

  } else if (e.target.value.length < 3 || e.target.value.length > 20) {

    document.getElementById('lastNameErrorMsg').textContent = `Le champ Nom n'est pas valide`;
    valueNom = null;
    console.log('trop court ou trop long');

  } if (e.target.value.match(/^[A-Za-zéè]{3,20}$/)) {
    document.getElementById('lastNameErrorMsg').textContent = ``
    valueNom = e.target.value;
    console.log('success');
    console.log(valueNom);

  } if (!e.target.value.match(/^[A-Za-zéè]{3,20}$/) && e.target.value.length > 3 && e.target.value.length < 25) {
    document.getElementById('lastNameErrorMsg').textContent = `Le champ Nom ne peut pas contenir de caractères spéciaux`;
    valueNom = null;
  }
});

adresse.addEventListener('input', function (e) {
  valueAdresse;

  if (e.target.value.length == 0) {
    console.log('rien');
    document.getElementById('addressErrorMsg').textContent = ``
    valueAdresse = null;

  } else if (e.target.value.length < 5 || e.target.value.length > 50) {

    document.getElementById('addressErrorMsg').textContent = `Le champ Adresse n'est pas valide`;
    valueAdresse = null;
    console.log('trop court ou trop long');

  } if (e.target.value.match(/^[A-Za-zéèàç0-9\s]{5,50}$/)) {
    document.getElementById('addressErrorMsg').textContent = ``
    valueAdresse = e.target.value;
    console.log('success');
    console.log(valueAdresse);

  };
});

ville.addEventListener('input', function (e) {
  valueVille;

  if (e.target.value.length == 0) {
    console.log('rien');
    document.getElementById('cityErrorMsg').textContent = ``
    valueVille = null;

  } else if (e.target.value.length < 3 || e.target.value.length > 20) {

    document.getElementById('cityErrorMsg').textContent = `Le champ ville n'est pas valide`;
    valueVille = null;
    console.log('trop court ou trop long');

  } if (e.target.value.match(/^[A-Za-zéèà\-]{3,20}$/)) {
    document.getElementById('cityErrorMsg').textContent = ``
    valueVille = e.target.value;
    console.log('success');
    console.log(valueVille);
  }
});

mail.addEventListener('input', function (e) {
  valueMail;

  if (e.target.value.length == 0) {
    console.log('rien');
    document.getElementById('emailErrorMsg').textContent = ``
    valueMail = null;

  } else if (e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {

    document.getElementById('emailErrorMsg').textContent = ``;
    valueMail = e.target.value;

  } if (!e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) && e.target.value.length !== 0) {
    document.getElementById('emailErrorMsg').textContent = `Le champ Email n'est pas valide. Ex d'email : openclassrooms@hotmail.com`;
    valueMail = null;
  }
});

// On récupère l'ID du bouton submit "commander"

const order = document.getElementById('order');

// On écoute le clique du bouton submit "commander"

order.addEventListener('click', function (e) {
  e.preventDefault()

  const contact = {
    firstName: valuePrenom,
    lastName: valueNom,
    address: valueAdresse,
    city: valueVille,
    email: valueMail
  };

  console.log(contact);

  if (valuePrenom && valueNom && valueAdresse && valueVille && valueMail) {
    localStorage.setItem('contact', JSON.stringify(contact))

  } else {

    alert(`Une erreur s'est produite. Veuillez réessayer.`)

  }

  // On fait un tableau vide où on enverra nos ID produits

  let products = []

  // On pousse nos ID dans notre tableau products

  for (let i = 0; i < dataStorage.length; i++) {
    products.push(dataStorage[i].idProduit)
  };

  // Envoie de contact et products vers le serveur

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