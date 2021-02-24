import 'reflect-metadata';
import express from 'express';
import "./database";

const app = express();

app.get("/", (request, response) => {
    return response.json({mensage: "Rota da Api /get"});
});

app.post("/", (request, response) => {
return response.json({mensagem: "Dados foram salvos /post"});
});

app.listen(3121, () => console.log("Servidor Rodando!"));