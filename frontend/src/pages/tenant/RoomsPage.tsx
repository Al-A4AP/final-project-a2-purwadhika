import type { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoomsLogic } from "@/hooks/useRoomsLogic";
import { RoomsAddButton } from "./rooms-page/RoomsAddButton";
import { RoomsFormSection } from "./rooms-page/RoomsFormSection";
import { RoomsListSection } from "./rooms-page/RoomsListSection";
import { RoomsModals } from "./rooms-page/RoomsModals";
import { RoomsPageHeader } from "./rooms-page/RoomsPageHeader";
import { createEmptyRoomForm, isWholeUnitCategory } from "./rooms-page/roomsPageUtils";
import { useRoomDeleteActions } from "./rooms-page/useRoomDeleteActions";

const RoomsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const state = useRoomsLogic(id);
  const deleteActions = useRoomDeleteActions(state);
  const isWholeUnit = isWholeUnitCategory(state.property?.category?.name);

  const handleToggleForm = () => {
    state.setShowForm(!state.showForm);
    state.setEditingRoom(null);
    state.setForm(createEmptyRoomForm());
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl">
      <RoomsPageHeader onBack={() => navigate("/tenant/properties")} />
      <RoomsAddButton isVisible={!isWholeUnit} showForm={state.showForm} onClick={handleToggleForm} />
      <RoomsFormSection showForm={state.showForm} isWholeUnit={isWholeUnit} form={state.form} setForm={state.setForm} handleSubmit={state.handleSubmit} />
      <RoomsListSection rooms={state.rooms} isWholeUnit={isWholeUnit} loading={state.loading} onDelete={deleteActions.handleDelete} handleEdit={state.handleEdit} handleOpenAvailModal={state.handleOpenAvailModal} handleOpenPeakModal={state.handleOpenPeakModal} />
      <RoomsModals {...state} {...deleteActions} onDeleteRate={deleteActions.handleDeletePeakRate} />
    </div>
  );
};

export default RoomsPage;
