import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../util/http.js";
import toast from "react-hot-toast";

const ControlSensors = () => {
  const [sensors, setSensors] = useState([]);
  const [updateMax, setUpdateMax] = useState({});
  const [updateMin, setUpdateMin] = useState({});
  const [maxValueUpdated, setMaxValueUpdated] = useState({});
  const [minValueUpdated, setMinValueUpdated] = useState({});
  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },

    {
      title: "Max-value",
      dataIndex: "max_value",
      key: "max_value",
      onCell: (record, rowIndex) => ({
        onClick: () => {
          console.log("Ô Max-value được click!", record);
          setUpdateMax({ [record.type]: true });
        },
        onBlur: () => {
          console.log("bạn vào onblur");
          setUpdateMax({ [record.type]: false });
        },
      }),
      render: (_, record, index) => {
        console.log("index: ", index);
        // Đảm bảo rằng key là duy nhất cho mỗi phần tử
        return updateMax[record.type] ? (
          <form
            onSubmit={(e) =>
              handleSubmitInput(e, record.type, "MAX", record._id, index)
            }
          >
            <input
              value={
                maxValueUpdated[record.type] != undefined
                  ? maxValueUpdated[record.type]
                  : record.max_value
              }
              className="w-8 text-center"
              onChange={(e) =>
                setMaxValueUpdated({
                  [record.type]: e.target.value,
                })
              }
            />
          </form>
        ) : (
          <span>{record.max_value}</span> // Thêm key duy nhất cho span
        );
      },
    },
    {
      title: "Min-value",
      dataIndex: "min_value",
      key: "min_value",
      onCell: (record, rowIndex) => ({
        onClick: () => {
          console.log("Ô Min-value được click!", record);
          setUpdateMin({ [record.type]: true });
        },
        onBlur: () => {
          setUpdateMin({ [record.type]: false });
        },
      }),
      render: (_, record, index) => {
        // Đảm bảo rằng key là duy nhất cho mỗi phần tử
        return updateMin[record.type] ? (
          <form
            onSubmit={(e) =>
              handleSubmitInput(e, record.type, "MIN", record._id, index)
            }
          >
            <input
              value={
                minValueUpdated[record.type] != undefined
                  ? minValueUpdated[record.type]
                  : record.min_value
              }
              className="w-8 text-center"
              onChange={(e) =>
                setMinValueUpdated({
                  [record.type]: e.target.value,
                })
              }
            />
          </form>
        ) : (
          <span>{record.min_value}</span> // Thêm key duy nhất cho span
        );
      },
    },
  ];
  const fetchSensors = async () => {
    try {
      const sensorData = await axiosInstance.get("/sensors");
      console.log("sensorData: ", sensorData);
      const fetchedSensors = sensorData.data.sensors;

      setSensors(() => {
        return fetchedSensors.map((s) => ({ ...s, key: s["_id"] }));
      });
    } catch (error) {
      console.log("error in fetchSensors: ", error);
    }
  };
  useEffect(() => {
    fetchSensors();
  }, []);
  const handleSubmitInput = async (e, name, type, _id, index) => {
    try {
      e.preventDefault();
      let update = {};

      type === "MIN"
        ? (update["min_value"] = minValueUpdated[name])
        : (update["max_value"] = maxValueUpdated[name]);
      const result = await axiosInstance.put(
        `/sensors/${name}/threshold`,
        update
      );
      setSensors((prev) =>
        prev.map((sensor) =>
          sensor._id === result.data.updatedSensor._id
            ? { ...result.data.updatedSensor, key: _id }
            : sensor
        )
      );
      toast.success(result.data.message);
      type === "MIN" ? setUpdateMin(false) : setUpdateMax(false);
      console.log("result in handleSubmitInput: ", result, index);
    } catch (error) {
      console.log("error in handleSubmitInput: ", error);
    }
  };
  return (
    <div className="w-full">
      <div className="w-full p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-semibold text-[65px] text-black">
            Control Sensors
          </h1>
        </div>

        <Table columns={columns} dataSource={sensors} />
      </div>
    </div>
  );
};

export default ControlSensors;
