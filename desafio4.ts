// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu 
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?

// A ideia dessa atividade é criar um aplicativo que: 
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela

// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction


interface Filme{
  adult : boolean;
  backdrop_path? : string;
  belongs_to_colletion? : object;
  budget : number;
  homepage? : string;
  id : number;
  imdb_id? : string;
  original_language : string;
  original_title : string;
  overview? : string;
  popularity : number;
  poster_path? : string;
  release_date : string;
  revenue : number;
  runtime? : number;
  status : string;
  tagline? : string;
  title : string;
  video : boolean;
  vote_average : number;
  vote_count : number;
  genres: Array<Genre>;
  production_companies: Array<Production_Companie>;
  production_countries: Array<Production_Countrie>;
  spoken_linguages: Array<Spoken_Language>;
}

interface Genre{
  id : number;
  name : string;  
}

interface Production_Companie{
  name : string;
  id : number;
  logo_path? : string;
  origin_country : string;
}

interface Production_Countrie{
  iso_3166_1 : string;
  name : string
}

interface Spoken_Language{
  iso_639_1 : string;
  name : string;
}

let apiKey = '3f301be7381a03ad8d352314dcc3ec1d';
let requestToken : string;
let username : string;
let password : string;
let sessionId : string;
let listId = '7101979';

let loginButton = document.getElementById('login-button') as HTMLButtonElement;
let searchButton = document.getElementById('search-button') as HTMLButtonElement;
let searchContainer = document.getElementById('search-container') as HTMLButtonElement;

loginButton!.addEventListener('click', async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
})

searchButton!.addEventListener('click', async () => {
  let lista = document.getElementById("lista");
  if (lista) {
    lista.outerHTML = "";
  }
  let elementInput = document.getElementById('search') as HTMLInputElement;
  let query = elementInput.value;
  let listaDeFilmes = await procurarFilme(query);
  let ul = document.createElement('ul');
  ul.id = "lista"
  for (const item of listaDeFilmes) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(item.original_title))
    ul.appendChild(li)
  }
  console.log(listaDeFilmes);
  searchContainer!.appendChild(ul);
})

function preencherSenha() {
  let senhaInput = document.getElementById('senha') as HTMLInputElement;
  password = senhaInput!.value;
  validateLoginButton();
}

function preencherLogin() {
  let loginInput = document.getElementById('login') as HTMLInputElement;
  username = loginInput!.value;
  validateLoginButton();
}

function preencherApi() {
  let apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
  apiKey = apiKeyInput!.value;
  validateLoginButton();
}

function validateLoginButton() {
  if (password && username && apiKey) {
    loginButton!.disabled = false;
  } else {
    loginButton!.disabled = true;
  }
}

interface GetParameters {
  url: string;
  method: string;
  body?: any;
}

class HttpClient {
  static async get({url, method, body} : GetParameters) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        })
      }

      if (body) {
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        body = JSON.stringify(body);
      }
      request.send(body);
    })
  }
}

async function procurarFilme(query : string) : Promise<Array<Filme>> {
  query = encodeURI(query)
  console.log(query)
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: "GET"
  }) as Array<Filme>;
  return result
}

async function adicionarFilme(filmeId : number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
    method: "GET"
  })
  console.log(result);
}

async function criarRequestToken () {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: "GET"
  }) as {request_token: string}
  requestToken = result.request_token
}

async function logar() {
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    }
  })
}

async function criarSessao() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET"
  }) as {session_id: string}
  sessionId = result.session_id;
}

async function criarLista(nomeDaLista : string, descricao : string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br"
    }
  })
  console.log(result);
}

async function adicionarFilmeNaLista(filmeId : number, listaId : number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId
    }
  })
  console.log(result);
}

async function pegarLista() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  })
  console.log(result);
}

{/* <div style="display: flex;">
  <div style="display: flex; width: 300px; height: 100px; justify-content: space-between; flex-direction: column;">
      <input id="login" placeholder="Login" onchange="preencherLogin(event)">
      <input id="senha" placeholder="Senha" type="password" onchange="preencherSenha(event)">
      <input id="api-key" placeholder="Api Key" onchange="preencherApi()">
      <button id="login-button" disabled>Login</button>
  </div>
  <div id="search-container" style="margin-left: 20px">
      <input id="search" placeholder="Escreva...">
      <button id="search-button">Pesquisar Filme</button>
  </div>
</div>*/}