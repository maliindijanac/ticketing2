const express = require ('express');
const router = express.Router();
var User = require ('../modules/user');
const jwt = require ('jsonwebtoken');

var userid = '';
var userrole = '';
// CRUD api za korisnika

// lista svih korisnika
router.get('/',checkToken, function (req,res) {

    User.find({}, function (err,users){
        if (err) {
            res.send(err);
        } else {
            res.send(users)
        }

    });
});

// lista developera
router.get('/querydev',checkToken, function (req,res) {
    User.find({"role":"developer"}, function (err,users){
        if (err) {
            res.send(err);
        } else {
            res.send(users)
        }

    });
});


//brisanje jednog korisnika
router.delete('/:id',checkToken,  function (req,res) {
    var query = {_id:req.params.id};
    User.deleteOne (query,function(err, user) {
        if (err) {
            res.send(err);    
        } else {
            res.send(user);
        }
    });
});

// update korisnika

router.put('/:id', checkToken, function (req,res) {
    var query = {_id:req.params.id};
    User.findOneAndUpdate (query,
                           {name:req.body.name,
                            email:req.body.email,
                            role:req.body.role,
                            username:req.body.username
                           },                           
                            function(err,user) {
        if (err) {
            res.send(err);    
        } else {
           // req.flash ('success','User modified');
            res.send(user);
        }
    });
});


// prijava na aplikaciju
router.post('/login', function (req,res) {
    // traži korisnika po username i passwordu
    User.findOne ({username:req.body.username,
                   password:req.body.password}, 
                function (err,user) {
                    if (err) {
                        res.status(401).send(err);
                    } else {
                        //console.log('našao');
                        //console.log(user);
                        if (user) {
                            // pronađen korisnika
                            var token = jwt.sign(user.toJSON(),'aminasifra' /*,{expiresIn : 20000}*/ );
                            res.status(200).send ({
                                success : true,
                                message: "Authenticated",
                                token : token,
                                userid: user._id,
                                isadmin: user.role == 'admin'
                            });
                        } else {
                            // ne postoji korisnik
                            // return status OK poruka greške
                            res.status(200).send ({
                                success : false,
                                message: "Wrong username or password !"
                            });
                        };
                    }
                });
});

// unos novog korisnika
router.post('/', checkToken,function (req,res) {
    console.log('obicni post');
       user = new User ( {
           name : req.body.name,
           email : req.body.email,
           username : req.body.username,
           password : req.body.password
          }
       );
    console.log(user);
        user.save(function (err,user){
            if (err) {
                res.send(err);
            } else {
                res.send(user)
            }
    
        });
});
    
// registracija
router.post('/register', function (req,res) {

    user = new User ( {
        name : req.body.name,
        email : req.body.email,
        username : req.body.username,
        password : req.body.password
       }
    );

 console.log(user);

     user.save(function (err,user){
         if (err) {
             res.status(400).send(err);
         } else {
             res.send(user)
         }
 
     });
});

function checkToken (req,res,next){
    jwt.verify (req.headers.authorization,'aminasifra',function (err,decoded) {
      if (err) {
         res.status(401).send('Authorization error!!');
      } else {
		 userid = mongoose.Types.ObjectId (decoded._id);
		 userrole = decoded.role;
         return next();
      } 
    });
};

module.exports = router;