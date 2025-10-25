/**
 * ============================================
 * Siladan App
 * ============================================
 * Fitur Utama:
 * 1. Authentication (Login/Register)
 * 2. Ticket Management (CRUD)
 * 3. User Management
 * 4. Knowledge Base
 * 5. Dashboard & Reports
 * ============================================
 */

const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express"); // Tambahkan ini
const { swaggerDocs, swaggerUiOptions } = require("./swagger.js"); // Import dari swagger.js (asumsi file sama direktori)
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());

// Tambahkan Swagger UI route di sini
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, swaggerUiOptions)
);
// ============================================
// ROOT ENDPOINT
// ============================================
app.get("/", (req, res) => {
  res.json({
    message: "Service Desk API - Versi Sederhana",
    version: "1.0.0",
    endpoints: {
      // ... (endpoint list tetap)
    },
    health: "/health",
    docs: "/api-docs", // Tambahkan ini untuk referensi
  });
});

// ============================================
// SUPABASE CONNECTION
// ============================================
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

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

// Generate ticket number
const generateTicketNumber = (type) => {
  const prefix = type === "incident" ? "INC" : "REQ";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${year}-${random}`;
};

// Hitung SLA due date (sederhana)
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

    // Validasi input
    if (!username || !password || !email || !role) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
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

    // Cari user
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Username atau password salah" });
    }

    // Cek password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Username atau password salah" });
    }

    // Update last login
    await supabase
      .from("users")
      .update({ last_login_at: new Date() })
      .eq("id", user.id);

    // Generate JWT token
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
 * Buat tiket baru (Incident atau Request)
 */
app.post("/api/tickets", authenticateToken, async (req, res) => {
  try {
    const { type, title, description, priority, category, opd_id } = req.body;

    // Validasi
    if (!type || !title || !description || !priority) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }

    // Generate ticket number
    const ticketNumber = generateTicketNumber(type);

    // Hitung SLA
    const slaDue = await calculateSLADue(priority, opd_id || req.user.opd_id);

    // Insert ticket
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

    // Log aktivitas
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
 * Get daftar tiket (dengan filter)
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

    // Filter berdasarkan role
    if (req.user.role === "pengguna") {
      query = query.eq("reporter_id", req.user.id);
    } else if (req.user.role === "teknisi") {
      query = query.eq("assigned_to", req.user.id);
    } else if (req.user.role === "admin_opd") {
      query = query.eq("opd_id", req.user.opd_id);
    }
    // admin_kota bisa lihat semua

    // Filter tambahan
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

    // Cek akses
    if (req.user.role === "pengguna" && ticket.reporter_id !== req.user.id) {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    // Get comments
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

    // Get logs
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

    const updateData = {
      updated_at: new Date(),
    };

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

    // Log aktivitas
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

      // Cek apakah user adalah teknisi
      const { data: technician } = await supabase
        .from("users")
        .select("id, role")
        .eq("id", technician_id)
        .single();

      if (!technician || technician.role !== "teknisi") {
        return res.status(400).json({ error: "User bukan teknisi" });
      }

      // Assign
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

      // Log
      await logTicketActivity(
        req.params.id,
        req.user.id,
        "assign",
        `Tiket di-assign ke teknisi ID: ${technician_id}`
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

    // Log
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

// ============================================
// 3. USER MANAGEMENT
// ============================================

/**
 * GET /api/users
 * Get daftar user (admin only)
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

      // Admin OPD hanya bisa lihat user di OPD-nya
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
 * Get daftar teknisi (untuk assign tiket)
 */
app.get("/api/users/technicians", authenticateToken, async (req, res) => {
  try {
    let query = supabase
      .from("users")
      .select("id, username, full_name, email, phone, opd_id")
      .eq("role", "teknisi")
      .eq("is_active", true);

    // Filter by OPD if not admin_kota
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
 * Update user (admin only)
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
 * Get artikel knowledge base (dengan search)
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

    // Hanya tampilkan published jika bukan admin
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

    // Increment view count
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
 * Buat artikel KB baru (admin only)
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
 * Update artikel KB (admin only)
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

    // Filter by role
    if (req.user.role === "pengguna") {
      ticketQuery = ticketQuery.eq("reporter_id", req.user.id);
    } else if (req.user.role === "teknisi") {
      ticketQuery = ticketQuery.eq("assigned_to", req.user.id);
    } else if (req.user.role === "admin_opd") {
      ticketQuery = ticketQuery.eq("opd_id", req.user.opd_id);
    }

    const { data: tickets } = await ticketQuery;

    // Hitung statistik
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

    // SLA Compliance
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

      // Filter by role
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

      // Hitung compliance per priority
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
 * Buat OPD baru (admin_kota only)
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
// 8. HEALTH CHECK
// ============================================

/**
 * GET /health
 * Health check endpoint
 */
app.get("/health", async (req, res) => {
  try {
    // Test database connection
    const { error } = await supabase.from("users").select("count").limit(1);

    res.json({
      status: error ? "unhealthy" : "healthy",
      timestamp: new Date().toISOString(),
      database: error ? "error" : "connected",
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
    message: "Service Desk API - Versi Sederhana",
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
    },
    health: "/health",
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
