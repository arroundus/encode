const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const uuid = require("uuid");

const connection = mysql.createPool({
  host: "195.93.252.183",
  user: "encode",
  password: "zaq12wsx",
  database: "encode",
});

connection.getConnection(function (err) {
  if (err) throw err;
});

const app = express();

app.use(cors());

app.get("/api/insert", (req, res) => {
  let strQuery = "INSERT INTO codes VALUES ";
  let id;

  for (let i = 1; i <= req.query.countQR; i++) {
    id = uuid.v4();
    strQuery = strQuery + `("${id}", "0")`;
    if (i < req.query.countQR) {
      strQuery = strQuery + `,`;
    } else if (i == req.query.countQR) {
      strQuery = strQuery + `;`;
    }
  }

  connection.query(`${strQuery}`, function (err, rows) {
    if (err) throw err;
  });
});

app.get("/api/select", (req, res) => {
  let datauuid = [];
  let countQR = req.query.countQR;

  if (countQR <= 0 || countQR == undefined) {
    console.log("Недопустимое значение");
  } else {
    connection.query(
      `SELECT uuid FROM codes WHERE is_printed = 0 LIMIT ${countQR}`,
      function (err, rows) {
        if (err) throw err;
        rows.forEach(function (row) {
          datauuid.push(row.uuid);
        });
        res.send(datauuid);
      }
    );

    connection.query(
      `UPDATE codes SET is_printed = '1' WHERE is_printed = 0 LIMIT ${countQR}`,
      function (err, rows) {
        if (err) throw err;
      }
    );
  }
});

app.get("/api/scan", (req, res) => {
  let datauuid = [];
  let code = req.query.code;

  connection.query(
    `SELECT * FROM codes WHERE uuid = "${code}"`,
    function (err, rows) {
      if (err) throw err;
      rows.forEach(function (row) {
        if (row.is_printed == 1) {
          row.is_printed = 'Напечатано'
        } else {
          row.is_printed = 'Не напечатано'
        }
        datauuid.push([row.uuid, row.is_printed]);
      });
      res.send(datauuid);
    }
  );
});

app.listen(3010, () => {
  console.log(`Server listening on port 3010`);
});
