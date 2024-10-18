// Create web server
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
let comments = require('./comments.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET comments
app.get('/api/comments', function(req, res) {
  res.json(comments);
});

// POST comments
app.post('/api/comments', function(req, res) {
  const comment = {
    id: Date.now(),
    username: req.body.username,
    message: req.body.message
  };
  
  comments.push(comment);
  
  fs.writeFile('./comments.json', JSON.stringify(comments, null, 2), (err) => {
    if (err) {
      res.status(500).send('Failed to save comment.');
    } else {
      res.status(201).json(comment);
    }
  });
});

// DELETE comment by ID
app.delete('/api/comments/:id', function(req, res) {
  const id = parseInt(req.params.id, 10);
  comments = comments.filter(comment => comment.id !== id);
  
  fs.writeFile('./comments.json', JSON.stringify(comments, null, 2), (err) => {
    if (err) {
      res.status(500).send('Failed to delete comment.');
    } else {
      res.status(200).send('Comment deleted.');
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
