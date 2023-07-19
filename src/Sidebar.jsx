import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import NoteOrganization from './components/NoteOrganization';
import CategoryList from './components/CategoryList';
import CategoryDetails from './components/CategoryDetails';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
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

  return (
    <Router>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <UserOutlined />,
                label: 'nav 1',
              },
              {
                key: '2',
                icon: <VideoCameraOutlined />,
                label: 'nav 2',
              },
              {
                key: '3',
                icon: <UploadOutlined />,
                label: 'nav 3',
              },
            ]}
          />
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
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <nav>
              <ul>
                <li>
                  <NavLink to="/">Home</NavLink>
                </li>
                <li>
                  <NavLink to="/categories/:categoryId">Note Organization</NavLink>
                </li>
              </ul>
            </nav>
            <Routes>
              <Route path="/categories/:categoryId" element={<NoteOrganization notes={notes} />} />
              <Route path='/' element={<CategoryList />} />
              <Route path="/category/:categoryId" element={<CategoryDetails />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default SideBar;
