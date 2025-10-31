/**
 * ============================================
 * SERVICE DESK API
 * ============================================
 * Fitur Utama:
 * 1. Authentication (Login/Register)
 * 2. Ticket Management (CRUD)
 * 3. User Management
 * 4. Knowledge Base
 * 5. Dashboard & Reports
 * 6. Integration (Asset & Change Management)
 * 7. Webhooks
 * 8. Notifications
 * ============================================
 */

const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const { swaggerDocs, swaggerUiOptions } = require("./swagger.js");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, swaggerUiOptions)
);

// ============================================
// SUPABASE CONNECTION
// ============================================
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// SSO Configuration
const SSO_CONFIG = {
  enabled: process.env.SSO_ENABLED === 'true',
  domain: process.env.SSO_DOMAIN || 'company.com',
  redirectUrl: process.env.SSO_REDIRECT_URL || 'http://localhost:8080/api/auth/sso/callback',
  metadataUrl: process.env.SSO_METADATA_URL,
  attributeMapping: {
    email: 'email',
    firstName: 'givenName',
    lastName: 'surname',
    department: 'department',
    role: 'role'
  }
};

// RBAC Configuration
const RBAC_ROLES = {
  'super_admin': {
    permissions: ['*'], // All permissions
    description: 'Super Administrator'
  },
  'admin_kota': {
    permissions: [
      'tickets.read', 'tickets.write', 'tickets.delete',
      'users.read', 'users.write', 'users.delete',
      'knowledge_base.read', 'knowledge_base.write', 'knowledge_base.delete',
      'reports.read', 'dashboard.read'
    ],
    description: 'Administrator Kota'
  },
  'admin_opd': {
    permissions: [
      'tickets.read', 'tickets.write',
      'users.read', 'users.write',
      'knowledge_base.read', 'knowledge_base.write',
      'reports.read', 'dashboard.read'
    ],
    description: 'Administrator OPD'
  },
  'agent': {
    permissions: [
      'tickets.read', 'tickets.write',
      'knowledge_base.read',
      'dashboard.read'
    ],
    description: 'Service Desk Agent'
  },
  'user': {
    permissions: [
      'tickets.read', 'tickets.write',
      'knowledge_base.read'
    ],
    description: 'End User'
  }
};
const WEBHOOK_SECRET =
  process.env.WEBHOOK_SECRET || "webhook-secret-change-this";

// Test connection
(async () => {
  try {
    const { error } = await supabase.from("users").select("count").limit(1);
    if (error) throw error;
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }
})();

// ============================================
// HELPER FUNCTIONS
// ============================================

// Middleware untuk autentikasi
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token tidak valid" });
    }
    req.user = user;
    next();
  });
};

// Middleware untuk cek role
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Akses ditolak" });
    }
    next();
  };
};

// Middleware untuk cek permission
const authorizePermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const roleConfig = RBAC_ROLES[userRole];
    
    if (!roleConfig) {
      return res.status(403).json({ error: "Role tidak valid" });
    }
    
    // Check if user has permission or wildcard permission
    if (roleConfig.permissions.includes('*') || roleConfig.permissions.includes(permission)) {
      next();
    } else {
      return res.status(403).json({ error: "Permission tidak cukup" });
    }
  };
};

// SSO Authentication middleware
const authenticateSSO = async (req, res, next) => {
  try {
    if (!SSO_CONFIG.enabled) {
      return res.status(400).json({ error: "SSO tidak diaktifkan" });
    }

    const { domain } = req.body;
    
    if (!domain) {
      return res.status(400).json({ error: "Domain diperlukan untuk SSO" });
    }

    // Generate state parameter for security
    const state = crypto.randomBytes(32).toString('hex');
    
    // Store state in session or database for validation
    req.session = req.session || {};
    req.session.ssoState = state;
    
    // Redirect to Supabase SSO
    const ssoUrl = `${process.env.SUPABASE_URL}/auth/v1/sso/saml/acs?domain=${domain}&state=${state}`;
    
    res.json({
      success: true,
      redirectUrl: ssoUrl,
      state: state
    });
  } catch (error) {
    console.error("SSO Authentication error:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada SSO authentication" });
  }
};

