const express = require("express")
    bodyParser = require("body-parser");

const hostname = '127.0.0.1';
const port = 3000;

const fs = require('fs');
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

let update = [];
update["id"] = false;
let msg = [];
let jsonName = null;

app.use(express.static(__dirname));
app.set('views engine', 'pug');

app.get("/", urlencodedParser, function(req, res)
{
    if(jsonName !== null)
    {
        let obj = JSON.parse(fs.readFileSync(jsonName+".json", 'utf8'));
        res.render('index', {
            update: update,
            items: obj["Hospitals"],
            msg: msg
        });
    }
    else
    {
        res.render('index', {update: false, items: false, msg: msg});
    }
});

app.post("/json", urlencodedParser, function(req, res)
{
    fs.access(req.body.json+".json", function(error){
        if (error)
        {
            msg["json"] = "Ошибка! Не правильно введено название json файла ";
            res.redirect("/");
        }
        else
        {
            jsonName = req.body.json;
            msg["json"] = "";
            res.redirect("/");
        }
    });
});

app.post("/create", urlencodedParser, function(req, res)
{
    let matches = req.body.phone.match(/^\d[\d\(\)\ -]{4,14}\d$/);

    if (matches === null)
    {
        msg["phone"] = "Ошибка! Неправильно введен телефон";
        res.redirect("/");
    }
    else
    {
        msg["phone"] = "";
        let obj = JSON.parse(fs.readFileSync(jsonName+".json", 'utf8'));
        obj["Hospitals"].push(req.body);
        let json = JSON.stringify(obj);
        fs.writeFileSync(jsonName+".json", json);
        res.redirect("/");
    }


});

app.post("/update", urlencodedParser, function(req, res)
{
    let matches = req.body.phone.match(/^\d[\d\(\)\ -]{4,14}\d$/);

    if (matches === null)
    {
        msg["phone"] = "Ошибка! Неправильно введен телефон";
        res.redirect("/");
    }
    else
    {
        msg["phone"] = "";
        let obj = JSON.parse(fs.readFileSync('lpu.json', 'utf8'));
        obj["Hospitals"][req.body.id]["full_name"] = req.body.full_name;
        obj["Hospitals"][req.body.id]["address"] = req.body.address;
        obj["Hospitals"][req.body.id]["phone"] = req.body.phone;
        let json = JSON.stringify(obj);
        fs.writeFileSync(jsonName + ".json", json);
        update = false;
        res.redirect("/");
    }
});

app.get("/update", urlencodedParser, function(req, res)
{
    let obj = JSON.parse(fs.readFileSync(jsonName+".json", 'utf8'));
    update['id'] = req.query.id;
    update['full_name'] = obj["Hospitals"][req.query.id]['full_name'];
    update['address'] = obj["Hospitals"][req.query.id]['address'];
    update['phone'] = obj["Hospitals"][req.query.id]["phone"];
    res.redirect("/");
});

app.get("/delete", urlencodedParser, function(req, res)
{
    let obj = JSON.parse(fs.readFileSync('lpu.json', 'utf8'));
    obj["Hospitals"].splice(req.query.id, 1);
    let json = JSON.stringify(obj);
    fs.writeFileSync(jsonName+".json", json);
    res.redirect("/");
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});