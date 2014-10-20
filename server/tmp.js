var fs = require('fs')
  , db = require('./model/db')
  , path = require('path')
  , mongoose = require('mongoose');

fs.readdir(path.join(__dirname, '..', '..', 'TargetPred', 'ligand_svg', 'ligand_svg'), function(err, files){
  var saveDatabase = function(svg_files){
    var file = svg_files.shift();
    var fname = path.join(__dirname, '..', '..', 'TargetPred', 'ligand_svg', 'ligand_svg', file);
    fs.readfile(fname, function(err, data){
      var Structure = mongoose.model('Structure');
      var user = new Structure({
        id: path.basename(file, '.svg'),
        svg: data
      });
      user.save(function(err){
        if (err) {
          console.log(err); 
        }
        saveDatabase(svg_files);
      });
    });
  };
  saveDatabase(files.slice(0,3));
});