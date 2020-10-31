const express = require('express');
const cors = require('cors');
const{uuid} = require('uuidv4');


// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
   return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} = request.body;
  
  const repository = {
    id:uuid(), 
    title, 
    url, 
    techs,
    likes: 0
  };
  
  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const {title, url, techs,likes} = request.body;
  const index = repositories.findIndex(repo => repo.id === id);

  if(index < 0) {
      return response.status(404).json({error : "repository not found"});
  }

  const newRepository = {
      id,
      url,
      title,
      techs,
      likes
  }
  repositories[index] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", (req, res) => {
  const {id} = req.params;

  const repoIndex = repositories.findIndex(repository => repository.id == id);

  if(repoIndex < 0) {
      return res.status(404).json({error : "repository not found"});
  }
  repositories.splice(repoIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const {id} = req.params;

  const repoIndex = repositories.findIndex(repository => repository.id == id);

  if(repoIndex < 0) {
      return res.status(404).json({error : "repository not found"});
  }

  const repo = repositories[repoIndex];
  repo.likes++;

  return res.status(201).json(repo);

});

module.exports = app;
