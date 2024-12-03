const CHAVE_API = 'bb9343bd26b125f4e385ae717cf72b11'; 
const URL_BASE = 'https://api.themoviedb.org/3';
const campoPesquisa = document.getElementById('pesquisa');
const botaoPesquisa = document.getElementById('botaoPesquisa');
const containerFilmes = document.getElementById('filmes');

// Função para buscar filmes
const buscarFilmes = async (consulta) => {
  const resposta = await fetch(`${URL_BASE}/search/movie?api_key=${CHAVE_API}&query=${consulta}&language=pt-BR`);
  const dados = await resposta.json();
  exibirFilmes(dados.results);
};

// Função para exibir os filmes na página
const exibirFilmes = (filmes) => {
  containerFilmes.innerHTML = ''; // Limpa os resultados anteriores
  filmes.forEach(filme => {
    const elementoFilme = document.createElement('div');
    elementoFilme.classList.add('movie');
    elementoFilme.innerHTML = `
      <h3>${filme.title}</h3>
      <p>⭐ ${filme.vote_average}</p>
      <img src="https://image.tmdb.org/t/p/w500${filme.poster_path}" alt="${filme.title}">
    `;
    containerFilmes.appendChild(elementoFilme);
  });
};

// Adiciona evento ao botão de busca
botaoPesquisa.addEventListener('click', () => {
  const consulta = campoPesquisa.value;
  if (consulta) buscarFilmes(consulta);
});
