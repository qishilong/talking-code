import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getArticleTitle } from "../api/article";

/**
 * 异步 thunk，外部在进行 dispatch 的时候，直接 dispatch 这个函数
 */
export const getArticleTitleList = createAsyncThunk(
  "article/getArticleTitleList",
  async (_, action) => {
    // 发送 ajax 请求获取数据
    const response = await getArticleTitle();
    // action.dispatch(initTypeList(response.data));
    return response?.data;
  }
);

/**
 * 创建切片
 */
export const articleSlice = createSlice({
  name: "article",
  initialState: {
    articleTitleList: [],
  },
  reducers: {},
  extraReducers: {
    [getArticleTitleList?.fulfilled]: (state, action) => {
      state.articleTitleList = action?.payload;
    }
  }
});

// export const { articleTitleList } = articleSlice.actions;

export default articleSlice.reducer;