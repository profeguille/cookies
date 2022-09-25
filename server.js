const express = require("express");
//const cookieParser = require("cookie-parser");
const session = require("express-session");
/* const redis = require("redis");
const client = redis.createClient({
  legacyMode: true,
});
client.connect();
const RedisStore = require("connect-redis")(session); */
const MongoStore = require("connect-mongo");

const app = express();
//app.use(cookieParser("el secreto"));
app.use(
  session({
    //store: new RedisStore({ host: "localhost", port: 6379, client, ttl: 300 }),
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://user:pas@cluster0.my1pzfu.mongodb.net/",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),

    secret: "el secreto",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/login", (req, res) => {
  const { user, pas } = req.query;
  if (user !== "pepe" || pas !== "asdasd") {
    return res.send("login failed");
  } else {
    req.session.user = user;
    req.session.admin = true;
    return res.send("login success!");
  }
});

app.get("/test", (req, res) => {
  console.log(req.session.user);
  console.log(req.session.admin);
  res.send("ruta test");
});

function checkAdmin(req, res, next) {
  if (!req.session.admin) return res.status(403).send("ACA NO!");
  return next();
}

//RUTAS PARA ADMIN
app.get("/algomuyimportante", checkAdmin, (req, res) => {
  return res.send("reportes ultra secretos de ventas truchas sin boleta");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ status: "Logout ERROR", body: err });
    }
    res.send("Logout ok!");
  });
});

// app.get("/crearcookie", (req, res) => {
//   return res
//     .cookie("nombre", "guille", { signed: true, httpOnly: true })
//     .send("<h1>GUARDAMOS TU COKIE</h1>");
// });

// app.get("/recuperarcookie", (req, res) => {
//   console.log("///////////////////////////////");
//   console.log(req.cookies);
//   console.log(req.signedCookies);
//   return res.send("<h1>mira la consola para ver si hay cookies</h1>");
// });

app.listen(8000, () => {
  console.log(`Example app listening on port 8000`);
});
