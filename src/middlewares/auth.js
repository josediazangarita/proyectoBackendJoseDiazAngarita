/*const auth = function (req, res, next) {
    const { username, password } = req.query;

    if (username !== 'JGDA' || password !== '1234') {
        return res.send('Usuario o contraseña incorrectos');
    }

    req.session.user = username;
    req.session.admin = true;

    return next();
}

export default auth;*/

const auth = function (req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    return next();
}

export default auth;
