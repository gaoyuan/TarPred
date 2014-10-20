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

var structureSchema = new mongoose.Schema({
    id: String,
    svg: String
});

var resultSchema = new mongoose.Schema({
    bindingDB: [mongoose.Types.String],
    drugbank: [mongoose.Types.String],
    GeneID: String,
    diseases: [mongoose.Types.String],
    neighbors: [mongoose.Types.String]
});

var jobSchema = new mongoose.Schema({
    username: String,
    smiles: String,
    status: {type: Number, default: 0}, // 0: new, 1: error, 2: done
    progress: {type: Number, default: 0},
    date: {type: Date, default: Date.now},
    results: [resultSchema]
});

var captchaSchema = new mongoose.Schema({
    code: Number
});

mongoose.model('User', userSchema);
mongoose.model('Result', resultSchema);
mongoose.model('Structure', structureSchema);
mongoose.model('Job', jobSchema);
mongoose.model('Captcha', captchaSchema);

mongoose.connect('mongodb://root:miss_babyface@localhost:27017/TarPred');