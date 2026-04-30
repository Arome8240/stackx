# Development Tasks - Staxial Health System

**Created:** 2026-04-21  
**Status:** In Progress  
**Current Completion:** 52%

---

## Task Status Legend
- ⏳ Not Started
- 🚧 In Progress
- ✅ Completed
- ⏸️ Blocked

---

## Phase 1: Web App Enhancements (Priority: HIGH)

### Task 1.1: Analytics Dashboard with Charts ✅
**Priority:** HIGH | **Estimated Time:** 4 hours | **Status:** COMPLETED

#### Subtasks:
- [x] 1.1.1 - Install chart library (recharts)
- [x] 1.1.2 - Create hospital growth chart component
- [x] 1.1.3 - Create appointment volume chart component
- [x] 1.1.4 - Create token circulation chart component
- [x] 1.1.5 - Integrate charts into analytics page
- [x] 1.1.6 - Add export functionality

**Files to Create/Modify:**
- `apps/web/components/charts/hospital-growth-chart.tsx`
- `apps/web/components/charts/appointment-volume-chart.tsx`
- `apps/web/components/charts/token-circulation-chart.tsx`
- `apps/web/app/(admin)/admin/analytics/page.tsx`

---

### Task 1.2: Token Management Page ✅
**Priority:** MEDIUM | **Estimated Time:** 3 hours | **Status:** COMPLETED

#### Subtasks:
- [x] 1.2.1 - Create token statistics component
- [x] 1.2.2 - Create token holders list
- [x] 1.2.3 - Create token transaction history
- [x] 1.2.4 - Add mint/burn functionality (admin only)
- [x] 1.2.5 - Create token management page

**Files to Create:**
- `apps/web/lib/sdk/token.ts`
- `apps/web/lib/hooks/use-token.ts`
- `apps/web/app/(admin)/admin/tokens/page.tsx`

---

### Task 1.3: Audit Log Viewer ✅
**Priority:** MEDIUM | **Estimated Time:** 3 hours | **Status:** COMPLETED

#### Subtasks:
- [x] 1.3.1 - Create audit log types
- [x] 1.3.2 - Create audit log fetching hook
- [x] 1.3.3 - Create audit log table component
- [x] 1.3.4 - Add filtering by action type
- [x] 1.3.5 - Add export audit logs functionality

**Files to Create:**
- `apps/web/lib/types/audit.ts`
- `apps/web/lib/hooks/use-audit-logs.ts`
- `apps/web/app/(admin)/admin/audit/page.tsx`

---

### Task 1.4: Enhanced Settings Page ⏳
**Priority:** LOW | **Estimated Time:** 2 hours

#### Subtasks:
- [ ] 1.4.1 - Add platform fee configuration UI
- [ ] 1.4.2 - Add network status monitoring
- [ ] 1.4.3 - Add admin profile section
- [ ] 1.4.4 - Add notification preferences

**Files to Modify:**
- `apps/web/app/(admin)/admin/settings/page.tsx`

---

### Task 1.5: Loading Skeletons & Error Boundaries ⏳
**Priority:** MEDIUM | **Estimated Time:** 2 hours

#### Subtasks:
- [ ] 1.5.1 - Create table skeleton component
- [ ] 1.5.2 - Create card skeleton component
- [ ] 1.5.3 - Create error boundary component
- [ ] 1.5.4 - Integrate skeletons into all pages
- [ ] 1.5.5 - Add error boundaries to routes

**Files to Create:**
- `apps/web/components/ui/table-skeleton.tsx`
- `apps/web/components/ui/card-skeleton.tsx`
- `apps/web/components/error-boundary.tsx`

---

## Phase 2: Mobile Application (Priority: HIGH)

### Task 2.1: Mobile Project Setup ✅
**Priority:** HIGH | **Estimated Time:** 2 hours | **Status:** COMPLETED

#### Subtasks:
- [x] 2.1.1 - Initialize React Native with Expo
- [x] 2.1.2 - Set up Expo Router navigation
- [x] 2.1.3 - Configure NativeWind for styling
- [x] 2.1.4 - Set up environment variables
- [x] 2.1.5 - Configure app.json with icons and splash

**Files to Create:**
- `apps/mobile/app.json`
- `apps/mobile/package.json`
- `apps/mobile/app/_layout.tsx`
- `apps/mobile/tailwind.config.js`

---

### Task 2.2: Mobile Wallet Integration ✅
**Priority:** HIGH | **Estimated Time:** 4 hours | **Status:** COMPLETED

