var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://mongodb-user:I2ZU9PuiOHBlUz1a@cs-web-server.uk2e9.mongodb.net/cs-web-server?retryWrites=true&w=majority";
var router = express.Router();

function compare(a, b) {
    if
    (a["Number"] > b["Number"]) return 1;
    else if
    (a["Number"] < b["Number"]) return -1;
    else {
        if (a["Name"] > b["Name"]) return 1;
        if (a["Name"] < b["Name"]) return -1;
    }

    return 0;
}

function compareDays(a, b) {
    if (a['WeekNumber'] > b['WeekNumber']) return 1;
    else if (a['WeekNumber'] < b['WeekNumber']) return -1;
    else {
        if
        (a["Number"] > b["Number"]) return 1;
        else if
        (a["Number"] < b["Number"]) return -1;
        else {
            return 0
        }
    }
}

function compareCourses(a, b) {
    if (a['Number'] > b['Number']) return 1;
    else return -1;
}

function compareDate(a, b) {
    let aDate = new Date(a.Date);
    let bDate = new Date(b.Date);

    if (aDate > bDate) return -1;
    if (aDate < bDate) return 1;
    return 0;
}

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('undergrad/overview', {
        title: 'Undergraduate Program Overview | Shaw Computer Science',
        admin: req.session.admin
    });
});

router.get('/academics', function (req, res, next) {
    res.render('undergrad/academics', {
        title: 'Undergraduate Program Overview | Shaw Computer Science',
        admin: req.session.admin
    });
});

