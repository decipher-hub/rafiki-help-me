import { Router } from 'express';
import { handleCreateDonation, handleListDonations } from '../controllers/donationController.js';

const router = Router();

router.post('/', handleCreateDonation);
router.get('/', handleListDonations);

export default router;
