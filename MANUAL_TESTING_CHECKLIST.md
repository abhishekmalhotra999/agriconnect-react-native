# AgriConnect Manual Testing Checklist

Use this checklist for full regression and release validation across mobile app + backend behavior.

## 1. Test Setup

- [ ] App builds and launches on Android emulator/device
- [ ] App launches on iOS simulator/device (if applicable)
- [ ] Backend is reachable from app (`API_URL` correct)
- [ ] DB seeded with realistic test data (courses, products, services, users)
- [ ] Clear app storage before first-run scenarios
- [ ] Network toggles available for offline/slow network tests

## 2. First Launch & App Shell

- [ ] Splash/onboarding appears only for first-time users
- [ ] Onboarding content renders correctly (image/text/button)
- [ ] Onboarding completion skips onboarding on next launch
- [ ] Bottom tab icons/labels align and highlight correctly
- [ ] Header icons (bell/profile/back) work from each screen
- [ ] Long titles do not break layout (marquee/ellipsis behavior acceptable)

## 3. Role-Based Signup & Login

### 3.1 OTP and Signup Entry

- [ ] `get_otp` works for Customer
- [ ] `get_otp` works for Farmer
- [ ] `get_otp` works for Technician
- [ ] Invalid account type is rejected with clear error
- [ ] Existing account path shows proper login guidance

### 3.2 Customer Signup

- [ ] Personal details submit successfully
- [ ] Password and confirm password mismatch shows proper error
- [ ] Required fields validate correctly
- [ ] Customer reaches app main flow after signup

### 3.3 Farmer Signup

- [ ] Personal details step works
- [ ] Professional details required fields validate (`farmingType`, `farmSize`, `yearsOfExperience`)
- [ ] Signup succeeds with valid data
- [ ] Duplicate email shows clear message
- [ ] Farmer lands in farmer-appropriate flow after signup/login

### 3.4 Technician Signup

- [ ] Professional details required fields validate (`technicianType`, `yearsOfExperience`)
- [ ] Signup succeeds with valid data
- [ ] Technician lands in technician/seller flow after signup/login

### 3.5 Login / Session

- [ ] Login by phone works
- [ ] Invalid password shows correct error
- [ ] Auth token persists after app restart
- [ ] Logout clears session and routes to auth
- [ ] Forgot/reset password flow works end-to-end

## 4. Role Access Control (Critical)

- [ ] Customer cannot access seller-only create/edit flows
- [ ] Farmer cannot create service listings (if policy requires)
- [ ] Farmer can request/book services
- [ ] Technician can create/update own service listings
- [ ] Non-owner cannot edit another seller listing
- [ ] Protected routes return clear errors, not silent failures

## 5. Home & Discovery

- [ ] Home search returns relevant results
- [ ] Search scope filter icon toggles and filters correctly
- [ ] Empty state appears when no match
- [ ] Banner cards navigate correctly
- [ ] Quick actions navigate to correct modules
- [ ] Recent items open expected destinations

## 6. LMS (Learn Module)

### 6.1 Learn Overview

- [ ] Overall progress card shows real aggregated values
- [ ] Progress values match lesson completion data
- [ ] My courses CTA navigates correctly
- [ ] Learn hero carousel supports swipe and autoplay

### 6.2 Courses

- [ ] Course list loads from API
- [ ] Course images render; fallback images appear on broken URLs
- [ ] Category banners (Farming/Cycles) filter courses
- [ ] Chips (All/Popular/New) filter/sort as expected
- [ ] Enrolled courses show progress bar and counts

### 6.3 Lesson Flow

- [ ] Opening a course loads lesson list
- [ ] Lesson detail opens correctly
- [ ] HTML lesson content renders (headings/lists/tables)
- [ ] Completing a lesson updates progress in UI
- [ ] Back navigation preserves tab bar behavior

## 7. Marketplace (Multi-Vendor)

### 7.1 Customer Side

- [ ] Product list loads with categories/filters/search
- [ ] Product detail image slider works
- [ ] Long product names remain readable (no header break)
- [ ] Save/share/call/WhatsApp actions work
- [ ] Add to cart works
- [ ] Related products load and navigate

### 7.2 Vendor Side

- [ ] Vendor can create product
- [ ] Required fields + media upload validation works
- [ ] Vendor can edit own product
- [ ] Vendor cannot edit product owned by others
- [ ] Product status (draft/published) affects visibility correctly

## 8. Services Module

### 8.1 Services Discovery

- [ ] Service list loads with category/search
- [ ] Service detail opens with images and metadata
- [ ] Long service names remain readable (no layout overlap)
- [ ] Save/share/call/WhatsApp actions work

### 8.2 Service Booking / Requests

- [ ] Request form submits successfully for Customer
- [ ] Request form submits successfully for Farmer
- [ ] Validation errors shown for missing required fields
- [ ] Success message shown after submit
- [ ] Request appears in My Requests
- [ ] Status filters in My Requests work
- [ ] Request details screen shows message/status timeline

### 8.3 Technician Inbox

- [ ] Technician sees incoming requests for own listings
- [ ] Request status updates (pending/accepted/completed etc.) reflect correctly

## 9. Notifications, Chats, Profile

- [ ] Bell icon navigation works from all key screens
- [ ] Notification screen behavior is expected (Coming Soon or full list)
- [ ] Chats list opens and chat room navigation works
- [ ] Profile details load and edit/save works
- [ ] Help/Privacy/Rate Us links open correctly

## 10. Preferences, Save/Recent, Persistence

- [ ] Save/unsave product updates instantly and persists
- [ ] Save/unsave service updates instantly and persists
- [ ] Recent items track and display correctly
- [ ] Saved/recent survive app restart

## 11. API Error Handling & Resilience

- [ ] Friendly error messages on API failures
- [ ] Loading indicators appear while requests are in progress
- [ ] Empty states shown instead of broken UI
- [ ] 401/403 cases route/notify correctly
- [ ] Offline mode handling shows no-crash behavior

## 12. UI/UX Quality Pass

- [ ] No overlapping UI at different screen sizes
- [ ] Buttons have enough tap area
- [ ] Input focus/keyboard behavior is correct
- [ ] Scroll performance acceptable on long lists
- [ ] Color contrast and text readability acceptable

## 13. Performance Sanity

- [ ] Initial app open time acceptable
- [ ] Home/Learn/Product/Service screens load within acceptable time
- [ ] No visible memory leaks or repeated crashes in 15-20 min exploratory run

## 14. Security & Data Integrity

- [ ] Password fields are masked
- [ ] Sensitive errors not exposed to user
- [ ] Unauthorized API operations are denied
- [ ] Role checks enforced server-side (not only UI-side)

## 15. Release Readiness (Go/No-Go)

- [ ] Critical auth/signup/login flows pass
- [ ] LMS core flows pass
- [ ] Marketplace purchase/discovery flows pass
- [ ] Services booking + my requests flows pass
- [ ] No blocker crashes
- [ ] APK build/install sanity verified
- [ ] Known issues documented with severity

---

## Suggested Test Accounts

- Customer: [ ]
- Farmer: [ ]
- Technician: [ ]
- Admin (if applicable): [ ]

## Notes / Defects Log

- Date:
- Build/Commit:
- Device/OS:
- Defect ID:
- Module:
- Severity:
- Repro Steps:
- Expected:
- Actual:
- Evidence (screenshot/video):
