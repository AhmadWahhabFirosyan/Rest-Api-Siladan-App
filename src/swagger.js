const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Siladan API",
      version: "2.0.0",
      description: "Dokumentasi REST API Siladan App",
      contact: {
        name: "Tim Backend",
        email: "ahmadwahhabfirosyan@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080/api/v1",
        description: "Development Server",
      },
      {
        url: "https://manpro-473802.et.r.appspot.com/api/v1",
        description: "Production Server",
      },
    ],
    tags: [
      {
        name: "0. Public",
        description: "Endpoint publik yang tidak memerlukan login",
      },
      {
        name: "1. Authentication",
        description: "Login, Register, Lupa Password, dan Profil",
      },
      {
        name: "2. Incidents",
        description:
          "Manajemen Insiden (Create, Read, Update, Classify, Merge)",
      },
      {
        name: "3. Service Requests",
        description: "Manajemen Permintaan Layanan",
      },
      {
        name: "4. Service Catalog",
        description: "Mengelola katalog layanan yang bisa di-request",
      },
      {
        name: "5. Knowledge Base (KB)",
        description: "Manajemen artikel, FAQ, dan Known Errors",
      },
      {
        name: "6. Assets & QR Code",
        description: "Manajemen Aset dan fungsionalitas Scan QR",
      },
      {
        name: "7. Admin",
        description: "Operasional Admin (Users, OPD, Technicians, dll.)",
      },
      {
        name: "8. Attachments & Comments",
        description: "Manajemen Lampiran File dan Komentar",
      },
      {
        name: "9. Progress Updates",
        description: "Update Progress untuk Insiden dan Request",
      },
      {
        name: "10. Audit & Stats",
        description: "Audit Logs dan Statistik Sistem",
      },
      {
        name: "11. Utilities",
        description: "Endpoint lain-lain (Sync, Chat, Survey, Search)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Otorisasi menggunakan Bearer Token JWT yang didapat dari /auth/login.",
        },
      },
      schemas: {
        // --- Skema Input ---
        InputLogin: {
          type: "object",
          properties: {
            username: { type: "string", example: "admin.kota" },
            password: {
              type: "string",
              format: "password",
              example: "pass1234",
            },
          },
          required: ["username", "password"],
        },
        InputRegister: {
          type: "object",
          description:
            "Untuk registrasi publik (/auth/register). Role otomatis 'pengguna'.",
          properties: {
            username: { type: "string", example: "budi.pengguna" },
            email: {
              type: "string",
              format: "email",
              example: "budi@gmail.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "pass1234",
            },
            full_name: { type: "string", example: "Budi Setiawan" },
            nip: {
              type: "string",
              description: "Bisa NIK",
              example: "3578...",
            },
            phone: { type: "string", example: "08123456789" },
            address: { type: "string", example: "Jl. Contoh No. 1" },
          },
          required: ["username", "password", "email", "full_name"],
        },
        InputForgotPassword: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
          },
          required: ["email"],
        },
        InputUpdateProfile: {
          type: "object",
          properties: {
            full_name: { type: "string", example: "Budi Setiawan" },
            phone: { type: "string", example: "08123456789" },
            address: { type: "string", example: "Jl. Contoh No. 1" },
          },
        },
        InputCreateIncident: {
          type: "object",
          description:
            "Untuk internal (/incidents) oleh 'pegawai_opd' atau 'admin'. Urgency/Impact di-set default oleh server.",
          properties: {
            title: { type: "string", example: "Printer Mati" },
            description: { type: "string", example: "Printer tidak menyala." },
            category: { type: "string", example: "Hardware" },
            incident_location: { type: "string", example: "Lantai 3" },
            incident_date: {
              type: "string",
              format: "date-time",
              example: "2025-11-07T10:00:00Z",
            },
            opd_id: {
              type: "integer",
              example: 1,
              description: "Opsional, default diambil dari OPD pelapor",
            },
            asset_identifier: {
              type: "string",
              description: "Nama aset (teks bebas)",
              example: "PC-01",
            },
            attachment_url: {
              type: "string",
              description: "URL file yang sudah di-upload",
              example: "https://.../printer.jpg",
            },
          },
          required: ["title", "description"],
        },
        InputCreatePublicIncident: {
          type: "object",
          description:
            "Untuk publik (/public/incidents). Wajib isi data pelapor.",
          properties: {
            title: { type: "string", example: "Lampu Jalan Mati" },
            description: {
              type: "string",
              example: "Lampu di Jl. Pahlawan mati.",
            },
            category: { type: "string", example: "Fasilitas Publik" },
            incident_location: { type: "string", example: "Jl. Pahlawan" },
            incident_date: {
              type: "string",
              format: "date-time",
              example: "2025-11-07T10:00:00Z",
            },
            asset_identifier: {
              type: "string",
              description: "Nama aset (teks bebas)",
              example: "Tiang Lampu A-05",
            },
            opd_id: {
              type: "integer",
              example: 22,
              description: "Wajib diisi oleh publik",
            },
            reporter_name: { type: "string", example: "Warga Peduli" },
            reporter_email: {
              type: "string",
              format: "email",
              example: "warga@gmail.com",
            },
            reporter_phone: { type: "string", example: "081298765432" },
            reporter_address: { type: "string", example: "Jl. Mawar No. 10" },
            reporter_nik: {
              type: "string",
              description: "NIK Pelapor (sesuai app.js)",
              example: "3578...",
            },
            attachment_url: {
              type: "string",
              description: "URL file yang sudah di-upload",
              example: "https://.../lampu.jpg",
            },
          },
          required: [
            "title",
            "description",
            "opd_id",
            "reporter_name",
            "reporter_email",
            "reporter_phone",
          ],
        },
        InputClassifyIncident: {
          type: "object",
          description:
            "Untuk Seksi mengklasifikasi prioritas (/incidents/:id/classify)",
          properties: {
            urgency: { type: "integer", example: 4, description: "Nilai 1-5" },
            impact: { type: "integer", example: 3, description: "Nilai 1-5" },
          },
          required: ["urgency", "impact"],
        },
        InputUpdateIncident: {
          type: "object",
          description:
            "Untuk update general (status, judul, dll) oleh teknisi/admin",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            category: { type: "string" },
            status: { type: "string", example: "in_progress" },
          },
        },
        InputMergeIncidents: {
          type: "object",
          properties: {
            source_ticket_ids: {
              type: "array",
              items: { type: "integer" },
              example: [1, 2],
            },
            target_ticket_id: { type: "integer", example: 3 },
            reason: { type: "string", example: "Duplicate issues" },
          },
          required: ["source_ticket_ids", "target_ticket_id", "reason"],
        },
        InputCreateRequest: {
          type: "object",
          description:
            "Untuk internal (/requests) oleh 'pegawai_opd' atau 'admin'. OPD ID diambil otomatis dari token user. service_catalog_id diambil otomatis dari service_item_id.",
          properties: {
            title: { type: "string", example: "Permintaan Akun Email Baru" },
            description: {
              type: "string",
              example: "Mohon dibuatkan akun email untuk pegawai baru.",
            },
            service_item_id: {
              type: "integer",
              example: 10,
              description: "ID item layanan yang spesifik (WAJIB)",
            },
            service_detail: {
              type: "object",
              example: { email_yang_di_reset: "pegawai.lupa@surabaya.go.id" },
            },
            attachment_url: {
              type: "string",
              description: "URL file yang sudah di-upload (Opsional)",
              example: "https://.../form.pdf",
            },
            requested_date: {
              type: "string",
              format: "date-time",
              description: "Tanggal permintaan layanan diperlukan (Opsional)",
              example: "2025-11-20T10:00:00Z",
            },
          },
          required: ["title", "description", "service_item_id"],
        },
        InputRequestApproval: {
          type: "object",
          properties: {
            notes: { type: "string", example: "Disetujui" },
          },
        },
        InputRequestReject: {
          type: "object",
          properties: {
            notes: { type: "string", example: "Data tidak lengkap" },
          },
          required: ["notes"],
        },
        InputCreateKB: {
          type: "object",
          properties: {
            title: { type: "string", example: "Cara Reset Password" },
            content: { type: "string", example: "Langkah 1..." },
            category: { type: "string", example: "FAQ" },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["password", "reset"],
            },
            opd_id: { type: "integer", example: 1 },
          },
          required: ["title", "content"],
        },
        InputUpdateKB: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            category: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
          },
        },
        InputMarkRead: {
          type: "object",
          properties: {
            notification_ids: {
              type: "array",
              items: { type: "integer" },
              example: [1, 2, 3],
            },
          },
          required: ["notification_ids"],
        },
        InputSurvey: {
          type: "object",
          properties: {
            ticket_id: { type: "integer" },
            rating: { type: "integer", example: 5 },
            feedback: { type: "string", example: "Sangat membantu!" },
            categories: { type: "object", example: { speed: 5, quality: 4 } },
          },
          required: ["ticket_id", "rating"],
        },
        InputChat: {
          type: "object",
          properties: {
            message: { type: "string", example: "Halo, saya butuh bantuan" },
            ticket_id: {
              type: "integer",
              example: 101,
              description: "Opsional, jika chat terkait tiket",
            },
          },
          required: ["message"],
        },
        InputSync: {
          type: "object",
          properties: {
            tickets: { type: "array", items: { type: "object" } },
            progress_updates: { type: "array", items: { type: "object" } },
          },
        },
        InputComment: {
          type: "object",
          properties: {
            content: { type: "string", example: "Komentar tambahan" },
            is_internal: { type: "boolean", example: false },
          },
          required: ["content"],
        },
        InputProgressUpdateIncident: {
          type: "object",
          properties: {
            update_number: { type: "integer", example: 1 },
            status_change: { type: "string", example: "Ditangani" },
            reason: { type: "string", example: "Pengecekan awal" },
            problem_detail: { type: "string", example: "Kabel rusak" },
            handling_description: { type: "string", example: "Ganti kabel" },
            final_solution: { type: "string", example: "Masalah teratasi" },
          },
          required: ["update_number", "status_change"],
        },
        InputProgressUpdateRequest: {
          type: "object",
          properties: {
            update_number: { type: "integer", example: 1 },
            status_change: { type: "string", example: "Dalam Proses" },
            notes: { type: "string", example: "Catatan update" },
          },
          required: ["update_number", "status_change"],
        },
        InputCreateAdminUser: {
          type: "object",
          description: "Untuk Admin membuat akun internal (/admin/users)",
          properties: {
            username: { type: "string", example: "admin.opd" },
            password: {
              type: "string",
              format: "password",
              example: "pass1234",
            },
            email: {
              type: "string",
              format: "email",
              example: "admin@opd.go.id",
            },
            full_name: { type: "string", example: "Admin OPD" },
            nip: { type: "string", example: "199001012020011001" },
            phone: { type: "string", example: "08123456789" },
            address: { type: "string", example: "Jl. Contoh No. 1" },
            role: {
              type: "string",
              enum: [
                "super_admin",
                "admin_kota",
                "admin_opd",
                "bidang",
                "seksi",
                "teknisi",
                "pegawai_opd",
                "pengguna",
              ],
              example: "pegawai_opd",
            },
            opd_id: { type: "integer", example: 1 },
            bidang_id: { type: "integer", example: 1 },
            seksi_id: { type: "integer", example: 1 },
          },
          required: ["username", "password", "email", "full_name", "role"],
        },
        InputUpdateUserRole: {
          type: "object",
          properties: {
            role: { type: "string", example: "teknisi" },
            opd_id: { type: "integer", example: 1 },
            bidang_id: { type: "integer", example: 1 },
            seksi_id: { type: "integer", example: 1 },
            is_active: { type: "boolean", example: true },
          },
        },
        InputUpdateOpdBranding: {
          type: "object",
          properties: {
            logo_url: {
              type: "string",
              example: "https://example.com/logo.png",
            },
            primary_color: { type: "string", example: "#007bff" },
            secondary_color: { type: "string", example: "#6c757d" },
          },
        },
        InputUpdateOpdCalendar: {
          type: "object",
          properties: {
            working_hours: {
              type: "object",
              example: { monday: "08:00-16:00" },
            },
            holidays: {
              type: "array",
              items: { type: "string" },
              example: ["2025-12-25"],
            },
          },
        },
        InputUpdateTechnicianSkills: {
          type: "object",
          properties: {
            skills: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Network" },
                  level: { type: "string", example: "expert" },
                  category: { type: "string", example: "IT" },
                },
              },
            },
            expertise_level: { type: "string", example: "senior" },
            certifications: {
              type: "array",
              items: { type: "string" },
              example: ["CCNA"],
            },
          },
          required: ["skills"],
        },
        InputTechnicianCheckIn: {
          type: "object",
          properties: {
            asset_id: { type: "integer", example: 1 },
            qr_code: { type: "string", example: "QR123" },
            latitude: { type: "number", example: -6.2088 },
            longitude: { type: "number", example: 106.8456 },
          },
        },

        // --- Skema Data (Model) ---

        ServiceItemBasic: {
          type: "object",
          description: "Detail item layanan dasar (Level 3) untuk dropdown",
          properties: {
            id: { type: "integer", example: 11 },
            item_name: { type: "string", example: "Buat Akun Email" },
          },
        },
        ServiceCatalog: {
          type: "object",
          description:
            "Model data untuk Katalog Layanan (Level 1) dan anak-anaknya yang sudah di-map",
          properties: {
            id: { type: "integer", example: 1 },
            opd_id: { type: "integer" },
            catalog_name: { type: "string", example: "Layanan IT" },
            catalog_code: { type: "string" },
            description: { type: "string", example: "Deskripsi" },
            icon: { type: "string" },
            display_order: { type: "integer" },
            is_active: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
            total_items: { type: "integer", example: 5 },
            sub_layanan: {
              type: "array",
              description: "Struktur sub-layanan (Level 2)",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 10 },
                  sub_catalog_name: {
                    type: "string",
                    example: "Layanan Email",
                  },
                  description: { type: "string" },
                  approval_required: { type: "boolean" },
                  service_items: {
                    type: "array",
                    description: "Detail layanan (Level 3)",
                    items: { $ref: "#/components/schemas/ServiceItemBasic" },
                  },
                },
              },
            },
          },
        },
        User: {
          type: "object",
          description: "Skema User general",
          properties: {
            id: { type: "integer", example: 1 },
            username: { type: "string", example: "admin.kota" },
            email: {
              type: "string",
              format: "email",
              example: "admin@pemkot.go.id",
            },
            full_name: { type: "string", example: "Admin Kota" },
            nip: { type: "string", example: "199001012020011001" },
            phone: { type: "string", example: "08123456789" },
            address: { type: "string", example: "Jl. Contoh No. 1" },
            role: { type: "string", example: "admin_kota" },
            opd_id: { type: "integer", example: 1 },
            is_active: { type: "boolean", example: true },
            opd: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                code: { type: "string" },
              },
            },
            bidang: {
              type: "object",
              properties: { id: { type: "integer" }, name: { type: "string" } },
            },
            seksi: {
              type: "object",
              properties: { id: { type: "integer" }, name: { type: "string" } },
            },
            created_at: { type: "string", format: "date-time" },
          },
        },
        // --- PERBAIKAN: Ticket Schema Lengkap (Gabungan Incident & Request) ---
        Ticket: {
          type: "object",
          description:
            "Model Ticket lengkap. Mencakup field dari Incident, Request, dan field server-generated.",
          properties: {
            id: { type: "integer", example: 101 },
            ticket_number: { type: "string", example: "INC-2025-001" },
            type: { type: "string", example: "incident" },
            title: { type: "string", example: "Printer Mati" },
            description: { type: "string" },
            status: { type: "string", example: "open" },
            priority: { type: "string", example: "medium" },
            priority_score: { type: "integer", example: 9 },
            urgency: { type: "integer", example: 3 },
            impact: { type: "integer", example: 3 },
            category: { type: "string", example: "Hardware" },

            // Field Relasi
            opd_id: { type: "integer", example: 1 },
            reporter_id: { type: "integer", example: 50 },
            assigned_to: { type: "integer", example: 25 },
            service_catalog_id: { type: "integer" },
            service_item_id: { type: "integer" },

            // Field Waktu & SLA
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
            sla_due: { type: "string", format: "date-time" },
            sla_target_date: { type: "string", format: "date" },
            sla_target_time: { type: "string", example: "14:00:00" },
            sla_breached: { type: "boolean", example: false },
            resolved_at: { type: "string", format: "date-time" },
            closed_at: { type: "string", format: "date-time" },

            // Field Khusus Incident
            incident_location: { type: "string" },
            incident_date: { type: "string", format: "date-time" },

            // Field Khusus Request
            service_detail: { type: "object" },
            requested_date: { type: "string", format: "date-time" },

            // Field Pelapor Publik
            reporter_name: { type: "string", example: "Warga Peduli" },
            reporter_email: { type: "string", example: "warga@gmail.com" },
            reporter_phone: { type: "string", example: "0812..." },
            reporter_address: { type: "string" },
            reporter_nip: { type: "string" }, // Internal
            reporter_nik: { type: "string" }, // Publik (tergantung endpoint)
            asset_name_reported: { type: "string" },
            reporter_attachment_url: { type: "string" },
          },
        },
        // ------------------------------------------------------------
        Asset: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Printer" },
            asset_type: { type: "string", example: "Hardware" },
            qr_code: { type: "string", example: "AST-123" },
          },
        },
        OPD: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Dinas Kominfo" },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            error: { type: "string", example: "Pesan error" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            error: { type: "string", example: "Validasi gagal" },
            details: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string", example: "email" },
                  message: { type: "string", example: "Email tidak valid" },
                },
              },
            },
          },
        },
      },
    },
    // ===========================================
    // DEFINISI PATHS / ENDPOINTS
    // ===========================================
    paths: {
      // --- 0. Public ---
      "/public/opd": {
        get: {
          tags: ["0. Public"],
          summary: "(Publik) Mendapatkan daftar OPD",
          description:
            "Mengambil daftar OPD yang aktif untuk ditampilkan di form publik.",
          responses: {
            200: {
              description: "Daftar OPD",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/OPD" },
                      },
                    },
                  },
                },
              },
            },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/public/incidents": {
        post: {
          tags: ["0. Public"],
          summary: "Buat Insiden Baru (Publik / Pengguna Terdaftar)",
          description:
            "Buat tiket insiden baru TANPA login (untuk masyarakat) atau DENGAN login (role 'pengguna'). Wajib menyertakan data pelapor dan OPD.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/InputCreatePublicIncident",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Insiden berhasil dilaporkan",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example: "Insiden berhasil dilaporkan",
                      },
                      // Menggunakan ref Ticket yang sudah lengkap
                      ticket: { $ref: "#/components/schemas/Ticket" },
                    },
                  },
                },
              },
            },
            400: { description: "Data wajib tidak lengkap" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },

      // --- 1. Authentication ---
      "/auth/login": {
        post: {
          tags: ["1. Authentication"],
          summary: "Login Pengguna",
          description:
            "Login untuk semua role, mengembalikan JWT token dan data user.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputLogin" },
              },
            },
          },
          responses: {
            200: {
              description: "Login berhasil",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      token: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1NiIsIn...",
                      },
                      user: {
                        type: "object",
                        description: "Data user yang dikembalikan saat login",
                        properties: {
                          id: { type: "integer", example: 1 },
                          username: { type: "string", example: "admin.kota" },
                          full_name: { type: "string", example: "Admin Kota" },
                          email: {
                            type: "string",
                            example: "admin@pemkot.go.id",
                          },
                          nip: {
                            type: "string",
                            example: "199001012020011001",
                          },
                          phone: { type: "string", example: "08123456789" },
                          address: {
                            type: "string",
                            example: "Jl. Contoh No. 1",
                          },
                          role: { type: "string", example: "admin_kota" },
                          opd_id: { type: "integer", example: 1 },
                          permissions: {
                            type: "array",
                            items: { type: "string" },
                            example: ["tickets.*", "users.*"],
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: { description: "Username dan password harus diisi" },
            401: { description: "Username atau password salah" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      // ... (Auth endpoints lain sama)
      "/auth/register": {
        post: {
          tags: ["1. Authentication"],
          summary: "Registrasi Pengguna Publik",
          description:
            "Registrasi untuk pengguna (role hardcoded sebagai 'pengguna').",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputRegister" },
              },
            },
          },
          responses: {
            201: {
              description: "Registrasi berhasil",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example: "Registrasi publik berhasil",
                      },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            400: { description: "Username atau email sudah digunakan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/auth/logout": {
        post: {
          tags: ["1. Authentication"],
          summary: "Logout Pengguna",
          description:
            "Logout (hanya client-side, token tetap valid hingga expire).",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Logout berhasil",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string", example: "Logout berhasil" },
                    },
                  },
                },
              },
            },
            401: { description: "Token tidak ditemukan" },
          },
        },
      },
      "/auth/me": {
        get: {
          tags: ["1. Authentication"],
          summary: "Dapatkan Profil Pengguna Saat Ini",
          description:
            "Mengambil data profil user yang login, termasuk relasi OPD, bidang, seksi.",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Profil user",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Token tidak valid" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
        put: {
          tags: ["1. Authentication"],
          summary: "Update Profil Pengguna Saat Ini",
          description: "Update field seperti full_name, phone, address.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputUpdateProfile" },
              },
            },
          },
          responses: {
            200: {
              description: "Profil diperbarui",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example: "Profil berhasil diperbarui",
                      },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Token tidak valid" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/auth/forgot-password": {
        post: {
          tags: ["1. Authentication"],
          summary: "Lupa Password",
          description: "Kirim link reset password ke email (jika terdaftar).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputForgotPassword" },
              },
            },
          },
          responses: {
            200: {
              description: "Link reset password telah dikirim ke email Anda",
            },
            400: { description: "Email harus diisi" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },

      // --- 2. Incidents ---
      "/incidents": {
        post: {
          tags: ["2. Incidents"],
          summary: "Buat Insiden Baru (Internal)",
          description:
            "Buat tiket insiden baru (untuk 'pegawai_opd' atau 'admin' yang login).",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputCreateIncident" },
              },
            },
          },
          responses: {
            201: {
              description: "Incident berhasil dibuat",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example: "Incident berhasil dibuat",
                      },
                      ticket: { $ref: "#/components/schemas/Ticket" },
                    },
                  },
                },
              },
            },
            400: { description: "Data tidak lengkap" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
        get: {
          tags: ["2. Incidents"],
          summary: "Dapatkan Daftar Insiden",
          description:
            "Daftar insiden dengan filter dan pagination (role-based).",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "status", in: "query", schema: { type: "string" } },
            { name: "priority", in: "query", schema: { type: "string" } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "opd_id", in: "query", schema: { type: "integer" } },
            {
              name: "verification_status",
              in: "query",
              schema: { type: "string" },
            },
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 20 },
            },
          ],
          responses: {
            200: { description: "Daftar insiden" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Token tidak valid" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/incidents/{id}": {
        get: {
          tags: ["2. Incidents"],
          summary: "Dapatkan Detail Insiden",
          description:
            "Detail insiden beserta relasi (reporter, attachments, progress, comments, logs).",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Detail insiden" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Token tidak valid atau akses ditolak" },
            404: { description: "Incident tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
        put: {
          tags: ["2. Incidents"],
          summary: "Update Insiden (General)",
          description:
            "Update field general seperti title, description, category, status.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputUpdateIncident" },
              },
            },
          },
          responses: {
            200: { description: "Incident berhasil diperbarui" },
            400: { description: "Tidak ada data untuk diupdate" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/incidents/{id}/classify": {
        put: {
          tags: ["2. Incidents"],
          summary: "(Seksi) Klasifikasi Urgency & Impact Insiden",
          description:
            "Endpoint khusus untuk Seksi mengatur Urgency dan Impact.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputClassifyIncident" },
              },
            },
          },
          responses: {
            200: { description: "Insiden berhasil diklasifikasi" },
            400: { description: "Urgency dan impact harus diisi" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup (Hanya Seksi/Admin)" },
            404: { description: "Tiket tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/incidents/merge": {
        post: {
          tags: ["2. Incidents"],
          summary: "Merge Insiden",
          description: "Gabung beberapa insiden duplikat menjadi satu.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputMergeIncidents" },
              },
            },
          },
          responses: {
            200: { description: "Incidents berhasil di-merge" },
            400: { description: "Data tidak lengkap" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },

      // --- 3. Service Requests ---
      "/requests": {
        post: {
          tags: ["3. Service Requests"],
          summary: "Buat Service Request Baru",
          description:
            "Membuat tiket permintaan layanan baru dari katalog (untuk 'pegawai_opd' atau 'admin').",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputCreateRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "Service request berhasil dibuat",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example: "Service request berhasil dibuat",
                      },
                      ticket: { $ref: "#/components/schemas/Ticket" },
                    },
                  },
                },
              },
            },
            400: { description: "Data tidak lengkap" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            404: { description: "Service Item tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
        get: {
          tags: ["3. Service Requests"],
          summary: "Dapatkan Daftar Request",
          description:
            "Daftar service request dengan filter (mirip incidents).",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "status", in: "query", schema: { type: "string" } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "opd_id", in: "query", schema: { type: "integer" } },
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 20 },
            },
          ],
          responses: {
            200: { description: "Daftar request" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Token tidak valid" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/requests/{id}": {
        get: {
          tags: ["3. Service Requests"],
          summary: "Dapatkan Detail Request",
          description: "Detail request beserta approval, progress, dll.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Detail request" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Akses ditolak" },
            404: { description: "Service request tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
        put: {
          tags: ["3. Service Requests"],
          summary: "Update Service Request (General)",
          description: "Update status atau progress notes oleh teknisi.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "in_progress" },
                    progress_notes: {
                      type: "string",
                      example: "Sedang dikerjakan",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Service request berhasil diperbarui" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/requests/{id}/approve": {
        post: {
          tags: ["3. Service Requests"],
          summary: "Approve Service Request",
          description: "Menyetujui service request (untuk Bidang, Seksi, dll)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputRequestApproval" },
              },
            },
          },
          responses: {
            200: { description: "Service request berhasil disetujui" },
            401: { description: "Token tidak ditemukan" },
            404: { description: "Approval tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/requests/{id}/reject": {
        post: {
          tags: ["3. Service Requests"],
          summary: "Reject Service Request",
          description: "Menolak service request (untuk Bidang, Seksi, dll)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputRequestReject" },
              },
            },
          },
          responses: {
            200: { description: "Service request berhasil ditolak" },
            400: { description: "Alasan penolakan harus diisi" },
            401: { description: "Token tidak ditemukan" },
            404: { description: "Approval tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },

      // --- 4. Service Catalog ---
      "/catalog": {
        get: {
          tags: ["4. Service Catalog"],
          summary: "Dapatkan Daftar Katalog Layanan",
          description:
            "Daftar katalog dengan sub_layanan dan detail (struktur baru).",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "opd_id", in: "query", schema: { type: "integer" } },
            { name: "is_active", in: "query", schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Daftar katalog (dengan struktur mapping baru)",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      count: { type: "integer" },
                      catalogs: {
                        type: "array",
                        items: { $ref: "#/components/schemas/ServiceCatalog" },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Token tidak valid" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },

      // --- 5. Knowledge Base (KB) ---
      "/kb": {
        get: {
          tags: ["5. Knowledge Base (KB)"],
          summary: "Dapatkan Artikel KB",
          description:
            "Daftar artikel KB dengan filter, pagination, dan search.",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "category", in: "query", schema: { type: "string" } },
            {
              name: "status",
              in: "query",
              schema: { type: "string", default: "published" },
            },
            { name: "search", in: "query", schema: { type: "string" } },
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 20 },
            },
          ],
          responses: {
            200: { description: "Daftar artikel" },
            401: { description: "Token tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
        post: {
          tags: ["5. Knowledge Base (KB)"],
          summary: "Buat Artikel KB Baru",
          description: "Membuat artikel KB baru (status awal 'draft').",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputCreateKB" },
              },
            },
          },
          responses: {
            201: { description: "Artikel KB berhasil dibuat (draft)" },
            400: { description: "Title dan content harus diisi" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/kb/suggest": {
        get: {
          tags: ["5. Knowledge Base (KB)"],
          summary: "Dapatkan Saran Artikel KB",
          description:
            "Saran artikel saat user mengetik tiket baru (deflection).",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "query",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Saran artikel" },
            400: { description: "Query harus diisi" },
            401: { description: "Token tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/kb/{id}": {
        get: {
          tags: ["5. Knowledge Base (KB)"],
          summary: "Dapatkan Detail Artikel KB",
          description: "Membaca satu artikel KB. Akan menambah view_count.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Detail artikel" },
            401: { description: "Token tidak ditemukan" },
            404: { description: "Artikel tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
        put: {
          tags: ["5. Knowledge Base (KB)"],
          summary: "Update Artikel KB",
          description: "Update title, content, category, atau tags artikel.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputUpdateKB" },
              },
            },
          },
          responses: {
            200: { description: "Artikel KB berhasil diperbarui" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
        delete: {
          tags: ["5. Knowledge Base (KB)"],
          summary: "Hapus Artikel KB",
          description: "Hapus artikel KB.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Artikel KB berhasil dihapus" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },

      // --- 6. Assets & QR Code ---
      "/assets/qr/:qr_code": {
        get: {
          tags: ["6. Assets & QR Code"],
          summary: "Scan QR Code Aset",
          description:
            "Proses scan QR untuk pengguna atau teknisi (create ticket atau check-in).",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "qr_code",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "QR diproses" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Role tidak valid untuk scan QR" },
            404: { description: "Asset tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },

      // --- 7. Admin ---
      "/admin/users": {
        get: {
          tags: ["7. Admin"],
          summary: "Dapatkan Daftar User (Admin)",
          description:
            "Admin mendapatkan daftar user dengan filter dan pagination.",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "role", in: "query", schema: { type: "string" } },
            { name: "opd_id", in: "query", schema: { type: "integer" } },
            { name: "is_active", in: "query", schema: { type: "string" } },
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 20 },
            },
          ],
          responses: {
            200: { description: "Daftar user" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
        post: {
          tags: ["7. Admin"],
          summary: "Buat User Baru oleh Admin",
          description:
            "Admin buat user internal (pegawai) dengan role dan OPD spesifik.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputCreateAdminUser" },
              },
            },
          },
          responses: {
            201: { description: "Akun pegawai berhasil dibuat" },
            400: { description: "Role tidak valid atau data tidak lengkap" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/admin/users/{id}/role": {
        put: {
          tags: ["7. Admin"],
          summary: "Update Role User oleh Admin",
          description: "Update role, OPD, bidang, seksi, atau status aktif.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputUpdateUserRole" },
              },
            },
          },
          responses: {
            200: { description: "Role user berhasil diperbarui" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/admin/opd": {
        get: {
          tags: ["7. Admin"],
          summary: "Dapatkan Daftar OPD",
          description: "Daftar OPD dengan filter dan pagination.",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "is_active", in: "query", schema: { type: "string" } },
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 20 },
            },
          ],
          responses: {
            200: { description: "Daftar OPD" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/admin/opd/{id}/branding": {
        put: {
          tags: ["7. Admin"],
          summary: "Update Branding OPD",
          description: "Update logo dan warna branding OPD.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputUpdateOpdBranding" },
              },
            },
          },
          responses: {
            200: { description: "Branding OPD berhasil diperbarui" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/admin/opd/{id}/calendar": {
        get: {
          tags: ["7. Admin"],
          summary: "Dapatkan Kalender OPD",
          description: "Dapatkan working hours dan holidays OPD.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Kalender OPD" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
        put: {
          tags: ["7. Admin"],
          summary: "Update Kalender OPD",
          description: "Update working hours dan holidays OPD.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputUpdateOpdCalendar" },
              },
            },
          },
          responses: {
            200: { description: "Kalender OPD berhasil diperbarui" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/admin/technicians/{id}/skills": {
        put: {
          tags: ["7. Admin"],
          summary: "Update Skills Teknisi",
          description:
            "Update skills, expertise level, dan certifications teknisi.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/InputUpdateTechnicianSkills",
                },
              },
            },
          },
          responses: {
            200: { description: "Skills teknisi berhasil diperbarui" },
            400: { description: "Skills harus berupa array" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/admin/technicians/check-in": {
        post: {
          tags: ["7. Admin"],
          summary: "Check-In Teknisi",
          description: "Check-in teknisi ke aset dengan lokasi.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputTechnicianCheckIn" },
              },
            },
          },
          responses: {
            201: { description: "Check-in berhasil" },
            400: { description: "asset_id atau qr_code harus diisi" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },

      // --- 8. Attachments & Comments ---
      "/incidents/{id}/comments": {
        post: {
          tags: ["8. Attachments & Comments"],
          summary: "Tambah Komentar ke Insiden",
          description: "Tambah komentar atau internal note.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputComment" },
              },
            },
          },
          responses: {
            201: { description: "Komentar berhasil ditambahkan" },
            400: { description: "Konten komentar harus diisi" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/requests/{id}/comments": {
        post: {
          tags: ["8. Attachments & Comments"],
          summary: "Tambah Komentar ke Request",
          description: "Tambah komentar atau internal note ke request.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputComment" },
              },
            },
          },
          responses: {
            201: { description: "Komentar berhasil ditambahkan" },
            // Mirip incidents/comments
          },
        },
      },

      // --- 9. Progress Updates ---
      "/incidents/{id}/progress": {
        post: {
          tags: ["9. Progress Updates"],
          summary: "Tambah Progress Update ke Insiden",
          description: "Update progress oleh teknisi, update status tiket.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/InputProgressUpdateIncident",
                },
              },
            },
          },
          responses: {
            201: { description: "Progress update berhasil ditambahkan" },
            400: { description: "Update number dan status harus diisi" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/requests/{id}/progress": {
        post: {
          tags: ["9. Progress Updates"],
          summary: "Tambah Progress Update ke Request",
          description: "Update progress untuk service request.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/InputProgressUpdateRequest",
                },
              },
            },
          },
          responses: {
            201: { description: "Progress update berhasil ditambahkan" },
            // Mirip incidents/progress
          },
        },
      },

      // --- 10. Audit & Stats ---
      "/dashboard": {
        get: {
          tags: ["10. Audit & Stats"],
          summary: "Dapatkan Data Dashboard",
          description:
            "Statistik ringkas untuk dashboard berdasarkan role (total, by status, by priority).",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Data dashboard" },
            401: { description: "Token tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/reports/sla": {
        get: {
          tags: ["10. Audit & Stats"],
          summary: "Dapatkan Laporan SLA",
          description: "Laporan kepatuhan SLA dengan filter.",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "opd_id", in: "query", schema: { type: "integer" } },
            {
              name: "date_from",
              in: "query",
              schema: { type: "string", format: "date" },
            },
            {
              name: "date_to",
              in: "query",
              schema: { type: "string", format: "date" },
            },
          ],
          responses: {
            200: { description: "Laporan SLA" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/reports/performance": {
        get: {
          tags: ["10. Audit & Stats"],
          summary: "Dapatkan Laporan Kinerja Teknisi",
          description: "Laporan kinerja teknisi dengan filter.",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "technician_id", in: "query", schema: { type: "integer" } },
            {
              name: "date_from",
              in: "query",
              schema: { type: "string", format: "date" },
            },
            {
              name: "date_to",
              in: "query",
              schema: { type: "string", format: "date" },
            },
          ],
          responses: {
            200: { description: "Laporan kinerja" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/admin/audit-logs": {
        get: {
          tags: ["10. Audit & Stats"],
          summary: "Dapatkan Audit Logs",
          description: "Daftar log aktivitas dengan filter dan pagination.",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "user_id", in: "query", schema: { type: "integer" } },
            { name: "action", in: "query", schema: { type: "string" } },
            {
              name: "date_from",
              in: "query",
              schema: { type: "string", format: "date" },
            },
            {
              name: "date_to",
              in: "query",
              schema: { type: "string", format: "date" },
            },
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 100 },
            },
          ],
          responses: {
            200: { description: "Daftar audit logs" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/admin/stats": {
        get: {
          tags: ["10. Audit & Stats"],
          summary: "Dapatkan Statistik Sistem",
          description: "Statistik seperti total users, tickets, assets, dll.",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Statistik sistem" },
            401: { description: "Token tidak ditemukan" },
            403: { description: "Permission tidak cukup" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },

      // --- 11. Utilities ---
      "/notifications": {
        get: {
          tags: ["11. Utilities"],
          summary: "Dapatkan Notifikasi User",
          description: "Daftar notifikasi untuk user yang login.",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "is_read", in: "query", schema: { type: "string" } },
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 20 },
            },
          ],
          responses: {
            200: { description: "Daftar notifikasi" },
            401: { description: "Token tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/notifications/mark-read": {
        post: {
          tags: ["11. Utilities"],
          summary: "Tandai Notifikasi Sudah Dibaca",
          description: "Tandai satu atau lebih notifikasi sebagai 'read'.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputMarkRead" },
              },
            },
          },
          responses: {
            200: { description: "Notifikasi berhasil ditandai" },
            400: { description: "notification_ids harus berupa array" },
            401: { description: "Token tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/search": {
        get: {
          tags: ["11. Utilities"],
          summary: "Pencarian Global",
          description: "Cari di tiket dan KB.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "q",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "type",
              in: "query",
              schema: { type: "string", enum: ["tickets", "kb"] },
            },
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 20 },
            },
          ],
          responses: {
            200: { description: "Hasil pencarian" },
            400: { description: "Query pencarian harus diisi" },
            401: { description: "Token tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/survey": {
        post: {
          tags: ["11. Utilities"],
          summary: "Submit Survey Kepuasan",
          description: "User mengisi survey setelah tiket selesai.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputSurvey" },
              },
            },
          },
          responses: {
            201: { description: "Survey berhasil dikirim" },
            400: { description: "ticket_id dan rating harus diisi" },
            401: { description: "Token tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/chat/send": {
        post: {
          tags: ["11. Utilities"],
          summary: "Kirim Pesan Chat",
          description: "Kirim pesan ke helpdesk/bot.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputChat" },
              },
            },
          },
          responses: {
            201: { description: "Pesan berhasil dikirim" },
            400: { description: "Message harus diisi" },
            401: { description: "Token tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
      "/sync": {
        post: {
          tags: ["11. Utilities"],
          summary: "Sinkronisasi Offline Mobile",
          description:
            "Endpoint untuk mobile client mengirim data offline (tiket, progress).",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputSync" },
              },
            },
          },
          responses: {
            200: { description: "Sinkronisasi selesai" },
            401: { description: "Token tidak ditemukan" },
            500: { description: "Terjadi kesalahan server" },
          },
        },
      },
    }, // Akhir dari 'paths'
  }, // Akhir dari 'definition'

  // Karena definisi manual, apis kosong
  apis: [],
};
// ===========================================
// EKSPOR
// ===========================================
const swaggerDocs = swaggerJsDoc(swaggerOptions);

const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 30px 0; }
    .swagger-ui .info .title { color: #007bff; }
    .swagger-ui .opblock-tag { background-color: #f0f0f0; }
    .swagger-ui .btn.authorize { background-color: #007bff; border-color: #007bff; }
  `,
  customSiteTitle: "Service Desk API V2.0 - Docs",
};

module.exports = {
  swaggerDocs,
  swaggerUiOptions,
};
