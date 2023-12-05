const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter an username."],
    unique: true,
    minLength: [4, "Minimum username length is 4 characters."],
  },
  password: {
    type: String,
    required: [true, "Please enter an Password."],
    minLength: [6, "Minimum password length is 6 characters."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

/**
 * fire a function before student is saved to db
 */

schema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  //console.log(this.password);
  next();
});


/**
 * static method to login student
 */

schema.statics.login = async function (name, password) {
  const student = await this.findOne({ name: name });
  if (student) {
    const auth = await bcrypt.compare(password, student.password);
    if (auth) {
      return student;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Incorrect Username");
};

const studentCollection = mongoose.model("studentCollection", schema);
module.exports = studentCollection;
