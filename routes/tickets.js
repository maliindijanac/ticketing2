const express = require ('express');
const router = express.Router();
const mongoose = require ('mongoose');

var Ticket = require ('../modules/ticket');
var User = require ('../modules/user');
const jwt = require ('jsonwebtoken');

var userid = '';
var userrole = '';


// lista validnih vrijednosti za polje status;
router.get('/statuslist', function (req,res) {
    res.send (Ticket.schema.path('status').enumValues);
});

// Stanje ticketa po statusu
router.get('/overview', function (req,res) {
    Ticket.aggregate([{"$group": {_id:"$status", count:{$sum:1}}}])
        .exec(function (err,ticketstatus){
                        if (err) {
                            res.send (err);
                            return;
                        } else {
                            res.send (ticketstatus);
                        }
        });
});



// lista svih ticketa
router.get('/',checkToken, function (req,res) {
    
        Ticket.find({}, function (err,tickets){
            if (err) {
                res.send(err);
            } else {
                res.send(tickets)
            }
    
        });
    });

    
router.get('/:id', checkToken,function (req,res) {
            console.log(req.params.id);
            Ticket.findOne({_id:req.params.id}, function (err,ticket){
                if (err) {
                    res.send(err);
                } else {
                    res.send(ticket)
                }
        
            });
});  
    
    
// unos novog ticket-a
router.post('/',checkToken ,function (req,res) {
           ticket = new Ticket ( {
               subject : req.body.subject,
               description : req.body.description,
               author:  userid
              }
           );
        
            ticket.save(function (err,ticket){
                if (err) {
                    res.send(err);
                } else {
                    res.send(ticket);
                }
        
            });
    });
    
//brisanje jednog ticketa
router.delete('/:id', checkToken, function (req,res) {
        var query = {_id:req.params.id};
        Ticket.findOneAndDelete (query,function(err, ticket) {
            if (err) {
                res.send(err);    
            } else {
                res.send(ticket);
            }
        });
    });
    
// update ticketa
    
router.put('/:id',checkToken,  function (req,res) {
    var query = {_id:req.params.id};
    console.log(req.body.notes);

    Ticket.findOneAndUpdate (query,
                           {subject: req.body.subject,
                            description:req.body.description,
                            notes : req.body.notes,
                            status : req.body.status,
                            assignedto : mongoose.Types.ObjectId (req.body.assignedto)
                           },                           
            function(err,ticket) {
        if (err) {
            res.send(err);    
        } else {
            res.status(200).send(ticket);
        }
    });
});


function checkToken (req,res,next){
    jwt.verify (req.headers.authorization,'aminasifra',function (err,decoded) {
      if (err) {
         res.status(401).send('ERRR');
      } else {
        // console.log(decoded);
         //userid = decoded._id; 
		 userid = mongoose.Types.ObjectId (decoded._id);
		 userrole = decoded.role;
         return next();
      } 
    });
};
    
module.exports = router;
