import * as React from "react";

import "./about.less";

export function AboutPage() {
    return (
        <div className="about-page">
            <h1>在线开放课程之协同学习系统</h1>
            <p>主要功能是为学生提供协同学习的能力，具体功能如下</p>
            
            <ul>
                <li>协同编辑器</li>
                <li>带权限的分享及小组功能</li>
                <li>文章分享及评价</li>
                <li>实用工具(单词卡、班级日历、签到打卡等等)</li>
            </ul>

            <p>前端主要技术</p>
            <ul>
                <li>Pure React & Pure React Hooks</li>
                <li>TypeScript</li>
            </ul>

            <p>后端主要技术</p>
            <ul>
                <li>Node.js (TypeScript)</li>
                <li>Socket.io</li>
                <li>Sequelize MySQL</li>
            </ul>
        </div>
    )
}

