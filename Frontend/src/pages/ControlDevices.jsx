import React, { useEffect, useState } from "react";
import { BellRing, User, Plus, Sun, Fan, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../util/http.js";
import { Space, Table, Switch, Row, Col, Slider, InputNumber } from "antd";
import { toast } from "react-hot-toast";

const deviceNames = ["LightBulb", "Fan"];

const AddDeviceModal = ({ isOpen, onClose, onAdd }) => {
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("light");
  const [newDevice, setNewDivice] = useState({
    name: "",
    type: "light",
    status: "1",
    location: "",
    auto: true,
  });
  const [inputValue, setInputValue] = useState({
    max_value: 1,
    min_value: 1,
  });
  console.log("value of min_max value: ", inputValue);

  const onChange = (newValue, type) => {
    if (type == 1) setInputValue({ ...inputValue, max_value: newValue });
    else setInputValue({ ...inputValue, min_value: newValue });
  };

  const handleChange = (e) => {
    let { value, name } = e.target;
    if (name == "auto") value = value == "1" ? true : false;
    setNewDivice((prev) => ({ ...prev, [name]: value }));
  };
  console.log("newDevice: ", newDevice);
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalDeviceSent = { ...newDevice, ...inputValue };
    console.log("finnalDeviceSent: ", finalDeviceSent);
    const deviceId = `${deviceType}_${Date.now()}`;
    onAdd(finalDeviceSent);
    setNewDivice({
      name: "",
      type: "light",
      status: "1",
      location: "",
      auto: true,
    });
    setInputValue({
      max_value: 1,
      min_value: 1,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 min-w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Device</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Name
              </label>
              <select
                name="name"
                value={newDevice.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Select a device
                </option>
                {deviceNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Type
              </label>
              <select
                value={newDevice.type}
                name="type"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="temperature">Temperature</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={newDevice.status}
                name="status"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">On</option>
                <option value="0">Off</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={newDevice.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max value
              </label>
              <Row>
                <Col span={12}>
                  <Slider
                    min={1}
                    max={100}
                    onChange={(newValue) => onChange(newValue, 1)}
                    value={
                      typeof inputValue.max_value === "number"
                        ? inputValue.max_value
                        : 1
                    }
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={1}
                    max={100}
                    style={{ margin: "0 16px" }}
                    value={inputValue.max_value}
                    onChange={(newValue) => onChange(newValue, 1)}
                  />
                </Col>
              </Row>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min value
              </label>
              <Row>
                <Col span={12}>
                  <Slider
                    min={1}
                    max={100}
                    onChange={(newValue) => onChange(newValue, 0)}
                    value={
                      typeof inputValue.min_value === "number"
                        ? inputValue.min_value
                        : 0
                    }
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={1}
                    max={100}
                    style={{ margin: "0 16px" }}
                    value={inputValue.min_value}
                    onChange={(newValue) => onChange(newValue, 0)}
                  />
                </Col>
              </Row>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto
              </label>
              <select
                value={newDevice.auto}
                name="auto"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">On</option>
                <option value="0">Off</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ControlDevices = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [updateMax, setUpdateMax] = useState({});
  const [updateMin, setUpdateMin] = useState({});
  const [maxValueUpdated, setMaxValueUpdated] = useState({});
  const [minValueUpdated, setMinValueUpdated] = useState({});

  console.log("valueUpdated: ", maxValueUpdated);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => <a>{record.name}</a>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record, index) => (
        <Space direction="vertical">
          <Switch
            checkedChildren={"ON"}
            unCheckedChildren={"OFF"}
            checked={record.status == "1" ? true : false}
            onChange={(checked) =>
              handleUpdateStatus(checked, record.name, index, record._id)
            }
          />
        </Space>
      ),
    },
    {
      title: "Max-value",
      dataIndex: "max_value",
      key: "max_value",
      onCell: (record, rowIndex) => ({
        onClick: () => {
          console.log("Ô Max-value được click!", record);
          setUpdateMax({ [record.name]: true });
        },
        onBlur: () => {
          console.log("bạn vào onblur");
          setUpdateMax({ [record.name]: false });
        },
      }),
      render: (_, record, index) => {
        // Đảm bảo rằng key là duy nhất cho mỗi phần tử
        return updateMax[record.name] ? (
          <form
            onSubmit={(e) =>
              handleSubmitInput(e, record.name, "MAX", record._id, index)
            }
          >
            <input
              value={
                maxValueUpdated[record.name] != undefined
                  ? maxValueUpdated[record.name]
                  : record.max_value
              }
              className="w-8 text-center"
              onChange={(e) =>
                setMaxValueUpdated({
                  [record.name]: e.target.value,
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
          setUpdateMin({ [record.name]: true });
        },
        onBlur: () => {
          setUpdateMin({ [record.name]: false });
        },
      }),
      render: (_, record, index) => {
        // Đảm bảo rằng key là duy nhất cho mỗi phần tử
        return updateMin[record.name] ? (
          <form
            onSubmit={(e) =>
              handleSubmitInput(e, record.name, "MIN", record._id, index)
            }
          >
            <input
              value={
                minValueUpdated[record.name] != undefined
                  ? minValueUpdated[record.name]
                  : record.min_value
              }
              className="w-8 text-center"
              onChange={(e) =>
                setMinValueUpdated({
                  [record.name]: e.target.value,
                })
              }
            />
          </form>
        ) : (
          <span>{record.min_value}</span> // Thêm key duy nhất cho span
        );
      },
    },
    {
      title: "Auto",
      dataIndex: "auto",
      key: "auto",
      render: (_, record, index) => (
        <Space direction="vertical">
          <Switch
            checkedChildren={"ON"}
            unCheckedChildren={"OFF"}
            checked={record.auto}
            onChange={(checked) => handleUpdateAuto(checked, record._id, index)}
          />
        </Space>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record, index) => (
        <Space size="middle">
          <button onClick={() => handleDeleteDevice(record._id)}>
            <Trash className="text-red-600" />
          </button>
        </Space>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    fetchDevices();
  }, []);

  const handleUpdateStatus = async (checked, name, index, _id) => {
    try {
      console.log("indexsshdsjdhsjd: ", index);
      const updated = await axiosInstance.put(`/devices/control/${name}`, {
        state: checked ? "1" : "0",
      });
      console.log("update Status successfully: ", updated);
      let newData = [...devices];
      newData[index].status = checked ? "1" : "0";
      setDevices(newData);
    } catch (error) {
      console.log("bug in 363: ", error);
    }
  };

  const handleUpdateAuto = async (checked, _id, index) => {
    try {
      const updated = await axiosInstance.put(`/devices/auto/${_id}`, {
        auto: checked ? true : false,
      });
      let newData = [...devices];
      newData[index] = { ...updated.data.device, key: _id };
      setDevices(newData);
      console.log("update Auto successfully: ", updated);
    } catch (error) {
      console.log("bug in 379: ", error);
    }
  };

  const handleSubmitInput = async (e, name, type, _id, index) => {
    try {
      e.preventDefault();
      let update = {};

      type === "MIN"
        ? (update["min_value"] = minValueUpdated[name])
        : (update["max_value"] = maxValueUpdated[name]);
      const result = await axiosInstance.put(`/devices/auto/${_id}`, update);
      const newDeviceArray = [...devices];
      newDeviceArray[index] = { ...result.data.device, key: _id };
      setDevices(newDeviceArray);
      type === "MIN" ? setUpdateMin(false) : setUpdateMax(false);
      console.log("result in handleSubmitInput: ", result);
    } catch (error) {
      console.log("error in handleSubmitInput: ", error);
    }
  };

  const handleAddDevice = async (newDevice) => {
    try {
      const newDeviceArray = await axiosInstance.post(
        "/devices/add",
        newDevice
      );
      let tempDevice = newDeviceArray.data.device;
      const addedDevice = { ...tempDevice, key: tempDevice._id };
      console.log("result in add device: ", newDeviceArray);
      setDevices((prev) => [...prev, addedDevice]);
      toast.success(newDeviceArray.data.message);
    } catch (error) {
      console.log("error in addDevice: ", error);
      toast.error(error.response.data.message);
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await axiosInstance.get("/devices");
      console.log("result in fetchDevices in ControlDevice@@@131: ", res);
      const fetchedDevices = res.data;
      const finalDevices = fetchedDevices.map((item, index) => ({
        ...item,
        key: item["_id"],
      }));
      console.log("final devices: ", finalDevices);
      setDevices(finalDevices);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleDeleteDevice = async (_id) => {
    try {
      const deleteResult = await axiosInstance.post("/devices/delete", {
        _id,
      });
      console.log("result in handleDeleteDevice: ", deleteResult);
      toast.success(deleteResult.data.message);
      const newDevices = devices.filter((item, i) => item._id !== _id);
      setDevices(newDevices);
    } catch (error) {
      console.log("error in handleDeleteDevice: ", error);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-['Italianno'] text-[70px] text-black">
            Control Devices
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Device
          </button>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device, index) => (
              <DeviceCard
                key={device.id}
                {...device}
                onToggle={() => handleToggleDevice(index)}
                onDelete={() => handleDeleteDevice(index)}
              />
            ))}
          </div> */}
        <Table columns={columns} dataSource={devices} />
      </div>
      <AddDeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddDevice}
      />
    </div>
  );
};

export default ControlDevices;
