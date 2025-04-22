// DOM Elements
const keywordInput = document.getElementById('keywordInput');
const searchButton = document.getElementById('searchButton');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const summaryElement = document.getElementById('summary');
const productsContainer = document.getElementById('products');

// API Configuration
const API_URL = 'http://localhost:3000/api/scrape';

function showError(message) {
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
}

function clearError() {
  errorElement.classList.add('hidden');
  errorElement.textContent = '';
}

function showLoading() {
  loadingElement.classList.remove('hidden');
  productsContainer.innerHTML = '';
  summaryElement.classList.add('hidden');
}

function hideLoading() {
  loadingElement.classList.add('hidden');
}

function renderProducts(data) {
  clearError();

  summaryElement.innerHTML = `
    Showing ${data.productCount} results for: <strong>${data.keyword}</strong>
  `;
  summaryElement.classList.remove('hidden');

  productsContainer.innerHTML = '';

  data.products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'product-card';

    productElement.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.title}" class="product-image">
      <div class="product-title">${product.title}</div>
      <div class="product-rating">${product.rating}</div>
      <div class="product-reviews">${product.reviews.toLocaleString()} reviews</div>
      <div class="product-price">${product.price}</div>
    `;

    productsContainer.appendChild(productElement);
  });
}

async function fetchData(keyword) {
  showLoading();
  clearError();

  try {
    const response = await fetch(`${API_URL}?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    const data = await response.json();
    if (data.error) throw new Error(data.error);

    renderProducts(data);
  } catch (error) {
    showError(error.message || 'Failed to fetch data from Amazon');
    console.error('Fetch error:', error);
  } finally {
    hideLoading();
  }
}

searchButton.addEventListener('click', () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) {
    showError('Please enter a search keyword');
    return;
  }
  fetchData(keyword);
});

keywordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchButton.click();
});
