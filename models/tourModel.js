const { Schema, model } = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: [true, 'Another tour with the same name already exists.'],
            trim: true,
            maxlength: [40, 'Tour name too large'],
            minlength: [10, 'Tour name too short']
            // validate: [
            //     validator.isAlpha(),
            //     'Tour name contains invalid characters.'
            // ]
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A max size must be declared']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Invalid option (easy, medium, difficult)'
            }
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Minimun rating is 1.0'],
            max: [5, 'Maximum rating is 5.0'],
            set: val => Math.round(val * 10) / 10
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function(val) {
                    return val < this.price;
                },
                message: 'Discount price ({VALUE}) higher than price'
            }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        },
        startLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point']
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
        guides: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

/**Add a virtual property with reviews for the tour. */
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', async function(next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });
// tourSchema.post('save', function(doc, next) {

// });

tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });
    next();
});

// tourSchema.post(/^find/, function(docs, next) {
//     console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//     next();
// });

tourSchema.pre('aggregate', function(next) {
    if (this.pipeline().some(pipe => Object.keys(pipe).includes('$geoNear'))) {
        this.pipeline().push({
            $match: { secretTour: { $ne: true } }
        });
        next();
    } else {
        this.pipeline().unshift({
            $match: { secretTour: { $ne: true } }
        });
        next();
    }
});

module.exports = model('Tour', tourSchema);
