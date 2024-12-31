import express from 'express';
import { checkAuth, Signin, Signout, Signup, UpdateProfile } from '../controllers/authController.js';
import { protectRoute } from '../middleware/authRoute.js';


const router = express.Router();

router.post("/signup", Signup)
router.post("/signin", Signin)
router.get("/signout", Signout)
router.put("/update-profile", protectRoute, UpdateProfile)
router.get("/check", protectRoute, checkAuth)



export default router