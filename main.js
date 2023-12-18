class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

class Product {
  constructor(name, price, id) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}
// TODO: MOSTRAR CATALOGO DE MOTOS, que se puedan ver mas detalles y
// guardar un historial de las motos que se vieron
//  axios
//   .get("https://api.api-ninjas.com/v1/motorcycles?make=kawasaki", {
//     headers:{
//       'X-Api-Key': 'IzwfWFD1SouJpi4lrXhAEw==OqY2Z6Ysd2p5F7Ip'
//     }
//   })
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

const authUsers = ["user", "test", "admin", "developer"];
const authPasswords = ["user1234", "test90921", "admin22884", "developer0011"];
const usersList = generateAuthUserList(authUsers, authPasswords);
const productList = ["celular", "televisor", "tablet", "laptop", "heladera"];
const prices = [300000, 250000, 400000, 600000, 400000];
const productsList = generateProductList(productList, prices);

let loggedUsername;
let loggedPassword;
let maxAttempts = 3;
let currentAttempts = 0;
let finalPrice = 0;
let cart = [];
let search = "";

function login(event) {
  event.preventDefault();

  loggedUsername = document.getElementById("username").value;
  loggedPassword = document.getElementById("password").value;

  let loggedUser = usersList.find((user) => user.username == loggedUsername);

  if (loggedUser != undefined && loggedUser.password === loggedPassword) {
    start();

    //TODO:
    // if (loggedUser.username === "admin") {
    //   console.log("Es admin");
    //   start("admin");
    // } else {
    //   console.log("Es user");
    //   start("user");
    // }
  } else {
    currentAttempts++;
    if (currentAttempts < maxAttempts) {
      alert("Usuario o contraseña incorrectos");
    } else {
      notAllowed();
    }
  }
}

function start() {
  document.getElementById("login").style.display = "none";
  showPoducts();
}

function notAllowed() {
  alert("No se pudo iniciar sesión, intente nuevamente más tarde");
}

function searchProduct() {
  search = document.getElementById("search").value;
  showPoducts(search);
}

function showPoducts(search) {
  let prodContainer = document.getElementById("products-list");
  prodContainer.innerHTML = "";

  if (search) {
    filterProducts = productsList.filter((product) =>
      product.name.includes(search.toLowerCase())
    );
  } else {
    filterProducts = productsList;
  }
  if (localStorage.getItem("cart") !== null) {
    cart = JSON.parse(localStorage.getItem("cart"));
    updateCartView(cart);
  }
  filterProducts.map((product, index) => {
    let prod = document.createElement("article");
    prod.innerHTML = `
            <h3 style="text-transform: capitalize">${product.name}</h3>
            <p>${product.price}</p>
            <button type="button" onclick="addToCart(${product.id})">Agregar a carrito</button>
        `;
    prodContainer.appendChild(prod);
  });
  document.getElementById("products").style.display = "block";
  prodContainer.style.display = "block";
  document.getElementById("cart").style.display = "block";
}

function addToCart(id) {
  if (localStorage.getItem("cart") === null) {
    localStorage.setItem("cart", JSON.stringify([]));
  }
  cart = JSON.parse(localStorage.getItem("cart"));

  cart.push(productsList.find((product) => product.id === id));
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartView(cart);
}

function updateCartView(cart) {
  finalPrice = 0;
  cartListView = document.getElementById("cart-list");
  cartListView.innerHTML = "";
  cart.forEach((product) => {
    let listItem = document.createElement("li");
    listItem.innerHTML = `
            <h4 style="text-transform: capitalize">${product.name}</h4>
            <p>${product.price}</p>
        `;
    finalPrice += product.price;
    cartListView.appendChild(listItem);
  });
  document.getElementById("final-price").innerHTML = finalPrice;
}

function checkout() {
  alert("Gracias por su compra");
  localStorage.removeItem("cart");
  updateCartView([]);
}

function generateAuthUserList(usernameList, passwordList) {
  let users = [];
  if (usernameList.length === passwordList.length) {
    for (let i = 0; i < usernameList.length; i++) {
      let user = new User(usernameList[i], passwordList[i]);
      users.push(user);
    }
  } else {
    console.log("La cantidad de usuarios y contraseñas no coincide");
  }
  return users;
}

function generateProductList(productList, prices) {
  let products = [];
  for (let i = 0; i < productList.length; i++) {
    let product = new Product(productList[i], prices[i], i);
    products.push(product);
  }
  return products;
}
