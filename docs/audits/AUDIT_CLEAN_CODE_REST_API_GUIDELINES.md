# Audit Clean Code dan REST API Guidelines

Tanggal audit terakhir: 22 Juni 2026
Project: PURWALOKA - Property Renting Web App  
Acuan: `docs/guidelines/PURWADHIKA.md`, `docs/guidelines/REST_API_GUIDELINES.md`, `docs/guidelines/CODE_LINE_CHECK_GUIDELINES.md`

## Ringkasan

Dokumen ini sudah disinkronkan dengan kondisi repository setelah refactor batch terbaru. Root README dibuat ringkas, sementara detail audit internal berada di folder `docs`.

Hasil audit aktual:

- File source >200 baris pada `frontend/src` dan `backend/src`: tidak ditemukan.
- Function-length advisory: 100 kandidat.
- Frontend function advisory: 92 kandidat.
- Backend function advisory: 8 kandidat.
- Scan `any`, `as any`, `as unknown as`, `console.log`, dan `debugger`: tidak ditemukan pada `frontend/src` dan `backend/src`.
- REST API jalur utama resource-oriented; beberapa legacy alias masih aktif untuk backward compatibility.

## Verifikasi yang Dijalankan

| Pemeriksaan | Hasil |
| --- | --- |
| Scan file source >200 baris | Tidak ditemukan |
| `npm run audit:functions` | 100 kandidat manual review, advisory only |
| Frontend function advisory | 92 kandidat |
| Backend function advisory | 8 kandidat |
| Scan `any` | Tidak ditemukan |
| Scan `as any` | Tidak ditemukan |
| Scan `as unknown as` | Tidak ditemukan |
| Scan `console.log` | Tidak ditemukan |
| Scan `debugger` | Tidak ditemukan |

## Files Over 200 Lines

Tidak ditemukan file source aktif di `frontend/src` atau `backend/src` yang melewati 200 baris.

| File | Lines |
| --- | ---: |
| _Tidak ada_ | 0 |

## Residue Scan

| Pattern | Result |
| --- | --- |
| `any` | Tidak ditemukan |
| `as any` | Tidak ditemukan |
| `as unknown as` | Tidak ditemukan |
| `console.log` | Tidak ditemukan |
| `debugger` | Tidak ditemukan |

Catatan:

- Scan dilakukan pada `frontend/src` dan `backend/src`.
- Script, docs, migration, dan dependency tidak dihitung sebagai source production utama kecuali disebut eksplisit.

## Function-Length Advisory

`npm run audit:functions` adalah alat bantu audit, bukan hard rule build. Kandidat berikut perlu dinilai manual. Refactor hanya disarankan jika meningkatkan maintainability, readability, atau pemisahan tanggung jawab.

Ringkasan aktual:

- Total kandidat: 100.
- Frontend kandidat: 92.
- Backend kandidat: 8.
- Batch 22 Juni menurunkan total 101 menjadi 100 melalui extraction pure helper penggabungan rentang availability.

Audit seluruh kandidat backend sebelum refactor aman:

| File | Function | Lines | Risk | Action |
| --- | --- | ---: | --- | --- |
| `backend/src/services/order/tenantRefundCompletion.ts` | `markRefundComplete` | 37 | HIGH | Retained; payment/refund state, ownership-scoped query, dan audit fields |
| `backend/src/services/order/userCancelOrder.ts` | `cancelUserOrder` | 32 | HIGH | Retained; order transition, manual-refund branch, dan email workflow |
| `backend/src/services/orderService.ts` | `executeOrderTransaction` | 28 | HIGH | Retained; transaction, lock, availability, voucher, dan order creation |
| `backend/src/services/tenantReport/occupancyQuery.ts` | `findOccupancyCalendar` | 28 | MEDIUM | Retained; query dan report-shaping semantics |
| `backend/src/services/propertyDetail/roomStatus.ts` | `buildRoomStatus` | 25 | HIGH | Retained; availability, pricing, dan date-range queries |
| `backend/src/services/orderService.ts` | `buildOrderCreateData` | 20 | HIGH | Retained; order payload dan status/payment semantics |
| `backend/src/services/tenantReport/occupancyQuery.ts` | `mergeAvailabilityToRanges` | 20 | SAFE | Resolved melalui pure date-range helpers |
| `backend/src/validations/voucherValidation.ts` | `validateVoucherRules` | 20 | HIGH | Retained; voucher business validation |
| `backend/src/services/orderService.ts` | `syncUserProfileFromBooking` | 19 | HIGH | Retained; booking side effect dan profile PII mutation |

