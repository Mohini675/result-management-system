const Student = require("../models/Students");
const { format } = require("date-fns");

/**
 * Handle errors
 */

const handleErrors = (err) => {
  let errors = { name: "", rollNo: "", dob: "", score: "" };
  //console.log(err.message, err.code);

  //roll no type caste error
  if (err.message.includes("Cast to Number failed")) {
    errors.rollNo = "Roll no can not be String.";
    return errors;
  }
  //validation errors
  if (err.message.includes("studentDb validation failed")) {
    Object.values(err.errors).forEach((properties) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

/**
 * GET/
 * Student Dashboard
 */

exports.studentDashboard = async (req, res) => {
  const locals = {
    title: "Search Student",
    description: "this is a project using node js",
  };
  res.render("student/search", { locals, message: req.flash() });
};

/**
 * GET/
 * Student search with roll no and dob
 */

exports.search = async (req, res) => {
  try {
    const date = format(new Date(req.query.dob), "yyyy-MM-dd");
    const students = await Student.findOne({
      rollNo: req.query.rollNo,
      dob: date,
    });
    if (students) {
      res.render("student/view", { students });
    } else {
      res.render("student/error", {
        errorMessage: "Record not found!!",
      });
    }
  } catch (err) {
    const errors = handleErrors(err);
    //console.log(err);
    if (errors) {
      req.flash("error", errors.rollNo + errors.dob);
      res.status(400).redirect("/search");
    }
  }
};
