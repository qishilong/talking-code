import { useState } from "react";
import LoginAvatar from "./LoginAvatar";
import { NavLink, useNavigate } from "react-router-dom";
import { Input, Select } from "antd";

const { Search } = Input;
const { Option } = Select;
function NavHeader(props) {
  const navigate = useNavigate();

  const [searchOptions, setSearchOption] = useState("issue");

  function onChange(value) {
    setSearchOption(value);
  }

  function onSearch(value) {
    if (value) {
      // 跳转到搜索页，将搜索内容传递过去
      navigate("/searchPage", {
        state: {
          value,
          searchOptions
        }
      });
    } else {
      navigate("/issues");
    }
  }

  return (
    <div className='headerContainer'>
      {/* 头部 logo */}
      <div className='logoContainer' onClick={() => navigate("/")}>
        <div className='logo'>
          <span>Talking</span>
          <span>Code</span>
        </div>
      </div>
      <div className='nav'>
        {/* 头部导航 */}
        <nav className='navContainer'>
          <NavLink to='/issues' className='navgation'>
            问答
          </NavLink>
          <NavLink to='/books' className='navgation'>
            书籍
          </NavLink>
          <NavLink to='/articles' className='navgation'>
            文章
          </NavLink>
          <a
            href='https://time.geekbang.org/'
            className='navgation'
            target='_blank'
            rel='noreferrer'
          >
            视频教程
          </a>
        </nav>
        {/* 搜索框 */}
        <div className='searchContainer'>
          <Input.Group compact>
            <Select
              defaultValue='issue'
              size='large'
              style={{
                width: "20%"
              }}
              onChange={onChange}
            >
              <Option value='issue'>问答</Option>
              <Option value='book'>书籍</Option>
              {/* <Option value="jobs">招聘</Option> */}
            </Select>
            <Search
              placeholder='请输入要搜索的内容'
              allowClear
              enterButton='搜索'
              size='large'
              onSearch={onSearch}
              style={{
                width: "80%"
              }}
            />
          </Input.Group>
        </div>
      </div>
      {/* 登录按钮 */}
      <div className='loginBtnContainer'>
        <LoginAvatar loginHandle={props?.loginHandle} />
      </div>
    </div>
  );
}

export default NavHeader;
