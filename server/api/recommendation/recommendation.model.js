'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RecommendationSchema = new Schema({
  	movie: String,
 	user: { type: Schema.Types.ObjectId, ref: 'User' },
	created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);