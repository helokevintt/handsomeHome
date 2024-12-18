class Toolbox {
    constructor() {
        this.tools = [];
        this.categories = [];
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.container = null;
        this.isVisible = false;
        this.defaultIcon = 'https://www.mmm.sd/upload/logo.png';
    }

    async init() {
        // 加载工具配置
        await this.loadConfig();
        
        // 初始化DOM
        this.initDOM();
        
        // 绑定事件
        this.bindEvents();
        
        // 初始化工具卡片
        await this.initTools();
    }

    async loadConfig() {
        try {
            const response = await fetch('js/config/tools.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const config = await response.json();
            this.tools = config.tools;
            this.categories = config.categories;
            this.settings = config.settings;
            
            // 应用设置
            this.applySettings();
        } catch (error) {
            console.error('加载工具配置失败:', error);
            // 使用默认配置
            this.tools = [];
            this.categories = [
                {
                    id: "all",
                    name: "全部",
                    icon: "🏠"
                }
            ];
            this.settings = {
                layout: "grid",
                theme: {
                    light: {
                        primary: "#007bff",
                        background: "#ffffff"
                    }
                }
            };
        }
    }

    applySettings() {
        // 简化设置应用
        if (this.settings && this.settings.theme && this.settings.theme.light) {
            const theme = this.settings.theme.light;
            document.documentElement.style.setProperty('--primary-color', theme.primary);
        }
    }

    initDOM() {
        // 创建工具集容器
        this.container = document.createElement('div');
        this.container.className = 'toolbox-container hidden';
        
        // 创建工具集界面HTML
        this.container.innerHTML = `
            <div class="toolbox-wrapper">
                <div class="toolbox-header">
                    <h2>工具集</h2>
                    <button class="close-toolbox">×</button>
                </div>
                <div class="toolbox-search">
                    <input type="text" placeholder="搜索工具...">
                    <span class="search-icon">🔍</span>
                </div>
                <div class="toolbox-categories"></div>
                <div class="toolbox-content"></div>
            </div>
        `;
        
        document.body.appendChild(this.container);
    }

    bindEvents() {
        // 修改头像点击事件的选择器，使用多个选择器确保能找到头像元素
        const avatars = document.querySelectorAll('.avatar-circle img, .avatar, .loading-avatar');
        avatars.forEach(avatar => {
            if (avatar) {
                avatar.style.cursor = 'pointer';
                avatar.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggle();
                });
            }
        });

        // 关闭按钮事件
        const closeBtn = this.container.querySelector('.close-toolbox');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        // 搜索事件
        const searchInput = this.container.querySelector('.toolbox-search input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterTools();
            });
        }

        // 点击外部关闭
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.hide();
            }
        });
    }

    async initTools() {
        const toolsContainer = this.container.querySelector('.toolbox-content');
        const categoriesContainer = this.container.querySelector('.toolbox-categories');

        // 渲染分类
        categoriesContainer.innerHTML = this.categories.map(category => `
            <button class="category-btn ${category.id === 'all' ? 'active' : ''}" 
                    data-category="${category.id}">
                ${category.name}
            </button>
        `).join('');

        // 分类点击事件
        categoriesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                this.currentCategory = e.target.dataset.category;
                categoriesContainer.querySelectorAll('.category-btn').forEach(btn => 
                    btn.classList.toggle('active', btn.dataset.category === this.currentCategory)
                );
                this.filterTools();
            }
        });

        // 初始化工具卡片
        await this.loadToolsInfo();
        this.filterTools();
    }

    async loadToolsInfo() {
        // 只处理默认值
        this.tools = this.tools.map(tool => ({
            ...tool,
            icon: tool.icon || this.settings?.defaultIcon || 'https://www.mmm.sd/upload/logo.png',
            description: tool.description || ''
        }));
    }

    filterTools() {
        const toolsContainer = this.container.querySelector('.toolbox-content');
        
        // 过滤工具列表
        const filteredTools = this.tools.filter(tool => {
            // 1. 搜索过滤: 检查工具名称、描述和标签是否包含搜索关键词
            const matchesSearch = 
                tool.name.toLowerCase().includes(this.searchQuery) ||
                (tool.description || '').toLowerCase().includes(this.searchQuery);
            
            // 2. 分类过滤: 检查工具的标签是否包含当前选中的分类
            // 如果是"全部"分类(all)则始终返回true
            const matchesCategory = 
                this.currentCategory === 'all' || 
                tool.tags.includes(this.currentCategory); // 精确匹配分类ID
            
            // 3. 在标签中隐藏分类ID
            tool.displayTags = tool.tags.filter(tag => 
                !this.categories.some(category => category.id === tag)
            );
            
            // 同时满足搜索和分类条件才显示
            return matchesSearch && matchesCategory;
        });

        // 渲染过滤后的工具卡片
        toolsContainer.innerHTML = filteredTools.map(tool => this.createToolCard(tool)).join('');
    }

    createToolCard(tool) {
        const defaultIcon = this.settings?.defaultIcon || 'https://www.mmm.sd/upload/logo.png';
        return `
            <div class="tool-card ${tool.hot ? 'hot' : ''}" data-url="${tool.url}" onclick="window.open('${tool.url}', '_blank')">
                <div class="tool-icon">
                    <img src="${tool.icon || defaultIcon}" alt="${tool.name}" 
                         onerror="this.src='${defaultIcon}'">
                    ${tool.hot ? '<span class="hot-badge">HOT</span>' : ''}
                </div>
                <div class="tool-info">
                    <h3>${tool.name}</h3>
                    <p>${tool.description || ''}</p>
                    <div class="tool-tags">
                        ${tool.displayTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    toggle() {
        this.isVisible ? this.hide() : this.show();
    }

    show() {
        if (this.container) {
            this.container.classList.remove('hidden'); // 先移除 hidden
            requestAnimationFrame(() => {
                this.container.classList.add('active');
                this.isVisible = true;
            });
        }
    }

    hide() {
        if (this.container) {
            this.container.classList.remove('active');
            this.isVisible = false;
        }
    }
}

// 初始化工具集
document.addEventListener('DOMContentLoaded', () => {
    const toolbox = new Toolbox();
    toolbox.init();
}); 