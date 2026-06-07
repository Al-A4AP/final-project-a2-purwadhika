import { useNavigate, useParams } from "react-router-dom";
import { useRoomsLogic } from "@/hooks/useRoomsLogic";
import { createEmptyRoomForm } from "./roomFormData";
import { isWholeUnitCategory } from "./roomCategory";
import { useRoomDeleteActions } from "./useRoomDeleteActions";

export const useRoomsPageState = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const state = useRoomsLogic(id);
  const deleteActions = useRoomDeleteActions(state);
  return buildRoomsPageState(state, navigate, deleteActions);
};

const buildRoomsPageState = (state: RoomsLogic, navigate: Navigate, deleteActions: DeleteActions) => ({
  deleteActions,
  handleCloseForm: () => closeRoomForm(state),
  handleToggleForm: () => toggleRoomForm(state),
  isWholeUnit: isWholeUnitCategory(state.property?.category?.name),
  navigate,
  state,
});

const closeRoomForm = (state: RoomsLogic) => {
  state.setShowForm(false);
  state.setEditingRoom(null);
  state.setForm(createEmptyRoomForm());
};

const toggleRoomForm = (state: RoomsLogic) => {
  state.setShowForm(!state.showForm);
  state.setEditingRoom(null);
  state.setForm(createEmptyRoomForm());
};

type RoomsLogic = ReturnType<typeof useRoomsLogic>;
type Navigate = ReturnType<typeof useNavigate>;
type DeleteActions = ReturnType<typeof useRoomDeleteActions>;
export type RoomsPageState = ReturnType<typeof useRoomsPageState>;
