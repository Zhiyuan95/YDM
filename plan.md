这份文档为你整理了项目的总体需求、技术架构以及分阶段的开发交付计划（Roadmap）。你可以直接将其保存为 PROJECT_PLAN.md。
********\*\*********\_\_\_\_********\*\*********项目开发计划书：现代数字媒体档案馆

1. 产品总体需求 (Product Overview)
   本计划旨在构建一个兼具档案馆叙事感与现代画廊美感的数字媒体平台，面向特定人群提供安全、可靠且直观的资源管理与探索体验。
   1.1 核心功能需求
   ● 多模态资产管理：支持高清图片、长视频、音频文件的存储与展示。
   ● 内容叙事：每一件媒体资产均可关联深度“故事”文本（支持 Markdown 或富文本）。
   ● 双重交互视图：
   ○ Archive View (时间轴模式)：参考 Fortepan 风格，通过横向时间轴探索历史。
   ○ Discovery View (瀑布流模式)：参考 Pinterest 风格，提供沉浸式的视觉探索。
   ● 高级筛选系统：基于元数据的多维搜索（年份范围、地点、人物、标签、资产 ID）。
   ● 受控投稿系统 (UGC)：允许授权用户上传，通过 Admin 审核队列进行发布管理。
   1.2 非功能需求
   ● 安全性：数据多重备份，访问权限精细控制（RLS）。
   ● 高性能：大体积视频秒开，海量图片无损压缩预览。
   ● 极简 UI：减少认知负荷，通过丝滑动效提升“高级感”。
   ********\*\*********\_\_\_\_********\*\*********2. 技术需求总结 (Technical Stack)
   维度 选型 说明
   前端框架 Next.js (App Router) 提供 SSR/ISR 性能优化，内置媒体处理能力。
   样式/动效 Tailwind CSS + Framer Motion 实现响应式布局与复杂的时间轴切换动画。
   数据库/鉴权 Supabase (PostgreSQL) 利用 RLS 保护数据，处理复杂的元数据关系。
   对象存储 Cloudflare R2 核心选型：0 出口流量费，支撑大规模视频消费。
   大文件上传 AWS S3 Multipart Upload + Uppy 前端分片预签名直传 R2，无需独立 TUS 节点，突破 Serverless 限制。
   CDN/优化 Cloudflare Image Resizing / Workers 利用边缘端基于 R2 实时裁剪和缓存缩略图，大幅降低单独存储和交付成本；兼顾视频流播放。
   ********\*\*********\_\_\_\_********\*\*********3. 开发与交付计划 (Roadmap)
   Phase 1: MVP (最小可行性产品) - 核心骨架构建
   目标：打通从上传到展示的全链路，验证技术可行性。
   ● 核心任务：
1. 搭建 Next.js 基础环境与 Supabase 初始化。
1. 实现 Admin 专用上传页面：支持单图/短视频上传至 R2。
1. 实现 基础瀑布流视图：展示已发布的媒体。
1. 初步安全性：配置 Supabase RLS，确保只有你拥有写入权限。
   ● 交付物：一个可私下访问的媒体展示 demo。
   Phase 2: Archival & UX (功能增强与质感提升)
   目标：引入“档案馆”逻辑，优化大文件处理。
   ● 核心任务：
1. 高级元数据支持：在数据库中增加地点、年份、人物等字段。
1. Advanced Filter 实现：开发多条件搜索弹窗。
1. 时间轴模式 (Fortepan)：开发横向滑动的年份筛选器。
1. 媒体优化：集成 CF Image Resizing 实现列表页仅加载动态生成的 WebP 缩略图；为长视频探索直链优化或 m3u8 切片。
   ● 交付物：具备搜索和双视图切换功能的 Beta 版本。
   Phase 3: UGC & Collaboration (用户贡献与审核)
   目标：开启特定人群的投稿流程。
   ● 核心任务：
1. 鉴权系统：集成 Clerk 或 Supabase Auth，识别“特定人群”。
1. 投稿队列：建立 status: pending 的逻辑，开发 Admin 审核面板。
1. 大文件断点续传：全面完善基于 S3 Multipart 的预签名分片上传体系，确保 GB 级超大文件极速安全直传 R2。
1. 安全下载：实现 Pre-signed URL 机制，授权用户可下载高清原图。
   ● 交付物：支持受控投稿的协作平台。
   Phase 4: Hardening & Release (加固与正式发布)
   目标：确保数据绝对安全，达到发布标准。
   ● 核心任务：
1. 灾备系统：编写脚本实现 R2 -> Backblaze B2 的异地冷备份。
1. 性能压测：优化瀑布流的虚拟滚动，确保万级数据不卡顿。
1. 全量 SEO 与 PWA：支持离线查看缓存图片，优化分享卡片（OpenGraph）。
   ● 交付物：正式版本 Release v1.0。
   ********\*\*********\_\_\_\_********\*\*********4. 关键数据模型 (Schema Preview)

SQL

-- 媒体资产表预览
CREATE TABLE archive_assets (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
title TEXT NOT NULL,
story TEXT, -- 存储故事描述
year INTEGER,
location TEXT,
media_type VARCHAR(20), -- image/video/audio
storage_path TEXT NOT NULL, -- R2 key
status VARCHAR(20) DEFAULT 'pending', -- 审核状态
metadata JSONB -- 存储分辨率、时长、摄影师等扩展信息
);

********\*\*********\_\_\_\_********\*\*********这份计划平衡了开发效率与系统鲁棒性。你是否需要我针对 Phase 1 的 Supabase 安全策略（RLS）提供更详细的代码配置建议？
