import React from 'react';

function PageFooter(props) {
    return (
        <div>
            <p className="links">
                <span className="linkItem">友情链接：</span>
                <a
                    href="https://time.geekbang.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    极客时间
                </a>
                <a
                    href="https://ke.qq.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    腾讯课堂
                </a>
                <a
                    href="https://juejin.cn/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    掘金
                </a>
                <a
                    href="https://www.cnblogs.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    博客园
                </a>
                <a
                    href="https://segmentfault.com/blogs"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    思否
                </a>
            </p>
            <p>Talking Code</p>
            <p>
                <a href="https://beian.miit.gov.cn/" target="_blank">备案号：</a>
                <a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2023002610号</a>
            </p>
        </div>
    );
}

export default PageFooter;