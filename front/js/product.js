// Récupération de l'ID de chaque produit grâce à la méthode URLSearchParams

const url_id = window.location.search;
const params = new URLSearchParams(url_id);
const id = params.get('id');

// Récupération de l'API

let url = 'http://localhost:3000/api/products';

// Récupération des éléments du HTML pour pouvoir les relier aux produits (titre, prix etc...)

let title = document.getElementById('title');
let price = document.getElementById('price');
let description = document.getElementById('description');
let itemsImg = document.querySelector('.item__img');
let colorSelect = document.getElementById('colors');
let addCart = document.getElementById('addToCart');

// Appel de l'API avec fetch

fetch(url)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })

    .then(function (products) {
        console.log(products);

        // On parcours une boucle qui va envoyer les bonnes données associées au produit sélectionné

        for (let i = 0; i < products.length; i++) {
            if (products[i]._id === id) {

                // Si l'id du produit cliqué est strictement égal à l'id d'un produit trouver dans la promise "products" alors on affiche les infos

                const productImg = document.createElement('img');
                productImg.setAttribute('src', products[i].imageUrl);
                productImg.setAttribute('alt', products[i].altTxt);
                itemsImg.appendChild(productImg);

                title.textContent = products[i].name;
                description.textContent = products[i].description;
                price.textContent = products[i].price;

                // On parcours une boucle for pour faire une liste déroulante des couleurs disponibles sur le produit

                for (let color of products[i].colors) {
                    let colors = document.createElement('option');
                    colorSelect.appendChild(colors);
                    colors.value = color,
                        colors.innerHTML = color
                };

            }
        }
    })

    .catch(function (err) {
        alert('Une erreur est survenue')
        console.log(err);
    });

// On écoute le clique du bouton "Commander" pour envoyer les infos dans le localStorage

addCart.addEventListener('click', function () {

    // On va ensuite chercher ce qu'il y'a dans le localStorage

    var dataStorage = JSON.parse(localStorage.getItem('products'));
    console.log(dataStorage);
    // dataStorage.sort();


    let quantity = parseInt(document.getElementById('quantity').value);
    let color = colorSelect.value;
    let idSelect = id;

    let addProducts =
    {
        idProduit: idSelect,
        colorProduit: color,
        quantityProduit: quantity,
    };

    console.log(addProducts);

    // SI le localStorage est vide 

    if (dataStorage == null && quantity > 0 && quantity <= 100 && color != "") {

            dataStorage = [];
            dataStorage.push(addProducts);
            console.log(dataStorage);
            localStorage.setItem('products', JSON.stringify(dataStorage));
            alert('Le produit a bien été ajouter au panier');

        // SI il y'a quelque chose dans le localStorage

    } else if (dataStorage != null && addProducts.quantityProduit > 0 && addProducts.quantityProduit <= 100 && addProducts.colorProduit != "") {

        // On parcours une boucle pour savoir si l'id du produit et sa couleur correspondent à un produit déjà présent

        for (let i = 0; i < dataStorage.length; i++) {
            if (dataStorage[i].idProduit == addProducts.idProduit && dataStorage[i].colorProduit == addProducts.colorProduit) {

                // On transforme les valeurs strings en parseInt pour pouvoir les additionner
                let storageQuantity = parseInt(dataStorage[i].quantityProduit);
                let selectedItemQuantity = parseInt(addProducts.quantityProduit);
                let total = storageQuantity + selectedItemQuantity;

                return (
                    dataStorage[i].quantityProduit = total,

                    // On enregistre les modifications dans le localStorage

                    localStorage.setItem('products', JSON.stringify(dataStorage)),
                    alert('Le produit a bien été ajouté au panier.')
                );
            }
        };

        for (let j = 0; j < dataStorage.length; j++) {
            if (dataStorage[j].idProduit == addProducts.idProduit && dataStorage[j].colorProduit != addProducts.colorProduit || dataStorage[j].idProduit != addProducts.idProduit) {
                return (
                    dataStorage.push(addProducts),
                    localStorage.setItem('products', JSON.stringify(dataStorage)),
                    alert('Le produit a bien été ajouter au panier')
                );
            };
        };
    } else {
        alert('Veuillez choisir une quantité entre 1 et 100 et/ou une couleur')
    }
});

