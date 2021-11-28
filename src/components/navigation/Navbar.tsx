import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { Avatar, Button, Dropdown, Menu } from "antd";
import Logo from "../Logo";
import { A } from "../../styles/A";
import { maxWidth } from "../../styles/Theme";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useUser } from "../../lib/authentication/user";
import { Breadcrumbs } from "./Breadcrumbs";

const MenuBar = styled.div`
  height: 64px;
  background: white;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding-right: 32px;
  padding-left: 32px;
  border-bottom: 1px solid #f0f1f2;

  @media (max-width: ${maxWidth.SMALL}) {
    align-items: center;
    justify-content: center;
  }
`;

const MenuRight = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  @media (max-width: ${maxWidth.SMALL}) {
    visibility: collapse;
  }
`;

const MenuLeft = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Navbar = () => {
  const { user } = useUser();

  const renderProfileDropdown = () => {
    const menu = (
      <Menu>
        <Menu.Item>
          <Link href="/profile">
            <a>
              <UserOutlined /> Profile
            </a>
          </Link>
        </Menu.Item>
      </Menu>
    );

    if (!user) {
      return;
    }

    return (
      <Dropdown overlay={menu} placement="bottomCenter" arrow>
        <Button
          type="text"
          icon={
            <Avatar
              size="small"
              src={user.picture}
              style={{ marginRight: "4px" }}
            />
          }
        >
          <Link href="/profile">
            <A>
              {user.name} <DownOutlined />{" "}
            </A>
          </Link>
        </Button>
      </Dropdown>
    );
  };

  return (
    <>
      <MenuBar>
        <MenuLeft>
          <Link href="/">
            <A>
              <Logo></Logo>
            </A>
          </Link>
        </MenuLeft>
        <MenuRight>{renderProfileDropdown()}</MenuRight>
      </MenuBar>
      <Breadcrumbs />
    </>
  );
};

export default Navbar;
