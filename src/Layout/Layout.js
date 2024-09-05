// src/Layout.js
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Button, Grid } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, SettingOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import logo from '../../src/logorostudy.png';  // Import your logo image

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

// Create a dropdown menu for the user profile in the header
const userMenu = (
  <Menu>
    <Menu.Item key="1" icon={<SettingOutlined />}>
      Settings
    </Menu.Item>
    <Menu.Item key="2" icon={<LogoutOutlined />}>
      Logout
    </Menu.Item>
  </Menu>
);

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();

  // Set sidebar collapsed state based on screen size (collapsed on mobile)
  useEffect(() => {
    setCollapsed(!screens.md); // Collapse sidebar if screen size is less than medium (md)
  }, [screens]);

  // Toggle function for sidebar
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header with logo, user profile, and title */}
      <Header style={{ background: '#001529', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo and Application Title */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '15px' }} />
          <Text style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>Rostudy</Text>
        </div>

        {/* User Profile Dropdown */}
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Space>
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            <Text style={{ color: '#fff' }}>Chirag Tankwal</Text>
          </Space>
        </Dropdown>
      </Header>

      <Layout>
        {/* Sidebar with additional styling and icons */}
        <Sider
          width={220}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{ background: '#fff', boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)' }}
        >
          {/* Toggle Button Inside Sidebar */}
          <Button type="text" onClick={toggleSidebar} style={{ margin: '10px 0', width: '100%' }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>

          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<UserOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="2" icon={<LaptopOutlined />}>
              Products
            </Menu.Item>
            <Menu.Item key="3" icon={<NotificationOutlined />}>
              Orders
            </Menu.Item>
            <Menu.Item key="4" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
          </Menu>
        </Sider>

        {/* Main Content Area with updated padding and background */}
        <Layout style={{ padding: '24px 24px 24px', background: '#f0f2f5' }}>
          <Content
            style={{
              padding: '24px',
              margin: 0,
              minHeight: 280,
              background: '#fff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
