import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import NoteOrganization from './components/NoteOrganization';
import CategoryList from './components/CategoryList';
import CategoryDetails from './components/CategoryDetails';
import CategoryIcon from './components/CategoryIcon';
import NoteCreationInterface from './components/NoteCreationInterface';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { getUser } from './utils/auth';

const { Header, Sider, Content } = Layout;

const SideBar = () => {
  // State and hooks
  const [collapsed, setCollapsed] = useState(false);
  const { colorBgContainer } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);

  const user = getUser();
  
  // Fetch notes from the backend on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/notes');
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear the access token from local storage and redirect to the login page
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="home" icon={<UserOutlined />}>
            <NavLink to="/">Home</NavLink>
          </Menu.Item>
          <Menu.Item key="create-notes" icon={<UserOutlined />}>
            <NavLink to="/create-notes">Create Notes</NavLink>
          </Menu.Item>
          <Menu.Item key="logout" icon={<VideoCameraOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          {user && user.name ? (
          <span style={{ marginLeft: '16px', fontSize: '20px' }}>Welcome, {user.name}</span>
        ) : null}
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 'calc(100vh - 128px)',
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route path="/categories/:categoryId" element={<NoteOrganization notes={notes} />} />
            <Route path="/" element={<CategoryList />} />
            <Route path="/category/:categoryId" element={<CategoryDetails />} />
            <Route path="/create-notes" element={<NoteCreationInterface />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SideBar;