#### Subtasks:
- [x] 2.2.1 - Research Stacks mobile wallet options
- [x] 2.2.2 - Install wallet dependencies
- [x] 2.2.3 - Create wallet context provider
- [x] 2.2.4 - Create connect wallet screen
- [x] 2.2.5 - Implement secure key storage
- [x] 2.2.6 - Add biometric authentication

**Files to Create:**
- `apps/mobile/lib/wallet/wallet-provider.tsx`
- `apps/mobile/app/(auth)/connect-wallet.tsx`
- `apps/mobile/lib/wallet/secure-storage.ts`

---

### Task 2.3: Patient Mobile Features ⏳
**Priority:** HIGH | **Estimated Time:** 8 hours

#### Subtasks:
- [ ] 2.3.1 - Create patient registration flow
- [ ] 2.3.2 - Create patient dashboard
- [ ] 2.3.3 - Create hospital search screen
- [ ] 2.3.4 - Create appointment booking flow
- [ ] 2.3.5 - Create medical records viewer
- [ ] 2.3.6 - Create prescription viewer

**Files to Create:**
- `apps/mobile/app/(patient)/register.tsx`
- `apps/mobile/app/(patient)/dashboard.tsx`
- `apps/mobile/app/(patient)/hospitals.tsx`
- `apps/mobile/app/(patient)/book-appointment.tsx`
- `apps/mobile/app/(patient)/records.tsx`
- `apps/mobile/app/(patient)/prescriptions.tsx`

---

### Task 2.4: Hospital/Doctor Mobile Features ⏳
**Priority:** MEDIUM | **Estimated Time:** 6 hours

#### Subtasks:
- [ ] 2.4.1 - Create doctor dashboard
- [ ] 2.4.2 - Create appointments list screen
- [ ] 2.4.3 - Create patient consultation screen
- [ ] 2.4.4 - Create prescription issuance form
- [ ] 2.4.5 - Create schedule management

**Files to Create:**
- `apps/mobile/app/(doctor)/dashboard.tsx`
- `apps/mobile/app/(doctor)/appointments.tsx`
- `apps/mobile/app/(doctor)/consultation.tsx`
- `apps/mobile/app/(doctor)/issue-prescription.tsx`

---

## Phase 3: Backend & Infrastructure (Priority: MEDIUM)

### Task 3.1: Event Indexing Service ⏸️ BLOCKED (Needs testnet deployment)
**Priority:** HIGH | **Estimated Time:** 1 week

#### Subtasks:
- [ ] 3.1.1 - Set up NestJS backend project
- [ ] 3.1.2 - Configure MongoDB connection
- [ ] 3.1.3 - Create event listener service
- [ ] 3.1.4 - Index hospital registration events
- [ ] 3.1.5 - Index patient registration events
- [ ] 3.1.6 - Index appointment events
- [ ] 3.1.7 - Index prescription events
- [ ] 3.1.8 - Create REST API endpoints

**Files to Create:**
- `apps/api/src/main.ts`
- `apps/api/src/indexer/indexer.service.ts`
- `apps/api/src/hospitals/hospitals.controller.ts`
- `apps/api/src/patients/patients.controller.ts`

---

### Task 3.2: IPFS Integration ⏳
**Priority:** MEDIUM | **Estimated Time:** 3 days

#### Subtasks:
- [ ] 3.2.1 - Set up Pinata or IPFS node
- [ ] 3.2.2 - Create file upload service
- [ ] 3.2.3 - Implement encryption for medical documents
- [ ] 3.2.4 - Create file retrieval service
- [ ] 3.2.5 - Add metadata storage

**Files to Create:**
- `apps/api/src/ipfs/ipfs.service.ts`
- `apps/api/src/ipfs/encryption.service.ts`

---

## Phase 4: Testing & Quality (Priority: HIGH)

### Task 4.1: Smart Contract Tests ⏳
**Priority:** HIGH | **Estimated Time:** 1 week

#### Subtasks:
- [ ] 4.1.1 - Write health-token tests
- [ ] 4.1.2 - Write hospital-registry tests
- [ ] 4.1.3 - Write patient-records tests
- [ ] 4.1.4 - Write appointments tests
- [ ] 4.1.5 - Write prescriptions tests
- [ ] 4.1.6 - Integration tests between contracts

**Files to Create:**
- `staxial-contract/tests/health-token.test.ts`
- `staxial-contract/tests/hospital-registry.test.ts`
- `staxial-contract/tests/patient-records.test.ts`
- `staxial-contract/tests/appointments.test.ts`
- `staxial-contract/tests/prescriptions.test.ts`

