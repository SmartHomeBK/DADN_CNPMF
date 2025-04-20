import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Tag, Input, Space } from 'antd';
import { axiosInstance } from '../util/http';
import moment from 'moment';

const { Title } = Typography;
const { Search } = Input;

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState('all'); // 'all', 'user', 'device'
    const [searchValue, setSearchValue] = useState('');

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/history');
            setHistory(response.data);
            setFilteredHistory(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        if (!searchValue) {
            setFilteredHistory(history);
            return;
        }

        const filtered = history.filter((item) => {
            const searchLower = searchValue.toLowerCase();

            if (searchType === 'user') {
                return item.user?.name?.toLowerCase().includes(searchLower);
            } else if (searchType === 'device') {
                return item.device?.name?.toLowerCase().includes(searchLower);
            } else {
                // Search in all fields
                return (
                    item.user?.name?.toLowerCase().includes(searchLower) ||
                    item.device?.name?.toLowerCase().includes(searchLower) ||
                    item.message?.toLowerCase().includes(searchLower)
                );
            }
        });

        setFilteredHistory(filtered);
    }, [searchValue, searchType, history]);

    const columns = [
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            render: (time) => moment(time).format('YYYY-MM-DD HH:mm:ss'),
            sorter: (a, b) => moment(a.time).unix() - moment(b.time).unix(),
        },
        {
            title: 'Device',
            dataIndex: 'device',
            key: 'device',
            render: (device) => device?.name || 'N/A',
            sorter: (a, b) =>
                (a.device?.name || '').localeCompare(b.device?.name || ''),
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            sorter: (a, b) => a.message.localeCompare(b.message),
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: (user) => user?.name || 'System',
            sorter: (a, b) =>
                (a.user?.name || '').localeCompare(b.user?.name || ''),
        },
        {
            title: 'Type',
            key: 'type',
            render: (_, record) => {
                const isSensor = record.message
                    .toLowerCase()
                    .includes('sensor');
                return (
                    <Tag color={isSensor ? 'blue' : 'green'}>
                        {isSensor ? 'Sensor' : 'Device'}
                    </Tag>
                );
            },
            filters: [
                { text: 'Device', value: 'device' },
                { text: 'Sensor', value: 'sensor' },
            ],
            onFilter: (value, record) => {
                const isSensor = record.message
                    .toLowerCase()
                    .includes('sensor');
                return value === 'sensor' ? isSensor : !isSensor;
            },
        },
    ];

    return (
        <div className="p-12 w-full">
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <Title level={2}>Activity History</Title>
                    <Space>
                        <Search
                            placeholder={`Search by ${searchType}`}
                            allowClear
                            enterButton="Search"
                            size="large"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ width: 300 }}
                        />
                        <select
                            className="border rounded-lg px-3 py-2"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="user">User</option>
                            <option value="device">Device</option>
                        </select>
                    </Space>
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredHistory}
                    loading={loading}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} items`,
                    }}
                />
            </Card>
        </div>
    );
};

export default HistoryPage;
