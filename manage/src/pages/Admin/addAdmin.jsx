import { PageContainer } from "@ant-design/pro-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "umi";

import AdminForm from "./components/adminForm";

function AddAdmin(props) {
  const [newAdminInfo, setNewAdminInfo] = useState({
    loginId: "",
    loginPwd: "",
    nickname: "",
    avatar: "",
    permission: 2 // 默认是普通管理员
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function submitHandle() {
    // 用户点击表单的确认时，要做的事儿
    // 接下来我们就需要进行新增操作
    dispatch({
      type: "admin/_addAdmin",
      payload: newAdminInfo
    });
    navigate("/admin/adminList");
  }

  return (
    <PageContainer>
      <div className='container' style={{ width: "500px" }}>
        <AdminForm
          type='add'
          adminInfo={newAdminInfo}
          setAdminInfo={setNewAdminInfo}
          submitHandle={submitHandle}
        />
      </div>
    </PageContainer>
  );
}

export default AddAdmin;
