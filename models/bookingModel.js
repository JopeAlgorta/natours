const { Schema, model } = require('mongoose');

const bookingSchema = new Schema({
    tour: {
        type: Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a tour.']
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a user.']
    },
    price: {
        type: Number,
        required: [true, 'A booking must have a price.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
});

bookingSchema.pre(/^find/, function(next) {
    this.populate([
        {
            path: 'user',
            select: 'name email -_id'
        },
        {
            path: 'tour'
        }
    ]);

    next();
});

module.exports = model('Booking', bookingSchema);