Kandidat frontend yang selesai pada batch ini:

| File | Function | Before | Result |
| --- | --- | ---: | --- |
| `frontend/src/pages/tenant/rooms-page/RoomsPageHeader.tsx` | `RoomsPageHeader` | 35 | Resolved melalui private header/action components |
| `frontend/src/pages/user/UserDashboardPage.tsx` | `UserDashboardPage` | 35 | Resolved melalui display-state composition |
| `frontend/src/pages/tenant/tenant-dashboard/TenantRevenuePanel.tsx` | `TenantRevenuePanel` | 33 | Resolved melalui title/select/chart helpers |
| `frontend/src/components/tenant/orders-table/OrdersTableCells.tsx` | `OrderStatusCell` | 27 | Resolved melalui status/proof display helpers |
| `frontend/src/pages/user/HomePage.tsx` | `PromosCta` | 31 | Resolved melalui data-driven promo cards |

Audit seluruh kandidat di atas 50 baris:

| File | Function | Lines | Domain | Risk | Action |
| --- | --- | ---: | --- | --- | --- |
| `frontend/src/pages/tenant/property-form/PropertyImageField.tsx` | `PropertyImageField` | 104 | upload | HIGH | Retained |
| `frontend/src/hooks/tenant/room-form/useRoomImageField.ts` | `useRoomImageField` | 100 | upload/API | HIGH | Retained |
| `frontend/src/pages/user/BookingDetailPage.tsx` | `BookingDetailPage` | 89 | booking/payment/upload | HIGH | Retained |
| `frontend/src/components/common/ImageCropperModal.tsx` | `ImageCropperModal` | 88 | upload/crop | HIGH | Retained |
| `frontend/src/pages/user/orders/UserOrdersContent.tsx` | `UserOrdersContent` | 82 | order/payment upload | HIGH | Retained |
| `frontend/src/components/property/ReservationPanel.tsx` | `ReservationPanel` | 73 | booking/availability CTA | HIGH | Retained |
| `frontend/src/pages/tenant/vouchers/AssignVoucherModal.tsx` | `AssignVoucherModal` | 70 | voucher mutation | HIGH | Retained |
| `frontend/src/pages/user/PropertyDetailPage.tsx` | `PropertyDetailView` | 60 | booking/availability | HIGH | Retained |
| `frontend/src/pages/user/orders/BookingPropertySummary.tsx` | `BookingPropertySummary` | 59 | booking | HIGH | Retained despite display-only role |
| `frontend/src/pages/user/orders/BookingPaymentPanel.tsx` | `BookingPaymentPanel` | 58 | payment/refund | HIGH | Retained |
| `frontend/src/pages/tenant/property-form/PropertyBasicFields.tsx` | `RentalTypeField` | 55 | property form | MEDIUM | Retained; form register/watch |
| `frontend/src/hooks/user/reviews/useUserReviewsState.ts` | `useReviewOrders` | 54 | server-state hook | MEDIUM | Retained; fetch lifecycle and stale-request guard |
| `frontend/src/pages/tenant/property-form/PropertyBasicFields.tsx` | `CategoryField` | 53 | property form | MEDIUM | Retained; form registration and role grouping |
| `frontend/src/pages/user/PaymentSuccessPage.tsx` | `PaymentSuccessPage` | 52 | payment navigation | HIGH | Retained |

Hasil terkini untuk kandidat >50: 14 kandidat tersisa, terdiri dari 0 SAFE, 3 MEDIUM, dan 11 HIGH.

Targeted review kandidat terbesar berikutnya:

| File | Function | Before | Risk | Result |
| --- | --- | ---: | --- | --- |
| `frontend/src/pages/tenant/categories/CategoryFormModal.tsx` | `CategoryFormModal` | 119 | MEDIUM | Resolved melalui presentational fields/actions extraction |

Submit orchestration tetap berada di `useCategoryForm`. Native `required`, `maxLength`, character count, serta kondisi tombol submit tetap identik. Kandidat property image, room image hook, cropper, booking detail, user orders, dan reservation panel dipertahankan karena HIGH risk.

Batch validation hardening:

| Area | Rule | Backend source of truth | Result |
| --- | --- | --- | --- |
| Tenant reject reason | Required, 10-200 characters | Transition service + route max validation | Implemented |
| Tenant review reply | Optional, max 200 characters | Route schema + service validation | Implemented |

Helper extraction pada reason field dan review reply field menurunkan advisory dari 102 menjadi 101 tanpa mengubah status transition, ownership, atau public API contract.

