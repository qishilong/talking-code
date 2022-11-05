import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getArticleTitle } from "../api/article";

export const getArticleTitleAsync = createAsyncThunk(
  "article/getArticleTitleAsync",
  async (_, thunkApi) => {
    const { data } = await getArticleTitle();
    thunkApi.dispatch(initArticleTitleList(data));
  }
);

const articleSlice = createSlice({
  name: "article",
  initialState: {
    articleTitleList: [],
  },
  reducers: {
    initArticleTitleList: (state, { payload }) => {
      state.articleTitleList = payload;
    },
  },
});

const { initArticleTitleList } = articleSlice.actions;
export default articleSlice.reducer;
