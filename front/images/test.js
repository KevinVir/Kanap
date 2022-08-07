let quantity = Number(document.getElementById('quantity').value);
let color = colorSelect.value;
let idSelect = id;

addProducts = [
    {
        idProduit: idSelect,
        colorProduit: color,
        quantityProduit: quantity,
    },
];


// SI la quantité est SUPERIEUR à 0 ET la quantité est EGAL ou INFERIEUR à 100 ET la valeur de la couleur est DIFFERENT de "" alors
if (quantity > 0 && quantity <= 100 && colorSelect.value != "") {

    // SI il y'a quelque chose dans le localStorage

    if (dataStorage) {

        // On parcours une boucle pour savoir si l'id du produit et sa couleur correspondent à un produit déjà présent

        for (let i = 0; i < dataStorage.length; i++) {
            if (addProducts.idProduit === dataStorage[i].idProduit && addProducts.colorProduit === dataStorage[i].colorProduit) {

                // On incrémente donc la quantité de celui-ci sans ajouter de nouvelles lignes

                dataStorage[i].quantityProduit = dataStorage[i].quantityProduit + quantity

                // On enregistre les modifications dans le localStorage

                localStorage.setItem('products', JSON.stringify(dataStorage));
                alert('Le produit a bien été ajouté au panier');
            };
        };

        // Si la boucle n'a trouvé aucun ID et COULEUR correspondant à un produit déjà présent alors on ajoute simplement le produit sélectionné

        dataStorage.push(addProducts);

        // On enregistre les modifications dans le localStorage

        localStorage.setItem('products', JSON.stringify(dataStorage));
        alert('Le produit a bien été ajouté au panier');

    } else {

        dataStorage.push(addProducts);
        localStorage.setItem('products', JSON.stringify(dataStorage));
        alert('Le produit a bien été ajouté au panier');

    };

} else {

    // SINON si aucune couleur ou une mauvaise quantité a été sélectionné alors on envoie une alerte pour prévenir l'utilisateur

    alert('Veuillez choisir une quantité comprise entre 1 et 100 et/ou sélectionner une couleur')

};