const express = require('express');
const {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  getDashboardSummary
} = require('../controllers/financialController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const {
  financialRecordValidator,
  updateFinancialRecordValidator,
  idParamValidator,
  queryFiltersValidator
} = require('../utils/validators');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Dashboard summary - accessible by Analyst and Admin
router.get(
  '/dashboard',
  restrictTo('analyst', 'admin'),
  queryFiltersValidator,
  validate,
  getDashboardSummary
);

// CRUD operations
router.post(
  '/records',
  financialRecordValidator,
  validate,
  createRecord
);

router.get(
  '/records',
  queryFiltersValidator,
  validate,
  getAllRecords
);

router.get(
  '/records/:id',
  idParamValidator,
  validate,
  getRecordById
);

router.put(
  '/records/:id',
  updateFinancialRecordValidator,
  validate,
  updateRecord
);

router.delete(
  '/records/:id',
  idParamValidator,
  validate,
  deleteRecord
);

module.exports = router;