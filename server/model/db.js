var mongoose = require('mongoose');

function toLower (v) {
  return v.toLowerCase();
}

var userSchema = new mongoose.Schema({
    username: String,
    email: {type: String, set: toLower},
    country: String,
    organization: String,
    salt: String,
    hash: String,
    date: {type: Date, default: Date.now}
});

var jobSchema = new mongoose.Schema({
    username: String,
    smiles: String,
    status: {type: Number, default: 0},
    date: {type: Date, default: Date.now}
});

var captchaSchema = new mongoose.Schema({
    code: Number
});

mongoose.model('User', userSchema);
mongoose.model('Job', jobSchema);
mongoose.model('Captcha', captchaSchema)

mongoose.connect('mongodb://root:Yuan2xian@localhost:27017/TarPred');