import { BellRing, Loader, User } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Dropdown, Modal, Space } from 'antd';
import { axiosInstance } from '../util/http.js';
import { setIsAuth } from '../redux/authSlice.js';

const HomeTemplate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation(); // Get current pathname
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Are you sure to logout?');

    const showModal = () => {
        setOpen(true);
    };

    const items = [
        {
            key: '1',
            label: <Link to={'/user-infor'}>My Account</Link>,
        },
        {
            key: '2',
            label: (
                <a type="primary" onClick={showModal}>
                    Logout
                </a>
            ),
        },
    ];

    const handleOk = async () => {
        try {
            const res = await axiosInstance.get('/auth/logout');
            console.log('Logout response:', res);
            dispatch(setIsAuth(false));
            setModalText('The modal will be closed after two seconds');
            setConfirmLoading(true);
            localStorage.removeItem('UserToken');
            setTimeout(() => {
                setOpen(false);
                setConfirmLoading(false);
            }, 2000);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const { isCheckingAuth, isAuth } = useSelector((state) => state.auth);

    const isActive = (path) => location.pathname === path;

    if (isCheckingAuth && !isAuth) {
        return (
            <div className="w-full min-h-screen bg-white">
                {/* Top Navigation Bar */}
                <div className="w-full h-[104px] bg-[#d09696] flex justify-between items-center px-8">
                    <div
                        className="w-[158px] h-[158px] relative top-[2.5rem] cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => navigate('/')}
                    >
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
                                className={`w-[187px] h-[65px] rounded-2xl transition-colors ${
                                    isActive('/')
                                        ? 'bg-[#d4c7b0]'
                                        : 'bg-[#f5e7d4] hover:bg-[#e5d7c4]'
                                }`}
                                onClick={() => navigate('/')}
                            >
                                <span className="font-inter text-base text-[#21255a]">
                                    Home
                                </span>
                            </button>
                            <button
                                className={`w-[187px] h-[65px] rounded-2xl transition-colors mt-4 ${
                                    isActive('/statistics')
                                        ? 'bg-[#d4c7b0]'
                                        : 'bg-[#f5e7d4] hover:bg-[#e5d7c4]'
                                }`}
                                onClick={() => navigate('/statistics')}
                            >
                                <span className="font-inter text-base text-[#21255a]">
                                    Statistic values
                                </span>
                            </button>
                            <button
                                className={`w-[187px] h-[65px] rounded-2xl transition-colors mt-4 ${
                                    isActive('/control-devices')
                                        ? 'bg-[#d4c7b0]'
                                        : 'bg-[#f5e7d4] hover:bg-[#e5d7c4]'
                                }`}
                                onClick={() => navigate('/control-devices')}
                            >
                                <span className="font-inter text-base text-[#21255a]">
                                    Control Devices
                                </span>
                            </button>
                            <button
                                className={`w-[187px] h-[65px] rounded-2xl transition-colors mt-4 ${
                                    isActive('/scheduler')
                                        ? 'bg-[#d4c7b0]'
                                        : 'bg-[#f5e7d4] hover:bg-[#e5d7c4]'
                                }`}
                                onClick={() => navigate('/scheduler')}
                            >
                                <span className="font-inter text-base text-[#21255a]">
                                    Scheduler
                                </span>
                            </button>
                            <button
                                className={`w-[187px] h-[65px] rounded-2xl transition-colors mt-4 ${
                                    isActive('/history')
                                        ? 'bg-[#d4c7b0]'
                                        : 'bg-[#f5e7d4] hover:bg-[#e5d7c4]'
                                }`}
                                onClick={() => navigate('/history')}
                            >
                                <span className="font-inter text-base text-[#21255a]">
                                    History
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex justify-center items-center mx-auto">
                        <Loader className="size-10 animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-white">
            {/* Top Navigation Bar */}
            <div className="w-full h-[104px] bg-[#d09696] flex justify-between items-center px-8 ">
                <div
                    className="w-[158px] h-[158px] relative top-[2.5rem] cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => navigate('/')}
                >
                    <img
                        src="https://dashboard.codeparrot.ai/api/image/Z9kVsJIdzXb5OlZt/mask-gro.png"
                        alt="Smart Home Logo"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex gap-6 mr-5">
                    <button className="w-10 h-10 hover:opacity-80 transition-opacity">
                        <BellRing className="w-8 h-8" />
                    </button>
                    <Space direction="vertical">
                        <Space wrap>
                            <Dropdown menu={{ items }} placement="bottom" arrow>
                                <button className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8" />
                                </button>
                            </Dropdown>
                        </Space>
                    </Space>
                </div>
            </div>

            {/* Sidebar */}
            <div className="flex">
                <div className="left-0 top-[10px] w-[227px] min-h-[calc(100vh-104px)] bg-[#d09696]">
                    <div className="px-5 pt-[100px]">
                        <button
                            className={`w-[187px] h-[65px] rounded-2xl transition-colors ${
                                isActive('/')
                                    ? 'bg-[#d4c7b0]'
                                    : 'bg-[#f5e7d4] hover:bg-[#e5d7c4]'
                            }`}
                            onClick={() => navigate('/')}
                        >
                            <span className="font-inter text-base text-[#21255a]">
                                Home
                            </span>
                        </button>
                        <button
                            className={`w-[187px] h-[65px] rounded-2xl transition-colors mt-4 ${
                                isActive('/statistics')
                                    ? 'bg-[#d4c7b0]'
                                    : 'bg-[#f5e7d4] hover:bg-[#e5d7c4]'
                            }`}
                            onClick={() => navigate('/statistics')}
                        >
                            <span className="font-inter text-base text-[#21255a]">
                                Statistic values
                            </span>
                        </button>
                        <button
                            className={`w-[187px] h-[65px] rounded-2xl transition-colors mt-4 ${
                                isActive('/control-devices')
                                    ? 'bg-[#d4c7b0]'
                                    : 'bg-[#f5e7d4] hover:bg-[#e5d7c4]'
                            }`}
                            onClick={() => navigate('/control-devices')}
                        >
                            <span className="font-inter text-base text-[#21255a]">
                                Control Devices
                            </span>
                        </button>
                        <button
                            className={`w-[187px] h-[65px] rounded-2xl transition-colors mt-4 ${
                                isActive('/control-sensors')
                                    ? 'bg-[#d4c7b0]'
                                    : 'bg-[#f5e7d4] hover:bg-[#e5d7c4]'
                            }`}
                            onClick={() => navigate('/control-sensors')}
                        >
                            <span className="font-inter text-base text-[#21255a]">
                                Control Sensors
                            </span>
                        </button>
                        <button
                            className={`w-[187px] h-[65px] rounded-2xl transition-colors mt-4 ${
                                isActive('/scheduler')
                                    ? 'bg-[#d4c7b0]'
                                    : 'bg-[#f5e7d4] hover:bg-[#e5d7c4]'
                            }`}
                            onClick={() => navigate('/scheduler')}
                        >
                            <span className="font-inter text-base text-[#21255a]">
                                Scheduler
                            </span>
                        </button>
                        <button
                            className={`w-[187px] h-[65px] rounded-2xl transition-colors mt-4 ${
                                isActive('/history')
                                    ? 'bg-[#d4c7b0]'
                                    : 'bg-[#f5e7d4] hover:bg-[#e5d7c4]'
                            }`}
                            onClick={() => navigate('/history')}
                        >
                            <span className="font-inter text-base text-[#21255a]">
                                History
                            </span>
                        </button>
                    </div>
                </div>
                <Modal
                    title="Logout"
                    open={open}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    okText="Confirm"
                    cancelText="Cancel"
                >
                    <p>{modalText}</p>
                </Modal>
                {/* Main Content */}
                <Outlet />
            </div>
        </div>
    );
};

export default HomeTemplate;