Kandidat yang selesai pada batch backend 19 Juni 2026:

| File | Function | Before | Result |
| --- | --- | ---: | --- |
| `backend/src/scripts/backfill.ts` | `backfill` | 44 | Resolved melalui helper extraction; urutan query tetap |
| `backend/src/services/tenantProperty/dashboardStats.ts` | `buildRevenueTrend` | 35 | Resolved melalui formatter dan map helper |
| `backend/src/services/categoryService.ts` | `findCategoryPage` | 16 | Resolved melalui query helper |
| `backend/src/services/categoryService.ts` | `updateCategory` | 18 | Resolved melalui DTO builder; ownership flow dan query order tetap |

Kandidat backend yang dipertahankan: 7 HIGH dan 1 MEDIUM. Tidak ada kandidat SAFE tersisa setelah extraction pure helper.

Kandidat yang selesai pada batch USER-only saved-property:

| File | Function | Before | Result |
| --- | --- | ---: | --- |
| `frontend/src/pages/tenant/reviews/ReviewsSkeleton.tsx` | `ReviewsSkeleton` | 22 | Resolved |
| `frontend/src/components/tenant/room-form/RoomImageDropzone.tsx` | `RoomImageDropzone` | 17 | Resolved |
| `frontend/src/pages/tenant/reports/ReportOrdersCard.tsx` | `ReportOrdersList` | 16 | Resolved |
| `frontend/src/pages/tenant/tenant-dashboard/TenantDashboardHeader.tsx` | `TenantDashboardHeader` | 16 | Resolved |
| `frontend/src/components/tenant/room-form/RoomGalleryGrid.tsx` | `RoomGalleryGrid` | 16 | Resolved |

Kandidat yang selesai pada batch saved-property/navigation:

| File | Function | Before | Result |
| --- | --- | ---: | --- |
| `frontend/src/pages/tenant/properties-list/PropertiesHeader.tsx` | `PropertiesHeader` | 20 | Resolved |
| `frontend/src/pages/tenant/rooms-page/RoomsListSection.tsx` | `RoomsListSection` | 20 | Resolved |
| `frontend/src/pages/tenant/reports/ReportOrdersCard.tsx` | `ReportOrdersCard` | 19 | Resolved |
| `frontend/src/pages/tenant/reviews/ReviewsHeader.tsx` | `ReviewsHeader` | 16 | Resolved |
| `frontend/src/pages/tenant/reviews/TenantReviewCard.tsx` | `TenantReviewCard` | 16 | Resolved |

Kandidat yang selesai pada batch 18 Juni 2026:

| File | Function | Before | Result |
| --- | --- | ---: | --- |
| `frontend/src/pages/tenant/categories/CategoriesHeader.tsx` | `CategoriesHeader` | 22 | Resolved |
| `frontend/src/pages/tenant/reports/ReportsContent.tsx` | `ReportsContent` | 21 | Resolved |
| `frontend/src/pages/tenant/reports/ReportOrderItem.tsx` | `ReportOrderItem` | 20 | Resolved |
| `frontend/src/pages/tenant/reports/KPICard.tsx` | `KPICard` | 19 | Resolved |
| `frontend/src/pages/tenant/reports/ReportsFilterPanel.tsx` | `ReportsFilterPanel` | 18 | Resolved |

Tabel rinci di bawah adalah snapshot kandidat historis 17 Juni 2026 untuk traceability, bukan daftar aktual. Daftar aktual authoritative selalu berasal dari `npm run audit:functions`.

