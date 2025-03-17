import { signup, login } from "../Controllers/AuthController.js";
import { signupValidation, loginValidation } from "../Middlewares/AuthValidation.js";
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);



router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: "http://localhost:5173/login",
    session: false
}), (req, res) => {
    if (!req.user) {
        return res.redirect("http://localhost:5173/login");
    }

    // Generate JWT token
    const token = jwt.sign(
        { email: req.user.email, _id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    console.log("JWT Token:", token);

    
    // res.redirect(`http://localhost:5173/login?token=${token}`);
    res.redirect(`http://localhost:5173/login?token=${token}`);
});



export default router;