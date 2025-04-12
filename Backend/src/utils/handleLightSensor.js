import Sensor from "../models/sensor.model.js";

export const handleLightSensor = async () => {
  console.log(
    "hàm để xử lý giá trị của light có vượt ngưỡng min-max của sensor cảm biến ánh sáng hay không"
  );
  const type_sensor = ["Light", "Temperature"];
  const sensors = await Sensor.find({
    type: { $in: type_sensor },
  });
  console.log("Sensors: ", sensors);
};
