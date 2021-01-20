//required items
const path = require('path');
const fs = require('fs');


//path requirements
const OUTPUT_DIR = path.resolve(__dirname, "../db");
outputPath = path.join(OUTPUT_DIR, "db.json");
// var notes = require("../db/db.json");

//empty arrays to put note data into
let notesArray = [];
let savedNotes = [];

//sets a a variable to be exported equal to the return of a function
module.exports = function (app) {
  //creates a get request that pulls any saved note data from the db.json file
  app.get("/api/notes", function (req, res) {
    //adding the array within the function (for scope purposed)
    savedNotes = [];
    //reads the data from the db.json file in human english
    fs.readFile(outputPath, 'utf8', (err, data) => {
      if (err) throw err;
      //if no err occurs, takes read result and stores it as the value of a variable called data
      data = JSON.parse(data)
      //loops through parsed data and pushes it's content into the savedNotes array
      for (i = 0; i < data.length; i++) {
        savedNotes.push(data[i]);
      }
      console.log(savedNotes)
      //returns the savedNotes array content
      res.send(savedNotes);
    });
  });

  //selects the notes file and created a function 
  app.post("/api/notes", function (req, res) {
    //entered array for scope purposes
    notesArray = [];
    notesArray.push(req.body);
    console.log(req.body);


    //reads the outputPath value (db.json) in english
    fs.readFile(outputPath, 'utf-8', (err, data) => {
      if (err) throw err;
      //parses the value of the returned data into a variable called data
      data = JSON.parse(data);
      for (let i = 0; i < data.length; i++) {
        //scans through the data and pushes it into the notesArray
        notesArray.push(data[i])

      }

      //tells the browser to scan through the notes array and add 1 to the value of each returned item's index and set's it id tothat value 
      for (let i = 0; i < notesArray.length; i++) {
        notesArray[i].id = i + 1;

      }
      //exports it 
      res.send(notesArray);
      console.log(notesArray);

      //writes the notes array values to the db.json file and logs success if no error occurs
      fs.writeFile(outputPath, JSON.stringify(notesArray), function (err) {
        if (err) {
          throw err;
        } else {
          console.log("success");
        }


      })
    });
  }

  )

  //write code to empty array 
  app.delete("/api/notes/:id", function (req, res) {
    //empties the notes array
    notesArray = [];
    // sets the value of a variable 
    let noteId = req.params.id;
    console.log(noteId);

    fs.readFile(outputPath, "utf8", (err, data) => {
      if (err) throw err;
      notesArray = JSON.parse(data);

      const newNotesArray = notesArray.filter(note => note.id != noteId);

      console.log(newNotesArray);

      fs.writeFile(outputPath, JSON.stringify(newNotesArray) + "\t", err => {
        if (err) throw err;
        console.log("deleted");
        res.send(newNotesArray)
      })
    })

  });
}