/**
 * Swagger Documentation for Service Desk API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token obtained from login endpoint
 *
 *   responses:
 *     UnauthorizedError:
 *       description: Authentication required
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Token tidak ditemukan"
 *     ForbiddenError:
 *       description: Insufficient permissions
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Akses ditolak"
 *     NotFoundError:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Tiket tidak ditemukan"
 *
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           example: john@example.com
 *         full_name:
 *           type: string
 *           example: "John Doe"
 *         role:
 *           type: string
 *           enum: [admin_kota, admin_opd, teknisi, pengguna]
 *           example: pengguna
 *         opd_id:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *         last_login_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         is_active:
 *           type: boolean
 *           example: true
 *
 *     Ticket:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         ticket_number:
 *           type: string
 *           example: "INC-2025-0001"
 *         type:
 *           type: string
 *           enum: [incident, request]
 *           example: incident
 *         title:
 *           type: string
 *           example: "Masalah Jaringan"
 *         description:
 *           type: string
 *           example: "Koneksi internet lambat"
 *         priority:
 *           type: string
 *           enum: [low, medium, high, critical]
 *           example: medium
 *         category:
 *           type: string
 *           example: "Umum"
 *         status:
 *           type: string
 *           enum: [open, in_progress, resolved, closed]
 *           example: open
 *         opd_id:
 *           type: integer
 *           example: 1
 *         reporter_id:
 *           type: integer
 *           example: 1
 *         assigned_to:
 *           type: integer
 *           nullable: true
 *         sla_due:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         sla_breached:
 *           type: boolean
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         resolved_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         closed_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *     TicketComment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         ticket_id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         content:
 *           type: string
 *           example: "Update status: sedang diproses"
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     TicketLog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         ticket_id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         action:
 *           type: string
 *           example: create
 *         description:
 *           type: string
 *           example: "Tiket dibuat: INC-2025-0001"
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     KnowledgeBaseArticle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Cara Reset Password"
 *         content:
 *           type: string
 *           example: "Langkah-langkah reset password..."
 *         category:
 *           type: string
 *           example: "Umum"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *           enum: [draft, published]
 *           example: published
 *         created_by:
 *           type: integer
 *           example: 1
 *         view_count:
 *           type: integer
 *           example: 10
 *         helpful_count:
 *           type: integer
 *           example: 5
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *     OPD:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Dinas Kominfo"
 *         code:
 *           type: string
 *           example: "KOMINFO"
 *         address:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           nullable: true
 *         is_active:
 *           type: boolean
 *           example: true
 *
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Tiket Baru"
 *         content:
 *           type: string
 *           example: "Tiket INC-2025-0001 telah dibuat"
 *         is_read:
 *           type: boolean
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     DashboardStats:
 *       type: object
 *       properties:
 *         total_tickets:
 *           type: integer
 *           example: 100
 *         open:
 *           type: integer
 *           example: 20
 *         in_progress:
 *           type: integer
 *           example: 30
 *         resolved:
 *           type: integer
 *           example: 40
 *         closed:
 *           type: integer
 *           example: 10
 *         sla_breached:
 *           type: integer
 *           example: 5
 *         by_priority:
 *           type: object
 *           properties:
 *             low:
 *               type: integer
 *               example: 10
 *             medium:
 *               type: integer
 *               example: 20
 *             high:
 *               type: integer
 *               example: 15
 *             critical:
 *               type: integer
 *               example: 5
 *         by_type:
 *           type: object
 *           properties:
 *             incident:
 *               type: integer
 *               example: 30
 *             request:
 *               type: integer
 *               example: 20
 *         sla_compliance:
 *           type: string
 *           example: "95%"
 *
 *     SLAComplianceReport:
 *       type: object
 *       properties:
 *         period:
 *           type: object
 *           properties:
 *             start_date:
 *               type: string
 *               format: date
 *               example: "2025-01-01"
 *             end_date:
 *               type: string
 *               format: date
 *               example: "2025-12-31"
 *         overall:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 50
 *             met:
 *               type: integer
 *               example: 46
 *             breached:
 *               type: integer
 *               example: 4
 *             compliance:
 *               type: string
 *               example: "92%"
 *         by_priority:
 *           type: object
 *           properties:
 *             low:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 20
 *                 breached:
 *                   type: integer
 *                   example: 1
 *                 compliance:
 *                   type: string
 *                   example: "95%"
 *             medium:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 15
 *                 breached:
 *                   type: integer
 *                   example: 1
 *                 compliance:
 *                   type: string
 *                   example: "93.33%"
 *             high:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 breached:
 *                   type: integer
 *                   example: 1
 *                 compliance:
 *                   type: string
 *                   example: "90%"
 *             critical:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 breached:
 *                   type: integer
 *                   example: 1
 *                 compliance:
 *                   type: string
 *                   example: "80%"
 *
 *     Health:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: healthy
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-10-22T12:00:00Z"
 *         database:
 *           type: string
 *           example: connected
 */

