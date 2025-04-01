import React, { useState } from 'react';
import { BellRing, User, Plus, Sun, Fan } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Switch } from '@headlessui/react';

const DeviceCard = ({ id, name, type, state, onToggle, onDelete }) => {
  const Icon = type === 'light' ? Sun : Fan;
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${state ? 'text-yellow-500' : 'text-gray-400'}`} />
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-xs text-gray-500">ID: {id}</p>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Remove
        </button>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{state ? 'On' : 'Off'}</span>
        <Switch
          checked={state}
          onChange={onToggle}
          className={`${
            state ? 'bg-green-500' : 'bg-gray-300'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
        >
          <span
            className={`${
              state ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </div>
  );
};

const AddDeviceModal = ({ isOpen, onClose, onAdd }) => {
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('light');

  const handleSubmit = (e) => {
    e.preventDefault();
    const deviceId = `${deviceType}_${Date.now()}`;
    onAdd({ 
      id: deviceId,
      name: deviceName, 
      type: deviceType, 
      state: false 
    });
    setDeviceName('');
    setDeviceType('light');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Device</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device Name
            </label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device Type
            </label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="fan">Fan</option>
            </select>
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddDevice = (newDevice) => {
    setDevices([...devices, newDevice]);
  };

  const handleToggleDevice = (index) => {
    const newDevices = [...devices];
    newDevices[index].state = !newDevices[index].state;
    setDevices(newDevices);
  };

  const handleDeleteDevice = (index) => {
    const newDevices = devices.filter((_, i) => i !== index);
    setDevices(newDevices);
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
              onClick={() => navigate('/')}
              className="w-[187px] h-[65px] bg-[#f5e7d4] rounded-2xl hover:bg-[#e5d7c4] transition-colors"
            >
              <span className="font-inter text-base text-[#21255a]">
                Home
              </span>
            </button>
            <button
              onClick={() => navigate('/statistics')}
              className="w-[187px] h-[65px] bg-[#f5e7d4] rounded-2xl hover:bg-[#e5d7c4] transition-colors mt-4"
            >
              <span className="font-inter text-base text-[#21255a]">
                Statistic values
              </span>
            </button>
            <button
              className="w-[187px] h-[65px] bg-[#f5e7d4] rounded-2xl hover:bg-[#e5d7c4] transition-colors mt-4"
            >
              <span className="font-inter text-base text-[#21255a]">
                Control Devices
              </span>
            </button>
            <button
              onClick={() => navigate('/scheduler')}
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
            <h1 className="font-['Italianno'] text-[70px] text-black">Control Devices</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Device
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device, index) => (
              <DeviceCard
                key={device.id}
                {...device}
                onToggle={() => handleToggleDevice(index)}
                onDelete={() => handleDeleteDevice(index)}
              />
            ))}
          </div>
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