const router = require("express").Router();
const userController = require("../controller/userController");
const bookController = require("../controller/bookController");
const couponController = require("../controller/couponController");
const modelController = require("../controller/modelController");
const setController = require("../controller/setController");
const pageController = require("../controller/pagesController");
const uploadsController = require("../controller/uploadsController");
const appInfoController = require("../controller/appInfoController");
const notificationsController = require("../controller/notificationsController");
const userBooksController = require("../controller/userBookController");
const transactionController = require("../controller/transactionController");
const feedBackController = require("../controller/feedBackController");

//user Endpoints
router.get("/users", userController.getAll);
router.get("/users/id/:userId", userController.getUserById);
router.post("/users/create", userController.registerUser);
router.post("/users/google-signIn", userController.loginWithGoogle);
router.post("/users/login-email", userController.loginWithEmail);
router.put("/users/update/device-token", userController.updateDeviceToken);
router.put("/users/refresh", userController.referesh);
router.put("/users/edit", userController.editProfileNoAuth);
router.delete("/users/delete/:userId", userController.deleteProfileNoAuth);
router.put("/users/score/update/:userId", userController.incrementScore);
router.put("/users/score/update/factor/:userId/:factor", userController.incrementScoreByFactor);
router.get("/users/score/board", userController.getScoreBoard);

//userbooks Endpoints
router.get("/user-books/userId", userBooksController.getByUserId);
router.get("/user-books/bookId", userBooksController.getOwnedBooksByBookId);
router.get("/user-books/owns-book", userBooksController.ownsThisBook);
router.put("/user-books/update-progres/amount", userBooksController.updateBookProgressByAmount);
router.put("/user-books/update-progress/increment", userBooksController.updateBookProgressByIncrement);

//book Endpoints
router.get("/books", bookController.getAll);
router.get("/books/id/:id", bookController.getById);
router.get("/books/type", bookController.getByType);
router.get("/books/featured", bookController.getFeatured);
router.post("/books/create", bookController.create);
router.post("/books/activate/coupon", bookController.activateBookByCoupon);
router.post("/books/buy", bookController.getChapaLink);
router.post("/books/callback", bookController.paymentCallback);
router.get("/books/callback", bookController.paymentCallback);
router.options("/books/callback", bookController.paymentCallback);
//router.post("/books/return", bookController.paymentReturn);
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
router.post("/models/create/upload", modelController.updateAndCreateModel);
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
router.post("/pages/create/upload", pageController.uploadAndCreate);
router.put("/pages/edit", pageController.editPage);
router.delete("/pages/delete/:pageId", pageController.delete);

//files
router.post("/files/upload/single", uploadsController.uploadSingle);

//appInfo
router.post("/appInfo/create", appInfoController.create);
router.post("/appInfo/welcome", appInfoController.getAppInfoUpdateScore);
router.get("/appInfo", appInfoController.getAppInfo);
router.get("/appInfo/stats", appInfoController.getAppStats);
router.get("/appInfo/health", appInfoController.deviceHealth);
router.put("/appInfo/edit", appInfoController.editAppInfo);

//notifications
router.post("/notifications/send/all", notificationsController.sendToAll);
router.post("/notifications/send/topic/:topic", notificationsController.sendToTopic);
router.post("/notifications/send/to", notificationsController.sendToDevice);
router.post("/notifications/send/user", notificationsController.sendToUser);

//transactions
router.get("/transactions/", transactionController.getAll);
router.get("/transactions/id/:id", transactionController.getById);
router.get("/transactions/userId/:userId", transactionController.getByUserId);
router.get("/transactions/bookId/:bookId", transactionController.getByBookId);
router.get("/transactions/status/:status", transactionController.getTransactionByStatus);
router.post("/transactions/status/update", transactionController.updateStatus);
router.delete("/transactions/delete/:id", transactionController.remove);

//feedbacks
router.get("/feedbacks", feedBackController.getAll);
router.get("/feedbacks/type", feedBackController.getAllByType);
router.get("/feedbacks/email", feedBackController.getAllByEmail);
router.post("/feedbacks/create", feedBackController.create);
router.delete("/feedbacks/delete/:feedBackId", feedBackController.delete);

module.exports = router;