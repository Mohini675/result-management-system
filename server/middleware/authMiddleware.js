const jwt = require("jsonwebtoken");
const StudentCollection = require("../models/StudentCollection");
const TeacherCollection = require("../models/TeacherCollection");

/**
 * function to check token for student
 */
const requireAuthStudent = (req, res, next) => {
  const token = req.cookies.jwt;
  //check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      let student = await StudentCollection.findById(decodedToken.id);
      if (err || student === null) {
        res.cookie("jwt", "", { maxAge: 1 });
        res.redirect("/");
      } else {
        next();
      }
    });
  } else {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
  }
};


/**
 * function to check token for teacher
 */
const requireAuthTeacher = (req, res, next) => {
  const token = req.cookies.jwt;
  //check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      let teacher = await TeacherCollection.findById(decodedToken.id);
      if (err || teacher === null) {
        res.redirect("/");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/");
  }
};

/**
 * Check current user is teacher or student
 */
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.cookie("jwt", "", { maxAge: 1 });
        res.locals.student = null;
        res.locals.teacher = null;
        next();
      } else {
        let student = await StudentCollection.findById(decodedToken.id);
        let teacher = await TeacherCollection.findById(decodedToken.id);

        if (student != null) {
          res.locals.student = student;
          res.locals.teacher = null;
          next();
        } else {
          res.locals.teacher = teacher;
          res.locals.student = null;
          next();
        }
      }
    });
  } else {
    res.cookie("jwt", "", { maxAge: 1 });
    res.locals.student = null;
    res.locals.teacher = null;
    next();
  }
};

module.exports = { requireAuthStudent, requireAuthTeacher, checkUser };
