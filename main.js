// ==UserScript==
// @name         微信读书-全本一键下载 (自定义延时+可选排版)
// @namespace    http://tampermonkey.net/
// @version      2025.02.08.3
// @description  一键抓取微信读书全本内容，支持自定义随机延时，可选择是否强制左对齐(纯净模式)，含防封禁机制
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weread.qq.com
// @author       You
// @match        https://weread.qq.com/web/reader/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://unpkg.com/turndown/dist/turndown.js
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    console.log('WeRead Script Loaded.');

    // ==========================================
    // 1. 核心解密类 (保持不变)
    // ==========================================
    class WereadGenerateBrowser {
        constructor(book_id, chapter_id, pc, ps) {
            this.book_id = book_id;
            this.chapter_id = chapter_id;
            this.pc = pc;
            this.ps = ps;
        }
        static instance() { return new WereadGenerateBrowser('1', '1', '1', '1') }
        md5_hex(message) { return this.#md5(message); }
        #md5(str) {
            function md5cycle(x, k) {
                let a = x[0], b = x[1], c = x[2], d = x[3];
                a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586);
                c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
                a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426);
                c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
                a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417);
                c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
                a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101);
                c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
                a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632);
                c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
                a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083);
                c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
                a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690);
                c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
                a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
                c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
                a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463);
                c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
                a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353);
                c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
                a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222);
                c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
                a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835);
                c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
                a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415);
                c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
                a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606);
                c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
                a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744);
                c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
                a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379);
                c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
                x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
            }
            function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); }
            function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
            function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
            function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
            function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
            function md51(s) {
                const txt = ''; const n = s.length; const state = [1732584193, -271733879, -1732584194, 271733878];
                let i; for (i = 64; i <= n; i += 64) { md5cycle(state, md5blk(s.substring(i - 64, i))); }
                s = s.substring(i - 64); const tail = Array(16).fill(0);
                for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
                tail[(i >> 2)] |= 0x80 << ((i % 4) << 3);
                if (i > 55) { md5cycle(state, tail); tail.fill(0); }
                tail[14] = n * 8; md5cycle(state, tail); return state;
            }
            function md5blk(s) {
                const blks = [];
                for (let i = 0; i < 64; i += 4) { blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24); }
                return blks;
            }
            function rhex(n) { const s = "0123456789abcdef"; let out = ""; for (let j = 0; j < 4; j++) out += s[(n >> (j * 8 + 4)) & 0x0F] + s[(n >> (j * 8)) & 0x0F]; return out; }
            function hex(x) { return x.map(rhex).join(""); }
            function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
            return hex(md51(str));
        }

        _0x58fb1d(s) {
            let a = 0x15051505; let b = a; const length = s.length; let i = length - 1;
            while (i > 0) {
                a = (a ^ (s.charCodeAt(i) << ((length - i) % 30))) & 0x7fffffff;
                b = (b ^ (s.charCodeAt(i - 1) << (i % 30))) & 0x7fffffff;
                i -= 2;
            }
            return (a + b).toString(16).toLowerCase();
        }

        async _e(s) {
            s = String(s); const h = this.md5_hex(s); let result = h.substring(0, 3);
            let chunks, type_flag;
            if (/^\d+$/.test(s)) {
                chunks = []; for (let i = 0; i < s.length; i += 9) { chunks.push(parseInt(s.substring(i, i + 9)).toString(16)); }
                type_flag = "3";
            } else { chunks = [Array.from(s).map(c => c.charCodeAt(0).toString(16)).join("")]; type_flag = "4"; }
            result += type_flag + "2" + h.slice(-2);
            chunks.forEach((chunk, idx) => {
                let lenHex = chunk.length.toString(16); if (lenHex.length === 1) lenHex = "0" + lenHex;
                result += lenHex + chunk; if (idx < chunks.length - 1) result += "g";
            });
            if (result.length < 20) result += h.slice(0, 20 - result.length);
            result += this.md5_hex(result).slice(0, 3);
            return result;
        }

        async get_request_param() {
            let bid = await this._e(this.book_id);
            let cid = await this._e(this.chapter_id);
            const book = { b: bid, c: cid, ct: `${Math.floor(Date.now() / 1000)}`, pc: this.pc, prevChapter: "false", ps: this.ps, r: String(Math.floor(10000 * Math.random()) ** 2), sc: 0, st: 0 };
            const s = Object.entries(book).map(([k, v]) => `${k}=${v}`).join("&");
            book.s = this._0x58fb1d(s);
            return book;
        }
    }

    // ==========================================
    // 2. 拖拽辅助类
    // ==========================================
    class DragElement {
        constructor(el, options = {}) {
            this.el = typeof el === "string" ? document.querySelector(el) : el;
            if (!this.el) return;
            this.options = Object.assign({ saveKey: null, boundary: window }, options);
            this.dragging = false; this.pointerId = null; this.startPointerX = 0; this.startPointerY = 0;
            this.startLeft = 0; this.startTop = 0; this.movedDuringPointer = false; this.suppressClick = false;
            this.loadPos(); this.bindEvents();
        }
        pxToNum(v) { return v ? parseFloat(v.replace("px", "")) : 0; }
        setPos(left, top) { this.el.style.left = left + "px"; this.el.style.top = top + "px"; }
        loadPos() {
            if (!this.options.saveKey) return;
            try {
                const raw = localStorage.getItem(this.options.saveKey);
                if (!raw) return;
                const pos = JSON.parse(raw);
                requestAnimationFrame(() => {
                    const w = this.el.offsetWidth; const h = this.el.offsetHeight;
                    const maxL = Math.max(window.innerWidth - w, 0); const maxT = Math.max(window.innerHeight - h, 0);
                    this.setPos(Math.min(Math.max(pos.left, 0), maxL), Math.min(Math.max(pos.top, 0), maxT));
                });
            } catch (e) {}
        }
        savePos() {
            if (!this.options.saveKey) return;
            try { localStorage.setItem(this.options.saveKey, JSON.stringify({ left: this.pxToNum(getComputedStyle(this.el).left), top: this.pxToNum(getComputedStyle(this.el).top) })); } catch (e) {}
        }
        bindEvents() {
            this.el.addEventListener("pointerdown", this.onDown.bind(this));
            window.addEventListener("pointermove", this.onMove.bind(this));
            window.addEventListener("pointerup", this.onUp.bind(this));
            this.el.addEventListener("click", this.onClick.bind(this));
            window.addEventListener("resize", this.onResize.bind(this));
        }
        onDown(e) {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            e.preventDefault(); this.el.setPointerCapture(e.pointerId);
            this.pointerId = e.pointerId; this.dragging = true; this.movedDuringPointer = false;
            this.startPointerX = e.clientX; this.startPointerY = e.clientY;
            this.startLeft = this.pxToNum(getComputedStyle(this.el).left); this.startTop = this.pxToNum(getComputedStyle(this.el).top);
            this.el.classList.add("dragging"); document.body.style.userSelect = "none";
        }
        onMove(e) {
            if (!this.dragging || e.pointerId !== this.pointerId) return;
            e.preventDefault();
            const dx = e.clientX - this.startPointerX; const dy = e.clientY - this.startPointerY;
            let newLeft = Math.round(this.startLeft + dx); let newTop = Math.round(this.startTop + dy);
            const w = this.el.offsetWidth; const h = this.el.offsetHeight;
            this.setPos(Math.min(Math.max(newLeft, 0), Math.max(window.innerWidth - w, 0)), Math.min(Math.max(newTop, 0), Math.max(window.innerHeight - h, 0)));
            this.movedDuringPointer = true;
        }
        onUp(e) {
            if (!this.dragging || e.pointerId !== this.pointerId) return;
            try { this.el.releasePointerCapture(e.pointerId); } catch (e) {}
            this.dragging = false; this.pointerId = null; this.el.classList.remove("dragging"); document.body.style.userSelect = "";
            if (this.movedDuringPointer) { this.savePos(); this.suppressClick = true; setTimeout(() => (this.suppressClick = false), 50); }
        }
        onClick(e) { if (this.suppressClick) { e.preventDefault(); e.stopImmediatePropagation(); } }
        onResize() { this.onMove({ clientX: this.startPointerX, clientY: this.startPointerY, pointerId: this.pointerId, preventDefault: () => {} }); }
    }

    // ==========================================
    // 3. 全局变量与拦截器
    // ==========================================
    var bookInfo = {};
    let params = {};
    var readProgress = null;
    var contents = {};
    var clickedChapters = new Set();
    const OriginalXHR = window.XMLHttpRequest;
    const originalOpen = OriginalXHR.prototype.open;
    const originalSend = OriginalXHR.prototype.send;

    OriginalXHR.prototype.open = function (method, url, async, user, password) {
        this._url = url; this._method = method;
        return originalOpen.apply(this, arguments);
    };

    OriginalXHR.prototype.send = function (body) {
        if (this._url && this._url.includes('/web/book/chapter/')) {
            try { params = JSON.parse(body); } catch(e) {}
        } else if(this._url.includes('/web/book/getProgress')) {
            this.addEventListener('load', function () {
                try { readProgress = JSON.parse(this.responseText); } catch(e) {}
            });
        }
        return originalSend.apply(this, arguments);
    };

    // ==========================================
    // 4. UI 初始化与逻辑
    // ==========================================
    function initUI() {
        $('<style>').text(`
            #simple-copy-btn, .copy-md, #download-all-btn { border: none; border-radius: 5px; padding: 5px 10px; font-size: 13px; color: white; cursor: pointer; margin-right: 5px; }
            #simple-copy-btn { background: #007bff; } #simple-copy-btn:hover { background: #0056b3; }
            .copy-md { background: #6c757d; } .copy-md:hover { background: #545b62; }
            #download-all-btn { background: #d32f2f; } #download-all-btn:hover { background: #b71c1c; }
            #download-all-btn:disabled { background: #e0e0e0; color: #999; cursor: not-allowed; }

            #chapter-list-btn { position: fixed; top: 140px; right: 20px; z-index: 9999; border: none; border-radius: 20px; padding: 5px 15px; cursor: pointer; background: #28a745; color: #fff; font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); width: max-content; }
            #chapter-list-panel { position: fixed; top: 200px; right: 20px; max-width: 320px; max-height: 80vh; overflow-y: auto; background: #fff; color: #333; border-radius: 10px; padding: 15px; box-shadow: 0 2px 20px rgba(0,0,0,0.3); z-index: 99999; display: none; }
            #chapter-list-panel .header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            #chapter-list-panel .close { cursor: pointer; color: #999; }
            .action-bar { margin-bottom: 10px; display: flex; flex-wrap: wrap; gap: 5px; }

            .config-box { background: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 10px; font-size: 12px; border: 1px solid #e9ecef;}
            .config-box input[type="number"] { width: 40px; border: 1px solid #ccc; border-radius: 3px; text-align: center; margin: 0 3px; }
            .config-row { margin-bottom: 6px; }
            .config-row:last-child { margin-bottom: 0; }

            .format-box { margin-bottom: 10px; font-size: 13px; color: #666; }
            #chapter-list-panel ul { list-style: none; padding: 0; margin: 0; }
            #chapter-list-panel li { padding: 8px 4px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
            #chapter-list-panel li:hover { background: #f9f9f9; }
            .copy-ch-btn, .copy-ch-btn-loaded { border: none; background: #e9ecef; color: #333; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-size: 12px; }
            .copy-ch-btn-loaded { background: #d4edda; color: #155724; }
            .copy-ch-btn:hover { background: #ced4da; }
            #__global_toast { position: fixed; left: 50%; top: 80px; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: #fff; padding: 10px 20px; border-radius: 8px; font-size: 14px; z-index: 999999; opacity: 0; pointer-events: none; transition: opacity .3s; }
            #__global_toast.show { opacity: 1; }
        `).appendTo('head');

        // 主按钮
        const $chapterBtn = $(`<button id="chapter-list-btn">📚 章节列表</button>`);
        $('body').append($chapterBtn);

        // 面板 DOM (更新配置区域)
        const $panel = $(`
            <div id="chapter-list-panel">
                <div class="header"><span>功能面板</span><span class="close">✖</span></div>
                <div class="action-bar">
                    <button id="simple-copy-btn" title="复制当前页HTML">当前Html</button>
                    <button class="wx-reader-btn copy-md" title="复制当前页Markdown">当前MD</button>
                    <button id="download-all-btn" title="下载全书到本地">📥 全本下载</button>
                </div>

                <div class="config-box">
                    <div class="config-row">
                        ⏳ 随机延时:
                        <input type="number" id="min-delay" value="2" step="0.5" min="0.5"> -
                        <input type="number" id="max-delay" value="5" step="0.5" min="1"> 秒
                    </div>
                    <div class="config-row" style="display:flex; align-items:center;">
                        <input type="checkbox" id="force-left-align" checked style="margin-right:5px; cursor:pointer;">
                        <label for="force-left-align" style="cursor:pointer;" title="移除原书的缩进、居中和颜色，生成纯净文本">强制左对齐 (纯净模式)</label>
                    </div>
                </div>

                <div class="format-box">
                    <span>格式：</span>
                    <label style="margin-right:10px;"><input type="checkbox" class="fmt" value="md" checked/> Markdown</label>
                    <label><input type="checkbox" class="fmt" value="html"/> HTML</label>
                </div>
                <div style="font-weight:bold; margin-bottom:5px; border-top:1px solid #eee; padding-top:10px;">章节选择:</div>
                <ul></ul>
            </div>
        `);
        $('body').append($panel);

        new DragElement('#chapter-list-btn', { saveKey: 'simple-copy-btn-pos' });

        const $btnCurrentPage = $("#simple-copy-btn");
        const $copyMdBtn = $(`.copy-md`);
        const $btnDownloadAll = $("#download-all-btn");

        // 渲染章节
        function renderChapters(chapters) {
            const $ul = $panel.find("ul");
            $ul.empty();
            const bid = bookInfo.book.bookId;
            chapters.forEach(ch => {
                let clicked = clickedChapters.has(ch.chapterUid) ? '✔' : '📋';
                let copyBtnCls = clickedChapters.has(ch.chapterUid) ? 'copy-ch-btn-loaded' : '';
                $ul.append(`
                    <li class="chapter-item" data-id="${ch.chapterUid}">
                        <span class="chapter-title" style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-right:5px;">${ch.title}</span>
                        <button class="copy-ch-btn ${copyBtnCls}" data-id="${ch.chapterUid}" data-title="${ch.title}">${clicked}</button>
                    </li>
                `);
            });

            $(".copy-ch-btn").on("click", function (e) {
                e.stopPropagation();
                const $btn = $(this);
                const original = $btn.text();
                $btn.text("⏳");
                const fmt = $(".fmt:checked").val() || "md";
                const chapterId = $(this).data("id");

                // 获取是否强制清洗
                const forceClean = $("#force-left-align").prop("checked");

                getTexts(fmt, bid, chapterId, forceClean).then(content => {
                    copyToClipboard(content, "");
                    $btn.text('✔').addClass('copy-ch-btn-loaded');
                }).catch(err => {
                    console.error("❌ 出错:", err);
                    showToast("加载失败");
                    $btn.text(original);
                });
            });
        }

        // 交互逻辑
        $chapterBtn.on("click", () => {
            if(!bookInfo || !bookInfo.updated) { showToast("数据未加载，请刷新页面"); return; }
            renderChapters(bookInfo.updated);
            $panel.show();
        });
        $panel.find(".close").on("click", () => $panel.hide());
        $btnCurrentPage.on('click', handleCurrentPage);
        $copyMdBtn.on('click', handleCopyMarkdown);

        $(document).on("change", ".fmt", function () {
            $(".fmt").not(this).prop("checked", false);
            if (!$(".fmt:checked").length) $(this).prop("checked", true);
        });

        // 辅助：获取随机延时
        function getRandomDelay(minStr, maxStr) {
            let min = parseFloat(minStr) || 1.5;
            let max = parseFloat(maxStr) || 3;
            if(min > max) [min, max] = [max, min];
            // 随机生成
            const ms = Math.floor(Math.random() * (max - min + 1) * 1000) + (min * 1000);
            return ms;
        }

        // ==========================
        // 全本下载核心逻辑
        // ==========================
        $btnDownloadAll.on("click", async function() {
            if(!bookInfo || !bookInfo.updated) { alert("未获取到章节信息，请刷新页面。"); return; }

            const chapters = bookInfo.updated;
            const format = $(".fmt:checked").val() || "md";
            const bookId = bookInfo.book.bookId;
            const bookName = bookInfo.book.title || "未命名书籍";

            // 获取用户配置
            const minD = $("#min-delay").val();
            const maxD = $("#max-delay").val();
            const forceClean = $("#force-left-align").prop("checked");

            if(!confirm(`即将下载《${bookName}》共 ${chapters.length} 章。\n格式：${format}\n纯净模式：${forceClean ? '开启' : '关闭'}\n延时设置：${minD} - ${maxD} 秒/章\n\n⚠️ 请勿关闭页面，保持网络通畅！`)) return;

            const $btn = $(this);
            const originalText = $btn.text();
            $btn.prop("disabled", true);

            let fullContent = "";
            let errorCount = 0;

            if(format === 'md') {
                fullContent += `# ${bookName}\n\n> 作者：${bookInfo.book.author}\n> 来源：微信读书\n\n---\n\n`;
            } else {
                fullContent += `<html><head><meta charset="utf-8"><title>${bookName}</title></head><body><h1>${bookName}</h1><p>作者：${bookInfo.book.author}</p><hr>`;
            }

            for (let i = 0; i < chapters.length; i++) {
                const ch = chapters[i];
                $btn.text(`正在获取: ${i + 1} / ${chapters.length}`);

                try {
                    let content = await getTexts(format, bookId, ch.chapterUid, forceClean);
                    if (format === 'md') {
                        fullContent += `# ${ch.title}\n\n${content}\n\n---\n\n`;
                    } else {
                        fullContent += `<div class="chapter"><h2>${ch.title}</h2>${content}</div><hr>`;
                    }
                    clickedChapters.add(ch.chapterUid);
                } catch (e) {
                    console.error(`章节 [${ch.title}] 下载失败`, e);
                    fullContent += `\n\n[章节: ${ch.title} 获取失败]\n\n`;
                    errorCount++;
                }

                // 随机延时防封
                if (i < chapters.length - 1) {
                    const waitTime = getRandomDelay(minD, maxD);
                    let timeLeft = Math.ceil(waitTime / 1000);
                    while(timeLeft > 0) {
                       $btn.text(`进度: ${i + 1}/${chapters.length} (等待 ${timeLeft}s)`);
                       await new Promise(r => setTimeout(r, 1000));
                       timeLeft--;
                    }
                }
            }

            if (format === 'html') fullContent += `</body></html>`;

            $btn.text("生成文件...");
            downloadFile(fullContent, `${bookName}.${format}`);

            $btn.text("下载完成");
            setTimeout(() => {
                $btn.text(originalText).prop("disabled", false);
                if(errorCount > 0) alert(`下载完成，但有 ${errorCount} 个章节失败。`);
            }, 3000);
        });
    }

    // ==========================================
    // 5. 辅助功能函数
    // ==========================================
    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.replace(/[\\/:*?"<>|]/g, '_');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
    }

    function showToast(msg, duration = 2000) {
        $("#__global_toast").remove();
        const $toast = $(`<div id="__global_toast">${msg}</div>`);
        $("body").append($toast);
        setTimeout(() => $toast.addClass("show"), 10);
        setTimeout(() => { $toast.removeClass("show"); setTimeout(() => $toast.remove(), 300); }, duration);
    }

    function copyToClipboard(text, targetCss) {
        const afterCopy = () => {
            if(!targetCss) showToast('复制完成');
            else {
                const $btn = $(targetCss);
                const originalText = $btn.text();
                $btn.text('✅').css('background', '#28a745');
                setTimeout(() => { $btn.text(originalText).css('background', ''); }, 1500);
            }
        };
        if (typeof GM_setClipboard !== 'undefined') { GM_setClipboard(text, 'text'); afterCopy(); }
        else { navigator.clipboard.writeText(text).then(afterCopy).catch(err => alert('复制失败: ' + err.message)); }
    }

    function handleCurrentPage() {
        try { getTexts('html').then(content => copyToClipboard(content, '#simple-copy-btn')) }
        catch (error) { alert('出错: ' + error.message); }
    }

    function handleCopyMarkdown() {
        getTexts('md').then(content => { if (content) copyToClipboard(content, '.copy-md'); });
    }

    function getCurrentBook() {
        const path = location.pathname.split('/').pop();
        let targetChapter = bookInfo.updated.find(c => path === c.hash);
        return targetChapter ? [bookInfo.book.bookId, targetChapter.chapterUid] : [bookInfo.book.bookId, null];
    }

    async function getTexts(format = 'html', bookId=null, chapterId=null, forceClean=true) {
        let bid = bookId, cid = chapterId;
        if(!bookId && !chapterId) {
            [bid, cid] = getCurrentBook();
            if(!bid || !cid) {
                await reqProgress(bid);
                const chapterIdx = readProgress.book.chapterIdx;
                cid = bookInfo.updated.find(c => chapterIdx === c.chapterIdx)?.chapterUid || cid;
            }
        }

        // 缓存Key包含forceClean，这样切换选项后可以获取不同版本
        const cacheKey = `${format}:${bid}:${cid}:${forceClean}`;
        if(contents[cacheKey]) { clickedChapters.add(cid); return contents[cacheKey]; }

        return await getEpubContent(bid, cid, params.pc, params.ps).then(texts => {
            if (texts.length > 0) {
                let content = get_content(texts);
                if (format === 'md') content = htmlToMarkdown(content, {}, forceClean);
                contents[cacheKey] = `${content}\n\n`;
                clickedChapters.add(cid);
                return `${content}\n\n`;
            }
            return '';
        });
    }

    function htmlToMarkdown(html, options = {}, forceClean = true) {
        if (!TurndownService) return html;

        let cleanHtml = html;

        // 【选项控制】如果勾选了强制左对齐/纯净模式，则执行清洗
        if (forceClean) {
            cleanHtml = cleanHtml
                .replace(/style="[^"]*"/gi, '') // 移除内联样式
                .replace(/<center>/gi, '<div>').replace(/<\/center>/gi, '</div>') // 移除center标签
                .replace(/align="[^"]*"/gi, '') // 移除align属性
                .replace(/class="[^"]*"/gi, ''); // 移除class (有时class包含对齐控制)
        }

        const turndownService = new TurndownService({...{ headingStyle: 'atx', hr: '---', bulletListMarker: '-', codeBlockStyle: 'fenced' }, ...options});
        turndownService.addRule('wereadHighlight', { filter: node => node.nodeName === 'SPAN' && node.className?.includes('highlight'), replacement: content => `**${content}**` });
        turndownService.addRule('wereadNote', { filter: node => node.nodeName === 'DIV' && node.className?.includes('note'), replacement: content => `> ${content}` });
        turndownService.addRule('wereadChapter', { filter: node => (node.nodeName === 'H1' || node.nodeName === 'H2' || node.className?.includes('chapter')), replacement: (content, node) => `${'#'.repeat(node.nodeName === 'H1' ? 1 : 2)} ${content}\n\n` });

        try { return turndownService.turndown(cleanHtml); } catch (error) { return html; }
    }

    function fixHtmlWithDomParser(htmlIn) {
        if (typeof htmlIn !== 'string') return htmlIn;
        const preprocessed = htmlIn.replace(/<title\b[^>]*?\/\s*>/gi, '<title></title>');
        if (!/<html\b[^>]*\sxmlns(\:|=)/i.test(preprocessed)) return preprocessed;
        const parser = new DOMParser();
        const doc = parser.parseFromString(preprocessed, 'text/html');
        return doc.documentElement ? doc.documentElement.outerHTML : htmlIn;
    }

    function get_content(texts, type = 'e') {
        if (texts.length === 4) texts.splice(2, 1);
        else if (texts.length === 2) type = 't';
        let t = texts.map(s => s.slice(32)).join("").slice(1);

        function a(s) {
            const length = s.length; if (length < 4) return []; if (length < 11) return [0, 2];
            const n = Math.min(4, Math.ceil(length / 10)); let tmp = "";
            for (let i = length - 1; i >= length - n; i--) { tmp += parseInt(s.charCodeAt(i).toString(2), 4).toString(); }
            const arr = []; const m = length - n - 2; const step = String(m).length; let i = 0;
            while (arr.length < 10 && i + step < tmp.length) {
                arr.push(parseInt(tmp.slice(i, i + step)) % m);
                arr.push(parseInt(tmp.slice(i + 1, i + 1 + step)) % m); i += step;
            }
            return arr;
        }

        function b(s, arr) {
            const chars = s.split("");
            for (let i = arr.length - 1; i >= 0; i -= 2) {
                for (let k of [1, 0]) {
                    const idx1 = arr[i] + k; const idx2 = arr[i - 1] + k;
                    [chars[idx1], chars[idx2]] = [chars[idx2], chars[idx1]];
                }
            }
            return chars.join("");
        }

        const b64 = b(t, a(t)).replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+/]/g, "");
        let decodedText = ""; try { decodedText = atob(b64); } catch { return ""; }
        decodedText = decodedText.replace(/[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g, (c) => {
             return decodeURIComponent(escape(c));
        });
        if (type === 'e') decodedText = fixHtmlWithDomParser(decodedText);
        return decodedText;
    }

    async function reqProgress(bookId) {
        return await fetch('/web/book/getProgress?bookId=' + bookId).then(resp=>resp.json()).then(data=>{ readProgress = data; return readProgress; });
    }

    async function getEpubContent(bookId, chapterId, pc, ps) {
        const wg = new WereadGenerateBrowser(bookId, chapterId, pc, ps || '11');
        const params = await wg.get_request_param();
        const urls = bookInfo.book.format === "epub" ? ["/web/book/chapter/e_0", "/web/book/chapter/e_1", "/web/book/chapter/e_3"] : ["/web/book/chapter/t_0", "/web/book/chapter/t_1"];
        const texts = [];
        for (let i = 0; i < urls.length; i++) {
            texts.push(await fetch(urls[i], { "headers": { "content-type": "application/json;charset=UTF-8" }, "body": JSON.stringify(params), "method": "POST" }).then(resp => resp.text()));
        }
        return texts;
    }

    async function getBookInfo(bookId) {
        let url = '/web/book/publicchapterInfos';
        let res = await fetch(url, { "headers": { "content-type": "application/json;charset=UTF-8" }, "body": JSON.stringify({"bookIds": [bookId]}), "method": "POST" }).then(r => r.json());
        if (res.data[0].updated.length === 0) {
            res = await fetch('/web/book/chapterInfos', { "headers": { "content-type": "application/json;charset=UTF-8" }, "body": JSON.stringify({"bookIds": [bookId]}), "method": "POST" }).then(r => r.json());
        }
        return res;
    }

    initUI();

    const observer = new MutationObserver((mutations) => {
        const el = document.querySelector('script[type="application/ld+json"]');
        if (el) {
            observer.disconnect();
            try {
                bookInfo = JSON.parse(el.textContent);
                if (bookInfo['@Id']) {
                    getBookInfo(bookInfo['@Id']).then(info => {
                        bookInfo = info.data[0];
                        const gen = new WereadGenerateBrowser('1', '1', '1', '1');
                        gen._e(bookInfo.book.bookId).then(bh=> {
                            bookInfo.updated.forEach(u => { gen._e(u.chapterUid).then(uh => { u.hash = `${bh}k${uh}`; }) });
                        });
                    });
                }
            } catch (e) {}
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

})();
