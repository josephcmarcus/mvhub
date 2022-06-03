module.exports.index = (req, res) => {
    console.log('hit on /');
    res.render('index');
};