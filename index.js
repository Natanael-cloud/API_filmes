// Minha chave de API para acessar o The Movie Database (TMDB)
const CHAVE_API = 'bb9343bd26b125f4e385ae717cf72b11';

// URL base para a comunicação com a API do TMDB
const URL_BASE = 'https://api.themoviedb.org/3';

// Seleção dos elementos do DOM que serão utilizados
const campoPesquisa = document.getElementById('pesquisa'); // Campo onde o usuário digita a busca
const botaoPesquisa = document.getElementById('botaoPesquisa'); // Botão que inicia a busca
const containerFilmes = document.getElementById('filmes'); // Container onde os resultados são exibidos

// Criação dinâmica do modal que exibirá os detalhes de um filme ou série
const modalDetalhes = document.createElement('div');
modalDetalhes.id = 'modalDetalhes';
modalDetalhes.style.display = 'none'; // Modal inicia oculto
document.body.appendChild(modalDetalhes); // Adiciona o modal ao corpo da página

// Função responsável por buscar filmes ou séries com base no texto digitado pelo usuário
const buscarFilmes = async (consulta) => {
  try {
    // Faz uma requisição à API, utilizando a busca genérica que abrange filmes e séries
    const resposta = await fetch(`${URL_BASE}/search/multi?api_key=${CHAVE_API}&query=${encodeURIComponent(consulta)}&language=pt-BR`);
    if (!resposta.ok) throw new Error('Erro na resposta da API'); // Tratamento de erro da API

    const dados = await resposta.json(); // Converte a resposta em JSON
    exibirFilmes(dados.results); // Chama a função para exibir os resultados
  } catch (erro) {
    // Caso ocorra algum erro, exibe uma mensagem no console e na interface
    console.error('Erro ao buscar filmes e séries:', erro);
    containerFilmes.innerHTML = `<p>Não foi possível carregar os resultados. Tente novamente.</p>`;
  }
};

// Função que renderiza os filmes ou séries na página
const exibirFilmes = (itens) => {
  containerFilmes.innerHTML = ''; // Limpa os resultados anteriores
  itens.forEach(item => {
    if (!item.poster_path) return; // Ignora itens que não possuem imagem

    // Cria dinamicamente um elemento de filme ou série
    const elementoItem = document.createElement('div');
    elementoItem.classList.add('movie');
    elementoItem.innerHTML = `
      <h3>${item.title || item.name}</h3> <!-- Exibe o título (ou nome) -->
      <p>⭐ ${item.vote_average || 'N/A'}</p> <!-- Exibe a nota -->
      <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}"> <!-- Exibe o pôster -->
    `;

    // Adiciona um evento de clique para abrir os detalhes no modal
    elementoItem.addEventListener('click', () => exibirDetalhes(item));
    containerFilmes.appendChild(elementoItem); // Adiciona o elemento ao container
  });
};

// Função que busca e exibe os detalhes de um item selecionado
const exibirDetalhes = async (item) => {
  try {
    const tipo = item.media_type; // Define o tipo: "movie" (filme) ou "tv" (série)
    const resposta = await fetch(`${URL_BASE}/${tipo}/${item.id}?api_key=${CHAVE_API}&language=pt-BR`);
    if (!resposta.ok) throw new Error('Erro ao buscar detalhes');

    const dados = await resposta.json(); // Detalhes do item

    // Preenche o modal com as informações detalhadas do item
    modalDetalhes.innerHTML = `
      <div class="modal-content">
        <span id="fecharModal">&times;</span> <!-- Botão para fechar o modal -->
        <h2>${dados.title || dados.name}</h2>
        <p><strong>Descrição:</strong> ${dados.overview || 'Não disponível.'}</p>
        <p><strong>Nota:</strong> ⭐ ${dados.vote_average || 'N/A'}</p>
        <p><strong>Data de Lançamento:</strong> ${dados.release_date || dados.first_air_date || 'Não disponível.'}</p>
        <img src="https://image.tmdb.org/t/p/w500${dados.poster_path}" alt="${dados.title || dados.name}">
      </div>
    `;
    modalDetalhes.style.display = 'block'; // Exibe o modal

    // Adiciona funcionalidade para fechar o modal
    const fecharModal = document.getElementById('fecharModal');
    fecharModal.addEventListener('click', () => {
      modalDetalhes.style.display = 'none'; // Oculta o modal
    });
  } catch (erro) {
    // Caso ocorra algum erro ao buscar os detalhes, exibe uma mensagem
    console.error('Erro ao exibir detalhes:', erro);
    modalDetalhes.innerHTML = `<p>Não foi possível carregar os detalhes. Tente novamente.</p>`;
  }
};

// Adiciona um evento ao botão de busca para iniciar a pesquisa
botaoPesquisa.addEventListener('click', () => {
  const consulta = campoPesquisa.value.trim(); // Remove espaços desnecessários
  if (consulta) buscarFilmes(consulta); // Apenas busca se houver texto
});


