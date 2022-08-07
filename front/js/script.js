// Récupération de l'ID items où les produits de l'API vont être injectés
let items = document.querySelector('#items');

// Récupération de l'API
let url = 'http://localhost:3000/api/products';

// Appel de l'API grâche à fetch
fetch(url)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (products) {

        // On parcours une boucle des éléments rendus par la promise pour afficher les produits

        for (let i = 0; i < products.length; i++) {

            // Dans cette boucle on crée les éléments HTML qui vont nous permettre d'afficher nos produits autant qu'il y'en a dans la promise "products"

            const productA = document.createElement('a');
            productA.setAttribute('href', `product.html?id=${products[i]._id}`);
            items.appendChild(productA);

            const productArticle = document.createElement('article');
            productA.appendChild(productArticle);

            const productImg = document.createElement('img');
            productImg.setAttribute('src', products[i].imageUrl);
            productImg.setAttribute('alt', products[i].alxTxt);
            productArticle.appendChild(productImg);

            const productName = document.createElement('h3');
            productName.classList.add('productName');
            productName.textContent = products[i].name;
            productArticle.appendChild(productName);

            const productDescription = document.createElement('p');
            productDescription.classList.add('productDescription');
            productDescription.textContent = products[i].description;
            productArticle.appendChild(productDescription);
        };
    })

    // Si une erreur survient catch nous renvoie celle-ci

    .catch(function (err) {
        alert('Une erreur est survenue')
        console.log(err);
    });