const express = require("express");
const loginController = require("../controllers/loginController");
const studentController = require("../controllers/studentController");
const teacherController = require("../controllers/teacherController");
const { requireAuthTeacher,requireAuthStudent, checkUser } = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * GET/
 * Login and signup forms routes for student and teacher
 */

//Main Login Page
router.get("/", loginController.loginPage);

//login page for student and teacher
router.get("/loginStudent", loginController.loginStudent);
router.get("/loginTeacher", loginController.loginTeacher);

//signup page for student and teacher
router.get("/signupStudent", loginController.signupStudent);
router.get("/signupTeacher", loginController.signupTeacher);

router.get("/logout", loginController.logout);

/**
 * POST/
 * Register and login Check routes for student and teacher
 */

//check login for student and teacher
router.post("/studentLoginCheck", loginController.loginCheckStudent);
router.post("/teacherLoginCheck", loginController.loginCheckTeacher);

//student register and teacher register
router.post("/registerStudent", loginController.studentRegister);
router.post("/registerTeacher", loginController.teacherRegister);

/**
 * GET/
 * Student Controller Routes
 */
router.get("/search", requireAuthStudent, studentController.studentDashboard);
router.get("/searchKey", studentController.search);

/**
 * Teacher Controller Routes
 */

//Dashboard page
router.get("/show", requireAuthTeacher, teacherController.dashboard);
//add record form
router.get("/add", requireAuthTeacher, teacherController.addRecord);
//edit record form
router.get("/edit/:id", requireAuthTeacher, teacherController.editRecord);

//create the record
router.post("/add", teacherController.createRecord);
//update the record
router.put("/edit/:id", teacherController.updateRecord);
//delete the record
router.delete("/delete/:id", teacherController.deleteRecord);


/**
 * GET/
 * About page
 */
router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
