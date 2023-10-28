import express from 'express'
import { getFoodAvailability, getFoodAvailableIn30Mins, getRestaurantById, getTopRestaurants, searchFood } from '../controllers/shopping.controller';


export const shoppingRouter = express.Router();

// <----------------------------Food availability--------------------------->
shoppingRouter.get('/food/:pincode', getFoodAvailability)

// <----------------------------Top Restaurant --------------------------->
shoppingRouter.get('/top-restaurants/:pincode',getTopRestaurants)

// <----------------------------Food available in 30 minutes--------------------------->
shoppingRouter.get('/foods-in-30min/:pincode', getFoodAvailableIn30Mins)

// <----------------------------Search Food--------------------------->
shoppingRouter.get('/food/search/:pincode',searchFood)

// <----------------------------Find restaurant by ID--------------------------->
shoppingRouter.get('/restaurant/:id', getRestaurantById)

