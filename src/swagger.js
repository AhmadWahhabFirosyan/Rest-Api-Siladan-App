const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "SILADAN APP API",
    version: "2.0.0",
    description:
      "Dokumentasi API lengkap untuk sistem Service Desk versi 2.0. API ini mengelola insiden, permintaan layanan, basis pengetahuan, survei, dan pengguna. Semua response dibungkus dalam format standar JSON.",
    contact: {
      name: "Contact Developer Ganteng",
      url: "http://wa.me/+6281357571468",
    },
  },
  servers: [
    {
      url: "https://manpro-473802.et.r.appspot.com/api/v1",
      description: "Production Server",
    },
    {
      url: "https://siladan-app.onrender.com/api/v1",
      description: "Secondary Production Server",
    },
    {
      url: "http://localhost:8080/api/v1",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT yang didapat dari endpoint /auth/login",
      },
    },
    // ==========================================
    // SCHEMAS (DATA MODELS)
    // ==========================================
    schemas: {
      // --- WRAPPERS ---
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation successful" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Deskripsi error yang terjadi" },
        },
      },
      PaginationInfo: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 20 },
          total: { type: "integer", example: 150 },
          total_pages: { type: "integer", example: 8 },
        },
      },

      // --- AUTH & USER ---
      LoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string", example: "admin_kota" },
          password: {
            type: "string",
            example: "password123",
            format: "password",
          },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["username", "password", "email", "full_name"],
        properties: {
          username: { type: "string", example: "warga01" },
          password: {
            type: "string",
            example: "rahasia123",
            format: "password",
          },
          email: {
            type: "string",
            format: "email",
            example: "warga@email.com",
          },
          full_name: { type: "string", example: "Warga Teladan" },
          nip: {
            type: "string",
            example: "3201123456780001",
            description: "NIK untuk publik, NIP untuk pegawai",
          },
          phone: { type: "string", example: "08123456789" },
          address: { type: "string", example: "Jl. Sudirman No. 10" },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          id: { type: "integer" },
          username: { type: "string" },
          email: { type: "string" },
          full_name: { type: "string" },
          nip: { type: "string" },
          phone: { type: "string" },
          address: { type: "string" },
          role: {
            type: "string",
            enum: [
              "super_admin",
              "admin_kota",
              "admin_opd",
              "bidang",
              "seksi",
              "helpdesk",
              "teknisi",
              "pegawai_opd",
              "pengguna",
            ],
          },
          opd: {
            type: "object",
            nullable: true,
            properties: { id: { type: "integer" }, name: { type: "string" } },
          },
          bidang: {
            type: "object",
            nullable: true,
            properties: { id: { type: "integer" }, name: { type: "string" } },
          },
          seksi: {
            type: "object",
            nullable: true,
            properties: { id: { type: "integer" }, name: { type: "string" } },
          },
          is_active: { type: "boolean" },
          last_login_at: { type: "string", format: "date-time" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          token: { type: "string" },
          user: {
            type: "object",
            properties: {
              id: { type: "integer" },
              username: { type: "string" },
              full_name: { type: "string" },
              email: { type: "string" },
              nip: { type: "string" },
              phone: { type: "string" },
              address: { type: "string" },
              role: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                },
              },
              opd_id: { type: "integer" },
              permissions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    action: { type: "string" },
                    subject: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },

      // --- INCIDENTS & REQUESTS (TICKETS) ---
      IncidentCreateAuth: {
        type: "object",
        required: ["title", "description"],
        properties: {
          title: { type: "string", example: "Koneksi Internet Putus" },
          description: {
            type: "string",
            example: "Wifi di lantai 3 tidak bisa connect sejak pagi.",
          },
          category: { type: "string", example: "Jaringan", default: "Umum" },
          incident_location: {
            type: "string",
            example: "Gedung B, Ruang Rapat",
          },
          incident_date: {
            type: "string",
            format: "date",
            example: "2023-10-27",
          },
          opd_id: {
            type: "integer",
            description:
              "Isi jika melapor untuk OPD lain. Jika kosong, akan menggunakan OPD pelapor.",
          },
          asset_identifier: { type: "string", example: "RT-001" },
          attachment_url: {
            type: "string",
            example: "https://storage.com/img.jpg",
          },
        },
      },
      IncidentCreatePublic: {
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
          title: { type: "string", example: "Lampu Taman Mati" },
          description: {
            type: "string",
            example: "Lampu taman kota mati total.",
          },
          category: { type: "string", default: "Umum" },
          incident_location: {
            type: "string",
            example: "Taman Kota Sisi Utara",
          },
          incident_date: {
            type: "string",
            format: "date",
            example: "2023-10-27",
          },
          opd_id: { type: "integer", example: 5 },
          asset_identifier: { type: "string" },
          reporter_name: { type: "string", example: "Budi Santoso" },
          reporter_email: {
            type: "string",
            format: "email",
            example: "budi@gmail.com",
          },
          reporter_phone: { type: "string", example: "08123456789" },
          reporter_address: { type: "string" },
          reporter_nik: { type: "string", example: "3271000000000001" },
          attachment_url: { type: "string" },
        },
      },
      RequestCreate: {
        type: "object",
        required: ["title", "description", "service_item_id"],
        properties: {
          title: { type: "string", example: "Permintaan Email Dinas" },
          description: {
            type: "string",
            example: "Mohon dibuatkan email untuk pegawai baru.",
          },
          service_item_id: {
            type: "integer",
            example: 1,
          },
          service_detail: {
            type: "object",
            example: { username_request: "budi.s", unit: "Keuangan" },
            description: "JSON object dinamis sesuai form layanan",
          },
          attachment_url: { type: "string" },
          requested_date: { type: "string", format: "date" },
        },
      },
      TicketDetailResponse: {
        type: "object",
        properties: {
          id: { type: "integer" },
          ticket_number: { type: "string", example: "INC-2023-1234" },
          type: { type: "string", enum: ["incident", "request"] },
          title: { type: "string" },
          description: { type: "string" },
          urgency: { type: "integer" },
          impact: { type: "integer" },
          priority_score: { type: "integer" },
          priority: {
            type: "string",
            enum: ["low", "medium", "high", "major"],
          },
          category: { type: "string" },
          status: {
            type: "string",
            enum: [
              "open",
              "verified",
              "assigned",
              "in_progress",
              "resolved",
              "closed",
              "pending_approval",
              "rejected",
              "merged",
            ],
          },
          stage: {
            type: "string",
            description: "Stage internal tiket (triase, verification, execution, etc.)",
            example: "triase",
          },
          verification_status: {
            type: "string",
            enum: ["pending", "verified", "rejected"],
          },
          incident_location: { type: "string" },
          incident_date: { type: "string", format: "date" },
          reporter_nip: { type: "string" },
          asset_name_reported: { type: "string" },
          reporter_attachment_url: { type: "string" },
          resolution: { type: "string" },
          resolved_at: { type: "string", format: "date-time" },
          closed_at: { type: "string", format: "date-time" },
          sla_due: { type: "string", format: "date-time" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          merged_to: { 
            type: "integer", 
            nullable: true, 
            description: "ID tiket target jika tiket ini digabung" 
          },
          merge_reason: { 
            type: "string", 
            nullable: true, 
            description: "Alasan penggabungan tiket" 
          },
          // Relations
          reporter: { $ref: "#/components/schemas/UserResponse" },
          recorder: { $ref: "#/components/schemas/UserResponse" },
          verifier: { $ref: "#/components/schemas/UserResponse" },
          technician: { $ref: "#/components/schemas/UserResponse" },
          opd: { $ref: "#/components/schemas/OPDResponse" },
          bidang: { $ref: "#/components/schemas/BidangResponse" },
          seksi: { $ref: "#/components/schemas/SeksiResponse" },
          service_catalog: { $ref: "#/components/schemas/ServiceCatalogItem" },
          service_item: { $ref: "#/components/schemas/ServiceItem" },
          // Related data arrays
          attachments: { type: "array", items: { type: "object" } },
          progress_updates: {
            type: "array",
            items: { $ref: "#/components/schemas/ProgressUpdate" },
          },
          comments: {
            type: "array",
            items: { $ref: "#/components/schemas/TicketComment" },
          },
          logs: {
            type: "array",
            items: { $ref: "#/components/schemas/TicketLog" },
          },
          approvals: {
            type: "array",
            items: { $ref: "#/components/schemas/ApprovalWorkflow" },
          },
        },
      },
      TicketListResponse: {
        type: "object",
        properties: {
          id: { type: "integer" },
          ticket_number: { type: "string", example: "INC-2023-1234" },
          title: { type: "string" },
          type: { type: "string", enum: ["incident", "request"] },
          status: {
            type: "string",
            enum: [
              "open",
              "verified",
              "assigned",
              "in_progress",
              "resolved",
              "closed",
              "pending_approval",
              "rejected",
              "merged",
            ],
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high", "major"],
          },
          category: { type: "string" },
          sla_due: { type: "string", format: "date-time" },
          created_at: { type: "string", format: "date-time" },
          // Simplified relations for list view
          reporter: {
            type: "object",
            properties: {
              id: { type: "integer" },
              full_name: { type: "string" },
            },
          },
          technician: {
            type: "object",
            properties: {
              id: { type: "integer" },
              full_name: { type: "string" },
            },
          },
          opd: {
            type: "object",
            properties: { id: { type: "integer" }, name: { type: "string" } },
          },
        },
      },
      ProgressUpdate: {
        type: "object",
        properties: {
          id: { type: "integer" },
          update_number: { type: "integer" },
          status_change: { type: "string" },
          reason: { type: "string" },
          problem_detail: { type: "string" },
          handling_description: { type: "string" },
          final_solution: { type: "string" },
          updated_by_user: { $ref: "#/components/schemas/UserResponse" },
          update_time: { type: "string", format: "date-time" },
        },
      },
      TicketComment: {
        type: "object",
        properties: {
          id: { type: "integer" },
          content: { type: "string" },
          is_internal: { type: "boolean" },
          user: { $ref: "#/components/schemas/UserResponse" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      TicketLog: {
        type: "object",
        properties: {
          id: { type: "integer" },
          ticket_id: { type: "integer" },
          user_id: { type: "integer" },
          action: { type: "string" },
          description: { type: "string" },
          user: {
            type: "object",
            properties: {
              username: { type: "string" },
              full_name: { type: "string" },
            },
          },
          created_at: { type: "string", format: "date-time" },
        },
      },
      ApprovalWorkflow: {
        type: "object",
        properties: {
          id: { type: "integer" },
          ticket_id: { type: "integer" },
          workflow_level: { type: "integer" },
          approver_role: { type: "string" },
          status: { type: "string", enum: ["pending", "approved", "rejected"] },
          approver_id: { type: "integer" },
          notes: { type: "string" },
          responded_at: { type: "string", format: "date-time" },
        },
      },

      // --- ACTIONS (PROGRESS, COMMENT) ---
      ProgressUpdateInput: {
        type: "object",
        required: ["update_number", "status_change"],
        properties: {
          update_number: { type: "integer", example: 1 },
          status_change: {
            type: "string",
            example: "Sedang ditangani",
            description:
              "Label status yang akan muncul di riwayat (misal: 'Sedang ditangani', 'Selesai')",
          },
          stage_change: {
            type: "string",
            example: "execution",
            description: "Perubahan stage internal tiket",
          },
          reason: { type: "string", example: "Sedang dikerjakan teknisi" },
          problem_detail: { type: "string" },
          handling_description: {
            type: "string",
            example: "Melakukan restart router",
          },
          final_solution: {
            type: "string",
            description:
              "Wajib diisi jika status akhir adalah 'Selesai' atau 'Ditutup'",
          },
        },
      },
      CommentInput: {
        type: "object",
        required: ["content"],
        properties: {
          content: {
            type: "string",
            example: "Mohon update estimasi waktunya.",
          },
          is_internal: {
            type: "boolean",
            default: false,
            description:
              "Jika true, hanya terlihat oleh staff (role selain pengguna)",
          },
        },
      },

      // --- KNOWLEDGE BASE (UPDATED) ---
      KBArticleV2: {
        type: "object",
        properties: {
          id_kb: { type: "integer" },
          judul_kb: { type: "string" },
          kategori_kb: { type: "string" },
          deskripsi_kb: { type: "string" },
          is_active: { type: "integer" }, // 1 for active, 0 for inactive
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          created_by: { type: "integer" },
          updated_by: { type: "integer" },
        },
      },
      KBArticleV2Input: {
        type: "object",
        required: ["judul_kb", "deskripsi_kb"],
        properties: {
          judul_kb: { type: "string", example: "Cara Mengatasi Printer Error" },
          kategori_kb: { type: "string", example: "Hardware" },
          deskripsi_kb: {
            type: "string",
            example: "<p>Langkah 1: Cek kabel...</p>",
          },
          is_active: { type: "integer" },
        },
      },

      // --- SURVEYS (NEW) ---
      TicketSurvey: {
        type: "object",
        properties: {
          id_surveys: { type: "integer" },
          ticket_id: { type: "integer" },
          rating: { type: "integer" },
          feedback: { type: "string" },
          category: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          created_by: { type: "integer" },
          ticket: { $ref: "#/components/schemas/TicketListResponse" }
        },
      },
      TicketSurveyInput: {
        type: "object",
        required: ["ticket_id", "rating"],
        properties: {
          ticket_id: { type: "integer" },
          rating: { type: "integer", example: 5 },
          feedback: { type: "string", example: "Pelayanan sangat memuaskan" },
          category: { type: "string", example: "Service Quality" },
        },
      },

      // --- SERVICE CATALOG ---
      ServiceCatalogResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/ServiceCatalogItem" },
          },
        },
      },
      ServiceCatalogItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          icon: { type: "string" },
          isReadOnly: { type: "boolean" },
          children: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                needAsset: { type: "boolean" },
                workflow: { type: "string" },
                children: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ServiceItem" },
                },
              },
            },
          },
        },
      },
      ServiceItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          desc: { type: "string" },
          needAsset: { type: "boolean" },
          workflow: { type: "string" },
        },
      },

      // --- ADMIN & MASTER DATA ---
      UserCreateAdmin: {
        type: "object",
        required: ["username", "password", "email", "role", "full_name"],
        properties: {
          username: { type: "string" },
          password: { type: "string", format: "password" },
          email: { type: "string", format: "email" },
          full_name: { type: "string" },
          role: {
            type: "string",
            enum: [
              "super_admin",
              "admin_kota",
              "admin_opd",
              "bidang",
              "seksi",
              "helpdesk",
              "teknisi",
              "pegawai_opd",
            ],
          },
          opd_id: { type: "integer" },
          bidang_id: { type: "integer" },
          seksi_id: { type: "integer" },
          nip: { type: "string" },
          phone: { type: "string" },
          address: { type: "string" },
        },
      },
      OPDResponse: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          code: { type: "string" },
          address: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
      BidangResponse: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
        },
      },
      SeksiResponse: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
        },
      },
      TechnicianSimpleResponse: {
        type: "object",
        properties: {
          id: { type: "integer" },
          username: { type: "string" },
          full_name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
      PublicTicketTrackResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              ticket_info: {
                type: "object",
                properties: {
                  ticket_number: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string" },
                  category: { type: "string" },
                  opd_name: { type: "string" },
                  location: { type: "string" },
                  reporter_name: { type: "string" },
                  created_at: { type: "string", format: "date-time" },
                  last_updated: { type: "string", format: "date-time" },
                },
              },
              timeline: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    update_time: { type: "string", format: "date-time" },
                    status_change: { type: "string" },
                    handling_description: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      SearchResponse: {
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
                    items: { $ref: "#/components/schemas/TicketListResponse" },
                  },
                  count: { type: "integer" },
                },
              },
              kb: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/KBArticleV2" },
                  },
                  count: { type: "integer" },
                },
              },
            },
          },
        },
      },
      SyncResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          results: {
            type: "object",
            properties: {
              tickets: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    local_id: { type: "string" },
                    server_id: { type: "integer" },
                    ticket_number: { type: "string" },
                  },
                },
              },
              progress_updates: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    local_id: { type: "string" },
                    server_id: { type: "integer" },
                  },
                },
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    local_id: { type: "string" },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      AssetScanResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          action: {
            type: "string",
            enum: ["create_ticket", "technician_check_in"],
          },
          message: { type: "string" },
          asset: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              type: { type: "string" },
              location: { type: "string" },
              opd: { type: "string" },
            },
          },
        },
      },
      AuditLogResponse: {
        type: "object",
        properties: {
          id: { type: "integer" },
          ticket_id: { type: "integer" },
          user_id: { type: "integer" },
          action: { type: "string" },
          description: { type: "string" },
          user: { $ref: "#/components/schemas/UserResponse" },
          ticket: {
            type: "object",
            properties: {
              ticket_number: { type: "string" },
              title: { type: "string" },
            },
          },
          created_at: { type: "string", format: "date-time" },
        },
      },
      RoleConfig: {
        type: "object",
        properties: {
          id: { type: "integer" },
          role_key: { type: "string" },
          description: { type: "string" },
          permissions: {
            type: "array",
            items: { type: "string" },
          },
          is_system: { type: "boolean" },
        },
      },
      DashboardResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          dashboard: {
            type: "object",
            properties: {
              total_tickets: { type: "integer" },
              by_status: {
                type: "object",
                example: { open: 5, resolved: 20 },
              },
              by_priority: {
                type: "object",
                example: { high: 2, medium: 10 },
              },
              role: { type: "string" },
              scope: { type: "string" },
            },
          },
        },
      },
    },
  },
  paths: {
    // ==========================================
    // GENERAL
    // ==========================================
    "/": {
      get: {
        tags: ["General"],
        summary: "Check API Status",
        description:
          "Endpoint untuk memeriksa apakah API berjalan dengan baik.",
        responses: {
          200: {
            description: "API Berjalan",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                          example:
                            "Welcome to Siladan App API",
                        },
                        version: { type: "string", example: "2.0.0" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/dashboard": {
      get: {
        tags: ["General"],
        security: [{ bearerAuth: [] }],
        summary: "Get Dashboard Stats",
        description:
          "Mengambil data statistik untuk dashboard pengguna. Data yang ditampilkan akan difilter berdasarkan role pengguna.",
        responses: {
          200: {
            description: "Berhasil mengambil data dashboard",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DashboardResponse" },
              },
            },
          },
        },
      },
    },
    "/search": {
      get: {
        tags: ["General"],
        security: [{ bearerAuth: [] }],
        summary: "Global Search",
        description:
          "Melakukan pencarian global pada tiket (insiden & permintaan) dan artikel basis pengetahuan.",
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
            description:
              "Filter tipe hasil pencarian. Jika kosong, akan mencari di semua.",
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
            description: "Hasil Pencarian",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SearchResponse" },
              },
            },
          },
        },
      },
    },
    "/sync": {
      post: {
        tags: ["General"],
        security: [{ bearerAuth: [] }],
        summary: "Offline Sync (Mobile)",
        description:
          "Endpoint untuk sinkronisasi data yang dibuat saat aplikasi mobile dalam mode offline.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  tickets: {
                    type: "array",
                    items: { $ref: "#/components/schemas/IncidentCreateAuth" },
                    description: "Array of tickets created offline",
                  },
                  progress_updates: {
                    type: "array",
                    items: { $ref: "#/components/schemas/ProgressUpdateInput" },
                    description: "Array of updates made offline",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Laporan Sinkronisasi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SyncResponse" },
              },
            },
          },
        },
      },
    },
    "/assets/qr/{qr_code}": {
      get: {
        tags: ["General"],
        security: [{ bearerAuth: [] }],
        summary: "Scan QR Asset",
        description:
          "Memindai QR code pada aset. Aksi yang dihasilkan tergantung pada role pengguna.",
        parameters: [
          {
            name: "qr_code",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Informasi Aset atau Aksi Check-in",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AssetScanResponse" },
              },
            },
          },
          404: {
            description: "Aset tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ==========================================
    // 1. AUTHENTICATION
    // ==========================================
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login User",
        description:
          "Login untuk pengguna yang sudah terdaftar di sistem. Mengembalikan token JWT untuk digunakan pada request selanjutnya.",
        requestBody: {
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
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          401: {
            description: "Username/Password salah",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register Public User",
        description:
          "Mendaftarkan pengguna baru dengan role 'pengguna'. Akun akan langsung aktif.",
        requestBody: {
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
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                          example: "Registrasi berhasil",
                        },
                        user: { $ref: "#/components/schemas/UserResponse" },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: "Data tidak valid atau username/email sudah digunakan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Authentication"],
        security: [{ bearerAuth: [] }],
        summary: "Logout User",
        description:
          "Logout pengguna. Di sisi server, ini hanya menghapus token dari client. Token JWT tidak bisa di-invalidate secara langsung.",
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
        tags: ["Authentication"],
        security: [{ bearerAuth: [] }],
        summary: "Get Current User Profile",
        description:
          "Mengambil data profil pengguna yang sedang login berdasarkan token.",
        responses: {
          200: {
            description: "Data profil pengguna",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    user: { $ref: "#/components/schemas/UserResponse" },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Authentication"],
        security: [{ bearerAuth: [] }],
        summary: "Update Current User Profile",
        description:
          "Memperbarui data profil pengguna yang sedang login (nama, telepon, alamat).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  full_name: { type: "string" },
                  phone: { type: "string" },
                  address: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profil berhasil diperbarui",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    user: { $ref: "#/components/schemas/UserResponse" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Authentication"],
        summary: "Request Password Reset",
        description:
          "Mengirim link reset password ke email pengguna. Untuk keamanan, response akan selalu sukses meskipun email tidak terdaftar.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: { email: { type: "string", format: "email" } },
              },
            },
          },
        },
        responses: {
          200: {
            description:
              "Jika email terdaftar, link reset password akan dikirim",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },

    // ==========================================
    // 2. INCIDENTS
    // ==========================================
    "/incidents": {
      get: {
        tags: ["Incidents"],
        security: [{ bearerAuth: [] }],
        summary: "List Incidents (Filtered)",
        description:
          "Mengambil daftar tiket insiden. Hasil akan difilter berdasarkan role dan OPD pengguna.",
        parameters: [
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "open",
                "verified",
                "assigned",
                "in_progress",
                "resolved",
                "closed",
              ],
            },
          },
          {
            name: "priority",
            in: "query",
            schema: {
              type: "string",
              enum: ["low", "medium", "high", "major"],
            },
          },
          { name: "opd_id", in: "query", schema: { type: "integer" } },
          {
            name: "verification_status",
            in: "query",
            schema: {
              type: "string",
              enum: ["pending", "verified", "rejected"],
            },
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "Cari judul/nomor tiket/deskripsi",
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
            description: "Daftar insiden",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/TicketListResponse",
                      },
                    },
                    pagination: { $ref: "#/components/schemas/PaginationInfo" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Incidents"],
        security: [{ bearerAuth: [] }],
        summary: "Create Incident (Authenticated)",
        description:
          "Membuat laporan insiden baru oleh pengguna yang sudah login.",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/IncidentCreateAuth" },
            },
          },
        },
        responses: {
          201: {
            description: "Insiden berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    ticket: {
                      $ref: "#/components/schemas/TicketDetailResponse",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Data tidak lengkap",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/incidents/{id}": {
      get: {
        tags: ["Incidents"],
        security: [{ bearerAuth: [] }],
        summary: "Get Incident Detail",
        description:
          "Mengambil detail lengkap sebuah tiket insiden beserta riwayat, lampiran, dan komentar.",
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
            description: "Detail lengkap insiden",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    ticket: {
                      $ref: "#/components/schemas/TicketDetailResponse",
                    },
                    attachments: { type: "array" },
                    progress_updates: { type: "array" },
                    comments: { type: "array" },
                    logs: { type: "array" },
                  },
                },
              },
            },
          },
          404: {
            description: "Tiket tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Akses ditolak",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Incidents"],
        security: [{ bearerAuth: [] }],
        summary: "Update Incident",
        description:
          "Memperbarui data insiden seperti judul, deskripsi, kategori, atau status.",
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
                  title: { type: "string" },
                  description: { type: "string" },
                  category: { type: "string" },
                  status: {
                    type: "string",
                    enum: ["open", "in_progress", "resolved", "closed"],
                  },
                  assigned_to: { type: "integer" },
                  verification_status: {
                    type: "string",
                    enum: ["pending", "verified", "rejected"],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Insiden berhasil diperbarui",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/incidents/{id}/classify": {
      put: {
        tags: ["Incidents"],
        security: [{ bearerAuth: [] }],
        summary: "Classify Incident (Set Priority)",
        description:
          "Digunakan oleh staff (seksi/bidang) untuk menentukan urgensi dan dampak. Sistem akan otomatis menghitung ulang prioritas dan SLA.",
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
                required: ["urgency", "impact"],
                properties: {
                  urgency: {
                    type: "integer",
                    minimum: 1,
                    maximum: 5,
                    example: 3,
                  },
                  impact: {
                    type: "integer",
                    minimum: 1,
                    maximum: 5,
                    example: 3,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Insiden berhasil diklasifikasi",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    ticket: {
                      $ref: "#/components/schemas/TicketDetailResponse",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/incidents/{id}/progress": {
      post: {
        tags: ["Incidents"],
        security: [{ bearerAuth: [] }],
        summary: "Add Progress Update",
        description:
          "Menambahkan pembaruan progress pada tiket, biasanya dilakukan oleh teknisi atau penanggung jawab.",
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
              schema: { $ref: "#/components/schemas/ProgressUpdateInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Progress berhasil ditambahkan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        progress: { $ref: "#/components/schemas/ProgressUpdate" },
                        current_state: {
                          type: "object",
                          properties: {
                            status: { type: "string" },
                            stage: { type: "string" },
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
    "/incidents/{id}/comments": {
      post: {
        tags: ["Incidents"],
        security: [{ bearerAuth: [] }],
        summary: "Add Comment to Incident",
        description:
          "Menambahkan komentar pada tiket insiden. Bisa komentar publik atau internal (staff only).",
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
              schema: { $ref: "#/components/schemas/CommentInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Komentar berhasil ditambahkan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    comment: { $ref: "#/components/schemas/TicketComment" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/incidents/merge": {
      post: {
        tags: ["Incidents"],
        security: [{ bearerAuth: [] }],
        summary: "Merge Incidents",
        description:
          "Menggabungkan beberapa tiket insiden (duplikat) menjadi satu tiket target.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["source_ticket_ids", "target_ticket_id", "reason"],
                properties: {
                  source_ticket_ids: {
                    type: "array",
                    items: { type: "integer" },
                  },
                  target_ticket_id: { type: "integer" },
                  reason: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Insiden berhasil digabungkan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },

    // ==========================================
    // 3. PUBLIC ENDPOINTS (NO AUTH)
    // ==========================================
    "/public/incidents": {
      post: {
        tags: ["Public"],
        summary: "Report Incident (No Login)",
        description:
          "Endpoint untuk publik (masyarakat umum) untuk melaporkan insiden tanpa perlu login.",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/IncidentCreatePublic" },
            },
          },
        },
        responses: {
          201: {
            description: "Laporan insiden berhasil diterima",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    ticket: { $ref: "#/components/schemas/TicketListResponse" },
                  },
                },
              },
            },
          },
          400: {
            description: "Data laporan tidak lengkap",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/public/opd": {
      get: {
        tags: ["Public"],
        summary: "Get OPD List",
        description:
          "Mengambil daftar OPD yang aktif. Digunakan untuk dropdown saat pelaporan publik.",
        responses: {
          200: {
            description: "Daftar OPD",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/OPDResponse" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/public/tickets/{ticket_number}": {
      get: {
        tags: ["Public"],
        summary: "Track Ticket Status",
        description:
          "Melacak status tiket (baik insiden maupun permintaan) menggunakan nomor tiket. Tidak memerlukan login.",
        parameters: [
          {
            name: "ticket_number",
            in: "path",
            required: true,
            schema: { type: "string", example: "INC-2023-0001" },
          },
        ],
        responses: {
          200: {
            description: "Informasi pelacakan tiket",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PublicTicketTrackResponse",
                },
              },
            },
          },
          404: {
            description: "Tiket tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ==========================================
    // 4. REQUESTS (LAYANAN)
    // ==========================================
    "/catalog": {
      get: {
        tags: ["Service Requests"],
        security: [{ bearerAuth: [] }],
        summary: "Get Service Catalog",
        description:
          "Mengambil katalog layanan yang tersedia, lengkap dengan sub-layanan dan item layanan.",
        parameters: [
          {
            name: "opd_id",
            in: "query",
            schema: { type: "integer" },
            description: "Filter katalog berdasarkan OPD",
          },
          {
            name: "is_active",
            in: "query",
            schema: { type: "boolean" },
            description: "Filter katalog aktif/non-aktif",
          },
        ],
        responses: {
          200: {
            description: "Struktur katalog layanan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ServiceCatalogResponse" },
              },
            },
          },
        },
      },
    },
    "/requests": {
      get: {
        tags: ["Service Requests"],
        security: [{ bearerAuth: [] }],
        summary: "List Service Requests",
        description:
          "Mengambil daftar permintaan layanan. Hasil difilter berdasarkan role dan OPD pengguna.",
        parameters: [
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "pending_approval",
                "open",
                "in_progress",
                "resolved",
                "rejected",
              ],
            },
          },
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
          200: {
            description: "Daftar permintaan layanan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/TicketListResponse",
                      },
                    },
                    pagination: { $ref: "#/components/schemas/PaginationInfo" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Service Requests"],
        security: [{ bearerAuth: [] }],
        summary: "Create Service Request",
        description:
          "Membuat permintaan layanan baru. Jika layanan memerlukan approval, status awal akan 'pending_approval'.",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RequestCreate" },
            },
          },
        },
        responses: {
          201: {
            description: "Permintaan layanan berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    ticket: {
                      $ref: "#/components/schemas/TicketDetailResponse",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Data tidak lengkap atau item layanan tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/requests/{id}": {
      get: {
        tags: ["Service Requests"],
        security: [{ bearerAuth: [] }],
        summary: "Get Service Request Detail",
        description:
          "Mengambil detail permintaan layanan beserta alur approval dan riwayatnya.",
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
            description: "Detail permintaan layanan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    ticket: {
                      $ref: "#/components/schemas/TicketDetailResponse",
                    },
                    approvals: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ApprovalWorkflow" },
                    },
                    progress_updates: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ProgressUpdate" },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Tiket tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Akses ditolak",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Service Requests"],
        security: [{ bearerAuth: [] }],
        summary: "Update Service Request",
        description: "Memperbarui data permintaan layanan.",
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
                  status: {
                    type: "string",
                    enum: [
                      "pending_approval",
                      "open",
                      "in_progress",
                      "resolved",
                      "rejected",
                    ],
                  },
                  progress_notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Permintaan layanan berhasil diperbarui",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/requests/{id}/classify": {
      put: {
        tags: ["Service Requests"],
        security: [{ bearerAuth: [] }],
        summary: "Classify Service Request (Set Priority)",
        description:
          "Digunakan oleh staff untuk menentukan urgensi dan dampak pada permintaan layanan. Sistem akan otomatis menghitung ulang prioritas dan SLA.",
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
                required: ["urgency", "impact"],
                properties: {
                  urgency: {
                    type: "integer",
                    minimum: 1,
                    maximum: 5,
                    example: 3,
                  },
                  impact: {
                    type: "integer",
                    minimum: 1,
                    maximum: 5,
                    example: 3,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Request berhasil diklasifikasi dan prioritas diperbarui",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    ticket: {
                      $ref: "#/components/schemas/TicketDetailResponse",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/requests/{id}/approve": {
      post: {
        tags: ["Service Requests"],
        security: [{ bearerAuth: [] }],
        summary: "Approve Request",
        description:
          "Menyetujui permintaan layanan. Endpoint ini hanya bisa diakses oleh role yang sesuai dengan alur approval.",
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
                  notes: {
                    type: "string",
                    description: "Catatan opsional saat menyetujui",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Permintaan berhasil disetujui",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: {
                      type: "string",
                      example: "Service request berhasil disetujui",
                    },
                    all_approved: {
                      type: "boolean",
                      description:
                        "True jika semua level approval sudah selesai",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Approval tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/requests/{id}/reject": {
      post: {
        tags: ["Service Requests"],
        security: [{ bearerAuth: [] }],
        summary: "Reject Request",
        description:
          "Menolak permintaan layanan. Permintaan akan ditutup secara otomatis.",
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
                required: ["notes"],
                properties: {
                  notes: {
                    type: "string",
                    description: "Alasan penolakan wajib diisi",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Permintaan berhasil ditolak",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          400: {
            description: "Alasan penolakan harus diisi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Approval tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/requests/{id}/comments": {
      post: {
        tags: ["Service Requests"],
        security: [{ bearerAuth: [] }],
        summary: "Add Comment to Request",
        description:
          "Menambahkan komentar pada tiket permintaan layanan. Bisa komentar publik atau internal (staff only).",
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
              schema: { $ref: "#/components/schemas/CommentInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Komentar berhasil ditambahkan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    comment: { $ref: "#/components/schemas/TicketComment" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/requests/{id}/progress": {
      post: {
        tags: ["Service Requests"],
        security: [{ bearerAuth: [] }],
        summary: "Add Progress Update",
        description:
          "Menambahkan pembaruan progress pada tiket permintaan layanan.",
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
              schema: { $ref: "#/components/schemas/ProgressUpdateInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Progress request berhasil ditambahkan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        progress: { $ref: "#/components/schemas/ProgressUpdate" },
                        current_state: {
                          type: "object",
                          properties: {
                            status: { type: "string" },
                            stage: { type: "string" },
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

    // ==========================================
    // 5. KNOWLEDGE BASE
    // ==========================================
    "/knowledge-base": {
      get: {
        tags: ["Knowledge Base"],
        security: [{ bearerAuth: [] }],
        summary: "List Knowledge Base Articles",
        description:
          "Mengambil daftar artikel basis pengetahuan dengan filter.",
        parameters: [
          {
            name: "active",
            in: "query",
            schema: { type: "boolean" },
            description: "Filter untuk artikel aktif (true/false)",
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
            description: "Filter berdasarkan kategori",
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "Pencarian di judul dan deskripsi",
          },
        ],
        responses: {
          200: {
            description: "Daftar artikel KB",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/KBArticleV2" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Knowledge Base"],
        security: [{ bearerAuth: [] }],
        summary: "Create Knowledge Base Article",
        description:
          "Membuat artikel baru di basis pengetahuan. Memerlukan izin `kb.write`.",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/KBArticleV2Input" },
            },
          },
        },
        responses: {
          201: {
            description: "Artikel berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/KBArticleV2" },
                  },
                },
              },
            },
          },
          400: {
            description: "Data tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/knowledge-base/{id}": {
      get: {
        tags: ["Knowledge Base"],
        security: [{ bearerAuth: [] }],
        summary: "Get Knowledge Base Article by ID",
        description: "Mengambil detail satu artikel berdasarkan ID.",
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
            description: "Detail artikel KB",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean" },
                    data: { $ref: "#/components/schemas/KBArticleV2" },
                  },
                },
              },
            },
          },
          404: {
            description: "Artikel tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Knowledge Base"],
        security: [{ bearerAuth: [] }],
        summary: "Update Knowledge Base Article",
        description:
          "Memperbarui artikel yang ada. Memerlukan izin `kb.write`.",
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
              schema: { $ref: "#/components/schemas/KBArticleV2Input" },
            },
          },
        },
        responses: {
          200: {
            description: "Artikel berhasil diperbarui",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/KBArticleV2" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/knowledge-base/{id}/deactivate": {
      patch: {
        tags: ["Knowledge Base"],
        security: [{ bearerAuth: [] }],
        summary: "Deactivate Knowledge Base Article",
        description:
          "Menonaktifkan artikel (soft delete). Memerlukan izin `kb.write`.",
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
            description: "Artikel berhasil dinonaktifkan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/KBArticleV2" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/knowledge-base/{id}": {
      delete: {
        tags: ["Knowledge Base"],
        security: [{ bearerAuth: [] }],
        summary: "Delete Knowledge Base Article",
        description:
          "Menghapus artikel secara permanen. Memerlukan izin `kb.write`.",
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
            description: "Artikel berhasil dihapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean" },
                    message: { type: "string", example: "Knowledge base berhasil dihapus permanen" }
                  },
                },
              },
            },
          },
        },
      },
    },

    // ==========================================
    // 6. SURVEYS
    // ==========================================
    "/surveys": {
      get: {
        tags: ["Surveys"],
        security: [{ bearerAuth: [] }],
        summary: "Get All Surveys (Admin)",
        description:
          "Mengambil semua data survei tiket. Memerlukan izin `reports.read`.",
        responses: {
          200: {
            description: "Daftar semua survei",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/TicketSurvey" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Surveys"],
        security: [{ bearerAuth: [] }],
        summary: "Submit Survey",
        description:
          "Mengirimkan survei untuk tiket yang telah selesai.",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TicketSurveyInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Survey berhasil disubmit",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string", example: "Survey berhasil disubmit" },
                    data: { $ref: "#/components/schemas/TicketSurvey" }
                  },
                },
              },
            },
          },
          400: {
            description: "Data tidak valid atau survey untuk tiket ini sudah ada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/surveys/my-surveys": {
      get: {
        tags: ["Surveys"],
        security: [{ bearerAuth: [] }],
        summary: "Get My Surveys",
        description:
          "Mengambil daftar survei yang diajukan oleh pengguna yang sedang login.",
        responses: {
          200: {
            description: "Daftar survei pengguna",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/TicketSurvey" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/surveys/check/{ticket_id}": {
      get: {
        tags: ["Surveys"],
        security: [{ bearerAuth: [] }],
        summary: "Check if Survey Exists for Ticket",
        description:
          "Memeriksa apakah sebuah tiket sudah memiliki survei atau belum.",
        parameters: [
          {
            name: "ticket_id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Status pemeriksaan survei",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    hasSurvey: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/surveys/{id}": {
      get: {
        tags: ["Surveys"],
        security: [{ bearerAuth: [] }],
        summary: "Get Survey by ID",
        description: "Mengambil detail satu survei berdasarkan ID.",
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
            description: "Detail survei",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean" },
                    data: { $ref: "#/components/schemas/TicketSurvey" },
                  },
                },
              },
            },
          },
          404: {
            description: "Survey tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ==========================================
    // 7. ADMIN OPERATIONS
    // ==========================================
    "/admin/roles": {
      get: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "List RBAC Roles",
        description:
          "Mengambil daftar role dan permission yang tersimpan di database. Memerlukan izin `rbac.manage`.",
        responses: {
          200: {
            description: "Daftar Role",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/RoleConfig" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "Create Custom Role",
        description: "Membuat role baru secara dinamis. Memerlukan izin `rbac.manage`.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["role_key", "description"],
                properties: {
                  role_key: {
                    type: "string",
                    example: "supervisor_lapangan",
                    description: "Harus huruf kecil dan underscore (a-z_)",
                  },
                  description: { type: "string" },
                  permissions: {
                    type: "array",
                    items: { type: "string" },
                    example: ["tickets.read", "incidents.create"],
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Role berhasil dibuat",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/admin/roles/{id}": {
      put: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "Update Role Permissions",
        description: "Memperbarui permission dan deskripsi role. Memerlukan izin `rbac.manage`.",
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
                  description: { type: "string" },
                  permissions: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Role berhasil diupdate",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "Delete Role",
        description: "Menghapus role kustom. Role sistem (bawaan) tidak bisa dihapus. Memerlukan izin `rbac.manage`.",
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
            description: "Role berhasil dihapus",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          403: {
            description: "Role sistem tidak dapat dihapus",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/admin/users": {
      get: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "List Users",
        description:
          "Mengambil daftar semua pengguna sistem, dengan filter role dan OPD. Memerlukan izin `users.read`.",
        parameters: [
          {
            name: "role",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "super_admin",
                "admin_kota",
                "admin_opd",
                "bidang",
                "seksi",
                "helpdesk",
                "teknisi",
                "pegawai_opd",
                "pengguna",
              ],
            },
          },
          { name: "opd_id", in: "query", schema: { type: "integer" } },
          { name: "is_active", in: "query", schema: { type: "boolean" } },
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
            description: "Daftar pengguna",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/UserResponse" },
                    },
                    pagination: { $ref: "#/components/schemas/PaginationInfo" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "Create User (Admin)",
        description:
          "Membuat pengguna baru oleh admin. Role dan OPD dapat ditentukan. Memerlukan izin `users.write`.",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserCreateAdmin" },
            },
          },
        },
        responses: {
          201: {
            description: "Pengguna berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                          example: "Akun pegawai (teknisi) berhasil dibuat",
                        },
                        user: { $ref: "#/components/schemas/UserResponse" },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: "Data tidak valid atau role tidak ada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/admin/users/{id}/role": {
      put: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "Update User Role/OPD",
        description:
          "Memperbarui role, OPD, bidang, atau seksi seorang pengguna. Memerlukan izin `users.write`.",
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
                  role: { type: "string" },
                  opd_id: { type: "integer" },
                  bidang_id: { type: "integer" },
                  seksi_id: { type: "integer" },
                  is_active: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Role pengguna berhasil diperbarui",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/admin/opd": {
      get: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "List OPD",
        description:
          "Mengambil daftar semua OPD (Organisasi Perangkat Daerah). Memerlukan izin `opd.read`.",
        parameters: [
          { name: "is_active", in: "query", schema: { type: "boolean" } },
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
            description: "Daftar OPD",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/OPDResponse" },
                    },
                    pagination: { $ref: "#/components/schemas/PaginationInfo" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/admin/opd/{id}/technicians": {
      get: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "Get Technicians by OPD",
        description: "Mengambil daftar teknisi aktif dari OPD tertentu.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID dari OPD",
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Daftar teknisi OPD",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/TechnicianSimpleResponse" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/admin/opd/{id}/calendar": {
      put: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "Update OPD Calendar",
        description:
          "Memperbarui jam kerja dan daftar hari libur untuk perhitungan SLA. Memerlukan izin `opd.write`.",
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
                  working_hours: {
                    type: "object",
                    description: "JSON object untuk jam kerja",
                  },
                  holidays: {
                    type: "array",
                    items: { type: "string", format: "date" },
                    description: "Array tanggal hari libur",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Kalender OPD berhasil diperbarui",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/admin/technicians/{id}/skills": {
      put: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "Update Technician Skills",
        description: "Memperbarui daftar keahlian (skills) seorang teknisi. Memerlukan izin `users.write`.",
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
                  skills: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        level: {
                          type: "string",
                          enum: ["beginner", "intermediate", "expert"],
                        },
                        category: { type: "string" },
                      },
                    },
                  },
                  expertise_level: { type: "string" },
                  certifications: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Skills teknisi berhasil diperbarui",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/admin/sla": {
      post: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "Configure SLA",
        description:
          "Mengkonfigurasi SLA (Service Level Agreement) untuk OPD tertentu. Memerlukan izin `opd.write`.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["opd_id", "configs"],
                properties: {
                  opd_id: { type: "integer" },
                  configs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        priority: {
                          type: "string",
                          enum: ["low", "medium", "high", "major"],
                        },
                        resolution_time: { type: "integer" },
                        description: { type: "string" },
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
            description: "Konfigurasi SLA berhasil disimpan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/admin/audit-logs": {
      get: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "Get Audit Logs",
        description:
          "Mengambil log audit aktivitas yang terjadi di dalam sistem. Memerlukan izin `reports.read`.",
        parameters: [
          {
            name: "user_id",
            in: "query",
            schema: { type: "integer" },
          },
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
          200: {
            description: "Daftar log audit",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/AuditLogResponse" },
                    },
                    pagination: { $ref: "#/components/schemas/PaginationInfo" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [], // We are using inline definitions
};

const swaggerDocs = swaggerJsdoc(options);

const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: "Service Desk API Docs",
};

module.exports = { swaggerDocs, swaggerUiOptions };