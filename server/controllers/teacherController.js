const Student = require("../models/Students");
const mongoose = require("mongoose");
const { format } = require("date-fns");

/**
 * Handle errors
 */
const handleErrors = (err) => {
  let errors = { name: "", rollNo: "", dob: "", score: "" };
  //console.log(err.message, err.code);

  //duplicate errors code
  if (err.code === 11000) {
    errors.name = "RollNo is already registered.";
    return errors;
  }
  //roll no type caste error
  if (err.message.includes("rollNo: Cast to Number failed")) {
    errors.rollNo = "Roll no can not be String.";
    return errors;
  }
  //score type caste error
  if (err.message.includes("score: Cast to Number failed")) {
    errors.score = "Score can not be String.";
    return errors;
  }
  //name length error
  if (err.message === "Name length") {
    errors.name = "Name length can't be less than 4 characters.";
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
 * GET /
 * Dashboard/homepage for teachers
 */

exports.dashboard = async (req, res) => {
  const locals = {
    title: "Result Management System",
    description: "this is a project using node js",
  };
  let perPage = 6;
  let page = req.query.page || 1;
  try {
    const students = await Student.aggregate([{ $sort: { rollNo: 1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Student.count();
    res.render("student/show", {
      locals,
      students,
      current: page,
      pages: Math.ceil(count / perPage),
      message: req.flash(),
    });
  } catch (err) {
    res.status(400).render("404");
  }
};


/**
 * GET /
 * Add Record Form
 */

exports.addRecord = async (req, res) => {
  const locals = {
    title: "Add new Student",
    description: "this is a project using node js",
  };
  res.render("student/add", { locals, message: req.flash() });
};



/**
 * GET /
 * Edit Record Form
 */
exports.editRecord = async (req, res) => {
  try {
    const students = await Student.findOne({ _id: req.params.id });
    const locals = {
      title: "Edit Student Record",
      description: "this is a project using node js",
    };
    const date = format(students.dob, "yyyy-MM-dd");
    res.render("student/edit", {
      locals,
      students,
      date,
      message: req.flash(),
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).render("404");
  }
};



/**
 * POST/
 * Create new Student
 */

exports.createRecord = async (req, res) => {
  const newStudent = new Student({
    rollNo: req.body.rollNo,
    name: req.body.name,
    dob: req.body.dob,
    score: req.body.score,
  });

  try {
    const student = await Student.create(newStudent);
    await req.flash("success", `Roll no ${student.rollNo} has been created`);
    res.redirect("/show");
  } catch (err) {
    const errors = handleErrors(err);
    if (errors) {
      req.flash(
        "error",
        errors.name + errors.rollNo + errors.dob + errors.score
      );
      res.status(400).redirect("/add");
    }
  }
};



/**
 * GET /
 * Update Student Data
 */

exports.updateRecord = async (req, res) => {
  const id = req.params.id;
  const score = req.body.score;
  try {
    if (req.body.name.length < 4) {
      throw Error("Name length");
    } else if (isNaN(score)) {
      throw Error("score: Cast to Number failed");
    } else {
      const student = await Student.findByIdAndUpdate(req.params.id, {
        rollNo: req.body.rollNo,
        name: req.body.name,
        dob: req.body.dob,
        score: req.body.score,
        updatedAt: Date.now(),
      });
      await req.flash("success", `Roll no ${student.rollNo} has been updated`);
      await res.status(200).redirect("/show");
    }
  } catch (err) {
    const errors = handleErrors(err);
    //console.log(errors);
    if (errors) {
      req.flash("error", errors.score + errors.name);
      res.status(400).redirect(`/edit/${id}`);
    }
  }
};



/**
 * Delete /
 * Delete Student Data
 */
exports.deleteRecord = async (req, res) => {
  try {
    await Student.deleteOne({ _id: req.params.id });
    await req.flash("success", `Record has been deleted`);
    res.status(200).redirect("/show");
  } catch (err) {
    const errors = handleErrors(err);
    //console.log(errors);
    if (errors) {
      req.flash(
        "error",
        errors.score + errors.name + errors.rollNo + errors.dob
      );
      res.status(400).redirect("/show");
    }
  }
};
