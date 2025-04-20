import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

export const chatWithAI = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/chatbot/chat`, {
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error in chatWithAI:", error);
    throw error;
  }
};
