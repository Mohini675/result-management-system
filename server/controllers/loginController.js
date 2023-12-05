const StudentCollection = require("../models/StudentCollection");
const TeacherCollection = require("../models/TeacherCollection");
const jwt = require("jsonwebtoken");

/**
 * Create Token
 */
const maxAge = 3 * 24 * 60 * 60; //3days
const createToken = (id) => {
  return jwt.sign({ id }, "login secret key", {
    expiresIn: maxAge,
  });
};

/**
 * Handle errors
 */
const handleErrors = (err) => {
  let errors = { name: "", password: "" };
  //console.log(err.code);

  //incorrect username
  if (err.message === "Incorrect Username") {
    errors.name = "Email is not registered";
  }

  //incorrect password
  if (err.message === "Incorrect Password") {
    errors.name = "Incorrect Password";
  }

  //duplicate errors code
  if (err.code === 11000) {
    errors.name = "Username is already registered";
    return errors;
  }
  //validation errors
  if (
    err.message.includes("studentCollection validation failed") ||
    err.message.includes("teacherCollection validation failed")
  ) {
    Object.values(err.errors).forEach((properties) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

/**
 * GET/
 * Main Login page
 */
exports.loginPage = async (req, res) => {
  res.clearCookie("jwt");
  const locals = {
    title: "Login Page",
    description: "this is a project using node js",
  };
  res.render("login", { locals });
};

/**
 * GET/
 * login form for student
 */
exports.loginStudent = async (req, res) => {
  const locals = {
    title: "Student Login Page",
    description: "this is a project using node js",
  };
  res.render("loginForms/studentLogin", {
    locals,
    message: req.flash(),
  });
};

/**
 * GET/
 * login form for Teacher
 */
exports.loginTeacher = async (req, res) => {
  const locals = {
    title: "Teacher Login Page",
    description: "this is a project using node js",
  };
  res.render("loginForms/teacherLogin", {
    locals,
    message: req.flash(),
  });
};

/**
 * GET/
 * sign up form for student
 */
exports.signupStudent = async (req, res) => {
  const locals = {
    title: "Student SignUp Page",
    description: "this is a project using node js",
  };
  res.render("loginForms/studentSignup", {
    locals,
    message: req.flash(),
  });
};

/**
 * GET/
 * sign up form for teacher
 */

exports.signupTeacher = async (req, res) => {
  const locals = {
    title: "Teacher SignUp Page",
    description: "this is a project using node js",
  };
  res.render("loginForms/TeacherSignup", {
    locals,
    message: req.flash(),
  });
};

/**
 * GET/
 * Logout
 */
exports.logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

/**
 * POST/
 * Register student
 */
exports.studentRegister = async (req, res) => {
  const data = new StudentCollection({
    name: req.body.name,
    password: req.body.password,
  });
  try {
    const student = await StudentCollection.create(data);
    req.flash("success", "Student created !! Now Login..");
    res.redirect("/loginStudent");
  } catch (err) {
    const errors = handleErrors(err);
    if (errors) {
      req.flash("error", errors.name + errors.password);
      res.redirect("/signupStudent");
    }
  }
};

/**
 * POST/
 * Register teacher
 */
exports.teacherRegister = async (req, res) => {
  const data = new TeacherCollection({
    name: req.body.name,
    password: req.body.password,
  });
  try {
    const teacher = await TeacherCollection.create(data);
    req.flash("success", "Teacher created !! Now Login..");
    res.redirect("/loginTeacher");
  } catch (err) {
    const errors = handleErrors(err);
    console.log(errors);
    if (errors) {
      req.flash("error", errors.name + errors.password);
      res.redirect("/signupTeacher");
    }
  }
};

/**
 * POST/
 * check login for student
 */
exports.loginCheckStudent = async (req, res) => {
  const { name, password } = req.body;
  try {
    const student = await StudentCollection.login(name, password);
    const token = createToken(student._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).redirect("/search");
  } catch (err) {
    const errors = handleErrors(err);
    //console.log(errors);
    if (errors) {
      req.flash("error", errors.name + errors.password);
      res.status(400).redirect("/loginStudent");
    }
  }
};

/**
 * POST/
 * check login for teacher
 */

exports.loginCheckTeacher = async (req, res) => {
  const { name, password } = req.body;
  try {
    const teacher = await TeacherCollection.login(name, password);
    const token = createToken(teacher._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).redirect("/show");
  } catch (err) {
    const errors = handleErrors(err);
    //console.log(errors);
    if (errors) {
      req.flash("error", errors.name + errors.password);
      res.status(400).redirect("/loginTeacher");
    }
  }
};
