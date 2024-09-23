fetch("https://tsodykteststore.myshopify.com/api/2023-01/graphql.json", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": "7e174585a317d187255660745da44cc7",
  },
  body: JSON.stringify({
    query: `{
          products(first: 10) {
            edges {
              node {
                title
                images(first: 2) {
                  edges {
                    node {
                      originalSrc
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                  }
                }
                compareAtPriceRange {
                  maxVariantPrice {
                    amount
                  }
                }
              }
            }
          }
        }`,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    displayProducts(data.data.products.edges);
  });

function displayProducts(products) {
  const productsContainer = document.getElementById("products-container");

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const firstImage = product.node.images.edges[0]?.node.originalSrc || "";
    const secondImage = product.node.images.edges[1]?.node.originalSrc || "";

    productCard.innerHTML = `
        <div class="product-image">
          <img src="${firstImage}" alt="${product.node.title}" class="default-img">
          <img src="${secondImage}" alt="${product.node.title}" class="hover-img" style="display: none;">
        </div>
        <h2>${product.node.title}</h2>
        <p>${product.node.priceRange.minVariantPrice.amount} ${product.node.priceRange.minVariantPrice.currencyCode}</p>
      `;

    const defaultImg = productCard.querySelector(".default-img");
    const hoverImg = productCard.querySelector(".hover-img");

    productCard.addEventListener("mouseover", () => {
      defaultImg.style.display = "none";
      hoverImg.style.display = "block";
    });

    productCard.addEventListener("mouseout", () => {
      defaultImg.style.display = "block";
      hoverImg.style.display = "none";
    });

    productsContainer.appendChild(productCard);
  });
}

fetchProducts()
  .then((products) => displayProducts(products))
  .catch((error) => console.error("Ошибка при получении продуктов:", error));

function displayProducts(products) {
  const productsContainer = document.getElementById("products-container");

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const firstImage =
      product.node.images.edges[0]?.node.originalSrc || "default_image.jpg";
    const secondImage =
      product.node.images.edges[1]?.node.originalSrc || "hover_image.jpg";

    const newPrice = parseFloat(product.node.priceRange.minVariantPrice.amount);
    const oldPrice =
      parseFloat(product.node.compareAtPriceRange?.maxVariantPrice?.amount) ||
      null;

    console.log("Old Price:", oldPrice);
    console.log("New Price:", newPrice);

    productCard.innerHTML = `
        <div class="product-image">
          <img src="${firstImage}" alt="${
      product.node.title
    }" class="default-img">
          <img src="${secondImage}" alt="${
      product.node.title
    }" class="hover-img">
        </div>
        <h2>${product.node.title}</h2>
        <p class="price">
          ${
            oldPrice && oldPrice > newPrice
              ? `<span class="old-price">${oldPrice.toFixed(2)} UAH</span>`
              : ""
          }
          <span class="new-price">${newPrice.toFixed(2)} UAH</span>
        </p>
      `;

    const defaultImg = productCard.querySelector(".default-img");
    const hoverImg = productCard.querySelector(".hover-img");

    productCard.addEventListener("mouseover", () => {
      defaultImg.style.display = "none";
      hoverImg.style.display = "block";
    });

    productCard.addEventListener("mouseout", () => {
      defaultImg.style.display = "block";
      hoverImg.style.display = "none";
    });

    productsContainer.appendChild(productCard);
  });
}
class Accordion {
  constructor(el) {
    this.el = el;
    this.summary = el.querySelector("summary");
    this.content = el.querySelector(".accordion-content");
    this.expandIcon = this.summary.querySelector(".accordion-icon");
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.summary.addEventListener("click", (e) => this.onClick(e));
  }

  onClick(e) {
    e.preventDefault();
    this.el.style.overflow = "hidden";

    if (this.isClosing || !this.el.open) {
      this.open();
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  shrink() {
    this.isClosing = true;

    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      {
        duration: 400,
        easing: "ease-out",
      }
    );
    this.animation.onfinish = () => {
      this.expandIcon.setAttribute(
        "src",
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/></svg>"
      );
      return this.onAnimationFinish(false);
    };

    this.animation.oncancel = () => {
      this.expandIcon.setAttribute(
        "src",
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/></svg>"
      );
      return (this.isClosing = false);
    };
  }

  open() {
    this.el.style.height = `${this.el.offsetHeight}px`;
    this.el.open = true;
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    this.isExpanding = true;

    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${
      this.summary.offsetHeight + this.content.offsetHeight
    }px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      {
        duration: 350,
        easing: "ease-out",
      }
    );

    this.animation.onfinish = () => {
      this.expandIcon.setAttribute(
        "src",
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/></svg>"
      );
      return this.onAnimationFinish(true);
    };
    this.animation.oncancel = () => {
      this.expandIcon.setAttribute(
        "src",
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/></svg>"
      );
      return (this.isExpanding = false);
    };
  }

  onAnimationFinish(open) {
    this.el.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = this.el.style.overflow = "";
  }
}

document.querySelectorAll("details").forEach((el) => {
  new Accordion(el);
});
