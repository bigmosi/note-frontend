import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import NoteOrganization from './components/NoteOrganization';
import CategoryList from './components/CategoryList';
import CategoryDetails from './components/CategoryDetails';
import CategoryIcon from './components/CategoryIcon';
import NoteCreationInterface from './components/NoteCreationInterface';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import AuthService from './components/AuthService';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
const { Header, Sider, Content } = Layout;

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [notes, setNotes] = useState([]);

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

  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(AuthService.isLoggedIn());

  // Handle login/logout status changes
  useEffect(() => {
    setIsLoggedIn(AuthService.isLoggedIn());
  }, [location]);

  const handleLogout = () => {
    // Clear the access token from local storage and redirect to the login page
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <Layout>
      {isLoggedIn ? (
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="home" icon={<UserOutlined />}>
              <NavLink to="/">Home</NavLink>
            </Menu.Item>
            <Menu.Item key="create-notes" icon={<UserOutlined />}>
              <NavLink to="/create-notes">Create Notes</NavLink>
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </Sider>
      ) : (
        // Redirect to the login page for non-logged-in users
        navigate('/login')
      )}
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
