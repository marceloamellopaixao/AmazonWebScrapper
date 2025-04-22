import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configurações avançadas
const REQUEST_DELAY = 5000; // 5 segundos entre requisições
let lastRequestTime = 0;

// Lista de User-Agents para rotação
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
];

// Gerador de cookies simulados
function generateAmazonCookies() {
  const randomId = Math.floor(1000000000 + Math.random() * 9000000000);
  return `session-id=${randomId}-${randomId}; session-id-time=${Math.floor(Date.now() / 1000)}; i18n-prefs=BRL; ubid-acbbr=${randomId}-${randomId}`;
}

// Headers base
function getAmazonHeaders() {
  return {
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
    'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
    'Cookie': generateAmazonCookies()
  };
}

/**
 * Verifica se a resposta contém uma página de erro da Amazon
 */
function isAmazonErrorPage(html: string): boolean {
  return html.includes('Sorry! Something went wrong') || 
         html.includes('To discuss automated access to Amazon data') ||
         html.includes('Parece que você fez muitas solicitações');
}

/**
 * Extrai dados de produtos do HTML da Amazon
 */
function extractProducts(html: string) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const products = [];

  // Seletores atualizados para a Amazon Brasil
  const productElements = document.querySelectorAll('.s-result-item[data-component-type="s-search-result"]');

  productElements.forEach((element) => {
    try {
      // Extrair título
      const titleElement = element.querySelector('h2 a span') || 
                          element.querySelector('.a-size-base-plus.a-color-base.a-text-normal');
      const title = titleElement?.textContent?.trim() || 'Sem título';

      // Extrair avaliação
      const ratingElement = element.querySelector('.a-icon-star-small .a-icon-alt') || 
                           element.querySelector('.a-icon-alt');
      const ratingText = ratingElement?.textContent?.trim() || '';
      const rating = ratingText.split(' ')[0] || 'Sem avaliação';

      // Extrair número de avaliações
      const reviewsElement = element.querySelector('.a-size-small .a-link-normal .a-size-base') || 
                            element.querySelector('.a-size-base.s-underline-text');
      let reviews = reviewsElement?.textContent?.trim().replace(/[^\d]/g, '') || '0';

      // Extrair URL da imagem
      const imageElement = element.querySelector('.s-image') as HTMLImageElement;
      const imageUrl = imageElement?.src || '';

      // Extrair preço (opcional)
      const priceElement = element.querySelector('.a-price .a-offscreen') || 
                         element.querySelector('.a-price-whole');
      const price = priceElement?.textContent?.trim() || 'Preço não disponível';

      if (title && imageUrl) {
        products.push({
          title,
          rating,
          reviews: parseInt(reviews) || 0,
          price,
          imageUrl,
        });
      }
    } catch (error) {
      console.error('Erro ao analisar produto:', error);
    }
  });

  return products;
}

/**
 * Função com retry automático
 */
async function fetchAmazonWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      // Adiciona delay entre requisições
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      
      if (timeSinceLastRequest < REQUEST_DELAY) {
        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY - timeSinceLastRequest));
      }
      
      lastRequestTime = Date.now();

      const response = await axios.get(url, {
        headers: getAmazonHeaders(),
        timeout: 10000
      });

      if (isAmazonErrorPage(response.data)) {
        throw new Error('Amazon bloqueou a requisição');
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Tentativa ${i + 1} falhou, tentando novamente...`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
  throw new Error('Todas as tentativas falharam');
}

/**
 * Endpoint de scraping
 */
app.get('/api/scrape', async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Parâmetro keyword é obrigatório' });
  }

  try {
    const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword.toString())}`;
    console.log(`Iniciando scraping para: ${keyword}`);

    const response = await fetchAmazonWithRetry(url);
    const products = extractProducts(response.data);

    if (products.length === 0) {
      console.warn('Nenhum produto encontrado - a estrutura do HTML pode ter mudado');
    }

    res.json({
      keyword,
      productCount: products.length,
      products,
    });
  } catch (error) {
    console.error('Erro detalhado:', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({ 
      error: 'A Amazon bloqueou a requisição',
      solution: 'Tente novamente mais tarde ou use um serviço de proxy',
      details: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Endpoints disponíveis:');
  console.log(`- GET /api/scrape?keyword={produto}`);
  console.log(`- GET /health`);
});