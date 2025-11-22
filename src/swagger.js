/**
 * =================================================================
 * DOKUMENTASI SWAGGER UNTUK SERVICE DESK API V2.0 (COMPLETE & FIXED)
 * =================================================================
 * Dokumentasi lengkap yang sesuai 100% dengan app.js
 * =================================================================
 */

const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Siladan API - Service Desk System",
      version: "2.0.0",
      description:
        "Dokumentasi REST API Siladan App (SSO Enabled) - Complete & Accurate",
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
      { name: "0. Root", description: "Base endpoints" },
      {
        name: "1. Public Endpoints",
        description: "Endpoint publik (Tracking & Pelaporan)",
      },
      {
        name: "2. Authentication",
        description: "Login, SSO, Register, Profil",
      },
      { name: "3. Incidents", description: "Manajemen Insiden (Internal)" },
      {
        name: "4. Service Requests",
        description: "Manajemen Permintaan Layanan",
      },
      { name: "5. Service Catalog", description: "Katalog Layanan" },
      { name: "6. Knowledge Base", description: "Artikel & FAQ" },
      { name: "7. Dashboard", description: "Dashboard & Statistik" },
      { name: "8. Search", description: "Pencarian Global" },
      { name: "9. Sync", description: "Sinkronisasi Offline" },
      { name: "10. Admin - Users", description: "Manajemen User" },
      { name: "11. Admin - OPD", description: "Manajemen OPD" },
      { name: "12. Admin - Technicians", description: "Manajemen Teknisi" },
      { name: "13. Assets & QR", description: "Manajemen Aset & QR Code" },
      { name: "14. Comments", description: "Komentar Tiket" },
      { name: "15. Progress Updates", description: "Update Progress Tiket" },
      { name: "16. Audit Logs", description: "Log Aktivitas" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Masukkan token JWT yang didapat dari login",
        },
      },
      schemas: {
        // ============= AUTH SCHEMAS =============
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "admin.kota" },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["username", "password", "email", "full_name"],
          properties: {
            username: { type: "string", example: "user123" },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
            email: {
              type: "string",
              format: "email",
              example: "user@email.com",
            },
            full_name: { type: "string", example: "John Doe" },
            nip: {
              type: "string",
              example: "123456789",
              description: "NIK untuk publik",
            },
            phone: { type: "string", example: "081234567890" },
            address: { type: "string", example: "Jl. Example No. 123" },
          },
        },
        UpdateProfileRequest: {
          type: "object",
          properties: {
            full_name: { type: "string", example: "John Doe Updated" },
            phone: { type: "string", example: "081234567890" },
            address: { type: "string", example: "Jl. Example No. 123" },
          },
        },
        ForgotPasswordRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@email.com",
            },
          },
        },

        // ============= INCIDENT SCHEMAS =============
        CreateIncidentInternal: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: { type: "string", example: "Printer tidak bisa print" },
            description: {
              type: "string",
              example:
                "Printer HP LaserJet tidak merespon saat diperintah print",
            },
            category: { type: "string", example: "Hardware" },
            incident_location: { type: "string", example: "Ruang IT Lantai 2" },
            incident_date: {
              type: "string",
              format: "date-time",
              example: "2025-11-22T09:00:00Z",
            },
            opd_id: {
              type: "integer",
              example: 1,
              description: "Opsional, jika tidak diisi akan ambil dari token",
            },
            asset_identifier: { type: "string", example: "PRINTER-001" },
            attachment_url: {
              type: "string",
              example: "https://storage.example.com/photo.jpg",
            },
          },
        },
        CreateIncidentPublic: {
          type: "object",
          required: [
            "title",
            "description",
            "opd_id",
            "reporter_name",
            "reporter_email",
            "reporter_phone",
          ],
          properties: {
            title: { type: "string", example: "Lampu jalan mati" },
            description: {
              type: "string",
              example:
                "Lampu jalan di Jl. Pahlawan sudah mati sejak 3 hari yang lalu",
            },
            category: { type: "string", example: "Fasilitas Publik" },
            incident_location: {
              type: "string",
              example: "Jl. Pahlawan No. 45",
            },
            incident_date: {
              type: "string",
              format: "date-time",
              example: "2025-11-20T18:00:00Z",
            },
            opd_id: { type: "integer", example: 5 },
            asset_identifier: { type: "string", example: "LAMPU-JL-045" },
            reporter_name: { type: "string", example: "Budi Santoso" },
            reporter_email: {
              type: "string",
              format: "email",
              example: "budi@gmail.com",
            },
            reporter_phone: { type: "string", example: "081234567890" },
            reporter_address: { type: "string", example: "Jl. Mawar No. 10" },
            reporter_nik: { type: "string", example: "3578012345678901" },
            attachment_url: {
              type: "string",
              example: "https://storage.example.com/lampu-mati.jpg",
            },
          },
        },
        ClassifyIncidentRequest: {
          type: "object",
          required: ["urgency", "impact"],
          properties: {
            urgency: { type: "integer", minimum: 1, maximum: 5, example: 4 },
            impact: { type: "integer", minimum: 1, maximum: 5, example: 3 },
          },
        },
        UpdateIncidentRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
              example: "Printer masih tidak bisa print",
            },
            description: {
              type: "string",
              example: "Update: Sudah dicoba restart masih belum bisa",
            },
            category: { type: "string", example: "Hardware" },
            status: {
              type: "string",
              enum: ["open", "assigned", "in_progress", "resolved", "closed"],
              example: "in_progress",
            },
          },
        },
        MergeIncidentsRequest: {
          type: "object",
          required: ["source_ticket_ids", "target_ticket_id", "reason"],
          properties: {
            source_ticket_ids: {
              type: "array",
              items: { type: "integer" },
              example: [101, 102, 103],
            },
            target_ticket_id: { type: "integer", example: 100 },
            reason: {
              type: "string",
              example: "Semua laporan merujuk pada masalah server yang sama",
            },
          },
        },

        // ============= REQUEST SCHEMAS =============
        CreateRequestInternal: {
          type: "object",
          required: ["title", "description", "service_item_id"],
          properties: {
            title: {
              type: "string",
              example: "Permintaan pembuatan email baru",
            },
            description: {
              type: "string",
              example: "Dibutuhkan email untuk pegawai baru di Bagian Keuangan",
            },
            service_item_id: { type: "integer", example: 15 },
            service_detail: {
              type: "object",
              example: {
                nama_pegawai: "Ahmad Wahyudi",
                nip: "199001012020011001",
                bagian: "Keuangan",
              },
              description: "Data tambahan terkait request",
            },
            attachment_url: {
              type: "string",
              example: "https://storage.example.com/sk-pegawai.pdf",
            },
            requested_date: {
              type: "string",
              format: "date-time",
              example: "2025-11-25T08:00:00Z",
            },
          },
        },
        ApprovalRequest: {
          type: "object",
          properties: {
            notes: { type: "string", example: "Disetujui, silakan proses" },
          },
        },
        RejectRequest: {
          type: "object",
          required: ["notes"],
          properties: {
            notes: {
              type: "string",
              example: "Ditolak karena data tidak lengkap",
            },
          },
        },

        // ============= KB SCHEMAS =============
        CreateKBRequest: {
          type: "object",
          required: ["title", "content"],
          properties: {
            title: {
              type: "string",
              example: "Cara Reset Password Akun Email",
            },
            content: {
              type: "string",
              example:
                "Langkah 1: Buka halaman login...\nLangkah 2: Klik 'Lupa Password'...",
            },
            category: { type: "string", example: "Tutorial" },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["email", "password", "reset"],
            },
            opd_id: { type: "integer", example: 1 },
          },
        },
        UpdateKBRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
              example: "Cara Reset Password Akun Email (Updated)",
            },
            content: {
              type: "string",
              example: "Konten yang sudah diupdate...",
            },
            category: { type: "string", example: "Tutorial" },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["email", "password"],
            },
          },
        },

        // ============= ADMIN SCHEMAS =============
        CreateUserRequest: {
          type: "object",
          required: ["username", "password", "email", "full_name", "role"],
          properties: {
            username: { type: "string", example: "teknisi.opd1" },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
            email: {
              type: "string",
              format: "email",
              example: "teknisi@opd.go.id",
            },
            full_name: { type: "string", example: "Ahmad Teknisi" },
            nip: { type: "string", example: "199001012020011001" },
            phone: { type: "string", example: "081234567890" },
            address: { type: "string", example: "Jl. Example No. 123" },
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
              example: "teknisi",
            },
            opd_id: { type: "integer", example: 1 },
            bidang_id: { type: "integer", example: 1 },
            seksi_id: { type: "integer", example: 1 },
          },
        },
        UpdateUserRoleRequest: {
          type: "object",
          properties: {
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
            },
            opd_id: { type: "integer", example: 2 },
            bidang_id: { type: "integer", example: 2 },
            seksi_id: { type: "integer", example: 2 },
            is_active: { type: "boolean", example: true },
          },
        },
        UpdateOpdCalendarRequest: {
          type: "object",
          properties: {
            working_hours: {
              type: "object",
              example: {
                monday: "08:00-16:00",
                tuesday: "08:00-16:00",
                wednesday: "08:00-16:00",
                thursday: "08:00-16:00",
                friday: "08:00-15:30",
              },
            },
            holidays: {
              type: "array",
              items: { type: "string", format: "date" },
              example: ["2025-12-25", "2026-01-01"],
            },
          },
        },
        UpdateTechnicianSkillsRequest: {
          type: "object",
          required: ["skills"],
          properties: {
            skills: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Network Configuration" },
                  level: {
                    type: "string",
                    enum: ["beginner", "intermediate", "advanced", "expert"],
                    example: "advanced",
                  },
                  category: { type: "string", example: "Networking" },
                },
              },
            },
            expertise_level: {
              type: "string",
              enum: ["junior", "middle", "senior"],
              example: "senior",
            },
            certifications: {
              type: "array",
              items: { type: "string" },
              example: ["CCNA", "CompTIA Network+"],
            },
          },
        },

        // ============= COMMENT & PROGRESS SCHEMAS =============
        CreateCommentRequest: {
          type: "object",
          required: ["content"],
          properties: {
            content: {
              type: "string",
              example:
                "Sudah dilakukan pengecekan awal, printer dalam kondisi rusak",
            },
            is_internal: {
              type: "boolean",
              example: false,
              description: "true = internal note, false = public comment",
            },
          },
        },
        CreateProgressIncidentRequest: {
          type: "object",
          required: ["update_number", "status_change"],
          properties: {
            update_number: { type: "integer", example: 1 },
            status_change: { type: "string", example: "Ditangani" },
            reason: {
              type: "string",
              example: "Printer rusak karena komponen internal",
            },
            problem_detail: {
              type: "string",
              example: "Drum printer sudah habis masa pakai",
            },
            handling_description: {
              type: "string",
              example: "Mengganti drum printer dengan yang baru",
            },
            final_solution: {
              type: "string",
              example: "Printer sudah bisa digunakan kembali dengan normal",
            },
          },
        },
        CreateProgressRequestRequest: {
          type: "object",
          required: ["update_number", "status_change"],
          properties: {
            update_number: { type: "integer", example: 1 },
            status_change: { type: "string", example: "Dalam Proses" },
            notes: {
              type: "string",
              example: "Email sedang dibuat oleh tim IT",
            },
          },
        },

        // ============= RESPONSE MODELS =============
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operasi berhasil" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "Terjadi kesalahan" },
          },
        },
        PaginationResponse: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 20 },
            total: { type: "integer", example: 150 },
            total_pages: { type: "integer", example: 8 },
          },
        },
      },
    },
    paths: {
      // ============= 0. ROOT =============
      "/": {
        get: {
          tags: ["0. Root"],
          summary: "Root endpoint",
          responses: {
            200: {
              description: "Welcome message",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example:
                          "Welcome to Service Desk API v2.0 (SSO Enabled)",
                      },
                      version: { type: "string", example: "2.0.0" },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ============= 1. PUBLIC ENDPOINTS =============
      "/public/opd": {
        get: {
          tags: ["1. Public Endpoints"],
          summary: "Mendapatkan daftar OPD (publik)",
          description:
            "Endpoint publik untuk mendapatkan daftar OPD yang aktif",
          responses: {
            200: {
              description: "Berhasil",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "integer", example: 1 },
                            name: {
                              type: "string",
                              example: "Dinas Komunikasi dan Informatika",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/public/incidents": {
        post: {
          tags: ["1. Public Endpoints"],
          summary: "Buat insiden publik (tanpa login)",
          description:
            "Endpoint untuk masyarakat melaporkan insiden tanpa harus login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateIncidentPublic" },
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
                      ticket: { type: "object" },
                    },
                  },
                },
              },
            },
            400: { description: "Validasi gagal" },
            500: { description: "Server error" },
          },
        },
      },
      "/public/tickets/{ticket_number}": {
        get: {
          tags: ["1. Public Endpoints"],
          summary: "Tracking tiket publik (tanpa login)",
          description:
            "Cek status tiket menggunakan nomor tiket tanpa harus login",
          parameters: [
            {
              name: "ticket_number",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "INC-2025-0001",
            },
          ],
          responses: {
            200: {
              description: "Data tiket ditemukan",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          ticket_info: {
                            type: "object",
                            properties: {
                              ticket_number: {
                                type: "string",
                                example: "INC-2025-0001",
                              },
                              title: {
                                type: "string",
                                example: "Lampu jalan mati",
                              },
                              description: { type: "string" },
                              status: {
                                type: "string",
                                example: "in_progress",
                              },
                              category: {
                                type: "string",
                                example: "Fasilitas Publik",
                              },
                              opd_name: {
                                type: "string",
                                example: "Dinas Pekerjaan Umum",
                              },
                              location: {
                                type: "string",
                                example: "Jl. Pahlawan No. 45",
                              },
                              reporter_name: {
                                type: "string",
                                example: "Budi Santoso",
                              },
                              created_at: {
                                type: "string",
                                format: "date-time",
                              },
                              last_updated: {
                                type: "string",
                                format: "date-time",
                              },
                            },
                          },
                          timeline: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                update_time: {
                                  type: "string",
                                  format: "date-time",
                                },
                                status_change: {
                                  type: "string",
                                  example: "Open",
                                },
                                handling_description: { type: "string" },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: { description: "Tiket tidak ditemukan" },
            500: { description: "Server error" },
          },
        },
      },

      // ============= 2. AUTHENTICATION =============
      "/auth/login": {
        post: {
          tags: ["2. Authentication"],
          summary: "Login dengan username & password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
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
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                      },
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "integer", example: 1 },
                          username: { type: "string", example: "admin.kota" },
                          full_name: { type: "string", example: "Admin Kota" },
                          email: {
                            type: "string",
                            example: "admin@kota.go.id",
                          },
                          role: { type: "string", example: "admin_kota" },
                          permissions: {
                            type: "array",
                            items: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Username atau password salah" },
          },
        },
      },
      "/auth/sso": {
        get: {
          tags: ["2. Authentication"],
          summary: "Redirect ke SSO Provider",
          description: "Mendapatkan URL redirect untuk login SSO",
          parameters: [
            {
              name: "provider",
              in: "query",
              required: true,
              schema: { type: "string", enum: ["google", "github", "gitlab"] },
              example: "google",
            },
          ],
          responses: {
            200: {
              description: "URL redirect SSO",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      redirect_url: {
                        type: "string",
                        example:
                          "https://accounts.google.com/o/oauth2/v2/auth?...",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/auth/callback": {
        get: {
          tags: ["2. Authentication"],
          summary: "SSO Callback (dipanggil oleh provider)",
          description:
            "Endpoint callback yang dipanggil oleh SSO provider setelah login berhasil",
          parameters: [
            {
              name: "code",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            302: { description: "Redirect ke frontend dengan token" },
            500: { description: "Login gagal" },
          },
        },
      },
      "/auth/register": {
        post: {
          tags: ["2. Authentication"],
          summary: "Registrasi pengguna publik",
          description:
            "Endpoint untuk registrasi pengguna baru dengan role 'pengguna'",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
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
                      user: { type: "object" },
                    },
                  },
                },
              },
            },
            400: { description: "Username atau email sudah digunakan" },
          },
        },
      },
      "/auth/logout": {
        post: {
          tags: ["2. Authentication"],
          summary: "Logout",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Logout berhasil",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessResponse" },
                },
              },
            },
          },
        },
      },
      "/auth/me": {
        get: {
          tags: ["2. Authentication"],
          summary: "Get profil user yang sedang login",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Data profil user",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      user: { type: "object" },
                    },
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ["2. Authentication"],
          summary: "Update profil user",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateProfileRequest" },
              },
            },
          },
          responses: {
            200: { description: "Profil berhasil diperbarui" },
          },
        },
      },
      "/auth/forgot-password": {
        post: {
          tags: ["2. Authentication"],
          summary: "Lupa password",
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ForgotPasswordRequest" },
              },
            },
          },
          responses: {
            200: { description: "Link reset password telah dikirim" },
          },
        },
      },

      // ============= 3. INCIDENTS =============
      "/incidents": {
        post: {
          tags: ["3. Incidents"],
          summary: "Buat insiden baru (internal)",
          description:
            "Untuk pegawai yang sudah login. Reporter diambil dari token.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateIncidentInternal" },
              },
            },
          },
          responses: {
            201: { description: "Incident berhasil dibuat" },
            400: { description: "Data tidak lengkap" },
            500: { description: "Server error" },
          },
        },
        get: {
          tags: ["3. Incidents"],
          summary: "List insiden (dengan filter & pagination)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "status",
              in: "query",
              schema: { type: "string" },
              description: "Filter by status",
            },
            {
              name: "priority",
              in: "query",
              schema: { type: "string" },
              description: "Filter by priority",
            },
            {
              name: "search",
              in: "query",
              schema: { type: "string" },
              description: "Search by title/ticket number",
            },
            {
              name: "opd_id",
              in: "query",
              schema: { type: "integer" },
              description: "Filter by OPD",
            },
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
            200: {
              description: "List insiden",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { type: "array", items: { type: "object" } },
                      pagination: {
                        $ref: "#/components/schemas/PaginationResponse",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/incidents/{id}": {
        get: {
          tags: ["3. Incidents"],
          summary: "Detail insiden",
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
            200: {
              description:
                "Detail insiden dengan attachments, progress, comments, dan logs",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      ticket: { type: "object" },
                      attachments: { type: "array", items: { type: "object" } },
                      progress_updates: {
                        type: "array",
                        items: { type: "object" },
                      },
                      comments: { type: "array", items: { type: "object" } },
                      logs: { type: "array", items: { type: "object" } },
                    },
                  },
                },
              },
            },
            404: { description: "Incident tidak ditemukan" },
          },
        },
        put: {
          tags: ["3. Incidents"],
          summary: "Update insiden",
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
                schema: { $ref: "#/components/schemas/UpdateIncidentRequest" },
              },
            },
          },
          responses: {
            200: { description: "Incident berhasil diperbarui" },
          },
        },
      },
      "/incidents/{id}/classify": {
        put: {
          tags: ["3. Incidents"],
          summary: "Klasifikasi insiden (Urgency & Impact)",
          description:
            "Untuk role 'seksi' - mengklasifikasi urgency dan impact, sistem akan menghitung prioritas dan SLA",
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
                  $ref: "#/components/schemas/ClassifyIncidentRequest",
                },
              },
            },
          },
          responses: {
            200: {
              description:
                "Insiden berhasil diklasifikasi dan prioritas diperbarui",
            },
          },
        },
      },
      "/incidents/merge": {
        post: {
          tags: ["3. Incidents"],
          summary: "Merge beberapa insiden menjadi satu",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MergeIncidentsRequest" },
              },
            },
          },
          responses: {
            200: { description: "Incidents berhasil di-merge" },
          },
        },
      },

      // ============= 4. SERVICE REQUESTS =============
      "/catalog": {
        get: {
          tags: ["5. Service Catalog"],
          summary: "List katalog layanan",
          description:
            "Mendapatkan katalog dengan struktur: Catalog → Sub Layanan → Service Items",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "opd_id", in: "query", schema: { type: "integer" } },
            {
              name: "is_active",
              in: "query",
              schema: { type: "string", enum: ["true", "false"] },
            },
          ],
          responses: {
            200: {
              description: "List katalog dengan sub layanan",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      count: { type: "integer", example: 5 },
                      catalogs: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "integer" },
                            catalog_name: {
                              type: "string",
                              example: "Layanan IT",
                            },
                            total_items: { type: "integer", example: 10 },
                            sub_layanan: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  id: { type: "integer" },
                                  sub_catalog_name: {
                                    type: "string",
                                    example: "Layanan Email",
                                  },
                                  description: { type: "string" },
                                  approval_required: { type: "boolean" },
                                  service_items: {
                                    type: "array",
                                    items: {
                                      type: "object",
                                      properties: {
                                        id: { type: "integer" },
                                        item_name: {
                                          type: "string",
                                          example: "Buat Akun Email Baru",
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/requests": {
        post: {
          tags: ["4. Service Requests"],
          summary: "Buat service request (internal)",
          description:
            "OPD ID diambil dari token, Catalog ID diambil dari Service Item ID",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateRequestInternal" },
              },
            },
          },
          responses: {
            201: { description: "Service request berhasil dibuat" },
            400: { description: "Data tidak lengkap" },
          },
        },
        get: {
          tags: ["4. Service Requests"],
          summary: "List service requests",
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
            200: { description: "List service requests" },
          },
        },
      },
      "/requests/{id}": {
        get: {
          tags: ["4. Service Requests"],
          summary: "Detail service request",
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
            200: {
              description: "Detail request dengan approvals dan progress",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      ticket: { type: "object" },
                      approvals: { type: "array", items: { type: "object" } },
                      progress_updates: {
                        type: "array",
                        items: { type: "object" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ["4. Service Requests"],
          summary: "Update service request",
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
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    progress_notes: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Service request berhasil diperbarui" },
          },
        },
      },
      "/requests/{id}/approve": {
        post: {
          tags: ["4. Service Requests"],
          summary: "Approve service request",
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
                schema: { $ref: "#/components/schemas/ApprovalRequest" },
              },
            },
          },
          responses: {
            200: { description: "Service request berhasil disetujui" },
          },
        },
      },
      "/requests/{id}/reject": {
        post: {
          tags: ["4. Service Requests"],
          summary: "Reject service request",
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
                schema: { $ref: "#/components/schemas/RejectRequest" },
              },
            },
          },
          responses: {
            200: { description: "Service request berhasil ditolak" },
          },
        },
      },

      // ============= 6. KNOWLEDGE BASE =============
      "/kb": {
        get: {
          tags: ["6. Knowledge Base"],
          summary: "List artikel KB",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "status", in: "query", schema: { type: "string" } },
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
            200: { description: "List artikel KB" },
          },
        },
        post: {
          tags: ["6. Knowledge Base"],
          summary: "Buat artikel KB baru",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateKBRequest" },
              },
            },
          },
          responses: {
            201: { description: "Artikel KB berhasil dibuat (draft)" },
          },
        },
      },
      "/kb/suggest": {
        get: {
          tags: ["6. Knowledge Base"],
          summary: "Suggest artikel KB",
          description: "Mendapatkan saran artikel berdasarkan query",
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
            200: { description: "Saran artikel KB" },
          },
        },
      },
      "/kb/{id}": {
        get: {
          tags: ["6. Knowledge Base"],
          summary: "Detail artikel KB",
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
            200: { description: "Detail artikel (view count akan bertambah)" },
            404: { description: "Artikel tidak ditemukan" },
          },
        },
        put: {
          tags: ["6. Knowledge Base"],
          summary: "Update artikel KB",
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
                schema: { $ref: "#/components/schemas/UpdateKBRequest" },
              },
            },
          },
          responses: {
            200: { description: "Artikel KB berhasil diperbarui" },
          },
        },
        delete: {
          tags: ["6. Knowledge Base"],
          summary: "Hapus artikel KB",
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
          },
        },
      },

      // ============= 7. DASHBOARD =============
      "/dashboard": {
        get: {
          tags: ["7. Dashboard"],
          summary: "Dashboard statistics",
          description: "Statistik tiket berdasarkan role user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Dashboard data",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      dashboard: {
                        type: "object",
                        properties: {
                          total_tickets: { type: "integer", example: 150 },
                          by_status: {
                            type: "object",
                            properties: {
                              open: { type: "integer", example: 25 },
                              assigned: { type: "integer", example: 30 },
                              in_progress: { type: "integer", example: 40 },
                              resolved: { type: "integer", example: 35 },
                              closed: { type: "integer", example: 20 },
                            },
                          },
                          by_priority: {
                            type: "object",
                            properties: {
                              low: { type: "integer", example: 30 },
                              medium: { type: "integer", example: 60 },
                              high: { type: "integer", example: 40 },
                              major: { type: "integer", example: 20 },
                            },
                          },
                          role: { type: "string", example: "admin_kota" },
                          scope: { type: "string", example: "All OPD" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ============= 8. SEARCH =============
      "/search": {
        get: {
          tags: ["8. Search"],
          summary: "Pencarian global",
          description: "Cari di tickets dan knowledge base",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "q",
              in: "query",
              required: true,
              schema: { type: "string" },
              description: "Query pencarian",
            },
            {
              name: "type",
              in: "query",
              schema: { type: "string", enum: ["tickets", "kb"] },
              description: "Tipe pencarian",
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
            200: {
              description: "Hasil pencarian",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      query: { type: "string" },
                      results: {
                        type: "object",
                        properties: {
                          tickets: {
                            type: "object",
                            properties: {
                              data: {
                                type: "array",
                                items: { type: "object" },
                              },
                              count: { type: "integer" },
                            },
                          },
                          kb: {
                            type: "object",
                            properties: {
                              data: {
                                type: "array",
                                items: { type: "object" },
                              },
                              count: { type: "integer" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ============= 9. SYNC =============
      "/sync": {
        post: {
          tags: ["9. Sync"],
          summary: "Sinkronisasi data offline",
          description: "Untuk mobile app yang bekerja offline",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tickets: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          local_id: { type: "string" },
                          type: { type: "string" },
                          title: { type: "string" },
                          description: { type: "string" },
                        },
                      },
                    },
                    progress_updates: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          local_id: { type: "string" },
                          ticket_id: { type: "integer" },
                          update_number: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Sinkronisasi selesai",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                      results: {
                        type: "object",
                        properties: {
                          tickets: { type: "array", items: { type: "object" } },
                          progress_updates: {
                            type: "array",
                            items: { type: "object" },
                          },
                          errors: { type: "array", items: { type: "object" } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ============= 10. ADMIN - USERS =============
      "/admin/users": {
        get: {
          tags: ["10. Admin - Users"],
          summary: "List users",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "role", in: "query", schema: { type: "string" } },
            { name: "opd_id", in: "query", schema: { type: "integer" } },
            {
              name: "is_active",
              in: "query",
              schema: { type: "string", enum: ["true", "false"] },
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
            200: { description: "List users" },
          },
        },
        post: {
          tags: ["10. Admin - Users"],
          summary: "Buat user baru (untuk admin)",
          description: "Hanya admin yang bisa membuat user pegawai",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateUserRequest" },
              },
            },
          },
          responses: {
            201: { description: "Akun pegawai berhasil dibuat" },
            400: { description: "Username atau email sudah digunakan" },
          },
        },
      },
      "/admin/users/{id}/role": {
        put: {
          tags: ["10. Admin - Users"],
          summary: "Update role user",
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
                schema: { $ref: "#/components/schemas/UpdateUserRoleRequest" },
              },
            },
          },
          responses: {
            200: { description: "Role user berhasil diperbarui" },
          },
        },
      },

      // ============= 11. ADMIN - OPD =============
      "/admin/opd": {
        get: {
          tags: ["11. Admin - OPD"],
          summary: "List OPD",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "is_active",
              in: "query",
              schema: { type: "string", enum: ["true", "false"] },
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
            200: { description: "List OPD" },
          },
        },
      },
      "/admin/opd/{id}/calendar": {
        put: {
          tags: ["11. Admin - OPD"],
          summary: "Update kalender OPD",
          description: "Update jam kerja dan hari libur OPD",
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
                schema: {
                  $ref: "#/components/schemas/UpdateOpdCalendarRequest",
                },
              },
            },
          },
          responses: {
            200: { description: "Kalender OPD berhasil diperbarui" },
          },
        },
      },

      // ============= 12. ADMIN - TECHNICIANS =============
      "/admin/technicians/{id}/skills": {
        put: {
          tags: ["12. Admin - Technicians"],
          summary: "Update skills teknisi",
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
                  $ref: "#/components/schemas/UpdateTechnicianSkillsRequest",
                },
              },
            },
          },
          responses: {
            200: { description: "Skills teknisi berhasil diperbarui" },
          },
        },
      },

      // ============= 13. ASSETS & QR =============
      "/assets/qr/{qr_code}": {
        get: {
          tags: ["13. Assets & QR"],
          summary: "Scan QR Code asset",
          description: "Untuk pengguna: info asset. Untuk teknisi: check-in",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "qr_code",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "QR-ASSET-001",
            },
          ],
          responses: {
            200: {
              description: "Info asset",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      action: {
                        type: "string",
                        enum: ["create_ticket", "technician_check_in"],
                      },
                      message: { type: "string" },
                      asset: { type: "object" },
                    },
                  },
                },
              },
            },
            404: { description: "Asset tidak ditemukan" },
          },
        },
      },

      // ============= 14. COMMENTS =============
      "/incidents/{id}/comments": {
        post: {
          tags: ["14. Comments"],
          summary: "Tambah komentar pada insiden",
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
                schema: { $ref: "#/components/schemas/CreateCommentRequest" },
              },
            },
          },
          responses: {
            201: { description: "Komentar berhasil ditambahkan" },
          },
        },
      },
      "/requests/{id}/comments": {
        post: {
          tags: ["14. Comments"],
          summary: "Tambah komentar pada request",
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
                schema: { $ref: "#/components/schemas/CreateCommentRequest" },
              },
            },
          },
          responses: {
            201: { description: "Komentar berhasil ditambahkan" },
          },
        },
      },

      // ============= 15. PROGRESS UPDATES =============
      "/incidents/{id}/progress": {
        post: {
          tags: ["15. Progress Updates"],
          summary: "Tambah progress update untuk insiden",
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
                  $ref: "#/components/schemas/CreateProgressIncidentRequest",
                },
              },
            },
          },
          responses: {
            201: { description: "Progress update berhasil ditambahkan" },
          },
        },
      },
      "/requests/{id}/progress": {
        post: {
          tags: ["15. Progress Updates"],
          summary: "Tambah progress update untuk request",
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
                  $ref: "#/components/schemas/CreateProgressRequestRequest",
                },
              },
            },
          },
          responses: {
            201: { description: "Progress update berhasil ditambahkan" },
          },
        },
      },

      // ============= 16. AUDIT LOGS =============
      "/admin/audit-logs": {
        get: {
          tags: ["16. Audit Logs"],
          summary: "List audit logs",
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
            200: { description: "List audit logs" },
          },
        },
      },
    },
  },
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
    .swagger-ui .info .title { color: #007bff; font-weight: bold; }
    .swagger-ui .opblock-tag { 
      background-color: #f8f9fa; 
      border-left: 4px solid #007bff;
      font-weight: 600;
    }
    .swagger-ui .btn.authorize { 
      background-color: #007bff; 
      border-color: #007bff; 
    }
    .swagger-ui .btn.authorize svg { fill: #fff; }
    .swagger-ui .opblock.opblock-post { border-color: #49cc90; background: rgba(73, 204, 144, 0.1); }
    .swagger-ui .opblock.opblock-get { border-color: #61affe; background: rgba(97, 175, 254, 0.1); }
    .swagger-ui .opblock.opblock-put { border-color: #fca130; background: rgba(252, 161, 48, 0.1); }
    .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; background: rgba(249, 62, 62, 0.1); }
  `,
  customSiteTitle: "Siladan API Documentation v2.0",
  customfavIcon: "https://www.svgrepo.com/show/354202/postman-icon.svg",
};

module.exports = {
  swaggerDocs,
  swaggerUiOptions,
};
