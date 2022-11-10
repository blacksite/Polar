var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://mongodb-user:gRyPhi0hGEq1PYIJ@blacksite.uk2e9.mongodb.net/test?authSource=admin&replicaSet=atlas-10c1sn-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";


function compareDate(a, b) {
    let aDate = new Date(a.Date);
    let bDate = new Date(b.Date);

    if (aDate > bDate) return -1;
    if (aDate < bDate) return 1;
    return 0;
}

MongoClient.connect(url, {
    useUnifiedTopology: true
}, (err, client) => {
    if (err) console.error(err);
    console.log("Connected to database");

    const db = client.db("blacksite");

    /* GET home page. */
    router.get('/', function (req, res, next) {

        db.collection("samples", function (err, collection) {
            collection.find({}).toArray(function (err, result1) {
                if (err) {
                    client.close();
                    console.log(err);
                    res.render('index', {title: 'Polar System Administrator Console'});
                }

                res.render('index', {
                    title: 'Polar System Administrator Console',
                    samples: result1
                });
            });
        });
    });

    router.get('/:FlowID', function (req, res, next) {
       let flowID = req.params.FlowID;

       db.collection("samples", function(err, collection) {
           collection.findOne({FlowID:flowID}, function (err, result) {
                if (err) {
                    client.close();
                    console.log(err);
                    res.render('index', {title: 'Polar System Administrator Console'});
                }

                res.render('sample', {
                    title: flowID,
                    sample: result,
                })
           });
       });
    });
});

module.exports = router;