| File | Function | Lines | Domain |
| --- | --- | ---: | --- |
| `frontend/src/pages/tenant/categories/CategoryFormModal.tsx:20` | `CategoryFormModal` | 119 | frontend |
| `frontend/src/pages/tenant/property-form/PropertyImageField.tsx:6` | `PropertyImageField` | 104 | frontend |
| `frontend/src/hooks/tenant/room-form/useRoomImageField.ts:21` | `useRoomImageField` | 100 | frontend |
| `frontend/src/pages/user/BookingDetailPage.tsx:12` | `BookingDetailPage` | 89 | frontend |
| `frontend/src/components/common/ImageCropperModal.tsx:44` | `ImageCropperModal` | 88 | frontend |
| `frontend/src/pages/user/orders/UserOrdersContent.tsx:16` | `UserOrdersContent` | 82 | frontend |
| `frontend/src/components/property/ReservationPanel.tsx:13` | `ReservationPanel` | 73 | frontend |
| `frontend/src/pages/tenant/vouchers/AssignVoucherModal.tsx:14` | `AssignVoucherModal` | 70 | frontend |
| `frontend/src/components/tenant/room-form/RoomFormFields.tsx:28` | `RoomFormFields` | 69 | frontend |
| `frontend/src/pages/tenant/categories/CategoryListView.tsx:65` | `CategoryListView` | 65 | frontend |
| `frontend/src/pages/user/PropertyDetailPage.tsx:26` | `PropertyDetailView` | 60 | frontend |
| `frontend/src/pages/user/saved-properties/SavedPropertyCard.tsx:14` | `SavedPropertyCard` | 60 | frontend |
| `frontend/src/pages/user/orders/BookingPropertySummary.tsx:6` | `BookingPropertySummary` | 59 | frontend |
| `frontend/src/pages/user/orders/BookingPaymentPanel.tsx:7` | `BookingPaymentPanel` | 58 | frontend |
| `frontend/src/pages/tenant/property-form/PropertyBasicFields.tsx:119` | `RentalTypeField` | 55 | frontend |
| `frontend/src/pages/tenant/rooms-page/RoomsSummary.tsx:10` | `RoomsSummary` | 55 | frontend |
| `frontend/src/hooks/user/reviews/useUserReviewsState.ts:36` | `useReviewOrders` | 54 | frontend |
| `frontend/src/pages/tenant/property-form/PropertyBasicFields.tsx:65` | `CategoryField` | 53 | frontend |
| `frontend/src/pages/user/PaymentSuccessPage.tsx:6` | `PaymentSuccessPage` | 52 | frontend |
| `frontend/src/pages/user/orders/BookingStatusTimeline.tsx:5` | `BookingStatusTimeline` | 50 | frontend |
| `frontend/src/pages/tenant/vouchers/TenantVoucherList.tsx:14` | `TenantVoucherList` | 48 | frontend |
| `frontend/src/components/property/PropertyGallery.tsx:11` | `PropertyGallery` | 47 | frontend |
| `frontend/src/pages/tenant/property-form/PropertyLocationFields.tsx:7` | `PropertyLocationFields` | 47 | frontend |
| `frontend/src/pages/user/property-detail/PropertyRoomsSection.tsx:35` | `RoomList` | 47 | frontend |
| `frontend/src/components/tenant/room-form/RoomImageField.tsx:19` | `RoomImageField` | 46 | frontend |
| `frontend/src/components/user/profile/ProfileInfoFields.tsx:20` | `CustomerFields` | 46 | frontend |
| `frontend/src/pages/tenant/PropertiesListPage.tsx:14` | `PropertiesListPage` | 46 | frontend |
| `frontend/src/pages/tenant/property-form/PropertyBasicFields.tsx:15` | `PropertyBasicFields` | 46 | frontend |
| `backend/src/scripts/backfill.ts:11` | `backfill` | 44 | backend |
| `frontend/src/hooks/useSavedProperties.ts:54` | `useSavedPropertyActions` | 43 | frontend |
| `frontend/src/pages/tenant/RoomsPage.tsx:14` | `RoomsPageLayout` | 41 | frontend |
| `frontend/src/hooks/user/orders/useUserOrders.ts:43` | `useUserOrderFilters` | 40 | frontend |
| `frontend/src/hooks/tenant/orders/useTenantOrderActions.ts:14` | `useTenantOrderActions` | 38 | frontend |
| `frontend/src/pages/user/booking/ReservationStepper.tsx:13` | `ReservationStepper` | 38 | frontend |
| `frontend/src/components/tenant/orders-table/OrdersTableCells.tsx:48` | `OrderStatusCell` | 36 | frontend |
| `frontend/src/pages/user/booking/ManualProofUpload.tsx:11` | `ManualProofUpload` | 36 | frontend |
| `backend/src/services/tenantProperty/dashboardStats.ts:35` | `buildRevenueTrend` | 35 | backend |
| `frontend/src/pages/tenant/rooms-page/RoomsPageHeader.tsx:12` | `RoomsPageHeader` | 35 | frontend |
| `frontend/src/pages/user/UserDashboardPage.tsx:13` | `UserDashboardPage` | 35 | frontend |
| `frontend/src/components/tenant/occupancy-calendar/OccupancyCell.tsx:32` | `OccupancyCell` | 34 | frontend |
| `frontend/src/hooks/tenant/orders/useTenantOrders.ts:9` | `useTenantOrders` | 34 | frontend |
| `backend/src/services/order/tenantRefundCompletion.ts:5` | `markRefundComplete` | 33 | backend |
| `frontend/src/pages/tenant/rooms-page/RoomsFormSection.tsx:19` | `RoomsFormSection` | 33 | frontend |
| `frontend/src/pages/tenant/tenant-dashboard/TenantRevenuePanel.tsx:14` | `TenantRevenuePanel` | 33 | frontend |
| `frontend/src/hooks/user/orders/useUserOrders.ts:11` | `useUserOrders` | 31 | frontend |
| `frontend/src/pages/user/HomePage.tsx:149` | `PromosCta` | 31 | frontend |
| `frontend/src/hooks/tenant/categories/useCategoryForm.ts:10` | `useCategoryForm` | 30 | frontend |
| `frontend/src/hooks/tenant/orders/useTenantOrders.ts:62` | `useFetchTenantOrders` | 30 | frontend |
| `frontend/src/hooks/user/orders/useUserOrders.ts:84` | `useFetchUserOrders` | 30 | frontend |
| `backend/src/services/order/userCancelOrder.ts:6` | `cancelUserOrder` | 29 | backend |
| `frontend/src/components/tenant/peak-rates/PeakRatePreview.tsx:10` | `PeakRatePreview` | 29 | frontend |
| `frontend/src/components/user/profile/ProfileInfoFields.tsx:67` | `TenantFields` | 29 | frontend |
| `frontend/src/lib/cropImage.ts:17` | `getCroppedImg` | 29 | frontend |
| `frontend/src/pages/user/orders/BookingDetailHeader.tsx:8` | `BookingDetailHeader` | 29 | frontend |
| `backend/src/services/orderService.ts:38` | `executeOrderTransaction` | 28 | backend |
| `backend/src/services/tenantReport/occupancyQuery.ts:6` | `findOccupancyCalendar` | 28 | backend |
| `frontend/src/components/common/navbar/ProfileDropdown.tsx:20` | `ProfileDropdownLinks` | 28 | frontend |
| `frontend/src/hooks/user/reviews/useUserReviewsState.ts:8` | `useUserReviewsState` | 27 | frontend |
| `frontend/src/pages/tenant/property-form/FormFields.tsx:44` | `TextAreaField` | 27 | frontend |
| `frontend/src/components/user/order-card/MidtransPaymentActions.tsx:17` | `MidtransPaymentActions` | 26 | frontend |
| `frontend/src/hooks/contact/useContactForm.ts:10` | `useContactForm` | 26 | frontend |
| `frontend/src/pages/tenant/CategoriesPage.tsx:17` | `CategoryPageView` | 26 | frontend |
| `backend/src/services/propertyDetail/roomStatus.ts:39` | `buildRoomStatus` | 25 | backend |
| `frontend/src/hooks/tenant/vouchers/useTenantVouchersPage.ts:7` | `useTenantVouchersPage` | 25 | frontend |
| `frontend/src/pages/tenant/property-form/FormFields.tsx:18` | `TextField` | 25 | frontend |
| `backend/src/services/tenantProperty/tenantPropertyFilters.ts:22` | `buildPropertyCreateData` | 24 | backend |
| `frontend/src/components/user/booking-summary/IncompleteProfileNotice.tsx:5` | `IncompleteProfileNotice` | 24 | frontend |
| `frontend/src/hooks/user/booking/useBookingCheckout.ts:53` | `reserveOrder` | 24 | frontend |
| `frontend/src/components/tenant/OrderMobileCard.tsx:23` | `OrderMobileHeader` | 23 | frontend |
| `frontend/src/components/tenant/orders-table/OrdersTableRow.tsx:13` | `OrdersTableRow` | 23 | frontend |
| `frontend/src/components/user/search/CityField.tsx:15` | `CityField` | 23 | frontend |
| `frontend/src/pages/tenant/DashboardPage.tsx:10` | `DashboardPage` | 23 | frontend |
| `frontend/src/components/property/InlineAvailabilitySection.tsx:21` | `InlineAvailabilitySection` | 22 | frontend |
| `frontend/src/components/tenant/peak-rates/PeakRateValueInput.tsx:9` | `PeakRateValueInput` | 22 | frontend |
| `frontend/src/pages/tenant/categories/CategoriesHeader.tsx:8` | `CategoriesHeader` | 22 | frontend |
| `frontend/src/pages/tenant/reviews/ReviewsSkeleton.tsx:3` | `ReviewsSkeleton` | 22 | frontend |
| `frontend/src/pages/tenant/reviews/TenantReviewsContent.tsx:11` | `TenantReviewsContent` | 22 | frontend |
| `frontend/src/pages/user/profile/ProfileContent.tsx:12` | `ProfileContent` | 22 | frontend |
| `backend/src/services/categoryService.ts:64` | `listCategories` | 21 | backend |
| `frontend/src/hooks/tenant/property-form/usePropertyFormState.ts:67` | `usePropertyFormLoader` | 21 | frontend |
| `frontend/src/pages/tenant/orders/TenantOrdersContent.tsx:13` | `TenantOrdersContent` | 21 | frontend |
| `frontend/src/pages/tenant/reports/ReportsContent.tsx:6` | `ReportsContent` | 21 | frontend |
| `frontend/src/pages/tenant/vouchers/TenantVoucherForm.tsx:43` | `VoucherDiscountFields` | 21 | frontend |
| `frontend/src/pages/user/orders/UserCancelOrderModal.tsx:5` | `UserCancelOrderModal` | 21 | frontend |
| `frontend/src/pages/user/orders/UserOrdersFilter.tsx:123` | `FilterButtons` | 21 | frontend |
| `frontend/src/pages/user/property-detail/PropertyRoomsSection.tsx:83` | `WholeUnit` | 21 | frontend |
| `backend/src/services/orderService.ts:141` | `buildOrderCreateData` | 20 | backend |
| `backend/src/services/tenantReport/occupancyQuery.ts:35` | `mergeAvailabilityToRanges` | 20 | backend |
| `backend/src/validations/voucherValidation.ts:27` | `validateVoucherRules` | 20 | backend |
| `frontend/src/hooks/auth/login/useLoginPageState.ts:109` | `handleGoogleSuccess` | 20 | frontend |
| `frontend/src/pages/tenant/properties-list/PropertiesHeader.tsx:6` | `PropertiesHeader` | 20 | frontend |
| `frontend/src/pages/tenant/reports/ReportOrderItem.tsx:6` | `ReportOrderItem` | 20 | frontend |
| `frontend/src/pages/tenant/rooms-page/RoomsListSection.tsx:16` | `RoomsListSection` | 20 | frontend |
| `frontend/src/pages/user/orders/UserOrdersFilter.tsx:39` | `FilterFields` | 20 | frontend |
| `backend/src/services/orderService.ts:67` | `syncUserProfileFromBooking` | 19 | backend |
| `frontend/src/components/user/order-card/OrderPaymentInfo.tsx:7` | `OrderPaymentInfo` | 19 | frontend |
| `frontend/src/pages/tenant/property-form/PropertyFormHeader.tsx:5` | `PropertyFormHeader` | 19 | frontend |
| `frontend/src/pages/tenant/reports/KPICard.tsx:10` | `KPICard` | 19 | frontend |
| `frontend/src/pages/tenant/reports/ReportOrdersCard.tsx:7` | `ReportOrdersCard` | 19 | frontend |
| `frontend/src/pages/user/booking/ReservationStepperActions.tsx:35` | `NextButton` | 19 | frontend |
| `backend/src/services/categoryService.ts:98` | `updateCategory` | 18 | backend |
| `backend/src/services/tenantPropertyService.ts:86` | `updateProperty` | 18 | backend |
| `frontend/src/components/tenant/occupancy-calendar/OccupancyCell.tsx:13` | `getCellAppearance` | 18 | frontend |
| `frontend/src/hooks/user/property-detail/usePropertyDetailPageState.ts:35` | `usePropertyDetailAuth` | 18 | frontend |
| `frontend/src/pages/tenant/categories/CategoryListView.tsx:16` | `DefaultBadge` | 18 | frontend |
| `frontend/src/pages/tenant/reports/ReportsFilterPanel.tsx:23` | `ReportsFilterPanel` | 18 | frontend |
| `frontend/src/pages/user/booking/ManualProofUpload.tsx:80` | `ProofPreview` | 18 | frontend |
| `frontend/src/components/common/ConfirmModal.tsx:34` | `ConfirmModalBody` | 17 | frontend |
| `frontend/src/components/tenant/room-form/RoomImageDropzone.tsx:10` | `RoomImageDropzone` | 17 | frontend |
| `frontend/src/hooks/rooms/useRoomSubmit.ts:8` | `useRoomSubmit` | 17 | frontend |
| `frontend/src/hooks/tenant/peak-season/usePeakSeasonRateModal.ts:12` | `usePeakSeasonRateModal` | 17 | frontend |
| `frontend/src/hooks/user/profile/useAvatarUpload.ts:23` | `useAvatarCropActions` | 17 | frontend |
| `frontend/src/pages/auth/register/RegisterForm.tsx:8` | `RegisterForm` | 17 | frontend |
| `frontend/src/pages/tenant/property-form/PropertySubmitButton.tsx:4` | `PropertySubmitButton` | 17 | frontend |
| `frontend/src/pages/user/booking/ReservationStepContent.tsx:86` | `SummaryStep` | 17 | frontend |
| `frontend/src/pages/user/orders/UserOrdersFilter.tsx:21` | `UserOrdersFilter` | 17 | frontend |
| `frontend/src/pages/user/profile/AvatarUploadSection.tsx:8` | `AvatarUploadSection` | 17 | frontend |
| `frontend/src/components/common/ImageCropperModal.tsx:27` | `EasyCropper` | 16 | frontend |
| `frontend/src/components/property/InlineDatePicker.tsx:17` | `InlineDatePicker` | 16 | frontend |
| `frontend/src/components/tenant/peak-rates/PeakRateForm.tsx:9` | `PeakRateForm` | 16 | frontend |
| `frontend/src/components/tenant/room-form/RoomFormFields.tsx:11` | `QuantityField` | 16 | frontend |
| `frontend/src/components/tenant/room-form/RoomGalleryGrid.tsx:14` | `RoomGalleryGrid` | 16 | frontend |
| `frontend/src/components/tenant/room-form/RoomGalleryGrid.tsx:74` | `GalleryIconButton` | 16 | frontend |
| `frontend/src/components/ui/Button.tsx:28` | `Button` | 16 | frontend |
| `frontend/src/hooks/auth/reset-password/resetPasswordActions.ts:14` | `resetPasswordAction` | 16 | frontend |
| `frontend/src/hooks/tenant/orders/useTenantOrderActions.ts:22` | `confirmRefundComplete` | 16 | frontend |
| `frontend/src/hooks/user/property-detail/propertyDetailAccess.ts:21` | `isSelectedRangeUnavailable` | 16 | frontend |
| `frontend/src/pages/auth/reset-password/ResetPasswordField.tsx:14` | `ResetPasswordField` | 16 | frontend |
| `frontend/src/pages/tenant/peak-season/PeakSeasonModalLayer.tsx:13` | `PeakRateModal` | 16 | frontend |
| `frontend/src/pages/tenant/reports/ReportOrdersCard.tsx:27` | `ReportOrdersList` | 16 | frontend |
| `frontend/src/pages/tenant/reviews/ReviewsHeader.tsx:4` | `ReviewsHeader` | 16 | frontend |
| `frontend/src/pages/tenant/reviews/TenantReviewCard.tsx:10` | `TenantReviewCard` | 16 | frontend |
| `frontend/src/pages/tenant/tenant-dashboard/RevenueTrendChart.tsx:22` | `RevenueTrendCanvas` | 16 | frontend |
| `frontend/src/pages/tenant/tenant-dashboard/TenantDashboardHeader.tsx:4` | `TenantDashboardHeader` | 16 | frontend |
| `frontend/src/pages/user/booking/GuestIdentityForm.tsx:39` | `GuestIdentityField` | 16 | frontend |
| `frontend/src/pages/user/orders/UserOrdersFilter.tsx:91` | `StatusField` | 16 | frontend |
| `frontend/src/pages/user/UserReviewsPage.tsx:14` | `UserReviewsPage` | 16 | frontend |

