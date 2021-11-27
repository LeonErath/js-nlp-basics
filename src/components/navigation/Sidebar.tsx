import { HomeOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Sidebar = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const router = useRouter();

  useEffect(() => {
    console.log(router.pathname, router.query);
    if (router.pathname === "/") {
      return setCurrentPage("home");
    }
    if (router.pathname.includes("playground/postagging")) {
      return setCurrentPage("chapter:2");
    }
    if (router.pathname.includes("playground/word2vec")) {
      return setCurrentPage("chapter:1");
    }
    if (router.pathname.includes("playground")) {
      return setCurrentPage("chapter:0");
    }

    return setCurrentPage("");
  }, [router.pathname, router.query]);
  return (
    <Menu
      selectedKeys={[currentPage]}
      defaultOpenKeys={["home"]}
      mode="inline"
      style={{ maxWidth: "240px", paddingTop: "16px" }}
    >
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Menu.Item>
      <Menu.ItemGroup key="g1" title="Playgrounds">
        <Menu.Item key="chapter:0">
          <Link href="/playground">
            <a>Overview</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="chapter:1">
          <Link href="/playground/word2vec">
            <a>Word2Vec</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="chapter:2">
          <Link href="/playground/postagging">
            <a>POS-Tagging</a>
          </Link>
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );
};

export default Sidebar;
