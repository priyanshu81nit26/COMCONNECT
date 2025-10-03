import axios from "axios";
import { API_URL } from "../config/api.config";

export const fetchChats = async (token, workspaceId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const { data } = await axios.get(
      `${API_URL}/chat/workspace/${workspaceId}/chats`,
      config
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchMessages = async (chatId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const { data } = await axios.get(`${API_URL}/message/${chatId}`, config);
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendMessage = async (content, chatId, token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const { data } = await axios.post(
      `${API_URL}/message`,
      {
        content,
        chatId,
      },
      config
    );
    return data;
  } catch (error) {
    throw error;
  }
};
