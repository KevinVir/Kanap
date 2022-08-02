// Récupération de l'ID de chaque produit grâce à la méthode URLSearchParams

const url_id = window.location.search;
const params = new URLSearchParams(url_id);
const id = params.get('id');

// Récupération des éléments du HTML pour pouvoir les relier aux produits (titre, prix etc...)

let title = document.getElementById('title');
let price = document.getElementById('price');
let description = document.getElementById('description');
let itemsImg = document.querySelector('.item__img');
let colorSelect = document.getElementById('colors');
let addCart = document.getElementById('addToCart');

// Appel de l'API avec fetch suivi de l'id du produit cliqué

fetch(`http://localhost:3000/api/products/`)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })

    .then(function (data) {

        // On parcours une boucle qui va envoyer les bonnes données associées au produit sélectionné

        for (element of data) {
            if (element._id === id) {
                const productImg = document.createElement('img');
                productImg.setAttribute('src', element.imageUrl);
                productImg.setAttribute('alt', element.altTxt);
                itemsImg.appendChild(productImg);

                title.textContent = element.name;
                description.textContent = element.description;
                price.textContent = element.price;

                // On parcours une boucle for pour faire une liste déroulante des couleurs disponibles sur le produit

                for (let color of element.colors) {
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

// On va ensuite chercher ce qu'il y'a dans le localStorage

const dataStorage = JSON.parse(localStorage.getItem('products'))

let addProducts = [
    {
        idProduit: " ",
        colorProduit: " ",
        quantityProduit: 0,
    },
];


// On écoute le clique du bouton "Commander" pour envoyer les infos dans le localStorage

addCart.addEventListener('click', function () {

    let quantity = Number(document.getElementById('quantity').value);
    let color = colorSelect.value;
    let idSelect = id;

    // Si la quantité est supérieur à 0 et qu'elle est inférieur à 100 et que la valeur de la couleur est différent de " "

    if (quantity > 0 && quantity <= 100 && colorSelect.value != "") {
        if (dataStorage) {

            //On vérifie si le panier est vide

            if (dataStorage.length === 0) {
                console.log(
                    "La panier est vide donc on envoie directement le produit dans le panier"
                );

                //On envoie alors le produit sélectionné

                addProducts = [
                    {
                        idProduit: idSelect,
                        colorProduit: color,
                        quantityProduit: quantity,
                    },
                ];

                // On met à jour le localStorage

                localStorage.setItem('products', JSON.stringify(addProducts));

            } else {

                // IL y a quelque chose dans le panier

                console.log(
                    "Il y a quelque chose dans le panier, on analyse si le produit est déjà existant"
                );

                // S'il y a un kanap avec même id et couleur on ajoute seulement

                let addQuantity = false;

                for (let i = 0; i < dataStorage.length; i++) {

                    //Initialisation de l'inspection id et couleur dans le storage

                    let sameId = dataStorage[i].idProduit;
                    let sameColor = dataStorage[i].colorProduit;

                    //Conditions pour rechercher

                    if (sameId === idSelect && sameColor === color) {

                        //On ajoute seulement la nouvelle quantité à celle déjà existante dans le storage

                        dataStorage[i].quantityProduit = Number(dataStorage[i].quantityProduit) + quantity;
                        addQuantity = true;

                        //On met à jour le panier

                        localStorage.setItem('products', JSON.stringify(dataStorage));

                    } else {
                        console.log(
                            "Le produit n'existe pas dans le panier, on l'insère"
                        );
                    }
                }
                if (addQuantity === false) {
                    dataStorage.push(
                        {
                            idProduit: idSelect,
                            colorProduit: color,
                            quantityProduit: quantity
                        }
                    );

                    localStorage.setItem('products', JSON.stringify(dataStorage));
                }
            }
        } else {

            //Création du storage car il n'existe pas

            console.log(
                "Le storage n'existe pas alors on pousse le produit directement"
            );

            addProducts = [
                {
                    idProduit: idSelect,
                    colorProduit: color,
                    quantityProduit: quantity,
                },
            ];

            localStorage.setItem('products', JSON.stringify(addProducts));
        }

        alert("Le produit a été ajouté au panier");

        // Si une mauvaise quantité et/ou une couleur n'est pas sélectionné

    } else {
           alert("Veuillez sélectionner une quantité comprise entre 1 et 100 et/ou une couleur");
    }
})