## Legacy Folder Cleanup Audit

| Folder | Used? | Import Found? | Recommendation |
| --- | --- | --- | --- |
| `frontend/src/hooks/tenant/occupancy` | Tidak | Tidak | Dihapus 22 Juni 2026 |
| `frontend/src/pages/tenant/occupancy` | Tidak | Tidak | Dihapus 22 Juni 2026 |
| `frontend/src/components/tenant/occupancy-calendar` | Ya | Ya | DO NOT DELETE |
| `/tenant/occupancy` route | Ya, redirect ke `/tenant/property-report` | Ya | DO NOT DELETE tanpa keputusan UX |

## Legacy / Orphan Classification

### CLEANUP COMPLETED

- `frontend/src/hooks/tenant/occupancy`: folder kosong dihapus.
- `frontend/src/pages/tenant/occupancy`: folder kosong dihapus.

### MAYBE DELETE

- Legacy REST alias setelah regression test menyeluruh.
- Legacy referral/voucher nominal schema/data hanya setelah audit database dan konfirmasi migration.

### DO NOT DELETE

- `frontend/src/components/tenant/occupancy-calendar`: masih dipakai pada property report.
- `backend/src/services/tenantReport/occupancyQuery.ts`: masih dipakai oleh report service.
- Route `/tenant/occupancy`: masih menjadi redirect/backward-compatible path.

