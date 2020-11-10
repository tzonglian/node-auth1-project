require("dotenv").config();
const server = require("./server");

const PORT = process.env.PORT || 4500;

server.listen(PORT, () => {
  console.log(`\n listening in port ${PORT}`.bgBlue);
});
