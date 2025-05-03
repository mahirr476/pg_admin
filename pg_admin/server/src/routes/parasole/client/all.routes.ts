import express from 'express';
import { HomeController } from '../../../controllers/parasole/client/home.controller';
import { AboutController } from '../../../controllers/parasole/client/about.controller';
import { ComplianceController } from '../../../controllers/parasole/client/compliance.controller';
// import { BusinessController } from '../../../controllers/group/client/business.controller';
// import { CompaniesController } from '../../../controllers/group/client/companies.controller';
// import { MediaController } from '../../../controllers/group/client/media.controller';
// import { ContactController } from '../../../controllers/group/client/contact.controller';

const router = express.Router();

// Home routes
router.get('/home', HomeController.getHomepage); 

// About routes
router.get('/about', AboutController.getAbout);
// router.get('/about-csr', AboutController.getCSRWithDetails);

// Compliance routes
router.get('/compliance', ComplianceController.getCompliance);

// // Business routes
// router.get('/business', BusinessController.getBusinees);
// router.get('/business/:slug', BusinessController.getBusinessBySlug);

// // Companies routes
// router.get('/companies', CompaniesController.getCompanies);
// router.get('/companies/:slug', CompaniesController.getCompaniesBySlug);

// // Media routes
// router.get('/media', MediaController.getMedia);
// router.post('/media/contact', MediaController.submitContact);

// // Contact routes
// router.get('/contact-us', ContactController.getContactInfo); 
// router.post('/contact-form', ContactController.submitContactForm);


export default router;