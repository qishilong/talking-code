import { Route, Routes, Navigate } from "react-router-dom";

// 引入页面
import Issues from '../pages/Issues';
import Books from '../pages/Books';
import AddIssue from "../pages/AddIssue";
import IssueDetail from "../pages/IssueDetail";
import SearchPage from "../pages/SearchPage";
import Articles from '../pages/Articles';

function RouteConfig() {
    return (
        <Routes>
            <Route path="/issues" element={<Issues />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
            <Route path="/addIssue" element={<AddIssue />} />
            <Route path="/books" element={<Books />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/searchPage" element={<SearchPage />} />
            <Route path="/" element={<Navigate replace to="/issues" />} />
        </Routes>
    )
}

export default RouteConfig;