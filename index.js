const express = require('express');
const bodyParser = require('body-parser');
const { Author, Book } = require('./sequelize');
const app = express();
app.use(bodyParser.json());

// Create a Author
app.post('/api/create/author', (req, res) => {
  console.log(req.body);
  Author.create(req.body)
    .then(author => {
      res.json(author)
    })
    .catch(err => res.json({
      message: `Error while creating the author, ${err}`
    }));
});

// create a book
app.post('/api/create/book', (req, res) => {
  Book.create(req.body)
    .then(author => {
      res.json(author)
    }).catch(err => res.json({
    message: `Error while creating the book, ${err}`
  }));
});

// get all books
app.get('/api/books', (req, res) => {
  Book.findAll()
    .then(books => {
      res.json(books)
    }).catch(err => res.json({
    message: `Error while fetching the books, ${err}`
  }));
});

// get all authors
app.get('/api/authors', (req, res) => {
  Author.findAll().then(authors =>
    res.json(authors));
});

// get book by  bookId
app.get('/api/book/:id', (req, res) => {
  Book.findOne({
      where: { id: req.params.id, },
    }
  ).then(book => {
    res.json(book)
  }).catch(err => {
    res.json({
      message: `Some error occured, ${err}`
    });
  });
});

// get author by id
app.get('/api/author/:id', (req, res) => {
  Author.findOne(
    {
      where: { id: req.params.id, },
    }
  ).then(author => res.json(author));
});

// get author with his book list
app.get('/api/authorHasManyBooks/:id', (req, res) => {
  let query;
  query = Author.findAll({
    where: { id: req.params.id, },
    include: [{ model: Book }
    ]
  });
  return query.then(author => res.json(author));
});

// delete user by id
app.delete('/api/delete/author/:id', (req, res) => {
  Author.destroy({
    where: { id: req.params.id }
  }).then(() => {
    res.json({
      message: 'User deleted Successfully'
    });
  }).catch(err => res.json({
    message: `Error while deleting the author, ${err}`
  }));
});

// delete book by it's id
app.delete('/api/delete/book/:id', (req, res) => {
  Book.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.json({
      message: 'Book deleted Successfully'
    });
  }).catch(err => {
    res.json({
      message: `Error occurred while deleting the book, ${err}`
    })
  })
});

//delete author data
app.delete('/api/delete/author/:id', (req, res) => {
  Author.destroy({
    where: {
      id: req.params.id
    },
    include: [{
      model: Book,
      as: 'books'
    }]
  }).then(() => {
    res.json({
      message: 'Deleted author data'
    });
  }).catch((err) => {
    res.json({
      message: `Error deleting author data, ${err}`
    });
  });
});

const port = 5000;
app.listen(port, () => {console.log(`Running on http://localhost:${port}`);
});
