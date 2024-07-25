import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newMessageAlert: localStorage.getItem("new_message_alert")
    ? JSON.parse(localStorage.getItem("new_message_alert"))
    : [{ chatId: "", count: 0 }],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setNewMessageAlert(state, action) {
      const { sender } = action.payload;

      const index = state.newMessageAlert.findIndex(
        (item) => item.chatId === sender
      );

      if (index !== -1) {
        state.newMessageAlert[index].count += 1;
      } else {
        state.newMessageAlert.push({ chatId: sender, count: 1 });
      }
    },

    removeNewMessagesAlert(state, action) {
      state.newMessageAlert = state.newMessageAlert.filter(
        (item) => item.chatId !== action.payload
      );
    },
  },
});

export const { removeNewMessagesAlert, setNewMessageAlert } = chatSlice.actions;
export default chatSlice.reducer;