## REST API Guidelines

Status: jalur utama cukup baik.

Endpoint resource-oriented yang digunakan:

- `GET /api/users/me/orders`
- `PATCH /api/users/me`
- `POST /api/users/me/email-change-requests`
- `GET /api/tenants/me/orders`
- `GET /api/tenants/me/properties`
- `POST /api/tenants/me/properties`
- `GET /api/tenants/me/properties/:propertyId/rooms`
- `POST /api/tenants/me/rooms/:roomId/availability-ranges`
- `GET /api/tenants/me/reports`
- `GET /api/tenants/me/reports/occupancy`
- `POST /api/orders/:id/payments`
- `POST /api/orders/:id/status-transitions`
- `POST /api/orders/:id/cancellations`
- `POST /api/reviews/:reviewId/replies`
- `GET /api/locations/geocodes`
- `GET /api/locations/reverse-geocodes`

## Legacy Alias REST

Status: masih aktif, bukan blocker runtime.

| Endpoint | Catatan | Rekomendasi |
| --- | --- | --- |
| `GET /api/orders/user` | Legacy alias | Gunakan `GET /api/users/me/orders` |
| `GET /api/orders/tenant` | Legacy alias | Gunakan `GET /api/tenants/me/orders` |
| `POST /api/orders/:id/payment-attempts` | Legacy alias | Gunakan `POST /api/orders/:id/payments` |
| `PATCH /api/orders/:id/status` | Shortcut lama | Gunakan `POST /api/orders/:id/status-transitions` |
| `POST /api/reviews/:reviewId/reply` | Legacy alias | Gunakan `POST /api/reviews/:reviewId/replies` |
| `POST /api/tenants/me/rooms/:roomId/availability/range` | Legacy alias | Gunakan `POST /api/tenants/me/rooms/:roomId/availability-ranges` |
| `PATCH /api/tenants/me/rooms/:roomId/images/:imageId/main` | Pseudo-action | Gunakan `PATCH /images/:imageId` dengan body `is_main` jika sudah aman |

