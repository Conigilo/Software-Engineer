import React, { useState } from 'react';
import { View } from 'react-native';
import {
  AdminWebPortalProps,
  AdminModalType,
  AdminSlotKey,
} from './types';
import { adminStyles as styles } from './styles/admin.styles';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { AdminModals } from './modals/AdminModals';
import { VenueManagePage } from './pages/VenueManagePage';
import { RequestReviewPage } from './pages/RequestReviewPage';
import { RequestsListPage } from './pages/RequestsListPage';

export { type AdminPage } from './types';

export function AdminWebPortal({
  page,
  setPage,
  venues,
  onUpdateVenueSlots,
  requestsData,
  selectedRequest,
  onSelectRequest,
  onReviewRequest,
  onLogout,
}: AdminWebPortalProps) {
  const [activeModal, setActiveModal] = useState<AdminModalType>(null);

  // Venue Management state
  const [venueSearch, setVenueSearch] = useState('');
  const [venueDate, setVenueDate] = useState('18 พฤศจิกายน 2569');
  const [editingVenueId, setEditingVenueId] = useState<string>('v-1');
  const [editingSlotKey, setEditingSlotKey] = useState<AdminSlotKey>('08:00 – 12:00 น.');
  const [editingSlotVal, setEditingSlotVal] = useState<'ว่าง' | 'ไม่ว่าง'>('ว่าง');
  const [uploadedVenueImg, setUploadedVenueImg] = useState<string | null>(null);

  // Requests List state
  const [reqStatusFilter, setReqStatusFilter] = useState<
    'ทั้งหมด' | 'รอตรวจสอบ' | 'อนุมัติแล้ว' | 'ส่งกลับแก้ไข'
  >('ทั้งหมด');
  const [reqSearch, setReqSearch] = useState('');
  const [reqDateFilter, setReqDateFilter] = useState('ทั้งหมด');
  const [reqSort, setReqSort] = useState<'ส่งล่าสุดก่อน' | 'ส่งเก่าสุดก่อน'>('ส่งล่าสุดก่อน');

  // Review Request state
  const [checkDoc, setCheckDoc] = useState(true);
  const [checkInfo, setCheckInfo] = useState(true);
  const [checkVenue, setCheckVenue] = useState(true);
  const [adminNote, setAdminNote] = useState('');
  const [docPage, setDocPage] = useState<1 | 2>(1);

  const editingVenue = venues.find((v) => v.id === editingVenueId) || venues[0];
  const currentReq = selectedRequest || requestsData.requests[0];
  const counts = requestsData.counts || { pending: 8, approved: 24, returned: 3, total: 35 };

  const filteredRequests = requestsData.requests.filter((r) => {
    if (reqStatusFilter !== 'ทั้งหมด' && r.status !== reqStatusFilter) return false;
    if (reqDateFilter !== 'ทั้งหมด' && r.submitted_date !== reqDateFilter) return false;
    if (reqSearch.trim() !== '') {
      const q = reqSearch.trim().toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.organizer.toLowerCase().includes(q) ||
        r.request_code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sortedRequests =
    reqSort === 'ส่งเก่าสุดก่อน' ? [...filteredRequests].reverse() : filteredRequests;

  const handleSelectVenueSlotCell = (
    venue: any,
    slotLabel: AdminSlotKey,
    currentVal: 'ว่าง' | 'ไม่ว่าง'
  ) => {
    setEditingVenueId(venue.id);
    setEditingSlotKey(slotLabel);
    setEditingSlotVal(currentVal);
  };

  const handleSaveVenueAvailability = async () => {
    if (!editingVenue) return;
    const payload: any = { updated_date: venueDate };
    if (editingSlotKey === '08:00 – 12:00 น.') payload.slot_morning = editingSlotVal;
    if (editingSlotKey === '12:00 – 16:00 น.') payload.slot_afternoon = editingSlotVal;
    if (editingSlotKey === '16:00 – 20:00 น.') payload.slot_evening = editingSlotVal;
    if (uploadedVenueImg) payload.image = uploadedVenueImg;

    await onUpdateVenueSlots(editingVenue.id, payload);
    setActiveModal('venue_saved_modal');
  };

  const handleConfirmApprove = async () => {
    if (!currentReq) return;
    await onReviewRequest(currentReq.id, {
      status: 'อนุมัติแล้ว',
      admin_note: adminNote,
      check_doc: checkDoc,
      check_info: checkInfo,
      check_venue: checkVenue,
    });
    setActiveModal('approved_done');
  };

  const handleConfirmReturn = async () => {
    if (!currentReq) return;
    const noteToUse =
      adminNote.trim() || 'กรุณาตรวจสอบวัน เวลา และสถานที่ให้ตรงกับเอกสาร';
    setAdminNote(noteToUse);
    await onReviewRequest(currentReq.id, {
      status: 'ส่งกลับแก้ไข',
      admin_note: noteToUse,
      check_doc: checkDoc,
      check_info: checkInfo,
      check_venue: checkVenue,
    });
    setActiveModal('returned_done');
  };

  return (
    <View style={styles.adminLayout}>
      <AdminSidebar
        page={page}
        setPage={setPage}
        pendingCount={counts.pending ?? 8}
        onOpenModal={setActiveModal}
      />
      <View style={styles.mainColumn}>
        <AdminHeader
          page={page}
          setPage={setPage}
          hasPending={(counts.pending ?? 0) > 0}
        />

        {page === 'venues' ? (
          <VenueManagePage
            venues={venues}
            venueSearch={venueSearch}
            setVenueSearch={setVenueSearch}
            venueDate={venueDate}
            editingVenueId={editingVenueId}
            setEditingVenueId={setEditingVenueId}
            editingVenue={editingVenue}
            editingSlotKey={editingSlotKey}
            editingSlotVal={editingSlotVal}
            setEditingSlotVal={setEditingSlotVal}
            uploadedVenueImg={uploadedVenueImg}
            onSelectVenueSlotCell={handleSelectVenueSlotCell}
            onSaveVenueAvailability={handleSaveVenueAvailability}
            setActiveModal={setActiveModal}
          />
        ) : page === 'review' && currentReq ? (
          <RequestReviewPage
            currentReq={currentReq}
            setPage={setPage}
            setActiveModal={setActiveModal}
            docPage={docPage}
            setDocPage={setDocPage}
            checkDoc={checkDoc}
            setCheckDoc={setCheckDoc}
            checkInfo={checkInfo}
            setCheckInfo={setCheckInfo}
            checkVenue={checkVenue}
            setCheckVenue={setCheckVenue}
            adminNote={adminNote}
            setAdminNote={setAdminNote}
          />
        ) : (
          <RequestsListPage
            counts={counts}
            sortedRequests={sortedRequests}
            reqStatusFilter={reqStatusFilter}
            setReqStatusFilter={setReqStatusFilter}
            reqSearch={reqSearch}
            setReqSearch={setReqSearch}
            reqDateFilter={reqDateFilter}
            reqSort={reqSort}
            setActiveModal={setActiveModal}
            onSelectRequest={onSelectRequest}
            setAdminNote={setAdminNote}
            setPage={setPage}
          />
        )}
      </View>

      <AdminModals
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        setPage={setPage}
        currentReq={currentReq}
        adminNote={adminNote}
        setAdminNote={setAdminNote}
        docPage={docPage}
        setDocPage={setDocPage}
        onConfirmApprove={handleConfirmApprove}
        onConfirmReturn={handleConfirmReturn}
        onLogout={onLogout}
        setReqSearch={setReqSearch}
        setReqDateFilter={setReqDateFilter}
        setReqSort={setReqSort}
        venues={venues}
        editingVenue={editingVenue}
        setEditingVenueId={setEditingVenueId}
        editingSlotKey={editingSlotKey}
        setEditingSlotKey={setEditingSlotKey}
        editingSlotVal={editingSlotVal}
        setVenueDate={setVenueDate}
        setUploadedVenueImg={setUploadedVenueImg}
        onUpdateVenueSlots={onUpdateVenueSlots}
      />
    </View>
  );
}