// ============================================
// 1. AUTHENTICATION ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, email, role]
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepassword123
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               full_name:
 *                 type: string
 *                 example: "John Doe"
 *               role:
 *                 type: string
 *                 enum: [admin_kota, admin_opd, teknisi, pengguna]
 *                 example: pengguna
 *               opd_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Registrasi berhasil"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or duplicate username/email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Username atau email sudah digunakan"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates user and returns JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Username dan password harus diisi"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Username atau password salah"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves profile of the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

// ============================================
// 2. TICKET MANAGEMENT ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket
 *     description: Creates a new incident or request ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, title, description, priority]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [incident, request]
 *                 example: incident
 *               title:
 *                 type: string
 *                 example: "Masalah Jaringan"
 *               description:
 *                 type: string
 *                 example: "Koneksi internet lambat"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *                 example: medium
 *               category:
 *                 type: string
 *                 example: "Umum"
 *               opd_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: Ticket created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tiket berhasil dibuat"
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Data tidak lengkap"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get list of tickets
 *     description: Retrieves tickets with optional filters
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [open, in_progress, resolved, closed]
 *         description: Filter by status
 *       - name: priority
 *         in: query
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         description: Filter by priority
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *           enum: [incident, request]
 *         description: Filter by type
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search by title or ticket number
 *     responses:
 *       200:
 *         description: List of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 tickets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get ticket details
 *     description: Retrieves detailed information about a ticket, including comments and logs
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TicketComment'
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TicketLog'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Update ticket
 *     description: Updates ticket details such as status, priority, etc.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ticket ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, resolved, closed]
 *                 example: in_progress
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *                 example: medium
 *               category:
 *                 type: string
 *                 example: "Umum"
 *               title:
 *                 type: string
 *                 example: "Masalah Jaringan"
 *               description:
 *                 type: string
 *                 example: "Koneksi internet lambat"
 *     responses:
 *       200:
 *         description: Ticket updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tiket berhasil diupdate"
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/tickets/{id}/assign:
 *   post:
 *     summary: Assign technician to ticket
 *     description: Assigns a technician to the ticket (admin only)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [technician_id]
 *             properties:
 *               technician_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Ticket assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Teknisi berhasil di-assign"
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid input or user not technician
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Input tidak valid atau pengguna bukan teknisi"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/tickets/{id}/comments:
 *   post:
 *     summary: Add comment to ticket
 *     description: Adds a new comment to the ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Update status: sedang diproses"
 *     responses:
 *       201:
 *         description: Comment added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Komentar berhasil ditambahkan"
 *                 comment:
 *                   $ref: '#/components/schemas/TicketComment'
 *       400:
 *         description: Missing content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Konten komentar harus diisi"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

