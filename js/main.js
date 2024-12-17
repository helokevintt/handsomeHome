document.addEventListener('DOMContentLoaded', function() {
    // 设置当前年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    const loadingScreen = document.getElementById('loading');
    const mainContent = document.getElementById('main-content');
    
    // 预加载图片
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    function preloadImage(img) {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === images.length) {
                    showMainContent();
                }
            });
        }
    }
    
    images.forEach(preloadImage);
    
    // 将等待时间从3秒改为1秒
    setTimeout(showMainContent, 1000);
    
    function showMainContent() {
        if (!mainContent.classList.contains('visible')) {
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                changeText();
            }, 500);
        }
    }

    // 设置面板控
    const settingsBtn = document.querySelector('.social-link.settings');
    const settingsPanel = document.querySelector('.settings-panel');
    const opacitySlider = document.getElementById('opacity-slider');
    const opacityValue = document.querySelector('.opacity-value');
    const profileCard = document.querySelector('.profile-card');
    const closeBtn = document.querySelector('.close-btn');

    // 切换设置面板
    settingsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        settingsPanel.classList.remove('hidden');
        settingsPanel.classList.add('active');
    });

    // 关闭按钮
    closeBtn.addEventListener('click', function() {
        settingsPanel.classList.remove('active');
    });

    // 调整透明度
    opacitySlider.addEventListener('input', function() {
        const value = this.value;
        opacityValue.textContent = `${value}%`;
        profileCard.style.backgroundColor = `rgba(255, 255, 255, ${value / 100})`;
    });

    // 初始化透明度
    profileCard.style.backgroundColor = `rgba(255, 255, 255, 0.6)`;

    // 点击外部关闭设置面板
    document.addEventListener('click', function(e) {
        if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
            settingsPanel.classList.remove('active');
        }
    });

    // 阻止设置面板内部点击事件冒泡
    settingsPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 状态点控制
    const statusDot = document.querySelector('.status-dot');
    
    // 初始状态设置
    if (document.hasFocus()) {
        statusDot.classList.add('active');
    }

    // 窗口焦点控制
    window.addEventListener('focus', function() {
        statusDot.classList.add('active');
    });
    
    window.addEventListener('blur', function() {
        statusDot.classList.remove('active');
    });

    // 添加悬浮提示
    const tooltips = {
        'blog': '访问我的博客',
        'github': '查看我的开源项目',
        'qq': '联系我',
        'email': '给我发送邮件',
        'settings': '个性化设置'
    };

    // 创建提示框函数
    function showMessage(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            animation: slideDown 0.3s ease forwards;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }

    // 创建提示元素
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    // 为社交链接添加悬停效果
    const socialLinks = document.querySelectorAll('.social-links .social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            const type = link.classList[1];
            tooltip.textContent = tooltips[type];
            tooltip.style.opacity = '1';
            
            // 计算位置
            const rect = link.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.bottom + 10 + 'px';
        });

        link.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });

    // 打字机效果
    const stringArray = [
        "欢迎来到我的主页",
        "Welcome to my homepage",
        "一个热爱生活的人",
        "联系我吧",
        "A person who loves life"
    ];
    let switch_box = document.getElementById('switch-box');
    let index = 0;
    let charIndex = 0;
    let isDelete = false;
    let defaultDelay = 120;  // 稍微加快速度
    let waitDelay = 2500;    // 增加停留时间
    let delay = defaultDelay;

    let changeText = () => {
        const randomDelay = Math.random() * 50;
        delay = defaultDelay + randomDelay;

        // 一个字一个字地显示
        if (charIndex <= stringArray[index].length) {
            switch_box.textContent = stringArray[index].substring(0, charIndex);
            // 每个字都创建烟花效果
            if (charIndex > 0 && !isDelete) {
                createFirework(switch_box, true);
            }
        }

        if (!isDelete) {
            charIndex++;
            if (charIndex > stringArray[index].length) {
                isDelete = true;
                delay = waitDelay;
                createFirework(switch_box, false);
            }
        } else {
            charIndex--;
            if (charIndex < 1) {
                isDelete = false;
                index++;
                if (index >= stringArray.length) {
                    index = 0;
                }
                delay = defaultDelay;
                createFirework(switch_box, false);
            }
        }
        setTimeout(changeText, delay);
    }

    // 创建烟花效果
    function createFirework(element, isDelete) {
        const rect = element.getBoundingClientRect();
        const firework = document.createElement('div');
        firework.className = 'firework';
        const randomOffset = (Math.random() - 0.5) * 150;
        firework.style.left = `${rect.left + rect.width/2 + randomOffset}px`;
        firework.style.top = `${rect.top + rect.height/2}px`;
        
        const particleCount = isDelete ? 40 : 20;
        const colors = [
            '#FFD700', // 金色
            '#FF69B4', // 粉红
            '#00FFFF', // 青色
            '#FF1493', // 深粉红
            '#FFA500', // 橙色
            '#9400D3', // 紫色
            '#00FF7F', // 春绿
            '#7FFF00', // 黄绿色
            '#9400D3'  // 紫罗兰
        ];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (i * 360) / particleCount;
            const distance = 40 + Math.random() * 60;
            const scale = 0.5 + Math.random() * 1;
            particle.style.transform = `rotate(${angle}deg) translate(${distance}px) scale(${scale})`;
            
            firework.appendChild(particle);
        }
        
        document.body.appendChild(firework);
        
        setTimeout(() => {
            firework.remove();
        }, 1000);
    }

    // 添加鼠标跟随的星星效果
    (function fairyDustCursor() {
        var possibleColors = ["#D61C59", "#E7D84B", "#1B8798"]
        var width = window.innerWidth;
        var height = window.innerHeight;
        var cursor = { x: width / 2, y: width / 2 };
        var particles = [];
        window.onMouseMove = function(e) {  // 将函数挂载到window对象上
            if (mouseEffectEnabled) {
                cursor.x = e.clientX;
                cursor.y = e.clientY;
                addParticle(cursor.x, cursor.y, possibleColors[Math.floor(Math.random() * possibleColors.length)]);
            }
        };

        function init() {
            bindEvents();
            loop();
        }

        function bindEvents() {
            document.addEventListener('mousemove', window.onMouseMove);
            window.addEventListener('resize', onWindowResize);
        }

        function onWindowResize(e) {
            width = window.innerWidth;
            height = window.innerHeight;
        }

        function addParticle(x, y, color) {
            var particle = new Particle();
            particle.init(x, y, color);
            particles.push(particle);
        }

        function updateParticles() {
            // 检查容器是否存在
            const container = document.querySelector('.js-cursor-container');
            if (!container) return;

            for (var i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            for (var i = particles.length - 1; i >= 0; i--) {
                if (particles[i].lifeSpan < 0) {
                    particles[i].die();
                    particles.splice(i, 1);
                }
            }
        }

        function loop() {
            requestAnimationFrame(loop);
            updateParticles();
        }

        function Particle() {
            this.characters = ["✦", "✧", "⋆", "✫", "✬", "✭", "✯", "✰", ""];
            this.lifeSpan = 120;
            this.initialStyles = {
                "position": "fixed",
                "display": "inline-block",
                "top": "0px",
                "left": "0px",
                "pointerEvents": "none",
                "touch-action": "none",
                "z-index": "10000000",
                "fontSize": "20px",
                "will-change": "transform"
            };

            this.init = function (x, y, color) {
                this.velocity = {
                    x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
                    y: 0.8 + Math.random() * 0.4
                };
                this.position = { x: x + 10, y: y + 10 };
                this.initialStyles.color = color;

                this.element = document.createElement('span');
                this.element.innerHTML = this.characters[Math.floor(Math.random() * this.characters.length)];
                applyProperties(this.element, this.initialStyles);
                this.update();

                document.querySelector('.js-cursor-container').appendChild(this.element);
            };

            this.update = function () {
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
                this.lifeSpan--;
                this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px, 0) scale(" + (this.lifeSpan / 120) + ")";
            }

            this.die = function () {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }
        }

        function applyProperties(target, properties) {
            for (var key in properties) {
                target.style[key] = properties[key];
            }
        }

        if (!('ontouchstart' in window || navigator.msMaxTouchPoints)) init();
    })();

    // 禁用右键菜单
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showMessage('为了网站安全，请禁用右键菜单');
        return false;
    });
    
    // // 禁用 F12 和其他开发者工具
    // window.addEventListener('keydown', function(e) {
    //     // 检测 F12 键
    //     if (e.key === 'F12') {
    //         e.preventDefault();
    //         showMessage('为了网站安全，请不要打开开发者工具');
    //     }
    // });

    // 监测开发者工具的打开状态
    setInterval(function() {
        const devtoolsOpen = window.devtools && window.devtools.open;
        if (devtoolsOpen) {
            showMessage('为了网站安全，请不要打开开发者工具');
            window.location.reload(); // 刷新页面
        }
    }, 1000);

    const mouseEffectToggle = document.getElementById('mouse-effect');
    const clickEffectToggle = document.getElementById('click-effect');
    let mouseEffectEnabled = true;
    let clickEffectEnabled = true;

    // 击文字效果
    const words = ["富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善"];
    const colors = [
        "#FF0000", // 红色
        "#FF7F00", // 橙色
        "#FFFF00", // 黄色
        "#00FF00", // 绿色
        "#00FFFF", // 青色
        "#0000FF", // 蓝色
        "#8B00FF", // 紫色
        "#FF1493", // 粉红
        "#FF4500", // 橘红
        "#32CD32", // 酸橙
        "#4169E1", // 皇家蓝
        "#9370DB"  // 中紫色
    ];
    let wordIndex = 0;

    document.addEventListener('click', function(e) {
        if (!clickEffectEnabled) return;
        
        const span = document.createElement('span');
        span.textContent = words[wordIndex];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        wordIndex = (wordIndex + 1) % words.length;

        span.style.cssText = `
            position: fixed;
            z-index: 999999;
            top: ${e.clientY - 20}px;
            left: ${e.clientX}px;
            font-weight: bold;
            color: ${randomColor};
            text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
            pointer-events: none;
            animation: floatUp 1.5s ease-out forwards;
            font-size: 16px;
        `;

        document.body.appendChild(span);
        setTimeout(() => span.remove(), 1500);
    });

    // 鼠标特效开关控制
    mouseEffectToggle.addEventListener('change', function() {
        mouseEffectEnabled = this.checked;
        const container = document.querySelector('.js-cursor-container');
        
        if (!mouseEffectEnabled) {
            // 清除所有现有的特效元素
            while (container && container.firstChild) {
                container.removeChild(container.firstChild);
            }
            // 移除鼠标移动事件监听器
            document.removeEventListener('mousemove', window.onMouseMove);
        } else {
            // 重新添加鼠标移动事件监听器
            document.addEventListener('mousemove', window.onMouseMove);
        }
    });

    // 点击特效开关控制
    clickEffectToggle.addEventListener('change', function() {
        clickEffectEnabled = this.checked;
    });

    // 壁纸链接
    const defaultWallpaper = "https://files.codelife.cc/itab/defaultWallpaper/videos/02.mp4"; // 当前使用的默认壁纸链接
    const videoBackground = document.querySelector('.video-background');
    const bingWallpaperButton = document.getElementById('bing-wallpaper');
    const resetWallpaperButton = document.getElementById('reset-wallpaper');

    // 初始化壁纸
    async function initializeWallpaper() {
        const savedWallpaper = localStorage.getItem('customWallpaper');
        if (savedWallpaper) {
            // 果有保存的壁纸，使用它
            setWallpaper(savedWallpaper);
        } else {
            // 否则从 wallpapers.json 机选择一个纸
            try {
                const encodedData = await loadWallpapers(); // 加载并编码 JSON 数据
                const decodedData = JSON.parse(atob(encodedData)); // 解码 Base64 数据

                if (decodedData.code === 200 && decodedData.data.length > 0) {
                    const randomIndex = Math.floor(Math.random() * decodedData.data.length);
                    const randomVideoUrl = decodedData.data[randomIndex].url; // 随机选择一个视频 URL
                    setWallpaper(randomVideoUrl); // 设置壁纸
                } else {
                    setWallpaper(defaultWallpaper); // 如果没数据，用默认壁纸
                }
            } catch (error) {
                console.error("初始化壁纸时发生错误:", error);
                setWallpaper(defaultWallpaper); // 如果发生错误，使用默认壁纸
            }
        }
    }

    // 设置壁纸的函数
    function setWallpaper(url) {
        videoBackground.innerHTML = `
            <div class="video-wrap">
                ${url.endsWith('.mp4') ? 
                    `<video autoplay loop muted playsinline class="video-content">
                        <source src="${url}" type="video/mp4">
                    </video>` : 
                    `<img src="${url}" class="video-content" style="width: 100%; height: 100%; object-fit: cover;">`}
            </div>
            <div class="video-overlay"></div>
        `;
    }

    // 初始化壁纸
    initializeWallpaper();

    // Base64 编码函数
    function base64Encode(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    // 获取日 Bing 图片
    bingWallpaperButton.addEventListener('click', async function() {
        const cachedImage = localStorage.getItem('bingWallpaper'); // 尝试从缓存中获取
        const cachedTime = localStorage.getItem('bingWallpaperTime'); // 获取缓存时间

        // 获取当前时间
        const now = new Date();
        const currentHour = now.getHours();
        const currentDate = now.toISOString().split('T')[0]; // 获取当前日期（YYYY-MM-DD）

        // 检查缓存间是否在今天的 00:00 之前
        if (cachedImage && cachedTime && (Date.now() - cachedTime < 3600000) && (new Date(parseInt(cachedTime)).toISOString().split('T')[0] === currentDate)) {
            setWallpaper(cachedImage);
            showMessage('已使用缓存的每日 Bing 图片');
            return;
        } else {
            // 如果存过，清除缓存
            localStorage.removeItem('bingWallpaper');
            localStorage.removeItem('bingWallpaperTime');
        }

        const apiUrl = 'https://myhkw.cn/open/img/bing?key=a32f84f6c318499a8b0dd369b080ca4d&type=json';
        try {
            const response = await fetch(apiUrl); // 使用端代理
            const data = await response.json();

            // 检查响应状态
            if (data.code === 1) {
                const imageUrl = data.img; // 获取图片地址
                setWallpaper(imageUrl);
                localStorage.setItem('bingWallpaper', imageUrl); // 缓存每日 Bing 图片
                localStorage.setItem('bingWallpaperTime', Date.now()); // 保存缓存时间
                showMessage('每日 Bing 图片已设置！');
            } else {
                showMessage(`获取每日 Bing 图片失败：${data.msg}`); // 显示错误信息
            }
        } catch (error) {
            showMessage(`获取每日 Bing 图片失败：${error.message}`);
        }
    });

    // 获取莫哈维动态图
    const mojaveWallpaperButton = document.getElementById('mojaveWallpaperButton');
    mojaveWallpaperButton.addEventListener('click', async function() {
        const apiUrl = 'https://myhkw.cn/open/img/mojave?key=a32f84f6c318499a8b0dd369b080ca4d&type=json';
        
        try {
            const response = await fetch(apiUrl); // 使用后端代理
            const data = await response.json();

            // 检查响应状态
            if (data.code === 1) {
                const imageUrl = data.img; // 获取图片地址
                setWallpaper(imageUrl); // 设置壁纸
                showMessage('莫哈维动态图已设置！');
            } else {
                showMessage(`获取莫哈维动态图失败：${data.msg}`); // 显示错误信息
            }
        } catch (error) {
            showMessage(`获取莫哈维动态图失败：${error.message}`);
        }
    });

    // 恢复默认壁纸
    resetWallpaperButton.addEventListener('click', function() {
        setWallpaper(defaultWallpaper);
        localStorage.removeItem('customWallpaper'); // 清除保存的壁纸
        showMessage('已恢复默认壁纸！');
    });

    // 获取随机动态壁纸
    async function getRandomWallpaper() {
        try {
            const encodedData = await loadWallpapers(); // 加载并编码 JSON 数据
            const decodedData = JSON.parse(atob(encodedData)); // 解码 Base64 数据

            if (decodedData.code === 200 && decodedData.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * decodedData.data.length);
                const randomVideoUrl = decodedData.data[randomIndex].url;
                setWallpaper(randomVideoUrl);
                localStorage.setItem('customWallpaper', randomVideoUrl);
                showMessage('随机动态壁纸已设置！');
            } else {
                showMessage('获取动态壁纸失败，请重试');
            }
        } catch (error) {
            console.error("获取动态壁纸时发生错��:", error);
            showMessage(`获取动态壁纸失败：${error.message}`);
        }
    }

    // 绑定按钮事件
    const randomWallpaperButton = document.getElementById('random-wallpaper'); // 假设您有一个按钮用于获取随机壁纸
    randomWallpaperButton.addEventListener('click', getRandomWallpaper);

    // 加载 JSON 文件并返回其内容
    async function loadWallpapers() {
        try {
            const response = await fetch('wallpapers.json'); // 获取 JSON 文件
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // 抛出错误
            }
            const data = await response.json(); // 解析 JSON 数据
            return btoa(JSON.stringify(data)); // 将 JSON 数据编码为 Base64
        } catch (error) {
            console.error("加载壁纸时发生错误:", error);
            throw error; // 重新抛出错误以便在调用时处理
        }
    }

    function showInteractiveMessage() {
        // 创建模态框的 HTML 结构
        const modalHTML = `
            <div class="modal fade" id="interactiveModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalLabel">${announcementConfig.popupTitle}</h5>
                        </div>
                        <div class="modal-body">
                            <p>${announcementConfig.popupMessage}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="confirmButton">${announcementConfig.confirmButtonText}</button>
                            <button type="button" class="btn btn-secondary" id="dismissButton">${announcementConfig.dismissButtonText}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 将模态框添加到文档中
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // 显示模态框
        $('#interactiveModal').modal('show');

        // 处理确认按钮点击事件
        document.getElementById('confirmButton').onclick = function() {
            localStorage.setItem('popupDismissed', Date.now()); // 设置弹窗被确认的时间
            $('#interactiveModal').modal('hide');
            // 移除模态框
            setTimeout(() => {
                document.getElementById('interactiveModal').remove();
                if (announcementConfig.redirectFlag) {
                    window.open(announcementConfig.redirectUrl, '_blank'); // 在新窗口中跳转
                }
            }, 300); // 等待模态框动画结束后再移除
        };

        // 处理稍后再说按钮点击事件
        document.getElementById('dismissButton').onclick = function() {
            localStorage.setItem('popupDismissed', Date.now()); // 设置弹窗被确认的时间
            $('#interactiveModal').modal('hide');
            // 移除模态框
            setTimeout(() => {
                document.getElementById('interactiveModal').remove();
            }, 300); // 等待模态框动画结束后再移除
        };
    }

    // 引入配置文件
    const script = document.createElement('script');
    script.src = 'js/config.js';
    script.onload = function() {
        // 页面载完成后显示出提示
        setTimeout(() => {
            const dismissedTime = localStorage.getItem('popupDismissed');
            if (announcementConfig.showPopup && (!dismissedTime || (Date.now() - dismissedTime > announcementConfig.popupDismissTime))) {
                showInteractiveMessage(); // 调用弹窗函数
            }
        }, announcementConfig.popupDelay);
    };
    document.head.appendChild(script);
}); 