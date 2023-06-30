const API_URL = "";

const MOCKED_PRODUCTS = [
  { id: 1, name: "TV", price: "1000", brand: "Samsung" },
  { id: 2, name: "Fridge", price: "2500", brand: "Haceb" },
  { id: 3, name: "Air conditioner", price: "1300", brand: "LG" },
  { id: 4, name: "Washing machine", price: "2200", brand: "Whirlpool" },
  { id: 5, name: "Blender", price: "200", brand: "Universal" },
];

async function fetchWeather() {
  //   const response = await fetch(API_URL + "/weather");
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "200",
        json: () => {
          return {
            temperature: "10",
            type: "cold",
          };
        },
      });
    }, 1000);
  });

  if (response.status !== "200") {
    throw new Error("Server Error");
  }

  const data = await response.json();
  return data;
}

async function fetchProducts(weather) {
  //   const response = await fetch(
  //     API_URL +
  //       "/products?temperature=" +
  //       weather.temperature +
  //       "&type=" +
  //       weather.type
  //   );
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "200",
        json: () => {
          return MOCKED_PRODUCTS;
        },
      });
    }, 1000);
  });

  if (response.status !== "200") {
    throw new Error("Server Error");
  }

  const data = await response.json();
  return data;
}

function addListeners(productsData) {
  const dropdownItems = document.getElementsByClassName("dropdown-item");
  for (var i = 0; i < dropdownItems.length; i++) {
    dropdownItems[i].addEventListener("click", (e) => {
      const sort = e.currentTarget.dataset.sort;
      createProductList(productsData, sort);
    });
  }
}

const SortOrder = {
  asc: "asc",
  desc: "desc",
};

function compareProducts(a, b, order) {
  if (order === SortOrder.asc) {
    return a.price - b.price;
  } else {
    return b.price - a.price;
  }
}

function createProductList(productsData, order) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  const orderedProductData = [...productsData];

  if (order) {
    orderedProductData.sort((a, b) => compareProducts(a, b, order));
  }

  orderedProductData.forEach((product) => {
    const productItem = document.createElement("li");
    productItem.textContent = `${product.name} (${product.brand}) - price: ${product.price} `;
    productList.appendChild(productItem);
  });
}

async function init() {
  try {
    const weatherData = await fetchWeather();
    const productsData = await fetchProducts(weatherData);

    const loader = document.getElementById("loader");
    loader.remove();

    const weatherContainer = document.querySelector("#weather .card-body");

    const weatherType = document.createElement("b");
    weatherType.textContent = "Type: " + weatherData.type; // warm, hot, windy, raining, sunny

    const weatherTemperature = document.createElement("p");
    weatherTemperature.textContent = "Temperature: " + weatherData.temperature;

    weatherContainer.appendChild(weatherType);
    weatherContainer.appendChild(weatherTemperature);
    createProductList(productsData);
    addListeners(productsData);
  } catch (error) {
    console.error("[AppError]: ", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