## Area REST yang Terdampak Hardening

| Area | Dampak REST |
| --- | --- |
| Booking creation | Order dibuat pada tahap `Lanjut ke Pembayaran`; tidak perlu endpoint baru |
| Payment window | Status order tetap memakai resource order/payment yang ada |
| Manual confirmation window | Cron/backend source of truth; UI hanya menampilkan status |
| Referral removal | Selesai pada source flow aktif; `referral_code` tidak lagi digunakan pada booking/voucher/dashboard/reward |
| Voucher simplification | Source flow aktif hanya menerima `PERCENTAGE` dan `FREE_NIGHTS` |
| Voucher free nights | Backend menghitung `discountedNights = min(freeNights, stayNights)`, menggratiskan malam termurah jika breakdown tersedia, dan zero-payment langsung `PROCESSED` |
| Domicile removal | Tidak ditemukan pada source aktif |
| Room max 5 dan stock max 20 | Backend menjadi source of truth, frontend hanya UX guard |
| Tenant category max 5 | Backend menghitung hanya kategori milik tenant, mengunci create per tenant, dan mengirim metadata quota; frontend disable tombol tambah |
| Persistent token blacklist | Tidak mengubah public REST contract |
| Login attempt guard | Tidak mengubah public REST contract |
| Explore search query consistency | Frontend memakai helper query Explore yang sama; backend endpoint tetap `GET /api/properties` |

## Rekomendasi

1. Lanjutkan function-length refactor per batch kecil, mulai dari presentational UI yang aman.
2. Jangan memecah function hanya demi angka jika readability memburuk.
3. Pertahankan route `/tenant/occupancy` sampai keputusan UX/compatibility berubah.
4. Jangan hapus legacy REST alias sebelum frontend dan QA benar-benar aman.
5. PII/data minimization pada list order/report tetap menjadi prioritas P1.

## Kesimpulan

Clean code membaik: tidak ada file source aktif >200 baris, residue type/log/debug bersih, dan function advisory turun menjadi 100 kandidat. Reject reason dan review reply validation konsisten pada frontend/backend tanpa mengubah ownership atau API contract. Dua folder occupancy kosong sudah dibersihkan, sedangkan route redirect dan komponen aktif tetap dipertahankan. Kandidat backend tersisa sengaja dipertahankan karena risikonya; pekerjaan lanjutan utama adalah PII minimization dan REST legacy alias cleanup setelah regression test.
