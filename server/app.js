var express = require('express')
  , fs = require('fs')
  , exec = require('child_process').exec
  , db = require('./model/db')
  , userfunc = require('./model/user.js')
  , jobfunc = require('./model/job.js')
  , captchafunc = require('./model/captcha.js')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , morgan = require('morgan')
  , methodOverride = require('method-override')
  , errorhandler = require('errorhandler')
  , captchapng = require('captchapng');

var pass = require('pwd');

var app = express();

// all environments
app.set('port', process.env.PORT || 5555);
app.set('views', __dirname + '../client');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, '/../client')));

// development only
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/../client/index.html');
});
app.get('/signup', function(req, res){
  res.redirect('/#signup');
});
app.get('/signin', function(req, res){
  res.redirect('/#signin');
});
app.get('/create', function(req, res){
  res.redirect('/#create');
});
app.get('/view', function(req, res){
  res.redirect('/#view');
});
app.get('/download/:id', function(req, res){
  var file = __dirname + '/' + req.params.id + '.csv';
  res.download(file);
});

app.post('/signup/check/username', function(req, res) {
  var username = req.body.username;
  // check if username contains non-url-safe characters
  if (username !== encodeURIComponent(username)) {
    res.status(403).json({
      invalidChars: true
    });
    return;
  }
  userfunc.is_unique_username(username, function(status){
    if (status == 'duplicate'){
        res.status(403).json({
          isTaken: true
        });
    }else{
      res.status(200).end();
    }
  });
  return;
});
app.post('/signup', function(req, res) {

  var username = req.body.username;
  var email = req.body.email;
  var country = req.body.country;
  var organization = req.body.organization;
  var password = req.body.password;
  var verification = req.body.verification;

  var error = null;
  var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

  // check for valid inputs
  if (!username || !email || !password || !verification) {
    error = 'All fields are required';
  } else if (username !== encodeURIComponent(username)) {
    error = 'Username may not contain any non-url-safe characters';
  } else if (!email.match(EMAIL_REGEXP)) {
    error = 'Email is invalid';
  } else if (password !== verification) {
    error = 'Passwords don\'t match';
  }
  
  if (error) {
      res.status(403).json({
        error: error
      });
    return;
  }

  // check if username is already taken
  userfunc.is_unique_username(username, function(status){
    switch(status){
      case 'error':
        res.status(500).json({
          error: 'Database error! Please try again later.'
        });
        break;
      case 'duplicate':
        res.status(403).json({
          error: 'Username is already taken'
        });
        break;
      case 'success':
        pass.hash(password, function(err, salt, hash){
          if (err) console.log(err);
          
          var user = {
            username: username,
            email: email,
            country: country,
            organization: organization,
            salt: salt,
            hash: hash,
            date: Date.now()
          };
          
          // save user to db
          userfunc.create_user(user, function(status){
            if (status == 'error') {
              res.status(500).json({
                error: 'Database error! Please try again later.'
              });
            } else {
              res.status(200).json(user);
            }
          });
        });
        break;
      default:
        break;
    }
  });
  return;
});
app.post('/signin', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  userfunc.get_salt_hash(username, function(status, rst){
    switch(status){
      case 'error':
        res.status(500).json({
          error: 'Database error! Please try again later.'
        });
        break;
      case 'fail':
        res.status(401).json({
          error: 'Username not found.'
        });
        break;
      case 'success':
        pass.hash(password, rst.salt, function(err, hash){
          if (err) console.log(err);

          if (hash == rst.hash) {
            res.status(200).end();
          }else{
            res.status(401).json({
              error: 'Incorrect password.'
            });
          }
        });
        break;
      default:
        break;
    }
  });
  return;
});
app.post('/create', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var smiles = req.body.smiles;
  var captcha_id = req.body.captcha_id;
  var captcha_code = req.body.captcha_code;
  captchafunc.get_code_and_remove(captcha_id, function(status, code){
    if (status == 'error'){
      res.status(500).json({
        error: 'Database error! Please try again later.'
      });
    }else{
      if (parseInt(code) === parseInt(captcha_code)){
        userfunc.get_salt_hash(username, function(status, rst){
          switch(status){
            case 'error':
              res.status(500).json({
                error: 'Database error! Please try again later.'
              });
              break;
            case 'fail':
              res.status(401).json({
                error: 'Username not found.'
              });
              break;
            case 'success':
              pass.hash(password, rst.salt, function(err, hash){
                if (err) console.log(err);

                if (hash == rst.hash) {
                  jobfunc.create_job(username, smiles, function(status, job){
                    if (status == 'error'){
                      res.status(500).json({
                        error: 'Database error! Please try again later.'
                      });                
                    }else{
                      infile = job._id + '.smi';
                      outfile = job._id + '.csv';
                      fs.writeFile(infile, smiles, function(err){
                        if (err) {
                          console.log(err);
                        }else{
                          var predict = exec('python predict.py -output ' + outfile + ' -smiles ' + infile);
                          predict.on('close', function(code){
                            if (code == 0){
                              // exit successfully
                              exit_status = 1;
                            }else{
                              // exit with error
                              exit_status = 2;
                            }
                            jobfunc.update_job_status(job._id, exit_status, function(status){
                              if (status == 'error'){
                                res.status(500).json({
                                  error: 'Database error! Please try again later.'
                                });
                              }else{
                                res.status(200).end();
                              }
                            });
                          });
                          res.status(200).end();
                        }
                      });
                    }
                  });
                }else{
                  res.status(401).json({
                    error: 'Incorrect password.'
                  });
                }
              });
              break;
            default:
              break;
          }
        });   
      }else{
        var code = parseInt(Math.random()*9000+1000);
        captchafunc.create_captcha(code, function(status, id){
          if (status == 'error'){
            res.status(500).json({
              error: 'Database error! Please try again later.'
            });                
          }else{
            var p = new captchapng(80, 30, code);
            p.color(0, 0, 0, 0);
            p.color(80, 80, 80, 255);
            res.status(401).json({
              id: id,
              captcha: p.getBase64(),
              error: 'Incorrect validation code'
            });
          }
        });    
      }     
    }
  });
  return;
});
app.post('/list', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  userfunc.get_salt_hash(username, function(status, rst){
    switch(status){
      case 'error':
        res.status(500).json({
          error: 'Database error! Please try again later.'
        });
        break;
      case 'fail':
        res.status(401).json({
          error: 'Username not found.'
        });
        break;
      case 'success':
        pass.hash(password, rst.salt, function(err, hash){
          if (err) console.log(err);

          if (hash == rst.hash) {
            jobfunc.list_user_jobs(username, function(status, results){
              if (status == 'error'){
                res.status(500).json({
                  error: 'Database error! Please try again later.'
                });                
              }else{
                res.status(200).json(results);
              }
            });
          }else{
            res.status(401).json({
              error: 'Incorrect password.'
            });
          }
        });
        break;
      default:
        break;
    }
  });
  return;
});
app.post('/captcha/new', function(req, res){
  var code = parseInt(Math.random()*9000+1000);
  captchafunc.create_captcha(code, function(status, id){
    if (status == 'error'){
      res.status(500).json({
        error: 'Database error! Please try again later.'
      });                
    }else{
        var p = new captchapng(80, 30, code);
        p.color(0, 0, 0, 0);
        p.color(80, 80, 80, 255);
        res.status(200).json({
          id: id,
          captcha: p.getBase64()
        });
    }
  });
});
app.post('/captcha/update', function(req, res){
  var id = req.body.id;
  var code = parseInt(Math.random()*9000+1000);
  captchafunc.update_captcha(id, code, function(status){
    if (status == 'error'){
      res.status(500).json({
        error: 'Database error! Please try again later.'
      });
    }else{
        var p = new captchapng(80, 30, code);
        p.color(0, 0, 0, 0);
        p.color(80, 80, 80, 255);
        res.status(200).json({
          captcha: p.getBase64()
        });
    }
  });
});
app.post('/captcha/check', function(req, res){
  var captcha_id = req.body.captcha_id;
  var captcha_code = req.body.captcha_code;
  captchafunc.get_code(captcha_id, function(status, code){
    if (status == 'error'){
      res.status(500).json({
        error: 'Database error! Please try again later.'
      });
    }else{
      if (parseInt(captcha_code) === parseInt(code)){
        res.status(200).end();
      }else{
        res.status(403).json({
          notMatch: true
        });
      }
    }
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});