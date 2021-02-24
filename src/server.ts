import express, { request, response } from 'express';

const app = express();

/**
* GET => Buscar
* POST => Salvar
* PUT => Alterar
* DELETE => Deletar
* PATCH => Alteração Especifica
*/

/*
https://localhost:3333/users
*/
app.get("/", (request, response) => {
    return response.json({mensage: "Rota da Api /get"});
});

app.post("/", (request, response) => {
    //recebeu parar salvar
return response.json({mensagem: "Dados foram salvos /post"});
});

app.listen(3333, () => console.log("Servidor Rodando!"));