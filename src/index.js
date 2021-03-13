const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (_, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex(repository => repository.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = repositories[index];

  if (title) {
    repository.title = title;
  }

  if (url) {
    repository.url = url;
  }

  if (techs) {
    repository.techs = techs;
  }

  repositories[index] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = repositories[index];

  repository.likes += 1;

  repositories[index] = repository;

  return response.json({ likes: repository.likes });
});

module.exports = app;
