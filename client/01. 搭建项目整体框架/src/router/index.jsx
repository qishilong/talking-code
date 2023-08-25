import { Route, Routes, Navigate } from "react-router-dom";

// 引入页面
import Issues from '../pages/Issues';
import Books from '../pages/Books';
import Articles from '../pages/Articles';

function RouteConfig() {
    return (
        <Routes>
            <Route path="/issues" element={<Issues />} />
            <Route path="/books" element={<Books />} />
            <Route path="/Articles" element={<Articles />} />
            <Route path="/" element={<Navigate replace to="/issues" />} />
        </Routes>
    )
}

export default RouteConfig;