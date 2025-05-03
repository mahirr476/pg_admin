import express from 'express';
import { HomeController } from '../../../controllers/parasole/client/home.controller';
import { AboutController } from '../../../controllers/parasole/client/about.controller';
import { ComplianceController } from '../../../controllers/parasole/client/compliance.controller';
import { OperationController } from '../../../controllers/parasole/client/operation.controller';
import { BuyerController } from '../../../controllers/parasole/client/buyer.controller';
import { ContactController } from '../../../controllers/parasole/client/contact.controller';

const router = express.Router();

// Home routes
router.get('/home', HomeController.getHomepage); 

// About routes
router.get('/about', AboutController.getAbout);
// router.get('/about-csr', AboutController.getCSRWithDetails);

// Compliance routes
router.get('/compliance', ComplianceController.getCompliance);

// Operation routes
router.get('/operation', OperationController.getOperation);
// router.get('/business/:slug', BusinessController.getBusinessBySlug);

// buyer routes
router.get('/buyer', BuyerController.getbuyer);
// router.get('/companies/:slug', CompaniesController.getCompaniesBySlug);

// Contact routes
router.get('/contact', ContactController.getContact);
router.post('/contact-form', ContactController.submitContactForm);
// router.post('/media/contact', MediaController.submitContact);

// // Contact routes
// router.get('/contact-us', ContactController.getContactInfo); 


export default router;