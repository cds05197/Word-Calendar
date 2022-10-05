require('dotenv').config();
// 외부 환경변수 파일 사용
const express = require('express');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const mongoose = require('mongoose');
const Word = require('./models/word');
// 모델 import
mongoose.Promise = global.Promise;
const app = express();
const port = 5000;
const  MONGO_URI  = process.env; // DBConnection 외부 파일 정보로 실행

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));
// DB Connection
app.post('/insert', (req, res) => {
    Word.create(req.body)
    .then(word => res.send(word))
    .catch(err => res.status(500).send(err));
});
// Insert 작업 수행

app.put('/update', (req, res) => {
    Word.updateBywordid(req.body.id, req.body)
    .then(word => res.send(word))
    .catch(err => res.status(500).send(err));
});
// Update 작업 수행

app.post('/delete', (req, res) => {
    Word.deleteBywordid(req.body.id)
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err));
});
// delete 작업 수행
app.get('/select', (req, res) => {
    Word.findAll()
    .then((word) => {
      if (!word) return res.status(404).send({ err: 'word not found' });
      res.send(word);
    })
    .catch(err => res.status(500).send(err));   
});
// find 작업 수행


app.listen(port, () => {
    console.log(`server is Running on Port ${port}`);
});         