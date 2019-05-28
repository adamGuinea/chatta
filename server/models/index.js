const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/chatta", {
  keepAlive: true,
  useNewUrlParser: true
  // useMongoClient: true,
});

module.exports.User = require("./user");
module.exports.Message = require("./message");
