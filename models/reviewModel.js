const { Schema, model } = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new Schema(
    {
        review: {
            type: String,
            required: [true, 'Must say a few words about the tour.'],
            maxlength: [300, 'Too large review.']
        },
        rating: {
            type: Number,
            required: [true, 'A review must have a rating for the tour.'],
            min: [1, 'Minimum rating is 1.0'],
            max: [5, 'Max rating is 5.0']
        },
        tour: {
            type: Schema.Types.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to a certain tour.']
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user.']
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
    // this.populate([
    //     {
    //         path: 'user',
    //         select: 'name photo -_id'
    //     },
    //     {
    //         path: 'tour',
    //         select: 'name -_id'
    //     }
    // ]);

    this.populate({
        path: 'user',
        select: 'name photo -_id'
    });
    next();
});

reviewSchema.statics.calcAverageRating = async function(tour) {
    const stats = await this.aggregate([
        {
            $match: { tour }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tour, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Tour.findByIdAndUpdate(tour, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
};

/**
 * Calculate ratings average when creating a review
 * This is a document middleware so 'this' points to the document. Then this.constructor
 * stands for the model that create that document.
 */
reviewSchema.post('save', function() {
    this.constructor.calcAverageRating(this.tour);
});

/**
 * Calculate ratings average when updating or deleting a review
 * This is a query middleware so 'this' points to the query. Then by executing it
 * we get the review from the database. Doing this.r we are storing the current review
 * in the query, so then we pass it to the next middleware.
 */
reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    next();
});

/**
 * this.r is the document of the review we get in the pre hook. So then, this.r.constructor
 * points to the model. SO finally we can calculate the average correctly.
 */
reviewSchema.post(/^findOneAnd/, async function() {
    await this.r.constructor.calcAverageRating(this.r.tour);
});

module.exports = model('Review', reviewSchema);
