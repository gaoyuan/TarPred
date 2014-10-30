var mongoose = require('mongoose');

// create new user
exports.svg = function svg(id, callback){
  var Structure = mongoose.model('Structure');
  Structure.findOne({'_id': id}, 'svg', function(err, result){
    if (err) {
      callback('error');
    } else {
      callback('success', result);
    }
  });
};