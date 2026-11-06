async function readFile3() {
  let p1 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done"), 2000);
  });

  let p2 = await p1;
  console.log("from p1 " + p2);

  let p3 = await p2;
  console.log("from p2 " + p3);
}

readFile3();
