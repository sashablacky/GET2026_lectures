const fs = require("fs");

function letsRead(filename) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, { encoding: "utf8" }, function (err, contents) {
      if (err) {
        reject(err);
        return;
      }

      resolve(contents);
    });
  });
}

let p1 = letsRead("example.txt");

p1.then(
  function (contents) {
    console.log("p1" + contents);
  },
  function (err) {
    console.log(err.message);
  },
);

let p2 = p1.then(function (value) {
  console.log("from p2 " + value);
});

p2.then(function () {
  console.log("task finished");
});
