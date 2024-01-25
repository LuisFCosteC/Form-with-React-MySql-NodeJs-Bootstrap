const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"employees_crud"
});

app.post("/create", (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const country = req.body.country;
    const workPosition = req.body.workPosition;
    const yearsWork = req.body.yearsWork;

    db.query('INSERT INTO employees (name, age, country, workPosition, yearsWork) VALUES (?, ?, ?, ?, ?)', [name, age, country, workPosition, yearsWork],
    (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result)
        }
    }
    );
});

app.get("/employees", (req, res) => {
    db.query('SELECT * FROM employees',
    (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result)
        }
    }
    );
});

app.put("/update", (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const age = req.body.age;
    const country = req.body.country;
    const workPosition = req.body.workPosition;
    const yearsWork = req.body.yearsWork;

    db.query('UPDATE employees SET name=?, age=?, country=?, workPosition=?, yearsWork=? WHERE id=?', [name, age, country, workPosition, yearsWork, id],
    (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result)
        }
    }
    );
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM employees WHERE id=?',id,
    (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result)
        }
    }
    );
});

app.listen(3001, () => {
    console.log("Running in port 3001")
})