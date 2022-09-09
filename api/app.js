var createError = require("http-errors");
// we added express
var express = require("express");
bodyParser = require("body-parser");
//we add it to connect to mysql
var mysql = require("mysql");

var path = require("path");
var logger = require("morgan");

//add the library we installed
var cors = require("cors");

//we create connction
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodemysql",
});

//connect to mysql
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("my sql connected");
});
var app = express();

// enable CORS using npm package
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Create database
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE nodemysql";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.sendStatus("Database Created");
  });
});

//create table is mysql
app.get("/createemployee", (req, res) => {
  let sql =
    "CREATE TABLE employee (id int AUTO_INCREMENT, name VARCHAR(255), designation VARCHAR(255), PRIMARY KEY(id))";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.sendStatus("Employee table created");
  });
});

//Insert employee
app.get("/employee1", (req, res) => {
  let post = { name: "Jack Smith", designation: "Chief Executive Officer" };
  let sql = "INSERT INTO employee SET ?";
  let query = db.query(sql, post, (err) => {
    if (err) {
      throw err;
    }
    res.sendStatus("Employee added");
  });
});

//Select employee
app.get("/getemployee", (req, res) => {
  let sql = "SELECT * FROM employee";
  let query = db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results);
    res.sendStatus("Employee details fetched");
  });
});

//update employee
app.get("/updateemployee/:id", (req, res) => {
  let newName = "Updated name";
  let sql = `UPDATE employee SET name = '${newName}' WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err) => {
    if (err) {
      throw err;
    }

    res.sendStatus("Employee updated");
  });
});

//Delete employee
app.get("/deleteemployee/:id", (req, res) => {
  let sql = `DELETE FROM employee WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err) => {
    if (err) {
      throw err;
    }

    res.sendStatus("Employee deleted");
  });
});

// Calculate preferences for user
app.get("/calcpref/:id", cors(), (req, res) => {
  const { id } = req.params;
  // get user
  db.query(`SELECT * FROM details WHERE id = ${id}`, (err, user) => {
    const row = user[0];
    const genderPref = row["genderPref"];
    const locationPref = row["locationPref"];
    const numOfKids = row["numOfKids"];
    const education = row["education"];

    console.log(genderPref, locationPref, numOfKids, education);

    // get matching preferences
    const userPref = `SELECT * FROM details \
    WHERE gender = '${genderPref}' \
    OR location = '${locationPref}' \
    OR numOfKids = '${numOfKids}' \
    OR education = '${education}' \
    `;
    db.query(userPref, (err, matches) => {
      // run matching algorithm calculation
      const userIdToScore = [];
      for (const match of matches) {
        // ignore undesired gender
        if (match["gender"] !== genderPref) continue;
        let score = 0;
        if (match["location"] == locationPref) score += 0.33;
        if (match["numOfKids"] == numOfKids) score += 0.33;
        if (match["education"] == education) score += 0.33;
        // insert match result
        userIdToScore.push({ ...match, score });
      }

      const sortedList = userIdToScore.sort((a, b) => {
        return b.score - a.score;
      });

      console.log(sortedList);
      res.status(200).send(sortedList);
    });
  });
});









//for stable matching

async function getPreferredMatching(user) {
  const preferredMatchingPromise = new Promise((resolve, reject) => {
    const genderPref = user["genderPref"];
    const locationPref = user["locationPref"];
    const numOfKids = user["numOfKids"];
    const education = user["education"];
    // get matching preferences
    const userPref = `SELECT * FROM details \
    WHERE gender = '${genderPref}' \
    OR location = '${locationPref}' \
    OR numOfKids = '${numOfKids}' \
    OR education = '${education}' \
    `;
    db.query(userPref, (err, res) => {
      // run matching algorithm calculation
      const userIdToScore = [];
      for (const match of res) {        
        // ignore undesired gender
        if (match["gender"] !== genderPref) continue;
        let score = 0;
        if (match["location"] == locationPref) score += 0.33;
        if (match["numOfKids"] == numOfKids) score += 0.33;
        if (match["education"] == education) score += 0.33;
        // insert match result
        userIdToScore.push({ ...match, score });
      }
      const sortedList = userIdToScore.sort((a, b) => {
        return b.score - a.score;
      });
      return resolve(sortedList);
    });
  });
  const result = await preferredMatchingPromise;
  return result;
}