// ============================================
// 3. USER MANAGEMENT ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get list of users
 *     description: Retrieves users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/users/technicians:
 *   get:
 *     summary: Get list of technicians
 *     description: Retrieves active technicians for assignment
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of technicians
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 technicians:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     description: Updates user details (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "+628123456789"
 *               role:
 *                 type: string
 *                 enum: [admin_kota, admin_opd, teknisi, pengguna]
 *                 example: teknisi
 *               opd_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User berhasil diupdate"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

// ============================================
// 4. KNOWLEDGE BASE ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/knowledge-base:
 *   get:
 *     summary: Get knowledge base articles
 *     description: Retrieves articles with optional filters
 *     tags: [Knowledge Base]
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search by title or content
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *         description: Filter by status (admin only)
 *     responses:
 *       200:
 *         description: List of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/KnowledgeBaseArticle'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/knowledge-base/{id}:
 *   get:
 *     summary: Get knowledge base article details
 *     description: Retrieves a specific article and increments view count
 *     tags: [Knowledge Base]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 article:
 *                   $ref: '#/components/schemas/KnowledgeBaseArticle'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/knowledge-base:
 *   post:
 *     summary: Create knowledge base article
 *     description: Creates a new article (admin only)
 *     tags: [Knowledge Base]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Cara Reset Password"
 *               content:
 *                 type: string
 *                 example: "Langkah-langkah reset password..."
 *               category:
 *                 type: string
 *                 example: "Umum"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "reset"
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 example: draft
 *     responses:
 *       201:
 *         description: Article created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Artikel berhasil dibuat"
 *                 article:
 *                   $ref: '#/components/schemas/KnowledgeBaseArticle'
 *       400:
 *         description: Missing title or content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Judul atau konten harus diisi"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/knowledge-base/{id}:
 *   put:
 *     summary: Update knowledge base article
 *     description: Updates an existing article (admin only)
 *     tags: [Knowledge Base]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Cara Reset Password"
 *               content:
 *                 type: string
 *                 example: "Langkah-langkah reset password..."
 *               category:
 *                 type: string
 *                 example: "Umum"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "reset"
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 example: published
 *     responses:
 *       200:
 *         description: Article updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Artikel berhasil diupdate"
 *                 article:
 *                   $ref: '#/components/schemas/KnowledgeBaseArticle'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/knowledge-base/{id}/helpful:
 *   post:
 *     summary: Mark article as helpful
 *     description: Increments helpful count for the article
 *     tags: [Knowledge Base]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Helpful marked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Terima kasih atas feedback Anda"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

// ============================================
// 5. DASHBOARD & REPORTS ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieves ticket statistics for dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   $ref: '#/components/schemas/DashboardStats'
 *                 sla_compliance:
 *                   type: string
 *                   example: "95%"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/dashboard/recent-tickets:
 *   get:
 *     summary: Get recent tickets
 *     description: Retrieves recent tickets for dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of tickets to return
 *     responses:
 *       200:
 *         description: Recent tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tickets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/reports/sla-compliance:
 *   get:
 *     summary: Get SLA compliance report
 *     description: Retrieves SLA compliance report (admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: start_date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-01"
 *       - name: end_date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-12-31"
 *     responses:
 *       200:
 *         description: SLA report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SLAComplianceReport'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

// ============================================
// 6. OPD MANAGEMENT ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/opd:
 *   get:
 *     summary: Get list of OPD
 *     description: Retrieves active OPD list
 *     tags: [OPD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of OPD
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 opd:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OPD'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/opd:
 *   post:
 *     summary: Create new OPD
 *     description: Creates a new OPD (admin_kota only)
 *     tags: [OPD]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name]
 *             properties:
 *               code:
 *                 type: string
 *                 example: "KOMINFO"
 *               name:
 *                 type: string
 *                 example: "Dinas Kominfo"
 *               address:
 *                 type: string
 *                 example: "Jl. Sudirman No. 123"
 *               phone:
 *                 type: string
 *                 example: "+628123456789"
 *               email:
 *                 type: string
 *                 example: kominfo@example.com
 *     responses:
 *       201:
 *         description: OPD created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OPD berhasil dibuat"
 *                 opd:
 *                   $ref: '#/components/schemas/OPD'
 *       400:
 *         description: Missing code or name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Kode dan nama OPD harus diisi"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

// ============================================
// 7. NOTIFICATIONS ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     description: Retrieves notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of notifications to return
 *     responses:
 *       200:
 *         description: Notifications list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 unread_count:
 *                   type: integer
 *                   example: 3
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     description: Marks a specific notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Notifikasi ditandai sebagai sudah dibaca"
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

// ============================================
// 8. HEALTH CHECK ENDPOINT
// ============================================

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Checks the health of the API and database connection
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Health status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Health'
 *       503:
 *         description: Unhealthy status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: unhealthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-22T12:00:00Z"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */

// ============================================
// ROOT ENDPOINT
// ============================================

/**
 * @swagger
 * /:
 *   get:
 *     summary: API root endpoint
 *     description: Provides API information and endpoint list
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Service Desk API - Versi Sederhana"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     auth:
 *                       type: object
 *                       properties:
 *                         register:
 *                           type: string
 *                           example: "POST /api/auth/register"
 *                         login:
 *                           type: string
 *                           example: "POST /api/auth/login"
 *                         profile:
 *                           type: string
 *                           example: "GET /api/auth/profile"
 *                     tickets:
 *                       type: object
 *                       properties:
 *                         create:
 *                           type: string
 *                           example: "POST /api/tickets"
 *                         list:
 *                           type: string
 *                           example: "GET /api/tickets"
 *                         detail:
 *                           type: string
 *                           example: "GET /api/tickets/:id"
 *                         update:
 *                           type: string
 *                           example: "PUT /api/tickets/:id"
 *                         assign:
 *                           type: string
 *                           example: "POST /api/tickets/:id/assign"
 *                         comment:
 *                           type: string
 *                           example: "POST /api/tickets/:id/comments"
 *                     users:
 *                       type: object
 *                       properties:
 *                         list:
 *                           type: string
 *                           example: "GET /api/users"
 *                         technicians:
 *                           type: string
 *                           example: "GET /api/users/technicians"
 *                         update:
 *                           type: string
 *                           example: "PUT /api/users/:id"
 *                     knowledge_base:
 *                       type: object
 *                       properties:
 *                         list:
 *                           type: string
 *                           example: "GET /api/knowledge-base"
 *                         detail:
 *                           type: string
 *                           example: "GET /api/knowledge-base/:id"
 *                         create:
 *                           type: string
 *                           example: "POST /api/knowledge-base"
 *                         update:
 *                           type: string
 *                           example: "PUT /api/knowledge-base/:id"
 *                         helpful:
 *                           type: string
 *                           example: "POST /api/knowledge-base/:id/helpful"
 *                     dashboard:
 *                       type: object
 *                       properties:
 *                         stats:
 *                           type: string
 *                           example: "GET /api/dashboard/stats"
 *                         recent:
 *                           type: string
 *                           example: "GET /api/dashboard/recent-tickets"
 *                     reports:
 *                       type: object
 *                       properties:
 *                         sla:
 *                           type: string
 *                           example: "GET /api/reports/sla-compliance"
 *                     opd:
 *                       type: object
 *                       properties:
 *                         list:
 *                           type: string
 *                           example: "GET /api/opd"
 *                         create:
 *                           type: string
 *                           example: "POST /api/opd"
 *                     notifications:
 *                       type: object
 *                       properties:
 *                         list:
 *                           type: string
 *                           example: "GET /api/notifications"
 *                         mark_read:
 *                           type: string
 *                           example: "PUT /api/notifications/:id/read"
 *                 health:
 *                   type: string
 *                   example: "/health"
 *                 docs:
 *                   type: string
 *                   example: "/api-docs"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

// ============================================
// SWAGGER CONFIGURATION
// ============================================

const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Service Desk API Documentation (Based on app.js)",
      version: "1.0.0",
      description: `
Service Desk API

This documentation is generated based on the provided app.js file.
It covers authentication, ticket management, user management, knowledge base, dashboard, reports, OPD, and notifications.

Authentication uses JWT. Most endpoints require bearer token.

For more details, see the endpoints below.
      `,
      contact: {
        name: "Developer",
        email: "ahmadwahhabfirosyan@gmail.com",
      },
      license: {
        name: "MIT",
        url: "nanti ya linknya",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User registration and login",
      },
      {
        name: "Tickets",
        description: "Ticket creation and management",
      },
      {
        name: "Users",
        description: "User management (admin)",
      },
      {
        name: "Knowledge Base",
        description: "Knowledge base articles",
      },
      {
        name: "Dashboard",
        description: "Dashboard statistics",
      },
      {
        name: "Reports",
        description: "Reporting endpoints",
      },
      {
        name: "OPD",
        description: "OPD management",
      },
      {
        name: "Notifications",
        description: "User notifications",
      },
      {
        name: "Health",
        description: "System health check",
      },
      {
        name: "General",
        description: "Root endpoint",
      },
    ],
  },
  apis: [__filename], // Use this file for annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0; }
    .swagger-ui .info .title { color: #0066cc; }
    .swagger-ui .btn.authorize { 
      background-color: #0066cc;
      border-color: #0066cc;
    }
    .swagger-ui .btn.authorize:hover { 
      background-color: #0052a3;
      border-color: #0052a3;
    }
  `,
  customSiteTitle: "Service Desk API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    syntaxHighlight: {
      activate: true,
      theme: "monokai",
    },
  },
};

module.exports = { swaggerDocs, swaggerUiOptions };
