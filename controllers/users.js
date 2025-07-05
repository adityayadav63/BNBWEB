const User = require("../models/user");


module.exports.rendersignupform = (req, res) => {
    res.render("user/signup.ejs");                          
};

module.exports.renderloggedinform =  (req, res) => {
    res.render("user/login.ejs")
};



module.exports.signup = (async (req, res) => {
        try {
            let { username, email, password } = req.body;
            const newuser = new User({ email, username });
            const ragisteredUser = await User.register(newuser, password);
            console.log(ragisteredUser);
            req.login(ragisteredUser, (err) => {
                if (err) {
                    return next(err);

                }
                req.flash("success", "welcome to RENTRICH ")
                res.redirect("/listings")
            })
        } catch (e) {
            req.flash("error", e.message)
            res.redirect("/signup")
        }

    })


    module.exports.login =  async (req, res) => {
        req.flash("success", "welcome Back toRENTRICH!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    };

    module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "you are logged out!")
        res.redirect("/listings")
    })
};