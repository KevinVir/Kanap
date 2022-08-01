// Récupération de l'ID de chaque produit grâche à la méthode URLSearchParams

const url_id = window.location.search;
const params = new URLSearchParams(url_id);
const id = params.get('id');

let produitData = []

console.log(id);

// Récupération des éléments du HTML pour pouvoir les relier aux produits (titre, prix etc...)

let title = document.getElementById('title');
let price = document.getElementById('price');
let description = document.getElementById('description');
let itemsImg = document.querySelector('.item__img');
let colorSelect = document.getElementById('colors');

// Appel de l'API avec fetch suivi de l'id du produit cliqué

fetch(`http://localhost:3000/api/products/${id}`)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (value) {
        produitData = value
        console.log("produitData")
        console.log(produitData)

        // On ajoute les valeurs de produitData sur la page produit

        title.innerHTML = produitData.name,
            price.innerHTML = produitData.price,
            description.innerHTML = produitData.description,
            itemsImg.innerHTML = `<img src="${produitData.imageUrl}" alt="${produitData.altTxt}"></img>`;

        // On parcours avec une boucle la valeur des couleurs de chaque produit

        for (let color of produitData.colors) {
            let colors = document.createElement('option');
            colorSelect.appendChild(colors);
            colors.value = color,
                colors.innerHTML = color
        }

        // On crée une variable addCart qui écoutera l'évènement du clique sur le bouton "Ajouter au panier"

        let addCart = document.getElementById('addToCart');
        let quantity = document.getElementById('quantity');

        addCart.addEventListener('click', function () {

            if (quantity.value <= 0 || colorSelect.value == "") {
                alert('Veuillez ajouter une quantité ou sélectionner une couleur')

            } else {

                const addProducts = Object.assign({}, produitData, {
                    couleur: `${colorSelect.value}`,
                    quantite: `${quantity.value}`
                })

                console.log(addProducts);

                // Enregistrement des valeurs choisis par l'utilisateur dans le localStorage
                // On déclare la variable dans laquelle les éléments seront introduits dans le localStorage (avec key et value)

                let dataStorage = JSON.parse(localStorage.getItem('products'))
                console.log(dataStorage);

                // Si dataStorage est égal à null donc si il n'y a pas d'éléments enregistrés dans le localStorage alors :

                if (dataStorage == null) {
                    dataStorage = []
                    dataStorage.push(addProducts)
                    localStorage.setItem('products', JSON.stringify(dataStorage))

                    // Si on ajoute un produit avec le même id et la même couleur qu'il y'a déjà dans le panier, alors on incrémente celui-ci

                } else if (dataStorage != null) {
                    for (element in dataStorage){
                        if(dataStorage[element]._id == dataStorage._id && dataStorage[element].couleur == dataStorage.couleur){
                            dataStorage[element].quantite = dataStorage[element].quantite + addProducts.quantite

                            localStorage.setItem('products', JSON.stringify(dataStorage))
                            return element;
                        }
                    }

                }

                if (quantity.value == 1) {
                    alert('Le produit a bien été ajouté à votre panier')

                } else {
                    alert('Les produits ont bien été ajoutés à votre panier')
                }
            }
        })
    })

    .catch(function (err) {
        alert('Une erreur est survenue')
        console.log(err);
    });