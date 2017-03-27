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
 * Restaurant Schema
 */
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
var RestaurantSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  restaurantImageURL:{
  type: String,
  default: '',
  trim: true
},
  openHours: {
    type: String,
    default: '',
    trim: true
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  latitude: {
    type: String,
    default: '',
    trim: true
  },
  longitude: {
    type: String,
    default: '',
    trim: true
  },
  address: {
    type: String,
    default: 'Address',
    trim: true,
    required: 'Address cannot be blank'
  },
  city: {
    type: String,
    default: '',
    trim: true
  },
  county: {
    type: String,
    default: '',
    trim: true
  },
  country: {
    type: String,
    default: '',
    trim: true
  },
  url: {
    type: String,
    default: '',
    trim: true
  },
  category: {
    type: String,
    default: '',
    trim: true
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

mongoose.model('Restaurant', RestaurantSchema);
