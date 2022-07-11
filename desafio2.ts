// Como podemos melhorar o esse código usando TS?

interface Pessoa{
    nome? : string;
    idade? : number;
    profissao? : string;
}

let pessoa1 : Pessoa = {}
pessoa1.nome = "maria";
pessoa1.idade = 29;
pessoa1.profissao = "Atriz";

let pessoa2 : Pessoa = {}
pessoa2.nome = "roberto";
pessoa2.idade = 19;
pessoa2.profissao = "Padeiro";

let pessoa3 : Pessoa = {
    nome: "laura",
    idade: 32,
    profissao: "Atriz"
};

let pessoa4 : Pessoa = {
    nome: "carlos",
    idade: 19,
    profissao: "Padeiro"
};