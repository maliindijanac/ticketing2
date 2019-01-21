const express = require ('express');
const router = express.Router();
var User = require ('../modules/user');

// CRUD api za korisnika

// lista svih korisnika
router.get('/', function (req,res) {

    User.find({}, function (err,users){
        if (err) {
            res.send(err);
        } else {
            res.send(users)
        }

    });
});

// unos novog korisnika
router.post('/', function (req,res) {
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

//brisanje jednog korisnika
router.delete('/:id',  function (req,res) {
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

router.put('/:id',  function (req,res) {
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
    //console.log(req.body.username);
    //console.log(req.body.password);
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
                            var token = jwt.sign(user.toJSON(),'tajnipass'/*,{expiresIn : 20000}*/);
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


    
// registracija
router.post('/register', function (req,res) {
  /*  encriptedpass = req.body.password;
    bcrypt.genSalt(10, function (err,salt){
        bcrypt.hash (req.body.password,salt, function (err,hash){
            encriptedpass = hash;
        })

    });*/

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

module.exports = router;