// SSO Callback handler
const handleSSOCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: "Authorization code tidak ditemukan" });
    }

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("SSO Callback error:", error);
      return res.status(400).json({ error: "Gagal menukar kode untuk session" });
    }

    const { user, session } = data;
    
    if (!user || !session) {
      return res.status(400).json({ error: "User atau session tidak ditemukan" });
    }

    // Extract user information from SSO
    const userMetadata = user.user_metadata || {};
    const email = user.email;
    const firstName = userMetadata.first_name || userMetadata.givenName || '';
    const lastName = userMetadata.last_name || userMetadata.surname || '';
    const department = userMetadata.department || '';
    const ssoRole = userMetadata.role || 'user';

    // Check if user exists in local database
    let { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    let userId;
    let userRole = ssoRole;

    if (userError && userError.code === 'PGRST116') {
      // User doesn't exist, create new user
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          username: email.split('@')[0],
          email: email,
          full_name: `${firstName} ${lastName}`.trim() || email.split('@')[0],
          role: userRole,
          opd_id: null,
          sso_provider: 'saml',
          sso_id: user.id,
          department: department,
          is_active: true
        })
        .select()
        .single();

      if (createError) {
        console.error("Create user error:", createError);
        return res.status(500).json({ error: "Gagal membuat user baru" });
      }

      userId = newUser.id;
      existingUser = newUser;
    } else if (userError) {
      console.error("User lookup error:", userError);
      return res.status(500).json({ error: "Terjadi kesalahan saat mencari user" });
    } else {
      // User exists, update SSO information
      userId = existingUser.id;
      
      const { error: updateError } = await supabase
        .from("users")
        .update({
          sso_provider: 'saml',
          sso_id: user.id,
          department: department,
          last_login: new Date()
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Update user error:", updateError);
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: userId,
        email: email,
        role: userRole,
        permissions: RBAC_ROLES[userRole]?.permissions || [],
        sso: true
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "SSO login berhasil",
      token: token,
      user: {
        id: userId,
        email: email,
        full_name: existingUser.full_name,
        role: userRole,
        department: department,
        permissions: RBAC_ROLES[userRole]?.permissions || []
      }
    });

  } catch (error) {
    console.error("SSO Callback error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Generate ticket number
const generateTicketNumber = (type) => {
  const prefix = type === "incident" ? "INC" : "REQ";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${year}-${random}`;
};

// Hitung SLA due date
const calculateSLADue = async (priority, opdId) => {
  try {
    const { data: sla } = await supabase
      .from("sla")
      .select("resolution_time")
      .eq("opd_id", opdId)
      .eq("priority", priority)
      .single();

    if (!sla) return null;

    const now = new Date();
    const dueDate = new Date(
      now.getTime() + sla.resolution_time * 60 * 60 * 1000
    );
    return dueDate;
  } catch (error) {
    console.error("Error calculating SLA:", error);
    return null;
  }
};

// Log aktivitas ticket
const logTicketActivity = async (ticketId, userId, action, description) => {
  try {
    await supabase.from("ticket_logs").insert({
      ticket_id: ticketId,
      user_id: userId,
      action: action,
      description: description,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

// Send notification helper
const sendNotification = async (userId, title, message, type = "info") => {
  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      type,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

// ============================================
// 1. AUTHENTICATION ENDPOINTS
// ============================================

/**
 * POST /api/auth/register
 * Register user baru
 */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password, email, full_name, role, opd_id } = req.body;

    if (!username || !password || !email || !role) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert({
        username,
        password: hashedPassword,
        email,
        full_name: full_name || username,
        role,
        opd_id: opd_id || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res
          .status(400)
          .json({ error: "Username atau email sudah digunakan" });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username dan password harus diisi" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Username atau password salah" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Username atau password salah" });
    }

    await supabase
      .from("users")
      .update({ last_login_at: new Date() })
      .eq("id", user.id);

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        opd_id: user.opd_id,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        opd_id: user.opd_id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/**
 * GET /api/auth/profile
 * Get profile user yang sedang login
 */
app.get("/api/auth/profile", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, email, full_name, phone, role, opd_id, created_at")
      .eq("id", req.user.id)
      .single();

    if (error) throw error;

    res.json({ success: true, user: data });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// ============================================
// 2. TICKET MANAGEMENT
// ============================================

/**
 * POST /api/tickets
 * Buat tiket baru
 */
app.post("/api/tickets", authenticateToken, async (req, res) => {
  try {
    const { type, title, description, priority, category, opd_id } = req.body;

    if (!type || !title || !description || !priority) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }

    const ticketNumber = generateTicketNumber(type);
    const slaDue = await calculateSLADue(priority, opd_id || req.user.opd_id);

    const { data: ticket, error } = await supabase
      .from("tickets")
      .insert({
        ticket_number: ticketNumber,
        type,
        title,
        description,
        priority,
        category: category || "Umum",
        opd_id: opd_id || req.user.opd_id,
        reporter_id: req.user.id,
        status: "open",
        sla_due: slaDue,
      })
      .select()
      .single();

    if (error) throw error;

    await logTicketActivity(
      ticket.id,
      req.user.id,
      "create",
      `Tiket dibuat: ${ticket.ticket_number}`
    );

    res.status(201).json({
      success: true,
      message: "Tiket berhasil dibuat",
      ticket,
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/**
 * GET /api/tickets
 * Get daftar tiket dengan filter
 */
app.get("/api/tickets", authenticateToken, async (req, res) => {
  try {
    const { status, priority, type, search } = req.query;

    let query = supabase
      .from("tickets")
      .select(
        `
        *,
        reporter:reporter_id(id, username, full_name, email),
        technician:assigned_to(id, username, full_name),
        opd:opd_id(id, name)
      `
      )
      .order("created_at", { ascending: false });

    if (req.user.role === "pengguna") {
      query = query.eq("reporter_id", req.user.id);
    } else if (req.user.role === "teknisi") {
      query = query.eq("assigned_to", req.user.id);
    } else if (req.user.role === "admin_opd") {
      query = query.eq("opd_id", req.user.opd_id);
    }

    if (status) query = query.eq("status", status);
    if (priority) query = query.eq("priority", priority);
    if (type) query = query.eq("type", type);
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,ticket_number.ilike.%${search}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      tickets: data,
    });
  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/**
 * GET /api/tickets/:id
 * Get detail tiket
 */
app.get("/api/tickets/:id", authenticateToken, async (req, res) => {
  try {
    const { data: ticket, error } = await supabase
      .from("tickets")
      .select(
        `
        *,
        reporter:reporter_id(id, username, full_name, email, phone),
        technician:assigned_to(id, username, full_name, phone),
        opd:opd_id(id, name, code)
      `
      )
      .eq("id", req.params.id)
      .single();

    if (error) throw error;
    if (!ticket) {
      return res.status(404).json({ error: "Tiket tidak ditemukan" });
    }

    if (req.user.role === "pengguna" && ticket.reporter_id !== req.user.id) {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const { data: comments } = await supabase
      .from("ticket_comments")
      .select(
        `
        *,
        user:user_id(id, username, full_name)
      `
      )
      .eq("ticket_id", req.params.id)
      .order("created_at", { ascending: true });

    const { data: logs } = await supabase
      .from("ticket_logs")
      .select(
        `
        *,
        user:user_id(username, full_name)
      `
      )
      .eq("ticket_id", req.params.id)
      .order("created_at", { ascending: false });

    res.json({
      success: true,
      ticket,
      comments: comments || [],
      logs: logs || [],
    });
  } catch (error) {
    console.error("Get ticket detail error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/**
 * PUT /api/tickets/:id
 * Update tiket
 */
app.put("/api/tickets/:id", authenticateToken, async (req, res) => {
  try {
    const { status, priority, category, title, description } = req.body;

    const updateData = { updated_at: new Date() };

    if (status) {
      updateData.status = status;
      if (status === "resolved") updateData.resolved_at = new Date();
      if (status === "closed") updateData.closed_at = new Date();
    }
    if (priority) updateData.priority = priority;
    if (category) updateData.category = category;
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const { data, error } = await supabase
      .from("tickets")
      .update(updateData)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    await logTicketActivity(
      req.params.id,
      req.user.id,
      "update",
      `Tiket diupdate: ${Object.keys(updateData).join(", ")}`
    );

    res.json({
      success: true,
      message: "Tiket berhasil diupdate",
      ticket: data,
    });
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/**
 * POST /api/tickets/:id/assign
 * Assign teknisi ke tiket
 */
app.post(
  "/api/tickets/:id/assign",
  authenticateToken,
  authorizeRole("admin_kota", "admin_opd"),
  async (req, res) => {
    try {
      const { technician_id } = req.body;

      if (!technician_id) {
        return res.status(400).json({ error: "ID teknisi harus diisi" });
      }

      const { data: technician } = await supabase
        .from("users")
        .select("id, role")
        .eq("id", technician_id)
        .single();

      if (!technician || technician.role !== "teknisi") {
        return res.status(400).json({ error: "User bukan teknisi" });
      }

      const { data, error } = await supabase
        .from("tickets")
        .update({
          assigned_to: technician_id,
          status: "in_progress",
          updated_at: new Date(),
        })
        .eq("id", req.params.id)
        .select()
        .single();

      if (error) throw error;

      await logTicketActivity(
        req.params.id,
        req.user.id,
        "assign",
        `Tiket di-assign ke teknisi ID: ${technician_id}`
      );

      await sendNotification(
        technician_id,
        "Ticket Assigned",
        `Ticket ${data.ticket_number} telah di-assign kepada Anda`,
        "info"
      );

      res.json({
        success: true,
        message: "Teknisi berhasil di-assign",
        ticket: data,
      });
    } catch (error) {
      console.error("Assign ticket error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

/**
 * POST /api/tickets/:id/comments
 * Tambah komentar ke tiket
 */
app.post("/api/tickets/:id/comments", authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Konten komentar harus diisi" });
    }

    const { data, error } = await supabase
      .from("ticket_comments")
      .insert({
        ticket_id: req.params.id,
        user_id: req.user.id,
        content,
      })
      .select(
        `
        *,
        user:user_id(id, username, full_name)
      `
      )
      .single();

    if (error) throw error;

    await logTicketActivity(
      req.params.id,
      req.user.id,
      "comment",
      "Menambahkan komentar"
    );

    res.status(201).json({
      success: true,
      message: "Komentar berhasil ditambahkan",
      comment: data,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/**
 * POST /api/tickets/:id/escalate
 * Escalate ticket ke priority lebih tinggi
 */
app.post(
  "/api/tickets/:id/escalate",
  authenticateToken,
  authorizeRole("admin_kota", "admin_opd", "teknisi"),
  async (req, res) => {
    try {
      const { reason } = req.body;

      const { data: ticket } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", req.params.id)
        .single();

      if (!ticket) {
        return res.status(404).json({ error: "Ticket tidak ditemukan" });
      }

      let newPriority = ticket.priority;
      if (ticket.priority === "low") newPriority = "medium";
      else if (ticket.priority === "medium") newPriority = "high";
      else if (ticket.priority === "high") newPriority = "critical";
      else {
        return res
          .status(400)
          .json({ error: "Ticket sudah di priority maksimal" });
      }

      await supabase
        .from("tickets")
        .update({
          priority: newPriority,
          updated_at: new Date(),
        })
        .eq("id", req.params.id);

      await logTicketActivity(
        req.params.id,
        req.user.id,
        "escalate",
        `Escalated: ${ticket.priority} → ${newPriority}. Reason: ${
          reason || "N/A"
        }`
      );

      const { data: admins } = await supabase
        .from("users")
        .select("id")
        .eq("role", "admin_opd")
        .eq("opd_id", ticket.opd_id);

      for (const admin of admins || []) {
        await sendNotification(
          admin.id,
          "Ticket Escalated",
          `Ticket ${ticket.ticket_number} telah di-escalate ke priority ${newPriority}`,
          "warning"
        );
      }

      res.json({
        success: true,
        message: "Ticket berhasil di-escalate",
        old_priority: ticket.priority,
        new_priority: newPriority,
      });
    } catch (error) {
      console.error("Escalate error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

// ============================================
// 3. USER MANAGEMENT
// ============================================

/**
 * GET /api/users
 * Get daftar user
 */
app.get(
  "/api/users",
  authenticateToken,
  authorizeRole("admin_kota", "admin_opd"),
  async (req, res) => {
    try {
      let query = supabase
        .from("users")
        .select(
          "id, username, email, full_name, phone, role, opd_id, is_active, created_at"
        )
        .order("created_at", { ascending: false });

      if (req.user.role === "admin_opd") {
        query = query.eq("opd_id", req.user.opd_id);
      }

      const { data, error } = await query;
      if (error) throw error;

      res.json({
        success: true,
        count: data.length,
        users: data,
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

/**
 * GET /api/users/technicians
 * Get daftar teknisi
 */
app.get("/api/users/technicians", authenticateToken, async (req, res) => {
  try {
    let query = supabase
      .from("users")
      .select("id, username, full_name, email, phone, opd_id")
      .eq("role", "teknisi")
      .eq("is_active", true);

    if (req.user.role !== "admin_kota" && req.user.opd_id) {
      query = query.eq("opd_id", req.user.opd_id);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      technicians: data,
    });
  } catch (error) {
    console.error("Get technicians error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/**
 * PUT /api/users/:id
 * Update user
 */
app.put(
  "/api/users/:id",
  authenticateToken,
  authorizeRole("admin_kota", "admin_opd"),
  async (req, res) => {
    try {
      const { full_name, email, phone, role, opd_id, is_active } = req.body;

      const updateData = {};
      if (full_name) updateData.full_name = full_name;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      if (role) updateData.role = role;
      if (opd_id !== undefined) updateData.opd_id = opd_id;
      if (is_active !== undefined) updateData.is_active = is_active;

      const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", req.params.id)
        .select(
          "id, username, email, full_name, phone, role, opd_id, is_active"
        )
        .single();

      if (error) throw error;

      res.json({
        success: true,
        message: "User berhasil diupdate",
        user: data,
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

// ============================================
// 4. KNOWLEDGE BASE
// ============================================

/**
 * GET /api/knowledge-base
 * Get artikel knowledge base
 */
app.get("/api/knowledge-base", async (req, res) => {
  try {
    const { search, category, status } = req.query;

    let query = supabase
      .from("knowledge_base")
      .select(
        `
        *,
        author:created_by(id, username, full_name)
      `
      )
      .order("view_count", { ascending: false });

    if (
      !req.user ||
      (req.user.role !== "admin_kota" && req.user.role !== "admin_opd")
    ) {
      query = query.eq("status", "published");
    }

    if (status) query = query.eq("status", status);
    if (category) query = query.eq("category", category);
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      articles: data,
    });
  } catch (error) {
    console.error("Get KB error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/**
 * GET /api/knowledge-base/:id
 * Get detail artikel KB
 */
app.get("/api/knowledge-base/:id", async (req, res) => {
  try {
    const { data: article, error } = await supabase
      .from("knowledge_base")
      .select(
        `
        *,
        author:created_by(id, username, full_name)
      `
      )
      .eq("id", req.params.id)
      .single();

    if (error) throw error;
    if (!article) {
      return res.status(404).json({ error: "Artikel tidak ditemukan" });
    }

    await supabase
      .from("knowledge_base")
      .update({ view_count: (article.view_count || 0) + 1 })
      .eq("id", req.params.id);

    res.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error("Get KB detail error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/**
 * POST /api/knowledge-base
 * Buat artikel KB baru
 */
app.post(
  "/api/knowledge-base",
  authenticateToken,
  authorizeRole("admin_kota", "admin_opd"),
  async (req, res) => {
    try {
      const { title, content, category, tags, status } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: "Judul dan konten harus diisi" });
      }

      const { data, error } = await supabase
        .from("knowledge_base")
        .insert({
          title,
          content,
          category: category || "Umum",
          tags: tags || [],
          status: status || "draft",
          created_by: req.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        message: "Artikel berhasil dibuat",
        article: data,
      });
    } catch (error) {
      console.error("Create KB error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

/**
 * PUT /api/knowledge-base/:id
 * Update artikel KB
 */
app.put(
  "/api/knowledge-base/:id",
  authenticateToken,
  authorizeRole("admin_kota", "admin_opd"),
  async (req, res) => {
    try {
      const { title, content, category, tags, status } = req.body;

      const updateData = { updated_at: new Date() };
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (category) updateData.category = category;
      if (tags) updateData.tags = tags;
      if (status) updateData.status = status;

      const { data, error } = await supabase
        .from("knowledge_base")
        .update(updateData)
        .eq("id", req.params.id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        message: "Artikel berhasil diupdate",
        article: data,
      });
    } catch (error) {
      console.error("Update KB error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

/**
 * POST /api/knowledge-base/:id/helpful
 * Mark artikel sebagai helpful
 */
app.post("/api/knowledge-base/:id/helpful", async (req, res) => {
  try {
    const { data: article } = await supabase
      .from("knowledge_base")
      .select("helpful_count")
      .eq("id", req.params.id)
      .single();

    if (!article) {
      return res.status(404).json({ error: "Artikel tidak ditemukan" });
    }

    await supabase
      .from("knowledge_base")
      .update({ helpful_count: (article.helpful_count || 0) + 1 })
      .eq("id", req.params.id);

    res.json({
      success: true,
      message: "Terima kasih atas feedback Anda",
    });
  } catch (error) {
    console.error("KB helpful error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// ============================================
// 5. DASHBOARD & REPORTS
// ============================================

/**
 * GET /api/dashboard/stats
 * Get statistik dashboard
 */
app.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
  try {
    let ticketQuery = supabase.from("tickets").select("*");

    if (req.user.role === "pengguna") {
      ticketQuery = ticketQuery.eq("reporter_id", req.user.id);
    } else if (req.user.role === "teknisi") {
      ticketQuery = ticketQuery.eq("assigned_to", req.user.id);
    } else if (req.user.role === "admin_opd") {
      ticketQuery = ticketQuery.eq("opd_id", req.user.opd_id);
    }

    const { data: tickets } = await ticketQuery;

    const stats = {
      total_tickets: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      in_progress: tickets.filter((t) => t.status === "in_progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      closed: tickets.filter((t) => t.status === "closed").length,
      sla_breached: tickets.filter((t) => t.sla_breached).length,
      by_priority: {
        low: tickets.filter((t) => t.priority === "low").length,
        medium: tickets.filter((t) => t.priority === "medium").length,
        high: tickets.filter((t) => t.priority === "high").length,
        critical: tickets.filter((t) => t.priority === "critical").length,
      },
      by_type: {
        incident: tickets.filter((t) => t.type === "incident").length,
        request: tickets.filter((t) => t.type === "request").length,
      },
    };

    const resolvedTickets = tickets.filter(
      (t) => t.status === "resolved" || t.status === "closed"
    );
    const slaCompliance =
      resolvedTickets.length > 0
        ? (
            ((resolvedTickets.length - stats.sla_breached) /
              resolvedTickets.length) *
            100
          ).toFixed(2)
        : 100;

    res.json({
      success: true,
      stats,
      sla_compliance: `${slaCompliance}%`,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/**
 * GET /api/dashboard/recent-tickets
 * Get tiket terbaru
 */
app.get(
  "/api/dashboard/recent-tickets",
  authenticateToken,
  async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;

      let query = supabase
        .from("tickets")
        .select(
          `
        id,
        ticket_number,
        title,
        priority,
        status,
        type,
        created_at,
        reporter:reporter_id(username, full_name)
      `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (req.user.role === "pengguna") {
        query = query.eq("reporter_id", req.user.id);
      } else if (req.user.role === "teknisi") {
        query = query.eq("assigned_to", req.user.id);
      } else if (req.user.role === "admin_opd") {
        query = query.eq("opd_id", req.user.opd_id);
      }

      const { data, error } = await query;
      if (error) throw error;

      res.json({
        success: true,
        tickets: data,
      });
    } catch (error) {
      console.error("Recent tickets error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

/**
 * GET /api/reports/sla-compliance
 * Laporan SLA Compliance
 */
app.get(
  "/api/reports/sla-compliance",
  authenticateToken,
  authorizeRole("admin_kota", "admin_opd"),
  async (req, res) => {
    try {
      const { start_date, end_date } = req.query;

      let query = supabase
        .from("tickets")
        .select("*")
        .in("status", ["resolved", "closed"]);

      if (req.user.role === "admin_opd") {
        query = query.eq("opd_id", req.user.opd_id);
      }

      if (start_date) query = query.gte("created_at", start_date);
      if (end_date) query = query.lte("created_at", end_date);

      const { data: tickets, error } = await query;
      if (error) throw error;

      const byPriority = {
        low: { total: 0, breached: 0, compliance: 0 },
        medium: { total: 0, breached: 0, compliance: 0 },
        high: { total: 0, breached: 0, compliance: 0 },
        critical: { total: 0, breached: 0, compliance: 0 },
      };

      tickets.forEach((t) => {
        if (byPriority[t.priority]) {
          byPriority[t.priority].total++;
          if (t.sla_breached) byPriority[t.priority].breached++;
        }
      });

      Object.keys(byPriority).forEach((priority) => {
        const p = byPriority[priority];
        p.compliance =
          p.total > 0
            ? (((p.total - p.breached) / p.total) * 100).toFixed(2) + "%"
            : "100%";
      });

      const totalBreached = tickets.filter((t) => t.sla_breached).length;
      const overallCompliance =
        tickets.length > 0
          ? (((tickets.length - totalBreached) / tickets.length) * 100).toFixed(
              2
            )
          : 100;

      res.json({
        success: true,
        period: { start_date, end_date },
        overall: {
          total: tickets.length,
          met: tickets.length - totalBreached,
          breached: totalBreached,
          compliance: `${overallCompliance}%`,
        },
        by_priority: byPriority,
      });
    } catch (error) {
      console.error("SLA report error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

// ============================================
// 6. OPD MANAGEMENT
// ============================================

/**
 * GET /api/opd
 * Get daftar OPD
 */
app.get("/api/opd", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("opd")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      opd: data,
    });
  } catch (error) {
    console.error("Get OPD error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/**
 * POST /api/opd
 * Buat OPD baru
 */
app.post(
  "/api/opd",
  authenticateToken,
  authorizeRole("admin_kota"),
  async (req, res) => {
    try {
      const { code, name, address, phone, email } = req.body;

      if (!code || !name) {
        return res.status(400).json({ error: "Kode dan nama OPD harus diisi" });
      }

      const { data, error } = await supabase
        .from("opd")
        .insert({
          code: code.toUpperCase(),
          name,
          address,
          phone,
          email,
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        message: "OPD berhasil dibuat",
        opd: data,
      });
    } catch (error) {
      console.error("Create OPD error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

// ============================================
// 7. NOTIFICATIONS
// ============================================

/**
 * GET /api/notifications
 * Get notifikasi user
 */
app.get("/api/notifications", authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const unread = data.filter((n) => !n.is_read).length;

    res.json({
      success: true,
      unread_count: unread,
      notifications: data,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Tandai notifikasi sebagai sudah dibaca
 */
app.put("/api/notifications/:id/read", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Notifikasi ditandai sebagai sudah dibaca",
      notification: data,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// ============================================
// 8. INTEGRATION ENDPOINTS
// ============================================

/**
 * POST /api/integration/tickets/:id/link-asset
 * Link ticket ke aset
 */
app.post(
  "/api/integration/tickets/:id/link-asset",
  authenticateToken,
  async (req, res) => {
    try {
      const { asset_id, asset_name, description } = req.body;

      if (!asset_id || !asset_name) {
        return res.status(400).json({ error: "Asset ID dan nama harus diisi" });
      }

      const { data: ticket } = await supabase
        .from("tickets")
        .select("id")
        .eq("id", req.params.id)
        .single();

      if (!ticket) {
        return res.status(404).json({ error: "Ticket tidak ditemukan" });
      }

      const { data, error } = await supabase
        .from("ticket_asset_links")
        .insert({
          ticket_id: req.params.id,
          asset_id,
          asset_name,
          description: description || null,
          linked_by: req.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      await logTicketActivity(
        req.params.id,
        req.user.id,
        "link_asset",
        `Asset linked: ${asset_name} (${asset_id})`
      );

      res.json({
        success: true,
        message: "Asset berhasil di-link ke ticket",
        link: data,
      });
    } catch (error) {
      console.error("Link asset error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

/**
 * GET /api/integration/tickets/:id/assets
 * Get semua asset yang linked ke ticket
 */
app.get(
  "/api/integration/tickets/:id/assets",
  authenticateToken,
  async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("ticket_asset_links")
        .select(
          `
          *,
          linked_by_user:linked_by(id, username, full_name)
        `
        )
        .eq("ticket_id", req.params.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        count: data.length,
        assets: data,
      });
    } catch (error) {
      console.error("Get linked assets error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

/**
 * POST /api/integration/tickets/:id/create-change
 * Buat Change Request dari ticket
 */
app.post(
  "/api/integration/tickets/:id/create-change",
  authenticateToken,
  authorizeRole("admin_kota", "admin_opd", "teknisi"),
  async (req, res) => {
    try {
      const {
        change_type,
        title,
        impact,
        rollback_plan,
        schedule_start,
        affected_ci_ids,
      } = req.body;

      const { data: ticket } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", req.params.id)
        .single();

      if (!ticket) {
        return res.status(404).json({ error: "Ticket tidak ditemukan" });
      }

      const changeNumber = `CHG-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 10000
      )
        .toString()
        .padStart(4, "0")}`;

      const { data, error } = await supabase
        .from("ticket_change_links")
        .insert({
          ticket_id: ticket.id,
          change_id: changeNumber,
          change_number: changeNumber,
          status: "pending",
          created_by: req.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      await logTicketActivity(
        ticket.id,
        req.user.id,
        "create_change",
        `Change Request created: ${changeNumber}`
      );

      res.json({
        success: true,
        message: "Change Request berhasil dibuat dari ticket",
        change: {
          change_number: changeNumber,
          ticket_id: ticket.id,
          ticket_number: ticket.ticket_number,
          status: "pending",
          created_at: new Date(),
        },
        link: data,
      });
    } catch (error) {
      console.error("Create change error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

/**
 * GET /api/integration/tickets/:id/changes
 * Get semua change request yang terkait dengan ticket
 */
app.get(
  "/api/integration/tickets/:id/changes",
  authenticateToken,
  async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("ticket_change_links")
        .select(
          `
          *,
          created_by_user:created_by(id, username, full_name)
        `
        )
        .eq("ticket_id", req.params.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        count: data.length,
        changes: data,
      });
    } catch (error) {
      console.error("Get linked changes error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

/**
 * GET /api/integration/tickets/:id/related
 * Get semua data terkait (assets + changes)
 */
app.get(
  "/api/integration/tickets/:id/related",
  authenticateToken,
  async (req, res) => {
    try {
      const { data: assets } = await supabase
        .from("ticket_asset_links")
        .select("*")
        .eq("ticket_id", req.params.id);

      const { data: changes } = await supabase
        .from("ticket_change_links")
        .select("*")
        .eq("ticket_id", req.params.id);

      res.json({
        success: true,
        related: {
          assets: assets || [],
          changes: changes || [],
          asset_count: assets ? assets.length : 0,
          change_count: changes ? changes.length : 0,
        },
      });
    } catch (error) {
      console.error("Get related data error:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
);

// ============================================
// 9. WEBHOOK RECEIVERS
// ============================================

/**
 * POST /api/webhooks/asset-status-changed
 * Webhook dari Asset Management
 */
app.post("/api/webhooks/asset-status-changed", async (req, res) => {
  try {
    const webhookSecret = req.headers["x-webhook-secret"];
    if (webhookSecret !== WEBHOOK_SECRET) {
      return res.status(401).json({ error: "Unauthorized webhook" });
    }

    const { asset_id, old_status, new_status, changed_by } = req.body;

    const { data: links } = await supabase
      .from("ticket_asset_links")
      .select(
        `
        ticket_id,
        tickets (
          id,
          ticket_number,
          status,
          reporter_id
        )
      `
      )
      .eq("asset_id", asset_id);

    if (links && links.length > 0) {
      for (const link of links) {
        const ticket = link.tickets;

        if (["open", "in_progress"].includes(ticket.status)) {
          await supabase.from("ticket_comments").insert({
            ticket_id: ticket.id,
            user_id: null,
            content: `🔔 Asset status changed: ${old_status} → ${new_status}`,
          });

          await logTicketActivity(
            ticket.id,
            null,
            "asset_update",
            `Asset ${asset_id} status changed to ${new_status}`
          );

          if (
            new_status === "operational" ||
            new_status === "fixed" ||
            new_status === "active"
          ) {
            await sendNotification(
              ticket.reporter_id,
              "Asset Terkait Sudah Diperbaiki",
              `Asset terkait ticket ${ticket.ticket_number} sudah diperbaiki. Silakan verifikasi dan close ticket jika masalah sudah selesai.`,
              "success"
            );
          }
        }
      }
    }

    res.json({
      success: true,
      message: "Webhook processed",
      affected_tickets: links ? links.length : 0,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

/**
 * POST /api/webhooks/change-completed
 * Webhook dari Change Management
 */
app.post("/api/webhooks/change-completed", async (req, res) => {
  try {
    const webhookSecret = req.headers["x-webhook-secret"];
    if (webhookSecret !== WEBHOOK_SECRET) {
      return res.status(401).json({ error: "Unauthorized webhook" });
    }

    const { change_id, change_number, status, result } = req.body;

    const { data: link } = await supabase
      .from("ticket_change_links")
      .select(
        `
        *,
        tickets (*)
      `
      )
      .eq("change_id", change_id)
      .single();

    if (link) {
      const ticket = link.tickets;

      await supabase
        .from("ticket_change_links")
        .update({ status: status })
        .eq("id", link.id);

      await supabase.from("ticket_comments").insert({
        ticket_id: ticket.id,
        user_id: null,
        content: `🔧 Change Request ${change_number} ${status}: ${result}`,
      });

      if (status === "completed" && result === "success") {
        if (["open", "in_progress"].includes(ticket.status)) {
          await supabase
            .from("tickets")
            .update({
              status: "resolved",
              resolved_at: new Date(),
              resolution: `Resolved via Change Request ${change_number}`,
            })
            .eq("id", ticket.id);

          await sendNotification(
            ticket.reporter_id,
            "Ticket Resolved",
            `Ticket ${ticket.ticket_number} telah di-resolve melalui Change Request ${change_number}`,
            "success"
          );

          await logTicketActivity(
            ticket.id,
            null,
            "auto_resolve",
            `Auto-resolved via Change Request ${change_number}`
          );
        }
      }
    }

    res.json({
      success: true,
      message: "Webhook processed",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

/**
 * POST /api/webhooks/high-risk-asset
 * Webhook untuk asset berisiko tinggi
 */
app.post("/api/webhooks/high-risk-asset", async (req, res) => {
  try {
    const webhookSecret = req.headers["x-webhook-secret"];
    if (webhookSecret !== WEBHOOK_SECRET) {
      return res.status(401).json({ error: "Unauthorized webhook" });
    }

    const { asset_id, asset_name, risk_level, risk_description, opd_id } =
      req.body;

    const ticketNumber = generateTicketNumber("incident");

    const { data: ticket } = await supabase
      .from("tickets")
      .insert({
        ticket_number: ticketNumber,
        type: "incident",
        title: `⚠️ High Risk Asset Alert: ${asset_name}`,
        description: `Asset ${asset_name} has been flagged as high-risk.\n\nRisk Level: ${risk_level}\nRisk Details:\n${risk_description}\n\nPreventive action required.`,
        priority: "high",
        category: "Preventive Maintenance",
        status: "open",
        reporter_id: 1,
        opd_id: opd_id,
        created_at: new Date(),
      })
      .select()
      .single();

    await supabase.from("ticket_asset_links").insert({
      ticket_id: ticket.id,
      asset_id,
      asset_name,
      description: "Auto-linked from risk alert",
      linked_by: 1,
    });

    const { data: admins } = await supabase
      .from("users")
      .select("id")
      .eq("role", "admin_opd")
      .eq("opd_id", opd_id);

    for (const admin of admins || []) {
      await sendNotification(
        admin.id,
        "High-Risk Asset Detected",
        `High-risk asset detected: ${asset_name}. Preventive maintenance ticket created: ${ticketNumber}`,
        "warning"
      );
    }

    res.json({
      success: true,
      message: "Preventive ticket created",
      ticket: ticket,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// ============================================
// 10. HEALTH CHECK
// ============================================

/**
 * GET /health
 * Health check endpoint
 */
app.get("/health", async (req, res) => {
  try {
    const { error } = await supabase.from("users").select("count").limit(1);

    res.json({
      status: error ? "unhealthy" : "healthy",
      timestamp: new Date().toISOString(),
      database: error ? "error" : "connected",
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// ============================================
// ROOT ENDPOINT
// ============================================

app.get("/", (req, res) => {
  res.json({
    message: "Service Desk API - Complete Version",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        profile: "GET /api/auth/profile",
      },
      tickets: {
        create: "POST /api/tickets",
        list: "GET /api/tickets",
        detail: "GET /api/tickets/:id",
        update: "PUT /api/tickets/:id",
        assign: "POST /api/tickets/:id/assign",
        comment: "POST /api/tickets/:id/comments",
        escalate: "POST /api/tickets/:id/escalate",
      },
      users: {
        list: "GET /api/users",
        technicians: "GET /api/users/technicians",
        update: "PUT /api/users/:id",
      },
      knowledge_base: {
        list: "GET /api/knowledge-base",
        detail: "GET /api/knowledge-base/:id",
        create: "POST /api/knowledge-base",
        update: "PUT /api/knowledge-base/:id",
        helpful: "POST /api/knowledge-base/:id/helpful",
      },
      dashboard: {
        stats: "GET /api/dashboard/stats",
        recent: "GET /api/dashboard/recent-tickets",
      },
      reports: {
        sla: "GET /api/reports/sla-compliance",
      },
      opd: {
        list: "GET /api/opd",
        create: "POST /api/opd",
      },
      notifications: {
        list: "GET /api/notifications",
        mark_read: "PUT /api/notifications/:id/read",
      },
      integration: {
        link_asset: "POST /api/integration/tickets/:id/link-asset",
        get_assets: "GET /api/integration/tickets/:id/assets",
        create_change: "POST /api/integration/tickets/:id/create-change",
        get_changes: "GET /api/integration/tickets/:id/changes",
        get_related: "GET /api/integration/tickets/:id/related",
      },
      webhooks: {
        asset_status: "POST /api/webhooks/asset-status-changed",
        change_completed: "POST /api/webhooks/change-completed",
        high_risk_asset: "POST /api/webhooks/high-risk-asset",
      },
    },
    health: "/health",
    docs: "/api-docs",
  });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Terjadi kesalahan server",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`

SERVICE DESK API

Port: ${PORT}
Status: ✅ Running
API Docs: http://localhost:${PORT}/api-docs
Health: http://localhost:${PORT}/health 
  `);
});

module.exports = app;