---

### Task 4.2: Web App Tests ⏳
**Priority:** MEDIUM | **Estimated Time:** 4 days

#### Subtasks:
- [ ] 4.2.1 - Set up Vitest for component tests
- [ ] 4.2.2 - Write tests for hospital management
- [ ] 4.2.3 - Write tests for patient management
- [ ] 4.2.4 - Write tests for appointments
- [ ] 4.2.5 - Set up Playwright for E2E tests
- [ ] 4.2.6 - Write E2E tests for admin flows

**Files to Create:**
- `apps/web/tests/hospitals.test.tsx`
- `apps/web/tests/patients.test.tsx`
- `apps/web/e2e/admin-flow.spec.ts`

---

## Phase 5: Deployment (Priority: CRITICAL)

### Task 5.1: Testnet Deployment ⏳
**Priority:** CRITICAL | **Estimated Time:** 4 hours

#### Subtasks:
- [ ] 5.1.1 - Set up Clarinet environment
- [ ] 5.1.2 - Configure testnet deployment settings
- [ ] 5.1.3 - Deploy health-token contract
- [ ] 5.1.4 - Deploy hospital-registry contract
- [ ] 5.1.5 - Deploy patient-records contract
- [ ] 5.1.6 - Deploy appointments contract
- [ ] 5.1.7 - Deploy prescriptions contract
- [ ] 5.1.8 - Verify all contracts on explorer
- [ ] 5.1.9 - Update .env files with addresses
- [ ] 5.1.10 - Test contract functions on testnet

**Files to Modify:**
- `staxial-contract/.env`
- `stackx/apps/web/.env`
- `stackx/.env`

---

### Task 5.2: Web App Deployment ⏳
**Priority:** HIGH | **Estimated Time:** 2 hours

#### Subtasks:
- [ ] 5.2.1 - Configure Vercel project
- [ ] 5.2.2 - Set up environment variables
- [ ] 5.2.3 - Deploy to staging
- [ ] 5.2.4 - Test staging deployment
- [ ] 5.2.5 - Deploy to production

---

### Task 5.3: Mobile App Deployment ⏳
**Priority:** MEDIUM | **Estimated Time:** 1 week

#### Subtasks:
- [ ] 5.3.1 - Build iOS app
- [ ] 5.3.2 - Submit to TestFlight
- [ ] 5.3.3 - Build Android app
- [ ] 5.3.4 - Submit to Internal Testing
- [ ] 5.3.5 - Conduct beta testing
- [ ] 5.3.6 - Submit to App Store
- [ ] 5.3.7 - Submit to Play Store

---

## Phase 6: Post-Launch (Priority: LOW)

### Task 6.1: Monitoring & Analytics ⏳
**Priority:** MEDIUM | **Estimated Time:** 2 days

#### Subtasks:
- [ ] 6.1.1 - Set up Sentry for error tracking
- [ ] 6.1.2 - Set up Mixpanel for analytics
- [ ] 6.1.3 - Configure uptime monitoring
- [ ] 6.1.4 - Set up alert system

---

### Task 6.2: Documentation ⏳
**Priority:** MEDIUM | **Estimated Time:** 3 days

#### Subtasks:
- [ ] 6.2.1 - Write patient user guide
- [ ] 6.2.2 - Write hospital admin guide
- [ ] 6.2.3 - Write super admin guide
- [ ] 6.2.4 - Create FAQ section
- [ ] 6.2.5 - Record video tutorials

---

## Current Sprint Focus

**Sprint Goal:** Complete Web App Enhancements  
**Tasks in Sprint:**
1. Task 1.1 - Analytics Dashboard with Charts
2. Task 1.2 - Token Management Page
3. Task 1.3 - Audit Log Viewer
4. Task 1.5 - Loading Skeletons & Error Boundaries

**Next Sprint:** Mobile Application Setup

---

## Progress Tracking

**Phase 1 (Web App):** 85% → Target: 100%  
**Phase 2 (Mobile):** 0% → Target: 50%  
**Phase 3 (Backend):** 0% → Target: 30%  
**Phase 4 (Testing):** 0% → Target: 50%  
**Phase 5 (Deployment):** 0% → Target: 100%

**Overall:** 52% → Target: 75% (End of next 2 sprints)

---

**Last Updated:** 2026-04-21  
**Next Review:** After Task 1.5 completion
