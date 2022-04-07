const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
	userId: { type: String, required: true },
	name: {
		type: String,
		validate: {
			validator: function (v) {
				return /^[a-z ,.'-]+$/i.test(v);
			},
		},
		required: true,
	},
	manufacturer: {
		type: String,
		validate: {
			validator: function (v) {
				return /^[a-z ,.'-]+$/i.test(v);
			},
		},
		required: true,
	},
	description: {
		type: String,
		validate: {
			validator: function (v) {
				return /^[a-z ,.'-]+$/i.test(v);
			},
		},
		required: true,
	},
	mainPepper: {
		type: String,
		validate: {
			validator: function (v) {
				return /^[a-z ,.'-]+$/i.test(v);
			},
		},
		required: true,
	},
	imageUrl: { type: String, required: true },
	heat: { type: Number, required: true },
	likes: { type: Number, default: 0, required: false },
	dislikes: { type: Number, default: 0, required: false },
	usersLiked: { type: [], required: false },
	usersDisliked: { type: [], required: false },
});

module.exports = mongoose.model('Sauce', sauceSchema);
