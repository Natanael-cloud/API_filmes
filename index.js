const CHAVE_API = 'bb9343bd26b125f4e385ae717cf72b11';
const URL_BASE = 'https://api.themoviedb.org/3';
const campoPesquisa = document.getElementById('pesquisa');
const botaoPesquisa = document.getElementById('botaoPesquisa');
const containerFilmes = document.getElementById('filmes');
const modalDetalhes = document.createElement('div'); // Modal para detalhes

// Configuração inicial do modal
modalDetalhes.id = 'modalDetalhes';
modalDetalhes.style.display = 'none';
document.body.appendChild(modalDetalhes);

// Função para buscar filmes e séries
const buscarFilmes = async (consulta) => {
  try {
    const resposta = await fetch(`${URL_BASE}/search/multi?api_key=${CHAVE_API}&query=${encodeURIComponent(consulta)}&language=pt-BR`);
    if (!resposta.ok) throw new Error('Erro na resposta da API');
    const dados = await resposta.json();
    exibirFilmes(dados.results);
  } catch (erro) {
    console.error('Erro ao buscar filmes e séries:', erro);
    containerFilmes.innerHTML = `<p>Não foi possível carregar os resultados. Tente novamente.</p>`;
  }
};

// Função para exibir os filmes/séries na página
const exibirFilmes = (itens) => {
  containerFilmes.innerHTML = ''; // Limpa os resultados anteriores
  itens.forEach(item => {
    if (!item.poster_path) return; // Ignora itens sem imagem
    const elementoItem = document.createElement('div');
    elementoItem.classList.add('movie');
    elementoItem.innerHTML = `
      <h3>${item.title || item.name}</h3>
      <p>⭐ ${item.vote_average || 'N/A'}</p>
      <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}">
    `;
    elementoItem.addEventListener('click', () => exibirDetalhes(item));
    containerFilmes.appendChild(elementoItem);
  });
};

// Função para buscar e exibir detalhes do item
const exibirDetalhes = async (item) => {
  try {
    const tipo = item.media_type; // "movie" ou "tv"
    const resposta = await fetch(`${URL_BASE}/${tipo}/${item.id}?api_key=${CHAVE_API}&language=pt-BR`);
    if (!resposta.ok) throw new Error('Erro ao buscar detalhes');
    const dados = await resposta.json();

    // Preenche o modal com os detalhes
    modalDetalhes.innerHTML = `
      <div class="modal-content">
        <span id="fecharModal">&times;</span>
        <h2>${dados.title || dados.name}</h2>
        <p><strong>Descrição:</strong> ${dados.overview || 'Não disponível.'}</p>
        <p><strong>Nota:</strong> ⭐ ${dados.vote_average || 'N/A'}</p>
        <p><strong>Data de Lançamento:</strong> ${dados.release_date || dados.first_air_date || 'Não disponível.'}</p>
        <img src="https://image.tmdb.org/t/p/w500${dados.poster_path}" alt="${dados.title || dados.name}">
      </div>
    `;
    modalDetalhes.style.display = 'block';

    // Fecha o modal
    const fecharModal = document.getElementById('fecharModal');
    fecharModal.addEventListener('click', () => {
      modalDetalhes.style.display = 'none';
    });
  } catch (erro) {
    console.error('Erro ao exibir detalhes:', erro);
    modalDetalhes.innerHTML = `<p>Não foi possível carregar os detalhes. Tente novamente.</p>`;
  }
};

// Adiciona evento ao botão de busca
botaoPesquisa.addEventListener('click', () => {
  const consulta = campoPesquisa.value.trim();
  if (consulta) buscarFilmes(consulta);
});

