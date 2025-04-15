import React, { useEffect, useState } from "react";
import { BellRing, User, Plus, Sun, Fan, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../util/http.js";
import { Space, Table, Switch, Row, Col, Slider, InputNumber } from "antd";
import { toast } from "react-hot-toast";

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
    const { value, name } = e.target;
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
              <input
                type="text"
                name="name"
                value={newDevice.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
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
                <option value="fan">Fan</option>
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
      render: (_, { status }) => (
        <Space direction="vertical">
          <Switch
            checkedChildren={"ON"}
            unCheckedChildren={"OFF"}
            checked={status == "1" ? true : false}
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
      render: (_, record) => {
        // Đảm bảo rằng key là duy nhất cho mỗi phần tử
        return updateMax[record.name] ? (
          <input
            value={
              maxValueUpdated[record.name] != undefined
                ? maxValueUpdated[record.name]
                : record.max_value
            }
            className="w-8 text-center"
            onChange={(e) =>
              setMaxValueUpdated({ [record.name]: e.target.value })
            }
          />
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
      render: (_, record) => {
        // Đảm bảo rằng key là duy nhất cho mỗi phần tử
        return updateMin[record.name] ? (
          <input
            value={
              minValueUpdated[record.name] != undefined
                ? minValueUpdated[record.name]
                : record.min_value
            }
            className="w-8 text-center"
            onChange={(e) =>
              setMinValueUpdated({ [record.name]: e.target.value })
            }
          />
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
  const handleToggleDevice = (index) => {
    const newDevices = [...devices];
    newDevices[index].state = !newDevices[index].state;
    setDevices(newDevices);
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
    <div className="w-full min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="w-full h-[104px] bg-[#d09696] flex justify-between items-center px-8">
        <div className="w-[158px] h-[158px] relative top-[2.5rem]">
          <img
            src="https://dashboard.codeparrot.ai/api/image/Z9kVsJIdzXb5OlZt/mask-gro.png"
            alt="Smart Home Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-6">
          <button className="w-10 h-10 hover:opacity-80 transition-opacity">
            <BellRing className="w-8 h-8" />
          </button>
          <button className="w-10 h-10 hover:opacity-80 transition-opacity bg-slate-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex">
        <div className="left-0 top-[10px] w-[227px] h-[calc(100vh-104px)] bg-[#d09696]">
          <div className="px-5 pt-[100px]">
            <button
              onClick={() => navigate("/")}
              className="w-[187px] h-[65px] bg-[#f5e7d4] rounded-2xl hover:bg-[#e5d7c4] transition-colors"
            >
              <span className="font-inter text-base text-[#21255a]">Home</span>
            </button>
            <button
              onClick={() => navigate("/statistics")}
              className="w-[187px] h-[65px] bg-[#f5e7d4] rounded-2xl hover:bg-[#e5d7c4] transition-colors mt-4"
            >
              <span className="font-inter text-base text-[#21255a]">
                Statistic values
              </span>
            </button>
            <button className="w-[187px] h-[65px] bg-[#f5e7d4] rounded-2xl hover:bg-[#e5d7c4] transition-colors mt-4">
              <span className="font-inter text-base text-[#21255a]">
                Control Devices
              </span>
            </button>
            <button
              onClick={() => navigate("/scheduler")}
              className="w-[187px] h-[65px] bg-[#f5e7d4] rounded-2xl hover:bg-[#e5d7c4] transition-colors mt-4"
            >
              <span className="font-inter text-base text-[#21255a]">
                Scheduler
              </span>
            </button>
          </div>
        </div>

        {/* Main Content */}
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