// helper function for matching algorithm
function hasFreeMen(men) {
  // convert object to array of usernames
  const users = Object.keys(men);
  let hasFreeMan = false;
  users.forEach((name) => {
    const user = men[name];
    // if user is still single and stil have prefs
    if (!user.match && user.prefs.length > 0) hasFreeMan = true;
  });
  return hasFreeMan;
}

// stable matching algorithm - Gale-Shapley
app.get("/matching", cors(), async (req, res) => {
  const men = {};
  const women = {};

  const getAllPreferences = new Promise((resolve, reject) => {
    db.query(`SELECT * FROM details`, async (err, rows) => {
      for (const user of rows) {
        // 1. prep list: get all preferences for each user
        const username = user["username"];
        const prefs = await getPreferredMatching(user);
        // men = [ 'moshe' : [{ prefs: [..], match: null } ]
        
        if (user["gender"] === "Man") {
          men[username] = { prefs, match: null };
        } else {
          women[username] = { prefs, match: null };
        }
      }
      resolve();
    });
  });
  // wait for preferences to be filled
  await getAllPreferences;
  //console.log(men, women);

  // [moshe, yossi, david]

  // 2. run while there are free men who hasnt proposed
  const menList = Object.keys(men);
  const womenList = Object.keys(women);  

  
  // if men list length is not equal to women list - throw error
  if (menList.length !== womenList.length) {
    const errorMessage = "Cant run match, list is not equal";
    console.error(errorMessage, menList.length, womenList.length);
    return res.status(200).send({ error: errorMessage });
  }
  
  // start matching!
  let currentManIndex = 0;
  while (hasFreeMen(men)) {
    // first: get current man to check
    const currentManName = menList[currentManIndex];
    // update the index - for the next round
    // example: [moshe, yossi] index: 0, 1 (length=2)
    if (currentManIndex + 1 >= menList.length) {
      currentManIndex = 0;
    } else {
      currentManIndex += 1;
    }
    // if man has match - continue
    if (men[currentManName].match !== null) {
      console.log(currentManName, "already match");
      //go back to while
      continue;
    }

    // The shift() method removes the first element from an array and returns that removed element. This method changes the length of the array.
    const firstManPref = men[currentManName].prefs.shift();
    const matchName = firstManPref.username;
    const desiredWoman = women[matchName];
    // if not proposed yet
    if (!desiredWoman.match) {
      men[currentManName].match = matchName;
      women[matchName].match = currentManName;
    }
    // if propoesed, check if preferred
    else {
      const lastMatchName = desiredWoman.match;
      const lastMatchPos = desiredWoman.prefs.indexOf(lastMatchName);
      const currentMatchPos = desiredWoman.prefs.indexOf(currentManName);
      // if current men is preferred (before) the match change the matching
      if (currentMatchPos < lastMatchPos) {
        //send last man to free
        men[lastMatchPos].match = null;
        //current man engage
        men[currentManName].match = matchName;
        women[matchName].match = currentManName;
      }
      // else: man is rejected
    }
  }

  // now we have matches
  console.log("\n\nCouples match:");
  menList.forEach(name => {
    const man = men[name];
    console.log(`** ${name} <> ${man.match} **\n`);
  });

  res.status(200).send({ men, women });
});

/*
data = {
education: "religious school"
email: "email"
gender: "gender"
genderPref: "Man"
location: "location"
locationPref: "North"
numOfKids: "one"
username: "name"
}
*/
app.post("/register", cors(), (req, res) => {
  const {
    username,
    email,
    education,
    gender,
    genderPref,
    location,
    locationPref,
    numOfKids,
  } = req.body.data;
  db.query(
    "INSERT INTO details (username, email, education, gender, genderPref, location, locationPref, numOfKids) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      username,
      email,
      education,
      gender,
      genderPref,
      location,
      locationPref,
      numOfKids,
    ],
    (err, result) => {
      if (!err) {
        res.send({ id: result.insertId });
      } else {
        console.log(err);
        res.sendStatus(500);
      }
    }
  );
});

app.post("/match:user_id", cors(), (req, res) => {
  // get current user data
});

app.use(logger("dev"));

app.listen("9000", () => {
  console.log("Server started on port 9000");
});

module.exports = app;