MongoClient.connect(url, {
    useUnifiedTopology: true
}, (err, client) => {
    if (err) console.error(err);
    console.log("Connected to database");

    const db = client.db("cs-web-server");

    /* GET home page. */
    router.get('/courses', function (req, res, next) {

        db.collection("courses", function (err, collection) {
            collection.find({}).toArray(function (err, result) {
                if (err) {
                    client.close();
                    console.log(err);
                    res.render('courses/index', {
                        title: 'Undergraduate Courses | Shaw Computer Science',
                        admin: req.session.admin
                    });
                }

                result.sort(compareCourses);

                res.render('courses/index', {
                    title: 'Undergraduate Courses | Shaw Computer Science',
                    courses: result,
                    admin: req.session.admin
                });
            });
        });
    });

    /* GET home page. */
    router.get('/courses/:code/:number', function (req, res, next) {
        let code = req.params.code;
        let number = req.params.number;


        db.collection("courses", function (err, collection) {
            collection.findOne({
                "Number": number,
                "Code": code
            }, function (err, result) {
                if (err) {
                    client.close();
                    console.log(err);
                    res.render('courses/index', {
                        title: 'Undergraduate Courses | Shaw Computer Science',
                        admin: req.session.admin
                    });
                }

                res.render('courses/home', {
                    title: code + " " + number + ' Home | Shaw Computer Science',
                    course: result,
                    admin: req.session.admin
                });
            });
        });
    });

    /* GET home page. */
    router.get('/courses/:code/:number/schedule', function (req, res, next) {
        let code = req.params.code;
        let number = req.params.number;

        db.collection("courses", function (err, collection) {
            collection.findOne({
                "Number": number,
                "Code": code
            }, function (err, course) {
                if (err) {
                    client.close();
                    console.log(err);
                }
                db.collection("days", function (err, collection) {
                    collection.find({
                        "CourseNumber": number,
                        "CourseCode": code,
                    }).toArray(function (err, days) {
                        if (err) {
                            client.close();
                            console.log(err);

                        }
                        days.sort(compareDays);

                        let weeks = new Array(20)

                        for (let i = 0; i < days.length; i++) {
                            if (typeof weeks[parseInt(days[i]['WeekNumber'])] === 'undefined') {
                                weeks[parseInt(days[i]['WeekNumber'])] = []
                            }

                            weeks[parseInt(days[i]['WeekNumber'])].push(days[i])
                        }


                        res.render('courses/schedule', {
                            title: 'Schedule | Shaw Computer Science',
                            course: course,
                            weeks: weeks,
                            admin: req.session.admin
                        });
                    });
                });
            });
        });
    });

    /* GET home page. */
    router.get('/courses/:code/:number/about', function (req, res, next) {
        let code = req.params.code;
        let number = req.params.number;


        db.collection("courses", function (err, collection) {
            collection.findOne({
                "Number": number,
                "Code": code
            }, function (err, result1) {
                if (err) {
                    client.close();
                    console.log(err);
                }
                db.collection("faculty", function (err, collection) {
                    collection.findOne({"FacultyID": result1.FacultyID}, function (err, result2) {
                        if (err) {
                            client.close();
                            console.log(err);
                            res.render('courses/index', {
                                title: 'Undergraduate Courses | Shaw Computer Science',
                                admin: req.session.admin
                            });
                        }

                        res.render('courses/about', {
                            title: 'About | Shaw Computer Science',
                            course: result1,
                            faculty: result2,
                            admin: req.session.admin
                        });
                    });
                });
            });
        });
    });

    /* GET home page. */
    router.get('/courses/:code/:number/ppts', function (req, res, next) {
        let code = req.params.code;
        let number = req.params.number;


        db.collection("courses", function (err, collection) {
            collection.findOne({
                "Number": number,
                "Code": code
            }, function (err, result1) {
                if (err) {
                    client.close();
                    console.log(err);
                }
                db.collection("powerpoints", function (err, collection) {
                    collection.find({
                        "CourseNumber": number,
                        "CourseCode": code
                    }).toArray(function (err, result2) {
                        if (err) {
                            client.close();
                            console.log(err);
                            res.render('courses/index', {
                                title: 'Undergraduate Courses | Shaw Computer Science',
                                admin: req.session.admin
                            });
                        }

                        result2.sort(compare);

                        res.render('courses/ppts', {
                            title: 'PowerPoints | Shaw Computer Science',
                            course: result1,
                            ppts: result2,
                            admin: req.session.admin
                        });
                    });
                });
            });
        });
    });

    /* GET home page. */
    router.get('/courses/:code/:number/videos', function (req, res, next) {
        let code = req.params.code;
        let number = req.params.number;


        db.collection("courses", function (err, collection) {
            collection.findOne({
                "Number": number,
                "Code": code
            }, function (err, result1) {
                if (err) {
                    client.close();
                    console.log(err);
                }
                db.collection("videos", function (err, collection) {
                    collection.find({
                        "CourseNumber": number,
                        "CourseCode": code
                    }).toArray(function (err, result2) {
                        if (err) {
                            client.close();
                            console.log(err);
                            res.render('courses/index', {
                                title: 'Undergraduate Courses | Shaw Computer Science',
                                admin: req.session.admin
                            });
                        }

                        let finalResults = {};

                        for (let i = 0; i < result2.length; i++) {
                            if (!finalResults[result2[i].Type]) {
                                finalResults[result2[i].Type] = [];
                            }
                            finalResults[result2[i].Type].push(result2[i])
                        }

                        result2 = [];
                        for (const [key, value] of Object.entries(finalResults)) {
                            console.log(`${key}: ${value}`);
                            result2.push(value.sort(compare));
                        }

                        let finalResult = [];
                        for (let i = 0; i < result2.length; i++) {
                            if (result2[i][0].Type === "Lecture") {
                                finalResult[0] = result2[i];
                            } else if (result2[i][0].Type === "Example") {
                                finalResult[1] = result2[i];
                            } else if (result2[i][0].Type === "Lab") {
                                finalResult[2] = result2[i];
                            } else if (result2[i][0].Type === "Assignment") {
                                finalResult[3] = result2[i];
                            }
                        }

                        res.render('courses/videos', {
                            title: 'Videos | Shaw Computer Science',
                            course: result1,
                            videos: finalResult,
                            admin: req.session.admin
                        });
                    });
                });
            });
        });
    });

    /* GET home page. */
    router.get('/courses/:code/:number/labs', function (req, res, next) {
        let code = req.params.code;
        let number = req.params.number;


        db.collection("courses", function (err, collection) {
            collection.findOne({
                "Number": number,
                "Code": code
            }, function (err, result1) {
                if (err) {
                    client.close();
                    console.log(err);
                }
                db.collection("labs", function (err, collection) {
                    collection.find({
                        "CourseNumber": number,
                        "CourseCode": code
                    }).toArray(function (err, result2) {
                        if (err) {
                            client.close();
                            console.log(err);
                            res.render('courses/index', {
                                title: 'Undergraduate Courses | Shaw Computer Science',
                                admin: req.session.admin
                            });
                        }

                        result2.sort(compare);

                        res.render('courses/labs', {
                            title: 'Labs | Shaw Computer Science',
                            course: result1,
                            labs: result2,
                            admin: req.session.admin
                        });
                    });
                });
            });
        });
    });

    /* GET home page. */
    router.get('/courses/:code/:number/assignments', function (req, res, next) {
        let code = req.params.code;
        let number = req.params.number;


        db.collection("courses", function (err, collection) {
            collection.findOne({
                "Number": number,
                "Code": code
            }, function (err, result1) {
                if (err) {
                    client.close();
                    console.log(err);
                }
                db.collection("assignments", function (err, collection) {
                    collection.find({
                        "CourseNumber": number,
                        "CourseCode": code
                    }).toArray(function (err, result2) {
                        if (err) {
                            client.close();
                            console.log(err);
                            res.render('courses/index', {
                                title: 'Undergraduate Courses | Shaw Computer Science',
                                admin: req.session.admin
                            });
                        }

                        result2.sort(compare);

                        res.render('courses/assignments', {
                            title: 'Assignments | Shaw Computer Science',
                            course: result1,
                            assignments: result2,
                            admin: req.session.admin
                        });
                    });
                });
            });
        });
    });

    /* GET home page. */
    router.get('/courses/:code/:number/help', function (req, res, next) {
        let code = req.params.code;
        let number = req.params.number;


        db.collection("courses", function (err, collection) {
            collection.findOne({
                "Number": number,
                "Code": code
            }, function (err, result) {
                if (err) {
                    client.close();
                    console.log(err);
                    res.render('courses/index', {
                        title: 'Undergraduate Courses | Shaw Computer Science',
                        admin: req.session.admin
                    });
                }

                res.render('courses/help', {
                    title: 'Help | Shaw Computer Science',
                    course: result,
                    admin: req.session.admin
                });
            });
        });
    });

    /* GET home page. */
    router.get('/courses/:code/:number/quizzes', function (req, res, next) {
        let code = req.params.code;
        let number = req.params.number;


        db.collection("courses", function (err, collection) {
            collection.findOne({
                "Number": number,
                "Code": code
            }, function (err, result1) {
                if (err) {
                    client.close();
                    console.log(err);
                }

                db.collection("quizzes", function (err, collection) {
                    collection.find({
                        "CourseNumber": number,
                        "CourseCode": code
                    }).toArray(function (err, result2) {
                        if (err) {
                            client.close();
                            console.log(err);
                            res.render('courses/index', {
                                title: 'Undergraduate Courses | Shaw Computer Science',
                                admin: req.session.admin
                            });
                        }

                        result2.sort(compare);

                        res.render('courses/quizzes', {
                            title: 'Quizzes | Shaw Computer Science',
                            course: result1,
                            quizzes: result2,
                            admin: req.session.admin
                        });
                    });
                });
            });
        });
    });

    /* GET home page. */
    router.get('/courses/:code/:number/resources', function (req, res, next) {
        let code = req.params.code;
        let number = req.params.number;


        db.collection("courses", function (err, collection) {
            collection.findOne({
                "Number": number,
                "Code": code
            }, function (err, result) {
                if (err) {
                    client.close();
                    console.log(err);
                    res.render('courses/index', {
                        title: 'Undergraduate Courses | Shaw Computer Science',
                        admin: req.session.admin
                    });
                }

                res.render('courses/resources', {
                    title: 'Resources | Shaw Computer Science',
                    course: result,
                    admin: req.session.admin
                });
            });
        });
    });

    /* GET home page. */
    router.get('/new-courses', function (req, res, next) {
       db.collection("new-bulletin", function (err, collection) {
            collection.find().toArray(function (err, result) {
                if (err) {
                    client.close();
                    console.log(err);
                    res.render('undergrad/new-courses', {
                        title: 'New Courses | Shaw Computer Science',
                        admin: req.session.admin
                    });
                }

                res.render('undergrad/new-courses', {
                    title: 'New Courses | Shaw Computer Science',
                    newCourses: result,
                    admin: req.session.admin
                });
            });
        });
    });

    /* GET home page. */
    router.get('/events', function (req, res, next) {

        db.collection("events", function (err, collection) {
            collection.find({Type: "undergrad"}).toArray(function (err, result2) {
                if (err) {
                    client.close();
                    console.log(err);
                    res.render('undergrad/events', {
                        title: 'Talks and Events | Shaw Computer Science',
                        admin: req.session.admin
                    });
                }

                result2.sort(compareDate);

                res.render('undergrad/events', {
                    title: 'Talks and Events | Shaw Computer Science',
                    events: result2,
                    admin: req.session.admin
                });
            });
        });
    });
});

/* GET home page. */
router.get('/bs', function (req, res, next) {
    res.render('undergrad/bs', {
        title: 'Bachelor of Science (BS) Degree | Shaw Computer Science',
        admin: req.session.admin
    });
});

/* GET home page. */
router.get('/research', function (req, res, next) {
    res.render('undergrad/research', {
        title: 'Undergraduate Research Opportunities | Shaw Computer Science',
        admin: req.session.admin
    });
});

/* GET home page. */
router.get('/innovation-lab', function (req, res, next) {
    res.render('undergrad/research', {
        title: 'Undergraduate Research Opportunities | Shaw Computer Science',
        admin: req.session.admin
    });
});

/* GET home page. */
router.get('/starting', function (req, res, next) {
    res.render('undergrad/starting', {
        title: 'Starting in Computer Science | Shaw Computer Science',
        admin: req.session.admin
    });
});


/* GET home page. */
router.get('/resources', function (req, res, next) {
    res.render('undergrad/resources', {title: 'Resources for Undergraduates | Shaw Computer Science'});
});

/* GET home page. */
router.get('/prospectives', function (req, res, next) {
    res.render('undergrad/prospectives', {title: 'Prospectives | Shaw Computer Science'});
});

module.exports = router;