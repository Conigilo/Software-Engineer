# E-MOD — KMUTT Activity & Venue Management Platform

โปรเจกต์ระบบจัดการกิจกรรมและจองสถานที่ภายในมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (KMUTT) จัดโครงสร้างแบบ **Clean Feature-First Modular Architecture** ตามมาตรฐานการพัฒนาแอพพลิเคชันจริง โดยแยกบทบาทชัดเจน:
* **📱 สำหรับ User ทั่วไป (นักศึกษาผู้เข้าร่วม & ชมรมผู้จัดกิจกรรม):** เป็น **Mobile Application (Application-Based)** (`390×844`)
* **💻 สำหรับ Admin (เจ้าหน้าที่ฝ่ายกิจการนักศึกษา):** เป็น **Web Application (Web-Based)** (`1440×1024`)
* **⚡ เชื่อมต่อผ่าน Backend API (4-Tier Layered Architecture) และฐานข้อมูลเชิงสัมพันธ์ 3NF SQLite (15 ตาราง)**

---

## โครงสร้างโปรเจกต์แบบ Clean Architecture (Feature-First)

ไม่มีการยัดทุกหน้าจอไว้ในไฟล์เดียว (Zero Monolithic Files) แต่แยกเป็นโมดูลตาม **Single Responsibility Principle (1 หน้าจอ = 1 ไฟล์)**:

