const express = require("express");
const mongoose = require("mongoose");
// const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
let mongooseHidden = require("mongoose-hidden")();
mongoose.connect("mongodb://localhost:27017/productTestDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
// const ProductSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
// });

// const Product = mongoose.model("products", ProductSchema);

// const product11 = new Product({
//   name: "Apple",
// });
// const product12 = new Product({
//   name: "Banna",
// });

// const product13 = new Product({
//   name: "Kola",
// });

// const product14 = new Product({
//   name: "hasi",
// });
//product.save();

const itemsSchema = new mongoose.Schema({
  _id: { type: String, hide: true },
  product: {
    type: String,
    required: true,
    //        required: true
  },
  quantity: {
    type: Number,
    //        required: true
  },
});
itemsSchema.plugin(mongooseHidden);

const Items = mongoose.model("items", itemsSchema);

// const items1 = Items({
//   product: "Banna",
//   quantity: 3,
// });

// const items2 = Items({
//   product: "kola",
//   quantity: 3,
// });
// // const items2 = Items({
// //     product: product12,
// //     quantity: 3,
// //   });
// items1.save();
// items2.save();

const orderSchema = {
  phone: {
    type: String,
    required: true,
    max: 11,
  },
  orderItems: [itemsSchema],
};

const Order = mongoose.model("orders", orderSchema);

// const createOrder = Order({
//   phone: "01830370262",
//   orderItems: [items1, items2],
// });

// createOrder.save();

app.post("/submitorder", (req, res) => {
  const { phone, product1, qty1, product2, qty2 } = req.body;
  console.log(qty1);
  const items1 = Items({
    product: product1,
    quantity: qty1,
  });

  const items2 = Items({
    product: product2,
    quantity: qty2,
  });
  const arr = [items1, items2];
  console.log(arr);

  Items.insertMany([items1, items2], (err, items) => {
    if (!err) {
      // console.log(items);

      const createOrder = Order({
        phone: phone,
        orderItems: arr,
      });
      createOrder.save((err) => {
        if (!err) {
          res.json({
            message: "Data Save succesfully",
          });
        }
      });
    }
  });
});

app.get("/order", (req, res) => {
  Order.find(function (err, order) {
    if (!err) {
      res.json({
        orderItems: order[0]["orderItems"],
        phone: order[0]["phone"],
      });
    } else {
      res.json({
        error: err,
      });
    }
  });
});

// const userRoute = require("./routes/users");
// dotenv.config();
// mongoose.connect(process.env.MONGO_URL,
//     { useNewUrlParser: true,useUnifiedTopology: true },
//     ()=>{
//     console.log("Connected to MongoDB");
// });
// const order = new Order({
//     order:{
//         orderitems:[]
//     }
// });

// const userSchema = mongoose.sc

// order.save();
// app.use(express.json());
// app.use("/api/users",userRoute);

app.listen(8000, () => {
  console.log("server is running!!! on 8000");
});
