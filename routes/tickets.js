const express = require ('express');
const router = express.Router();

var Ticket = require ('../modules/ticket');
var User = require ('../modules/user');


// lista svih ticketa
router.get('/', function (req,res) {
    
        Ticket.find({}, function (err,tickets){
            if (err) {
                res.send(err);
            } else {
                res.send(tickets)
            }
    
        });
    });
    
// unos novog ticket-a
router.post('/', function (req,res) {
           ticket = new Ticket ( {
               subject : req.body.subject,
               description : req.body.description
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
router.delete('/:id',  function (req,res) {
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
    
router.put('/:id',  function (req,res) {
        var query = {_id:req.params.id};
        Ticket.findOneAndUpdate (query,
                               {subject: req.body.subject,
                                description:req.body.description
                               },                           
                function(err,ticket) {
            if (err) {
                res.send(err);    
            } else {
                res.send(ticket);
            }
        });
});
    
module.exports = router;
