var mongoose = require ('mongoose');
var moment = require ('moment');

// Ticket

var noteSchema = mongoose.Schema ({
    notetext : {
        type: String,
        required: true,
     },
    notedate: {
        type: Date,
        default: Date.now
    },
    noteautor:{
        type: String,
        required: true
    }
});

noteSchema.virtual('notedateformated')
.get(function() {
  return moment(this.notedate).format('DD.MM.YY hh:mm');
}
);

var ticketSchema = mongoose.Schema ({
    subject:{
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"  // mora biti pod nazivom pod kojim je model importovan u route.js
    },
    description :{
        type: String,
        required: true
    },
    createddate: {
        type: Date,
        default: Date.now
    },
    status : {
        type: String,
        required: true,
        enum: ['new', 'open', 'postponed','closed','analyzed'],
        default:'new'
    },
    
    notes : [noteSchema],

    assignedto :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    }
});


// opcija da se virtualno polje uvjek popunjava bez posebnog zahtjeva
// primjer bez ove opcije
//Ticket.findById(req.params.id).populate("autor","name")
//.populate("assignedtoname")
//.exec(function(err, ticket){

// sa ovom opcijom
// Ticket.findById(req.params.id).populate("autor","name")
//  .exec(function(err, ticket){



ticketSchema.virtual('assignedtodet', {
    ref: 'User', // The model to use
    localField: 'assignedto', // Find people where `localField`
    foreignField: '_id', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: true,
    options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
  });



// Always attach `populate()` to `find()` calls
//MySchema.pre('find', function() {
//    this.populate('user');
//  });

// Always `populate()` after `find()` calls. Useful if you want to selectively populate
// based on the docs found.
//MySchema.post('find', async function(docs) {
//    for (let doc of docs) {
//      if (doc.isPublic) {
//        await doc.populate('user').execPopulate();
//      }
//    }
//  });

// `populate()` after saving. Useful for sending populated data back to the client in an
// update API endpoint
//MySchema.post('save', function(doc, next) {
//    doc.populate('user').execPopulate().then(function() {
//      next();
//    });
//  });

ticketSchema.pre('findOne', function() {
    //console.log('prefindONE executed');
    this.populate('assignedtodet','name');
});


ticketSchema.pre('find', function() {
    //console.log('prefind executed');
    this.populate('assignedtodet','name');
});


ticketSchema.virtual('createddateformated')
  .get(function() {
    return moment(this.createddate).format('DD.MM.YYYY hh:mm');
  }
);

ticketSchema.virtual('createddateformatedshort')
.get(function() {
  return moment(this.createddate).format('DD.MM hh:mm');
}
);

var Ticket = module.exports =mongoose.model('Ticket',ticketSchema);
