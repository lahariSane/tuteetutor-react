// test-solr-connection.js
import http from "http";

const options = {
  hostname: "localhost",
  port: 8983,
  path: "/solr/admin/cores?action=STATUS",
  method: "GET",
};

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on("data", (d) => {
    process.stdout.write(d);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.end();
