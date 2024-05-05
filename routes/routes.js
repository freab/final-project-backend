const router = require("express").Router();
const userController = require("../controller/userController");
const bookController = require("../controller/bookController");
const couponController = require("../controller/couponController");
const modelController = require("../controller/modelController");
const setController = require("../controller/setController");
const pageController = require("../controller/pagesController");
const uploadsController = require("../controller/uploadsController");

//user Endpoints
router.get("/users", userController.getAll);
router.post("/users/google-signIn", userController.loginWithGoogle);
router.post("/users/login-email", userController.loginWithEmail);
router.put("/users/refresh", userController.referesh);
router.put("/users/edit-profile", userController.editProfile);
router.put("/users/delete-profile", userController.deleteProfile);
router.put("/users/score/update/:userId", userController.incrementScore);
router.put("/users/score/update/factor/:userId/:factor", userController.incrementScoreByFactor);
router.get("/users/score/board", userController.getScoreBoard);

//book Endpoints
router.get("/books", bookController.getAll);
router.get("/books/id/:id", bookController.getById);
router.get("/books/type", bookController.getByType);
router.post("/books/create", bookController.create);
router.put("/books/edit", bookController.editBook);
router.delete("/books/delete/:id", bookController.remove);

//Coupon Endpoints
router.get("/coupons", couponController.getAll);
router.get("/coupons/id/:id", couponController.getById);
router.put("/coupons/edit", couponController.editCoupon);
router.post("/coupons/create", couponController.create);
router.delete("/coupons/delete/:id", couponController.remove);

//Model Endpoints
router.get("/models", modelController.getAll);
router.post("/models/create", modelController.create);
router.get("/models/id/:id", modelController.getById);
router.put("/models/edit", modelController.editModel);
router.delete("/models/delete/:id", modelController.deleteModel);

//Set Endpoints
router.get("/sets", setController.getAll);
router.get("/sets/id/:id", setController.getById);
router.post("/sets/create", setController.create);
router.put("/sets/edit", setController.editSet);
router.delete("/sets/delete/:id", setController.delete);

//page Endpoints
router.get("/pages", pageController.getAll);
router.get("/pages/id/:pageId", pageController.getById);
router.get("/pages/bookId/:bookId", pageController.getByBookId);
router.post("/pages/create", pageController.create);
router.put("/pages/edit", pageController.editPage);
router.delete("/pages/delete/:pageId", pageController.delete);

//files
router.post("/files/upload/single", uploadsController.uploadSingle);

module.exports = router;