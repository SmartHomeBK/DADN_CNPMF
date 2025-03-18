import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "./../Backend/config/.env" });
const AIO_USERNAME = process.env.AIO_USERNAME;
console.log("AIO_USERNAME: ", process.env.AIO_USERNAME);
const AIO_KEY = process.env.AIO_KEY;
const BASE_URL = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds`;

// Header xác thực với AIO Key
const headers = {
  "X-AIO-Key": AIO_KEY,
  "Content-Type": "application/json",
};
export const getEnvironmentValues = async (req, res) => {
  try {
    const [humidRes, tempRes, lightRes] = await Promise.all([
      axios.get(`${BASE_URL}/humid`, { headers }),
      axios.get(`${BASE_URL}/temperature`, { headers }),
      axios.get(`${BASE_URL}/light`, { headers }),
    ]);

    // Destructure lấy dữ liệu cần
    const { last_value: humid } = humidRes.data;
    const { last_value: temp } = tempRes.data;
    const { last_value: light } = lightRes.data;
    console.log("data from getHumid: ", humid, temp, light);
    // Gửi response về client
    res.json({ humid, temp, light });
  } catch (error) {
    console.error(
      "Error fetching humid data:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch humid data" });
  }
};
