// Récupération de l'ID items où les produits de l'API vont être injectés
let items = document.querySelector('#items');

// Récupération de l'API
let url = "http://localhost:3000/api/products";

// Appel de l'API grâche à fetch
fetch(url)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (products) {
        for (let i = 0; i < products.length; i++) {
            
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
    .catch(function (err) {
        alert('Une erreur est survenue')
        console.log(err);
    });