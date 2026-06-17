import type { FC } from "react";
import { useRoomsPageState, type RoomsPageState } from "@/hooks/rooms/useRoomsPageState";
import { RoomsFormSection } from "./rooms-page/RoomsFormSection";
import { RoomsListSection } from "./rooms-page/RoomsListSection";
import { RoomsModals } from "./rooms-page/RoomsModals";
import { RoomsPageHeader } from "./rooms-page/RoomsPageHeader";
import { RoomsSummary } from "./rooms-page/RoomsSummary";

const RoomsPage: FC = () => {
  const page = useRoomsPageState();
  return <RoomsPageLayout {...page} />;
};

const RoomsPageLayout: FC<RoomsPageLayoutProps> = ({ deleteActions, handleToggleForm, handleCloseForm, isWholeUnit, navigate, state }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-7xl">
      <RoomsPageHeader 
        onBack={() => navigate("/tenant/properties")} 
        propertyName={state.property?.name} 
        onAdd={handleToggleForm} 
        isWholeUnit={isWholeUnit} 
        canAddRoom={state.rooms.length < 5}
      />
      
      <RoomsSummary rooms={state.rooms} />

      <div className="mt-8">
        <RoomsListSection 
          rooms={state.rooms} 
          isWholeUnit={isWholeUnit} 
          loading={state.loading} 
          onDelete={deleteActions.handleDelete} 
          handleEdit={state.handleEdit} 
          handleOpenAvailModal={state.handleOpenAvailModal} 
        />
      </div>

      <RoomsFormSection 
        showForm={state.showForm} 
        isWholeUnit={isWholeUnit} 
        form={state.form} 
        editingRoom={state.editingRoom} 
        isSavingRoom={state.isSavingRoom}
        setForm={state.setForm} 
        handleSubmit={state.handleSubmit} 
        fetchRooms={state.fetchRooms} 
        setEditingRoom={state.setEditingRoom} 
        onClose={handleCloseForm}
      />
      
      <RoomsModals {...state} {...deleteActions} onDeleteRate={deleteActions.handleDeletePeakRate} />
    </div>
  </div>
);

type RoomsPageLayoutProps = RoomsPageState;

export default RoomsPage;
