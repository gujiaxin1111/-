

// 滚动监听模块

const scrollTopBtn = document.getElementById('scrollTopBtn');

// 监听页面滚动事件
window.addEventListener('scroll', () => {
  // 当滚动距离超过100px时显示返回顶部按钮
  if (window.scrollY > 100) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

// 返回顶部按钮点击事件（平滑滚动）
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // 平滑滚动效果
  });
});


// 主题切换模块

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// 初始化主题（优先读取本地存储，默认浅色）
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '🌞'; // 切换为白天图标
  } else {
    body.classList.remove('dark-mode');
    themeToggle.textContent = '🌓'; // 切换为夜晚图标
  }
}

// 主题切换点击事件
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode'); // 切换主题类
  const isDarkMode = body.classList.contains('dark-mode');

  // 存储主题状态到本地存储
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

  // 更新图标显示
  themeToggle.textContent = isDarkMode ? '🌞' : '🌓';
});


// 轮播图
 
        var mySwiper = new Swiper('.swiper',{
            direction: 'horizontal',
            loop: true,
           
            effect: 'fade',
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

// 卡片鼠标移入/移出动画（已有CSS过渡，JS可增强交互反馈）
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    // 放大卡片（配合CSS的transform）
    card.style.transform = 'scale(1.03)';
    // 动态修改阴影颜色为主色
    card.style.boxShadow = `0 8px 20px rgba(${getRGBValue('--primary-color')}, 0.2)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'scale(1)';
    card.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.1)';
  });
});

// 辅助函数支持带Alpha的16进制色（如#FF0000AA）
function getRGBValue(variable) {
  const computedStyle = getComputedStyle(document.documentElement);
  const hexColor = computedStyle.getPropertyValue(variable).trim();

  // 处理带Alpha通道的16进制色
  const is8Char = hexColor.length === 9; // #RRGGBBAA
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), is8Char ? 7 : 9, 16);

  return `${r}, ${g}, ${b}`;
}

// 新增：预计算主色RGB并绑定到元素属性（避免重复计算）
const primaryColorRGB = getRGBValue('--primary-color');
document.documentElement.style.setProperty('--primary-color-rgb', primaryColorRGB);

// 初始化进度条
const progressBars = document.querySelectorAll('.progress-bar');

progressBars.forEach(bar => {
  const percent = bar.dataset.percent; // 获取data-percent值
  bar.style.setProperty('--progress-width', `${percent}%`); // 绑定CSS变量
});


const chatToggle = document.getElementById('chatbotToggle');
const chatPopup = document.getElementById('chatPopup');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// 切换窗口显示状态
chatToggle.addEventListener('click', () => {
  chatPopup.classList.toggle('show');
});

// 发送消息处理
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // 显示用户消息
  addMessage(message, 'user');
  userInput.value = '';

  // 调用OpenAI API
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'sk-214a4ede5bc44e90bb3ef713b66e2113', 
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;
    addMessage(aiMessage, 'ai');
  } catch (error) {
    addMessage('抱歉，暂时无法获取回答，请稍后再试。', 'ai');
    console.error('API调用错误:', error);
  }
}

// 添加消息到聊天窗口
function addMessage(content, role) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  messageDiv.innerHTML = `<p>${content}</p>`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight; // 自动滚动到底部
}
