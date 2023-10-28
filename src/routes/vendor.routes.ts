import express from 'express';
import { addFood, getFood, loginVendor, profile, updateCoverImages, updateProfile, updateService } from '../controllers';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import multer from 'multer';


export const vendorRouter = express.Router();


const discStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/images')
    },

    filename: function (req, file, cb) {
        cb(null, new Date().toISOString + file.originalname)
    }
})
const uploadImage = multer({ storage: discStorage }).array('images', 10)

vendorRouter.post('/vendor/login', loginVendor)
vendorRouter.get('/vendor/profile', isAuthenticated, profile);
vendorRouter.patch('/vendor/profile', isAuthenticated, updateProfile)
vendorRouter.patch('/vendor/service', isAuthenticated, updateService);
vendorRouter.post('/vendor/add-food', isAuthenticated, uploadImage, addFood);

vendorRouter.patch('/vendor/update-cover-image', isAuthenticated, uploadImage, updateCoverImages);
vendorRouter.get('/vendor/get-food', getFood)