```text
EMod/
├── mobile/                                      # 📱 Standalone React Native (Expo) Mobile App
│   ├── App.tsx                                  # Root Mobile App Container
│   ├── index.js                                 # Expo Root Entry
│   └── src/
│       ├── constants/                           # 🎨 Design System Tokens (colors.ts, categories.ts)
│       ├── types/                               # 📐 TypeScript Domain Interfaces (index.ts)
│       ├── services/                            # 🌐 HTTP Client & Domain Services (http.client.ts, auth.service.ts, event.service.ts)
│       ├── context/                             # 🧠 Auth & Session State (AuthContext.tsx)
│       ├── components/                          # 🧩 Vector Icons (Icons.tsx)
│       └── features/                            # 📦 Feature-First Modules
│           ├── auth/
│           │   └── MobileLoginScreen.tsx        # หน้าล็อกอินแอพมือถือ (@kmutt.ac.th)
│           ├── participant/                     # 🙋‍♂️ โมดูลผู้เข้าร่วมกิจกรรม (12 ไฟล์แยกตามหน้าจอ)
│           │   ├── ParticipantNavigator.tsx     # ตัวสลับหน้าจอฝั่งผู้เข้าร่วม
│           │   ├── components/                  # ParticipantBottomNav.tsx, ParticipantEventCard.tsx
│           │   ├── styles/participant.styles.ts
│           │   └── screens/
│           │       ├── HomeScreen.tsx           # 1. หน้าหลักรวมกิจกรรม
│           │       ├── SearchScreen.tsx         # 2. หน้าค้นหาและประวัติการค้นหาล่าสุด
│           │       ├── FilterScreen.tsx         # 3. หน้าตัวกรองหมวดหมู่และเรียงลำดับ
│           │       ├── EventDetailScreen.tsx    # 4. หน้ารายละเอียดกิจกรรมและลงทะเบียน
│           │       ├── QrTicketScreen.tsx       # 5. หน้าบัตรเข้างาน QR Code
│           │       ├── MapRouteScreen.tsx       # 6. หน้าแผนที่นำทางไปอาคารจัดงาน
│           │       ├── NotificationsScreen.tsx  # 7. หน้าการแจ้งเตือนผู้เข้าร่วม
│           │       ├── FavoritesScreen.tsx      # 8. หน้ารายการโปรดที่กดบันทึกไว้
│           │       ├── MyEventsScreen.tsx       # 9. หน้ากิจกรรมของฉัน
│           │       ├── ProfileScreen.tsx        # 10. หน้าโปรไฟล์และชั่วโมงสะสม
│           │       ├── SettingsScreen.tsx       # 11. หน้าตั้งค่าบัญชี
│           │       └── SupportChatScreen.tsx    # 12. หน้าแชทช่วยเหลือ E-MOD Assistant
│           └── organizer/                       # 📋 โมดูลผู้จัดกิจกรรม (10 ไฟล์แยกตามหน้าจอ)
│               ├── OrganizerNavigator.tsx       # ตัวสลับหน้าจอฝั่งผู้จัดกิจกรรม
│               ├── components/                  # OrganizerBottomNav.tsx
│               ├── styles/organizer.styles.ts
│               └── screens/
│                   ├── MyEventsScreen.tsx       # 1. หน้ากิจกรรมของชมรม
│                   ├── EventFormScreen.tsx      # 2. หน้าสร้าง/แก้ไขคำขอจัดกิจกรรม 5 ขั้นตอน + แนบ PDF
│                   ├── EventStatusScreen.tsx    # 3. หน้าไทม์ไลน์สถานะคำขอ + ส่งออกรายชื่อ CSV
│                   ├── QrCheckInScreen.tsx      # 4. หน้ากล้องสแกน QR Code เช็คชื่อหน้างาน
│                   ├── VenueListScreen.tsx      # 5. หน้าค้นหาและตรวจสอบสถานที่ว่าง
│                   ├── VenueDetailScreen.tsx    # 6. หน้ารายละเอียดสถานที่และตารางช่วงเวลา (เช้า/บ่าย/เย็น)
│                   ├── OrganizerNotificationsScreen.tsx # 7. หน้าการแจ้งเตือนผู้จัด
│                   └── OrganizerSettingsScreen.tsx      # 8. หน้าตั้งค่าผู้จัด
│
├── frontend/                                    # 💻 Admin Web Application (/admin/*) + Mobile OS Simulator (/app)
│   └── src/
│       ├── App.tsx                              # แยก 2 แพลตฟอร์ม: User ทั่วไป = Mobile App | Admin = Web App
│       ├── components/simulator/
│       │   └── PhoneSimulatorFrame.tsx          # ตัวเครื่องจำลอง iPhone 14 Pro + หน้าโฮม iOS
│       └── features/
│           ├── auth/AdminLoginScreen.tsx        # 💻 หน้าล็อกอินเว็บแอดมิน (/admin/login)
│           └── admin/                           # 💻 โมดูลเว็บแอดมิน (1440×1024)
│               ├── AdminWebPortal.tsx           # โครงสร้างหลักหน้าเว็บแอดมิน
│               ├── components/                  # AdminSidebar.tsx, AdminHeader.tsx
│               ├── modals/AdminModals.tsx       # Modal พรีวิวเอกสาร PDF และยืนยันผลการอนุมัติ
│               ├── styles/admin.styles.ts
│               └── pages/
│                   ├── RequestsListPage.tsx     # 1. หน้าตารางคำขอโพสต์กิจกรรม
│                   ├── RequestReviewPage.tsx    # 2. หน้าตรวจสอบคำขอ 3 จุด + เล่มโครงการ PDF
│                   └── VenueManagePage.tsx      # 3. หน้าจัดการตารางเวลาว่างสถานที่ (เช้า/บ่าย/เย็น)
│
└── backend/                                     # ⚡ ElysiaJS + Bun (4-Tier Layered Architecture + 3NF SQLite)
    └── src/
        ├── index.ts                             # Entry Point + OpenAPI Swagger (/swagger)
        ├── config/env.ts                        # ตั้งค่าสภาพแวดล้อมและโดเมน @kmutt.ac.th
        ├── middlewares/logger.middleware.ts     # จับเวลาประมวลผลและจัดการ Validation Error
        ├── routes/                              # [Layer 1] Controller Routes + TypeBox Validation
        ├── services/                            # [Layer 2] Business Logic Services
        ├── repositories/                        # [Layer 3] SQL JOIN Data Access Repositories
        └── db/                                  # [Layer 4] 3NF Relational Database (schema.sql + seed.ts)
```

---

## วิธีรันใช้งาน

1. **Backend API (`http://localhost:3001` & Swagger `http://localhost:3001/swagger`):**
   ```bash
   cd backend
   bun run src/index.ts
   ```
2. **Admin Web App & Mobile App Simulator (`http://localhost:5173`):**
   ```bash
   cd frontend
   npx vite --port 5173
   ```
3. **Standalone Mobile App ด้วย Expo (`mobile/`):**
   ```bash
   cd mobile
   npx expo start
   ```
