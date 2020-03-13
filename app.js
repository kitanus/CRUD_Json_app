const express = require("express")
    bodyParser = require("body-parser");

const hostname = '127.0.0.1';
const port = 3000;

const fs = require('fs');
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

let id = false;
let jsonName = null;

app.use(express.static(__dirname));
app.set('views engine', 'pug');

app.get("/", function(req, res)
{
    if(jsonName !== null)
    {
        let obj = JSON.parse(fs.readFileSync(jsonName+".json", 'utf8'));
        res.render('index', {id: id, items: obj["Hospitals"]});
    }
    else
    {
        res.render('index', {id: false, items: false});
    }

});

app.post("/json", urlencodedParser, function(req, res)
{
    fs.access(req.body.json+".json", function(error){
        if (error)
        {
            res.redirect("/");
        }
        else
        {
            jsonName = req.body.json;
            res.redirect("/");
        }
    });
});

app.post("/create", urlencodedParser, function(req, res)
{
    let matches = req.body.phone.match(/^\d[\d\(\)\ -]{4,14}\d$/);

    if (matches === null)
    {
        res.redirect("/");
    }
    else
    {
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
        res.redirect("/");
    }
    else {
        let obj = JSON.parse(fs.readFileSync('lpu.json', 'utf8'));
        obj["Hospitals"][req.body.id]["full_name"] = req.body.full_name;
        obj["Hospitals"][req.body.id]["address"] = req.body.address;
        obj["Hospitals"][req.body.id]["phone"] = req.body.phone;
        let json = JSON.stringify(obj);
        fs.writeFileSync(jsonName + ".json", json);
        id = false;
        res.redirect("/");
    }
});

app.get("/update", urlencodedParser, function(req, res)
{
    id = req.query.id;
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