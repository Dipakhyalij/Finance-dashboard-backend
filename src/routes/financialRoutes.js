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

/**
 * @swagger
 * /financial/dashboard:
 *   get:
 *     summary: Get dashboard summary with financial insights
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/DashboardSummary'
 *       403:
 *         description: Access denied (requires analyst or admin role)
 *       401:
 *         description: Not authenticated
 */
router.get(
  '/dashboard',
  restrictTo('analyst', 'admin'),
  queryFiltersValidator,
  validate,
  getDashboardSummary
);

/**
 * @swagger
 * /financial/records:
 *   post:
 *     summary: Create a new financial record
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFinancialRecordRequest'
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/FinancialRecord'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 */
router.post(
  '/records',
  financialRecordValidator,
  validate,
  createRecord
);

/**
 * @swagger
 * /financial/records:
 *   get:
 *     summary: Get all financial records with filters and pagination
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by transaction type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in description or category
 *     responses:
 *       200:
 *         description: Records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedRecordsResponse'
 *       401:
 *         description: Not authenticated
 */
router.get(
  '/records',
  queryFiltersValidator,
  validate,
  getAllRecords
);

/**
 * @swagger
 * /financial/records/{id}:
 *   get:
 *     summary: Get a single financial record by ID
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/FinancialRecord'
 *       404:
 *         description: Record not found
 *       401:
 *         description: Not authenticated
 */
router.get(
  '/records/:id',
  idParamValidator,
  validate,
  getRecordById
);

/**
 * @swagger
 * /financial/records/{id}:
 *   put:
 *     summary: Update a financial record
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFinancialRecordRequest'
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/FinancialRecord'
 *       404:
 *         description: Record not found
 *       401:
 *         description: Not authenticated
 */
router.put(
  '/records/:id',
  updateFinancialRecordValidator,
  validate,
  updateRecord
);

/**
 * @swagger
 * /financial/records/{id}:
 *   delete:
 *     summary: Soft delete a financial record
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Record not found
 *       401:
 *         description: Not authenticated
 */
router.delete(
  '/records/:id',
  idParamValidator,
  validate,
  deleteRecord
);

module.exports = router;