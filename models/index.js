/**
 * Central export for Sequelize models. Import this file after `connectDatabase()`
 * or ensure models are loaded before sync.
 */
import User from './User.js';
import Donation from './Donation.js';
import { sequelize } from '../config/database.js';

export { sequelize, User, Donation };
