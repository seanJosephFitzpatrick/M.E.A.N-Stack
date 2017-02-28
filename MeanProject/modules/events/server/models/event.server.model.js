'use strict';

/**
 * Module dependencies.
 */
//Get a handle on mongoose package with the require keyword
var mongoose = require('mongoose'),
/**
*Use mongoose schema and assign to variable schema instead of typing mongoose.schema
*
*/
Schema = mongoose.Schema;

/**
 * Event Schema
 */
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
var EventSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  time: {
    type: String,
    default: '',
    trim: true
  },
  place: {
    type: String,
    default: '',
    trim: true
  },
  address: {
    type: String,
    default: '',
    trim: true
  },
  performers: {
    type: String,
    default: '',
    trim: true
  },
  short_bio: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  description: {
    type: String,
    default: 'There is no description',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Event', EventSchema);