const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://root:root@cluster0.8t3kwxp.mongodb.net/proizvodiDB')
  .then(() => console.log('Connected!'));

app.use(cors());
app.use(bodyParser.json());


const productSchema = mongoose.Schema({
  title: String,
  content: String,
  imageURL: String,
  price: Number
})

const Product = mongoose.model('Product', productSchema)

app.route("/products")
  .get(async (req, res) => {
    try {
      res.send(await Product.find({}));
    } catch (error) {
      res.send(error)
    }
  })
  .post(async (req, res) => {

    const newProduct = new Product({
      title: req.body.title,
      content: req.body.content,
      imageURL: req.body.imageURL,
      price: parseFloat(req.body.price)
    });

    try {
      await newProduct.save().then((doc) => {
        res.send(doc);
      })

    } catch (error) {
      res.send(error);
    }
  })
  .delete(async (req, res) => {
    try {
      await Product.deleteMany({}).exec()
      res.send("Svi proizvodi uspješno obrisani");
    } catch (error) {
      res.send(error);
    }
  });

app.route('/products/:productId')
  .get(async (req, res) => {
    try {
      const product = await Product.findOne({ _id: req.params.productId }).exec()
      res.send(product)
    } catch (error) {
      res.send(error)
    }
  })
  .put(async (req, res) => {
    const newProductValues = new Product({
      title: req.body.title,
      content: req.body.content,
      imageURL: req.body.imageURL,
      price: parseFloat(req.body.price)
    });

    try {
      await Product.findOneAndReplace({ _id: req.params.productId },
        { $set: { title: newProductValues.title, content: newProductValues.content, imageURL: newProductValues.imageURL, price: newProductValues.price } },
      )

      res.send(newProductValues)

    } catch (error) {
      res.send(error)
    }
  })
  .patch(async (req, res) => {
    try {
      await Product.findOneAndUpdate({ _id: req.params.productId },
        { $set: req.body },
      ).exec().then((doc) => {
        res.send(doc)

      })

    } catch (error) {
      res.send(error)

    }
  })
  .delete(async (req, res) => {
    try {
      await Product.deleteOne({ _id: req.params.productId }).exec().then(() => {
        res.send(req.params.productId)
      })
    } catch (error) {
      res.send(error)
    }
  });

const userSchema = {
  username: String,
  password: String
}

const User = mongoose.model("User", userSchema);

app.route("/users")
  .get(async (req, res) => {
    try {
      res.send(await User.find({}).exec())
    } catch (error) {
      res.send(error)
    }
  })
  .post(async (req, res) => {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    try {
      const foundUsers = await User.find({ username: req.body.username }).exec()
      if (foundUsers.length === 0) {
        await newUser.save().then((doc) => {
          res.send(doc)
        })
      } else {
        res.send("Korisnik s tim username već postoji.")
      }
    } catch (error) {
      res.send(error)
    }
  })
  .delete(async (req, res) => {
    try {
      await User.deleteMany({}).exec()
      res.send("Svi proizvodi uspješno obrisani");

    } catch (error) {
      res.send(error)
    }
  });

app.route("/users/:userId")
  .get(async (req, res) => {
    try {
      res.send(await User.findOne({ _id: req.params.userId }).exec())
    } catch (error) {
      res.send(error)
    }
  })
  .put(async (req, res) => {
    const newUserData = { username: req.body.username, password: req.body.password }
    try {
      const foundUsers = await User.find({ username: req.body.username }).exec()
      if (foundUsers.length === 0) {
        await User.findOneAndReplace(
          { _id: req.params.userId },
          { $set: { username: newUserData.username, password: newUserData.password } }
        )
        res.send(newUserData)
      } else {
        res.send("Korisnik s tim username već postoji.")
      }

    } catch (error) {
      res.send(error)
    }
  })
  .patch(async (req, res) => {
    try {
      await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body }
      ).exec().then((doc) => {
        res.send(doc)

      })
    } catch (error) {
      res.send(error)
    }
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

app.listen(3000, () => {
  console.log('Server started on port 3000');
})