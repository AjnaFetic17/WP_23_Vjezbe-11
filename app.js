const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.0:27017/proizvodiDB");

const proizvodSchema = {
  title: String,
  content: String,
  imageURL: String,
  price: Number
}

const Proizvod = mongoose.model("Product", proizvodSchema);

app.route("/products")
  .get((req, res) => {
    Proizvod.find((err, foundProducts) => {
      if (err) {
        res.send(err);
      } else {
        res.send(foundProducts)
      }
    })
  })
  .post((req, res) => {
    const newProduct = new Proizvod({
      title: req.body.title,
      content: req.body.content,
      imageURL: req.body.content,
      price: parseFloat(req.body.price)
    });

    newProduct.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Novi proizvod je uspješno dodan");
      }
    })
  })
  .delete((req, res) => {
    Proizvod.deleteMany((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Uspješno brisanje svih podataka.")
      }
    })
  });

app.route("/products/:productTitle")
  .get((req, res) => {
    Proizvod.findOne({ title: req.params.productTitle }, (err, foundProduct) => {
      if (err) {
        res.send("Nema proizvoda u bazi");
      } else {
        res.send(foundProduct);
      }
    })
  })
  .put((req, res) => {
    Proizvod.findOneAndUpdate(
      { title: req.params.productTitle },
      { title: req.body.title, content: req.body.content, imageURL: req.body.imageURL, price: parseFloat(req.body.price) },
      { overwrite: true },
      (err) => {
        if (err) {
          res.send("Proizvod nije update-ovan");
        } else {
          res.send("Proizvod uspješno update-ovan.")
        }
      }
    )
  })
  .patch((req, res) => {
    Proizvod.findOneAndUpdate(
      { title: req.params.productTitle },
      { $set: req.body },
      (err) => {
        if (err) {
          res.send("Proizvod nije update-ovan.");
        } else {
          res.send("Update proizvoda je uspješan.")
        }
      }
    )
  })
  .delete((req, res) => {
    Proizvod.deleteOne(
      { title: req.params.productTitle },
      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Proizvod uspješno obrisan.");
        }
      }
    )
  });

const userSchema = {
  username: String,
  password: String
}

const User = mongoose.model("User", userSchema);

app.route("/users")
  .get((req, res) => {
    User.find((err, foundUsers) => {
      if (err) {
        res.send(err);
      } else {
        res.send(foundUsers);
      }
    })
  })
  .post((req, res) => {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    });

    User.find({ username: req.body.username }, (err, foundUsers) => {
      if (err) {
        res.send(err);
      } else {
        if (foundUsers.length === 0) {
          newUser.save((err) => {
            if (err) {
              res.send(err);
            } else {
              res.send("Korisnik uspješno dodan.");
            }
          })
        } else {
          res.send("Korisnik s tim username već postoji.")
        }
      }
    })
  })
  .delete((req, res) => {
    User.deleteMany((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Svi korisnici uspješno obrisani.")
      }
    })
  });

app.route("/users/:username")
  .get((req, res) => {
    User.find({ username: req.params.username }, (err, foundUser) => {
      if (err) {
        res.send(err);
      } else {
        res.send(foundUser);
      }
    })
  })
  .put((req, res) => {
    User.findOneAndUpdate(
      { username: req.params.username },
      { username: req.body.username, password: req.body.password },
      { overwrite: true },
      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Korisnik uspješno update-ovan.");
        }
      }
    )
  })
  .patch((req, res) => {
    User.findOneAndUpdate(
      { username: req.params.username },
      { $set: req.body },
      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Uspješan update korisnika.");
        }
      }
    )
  })
  .delete((req, res) => {
    User.deleteOne(
      { username: req.params.username },
      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Korisnik uspješno obrisan.");
        }
      }
    )
  });

app.listen(8080, () => {
  console.log("Server started on port 8080");
})