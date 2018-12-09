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
       user = new User ( {
           name : req.body.name,
           email : req.body.email,
           username : req.body.username,
           password : req.body.password
          }
       );
    
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

module.exports = router;