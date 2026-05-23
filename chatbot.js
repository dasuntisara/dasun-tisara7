/* ═══════════════════════════════════════════════════════
   DASUN TISARA — AI Chatbot + Phone Notifications
   Claude AI powered | ntfy.sh push messages | 2025
═══════════════════════════════════════════════════════

   SETUP (one-time, 5 minutes):
   ─────────────────────────────
   STEP 1 — Get Claude API Key (FREE tier available):
     → Go to: https://console.anthropic.com
     → Create account → API Keys → Create Key
     → Paste below as ANTHROPIC_KEY

   STEP 2 — Setup phone notifications:
     → Download "ntfy" app (Android: Play Store / iOS: App Store)
     → Open app → tap "+" → type your NTFY_TOPIC exactly
     → That's it! Messages will appear as notifications

   STEP 3 — Fill in your config below:
══════════════════════════════════════════════════════ */

(function () {

  /* ══════════════════════════════════════════════════
     ⚙️  YOUR CONFIG — FILL THESE IN
  ════════════════════════════════════════════════════ */
  const CONFIG = {
    ANTHROPIC_KEY : "YOUR_API_KEY_HERE",    // paste your key from console.anthropic.com
    NTFY_TOPIC    : "dasun_portfolio_2025", // IMPORTANT: must match exactly what you typed in ntfy app
  };

  /* ══════════════════════════════════════════════════
     📋  DASUN'S PERSONAL INFO (bot uses this)
  ════════════════════════════════════════════════════ */
  const DASUN_INFO = `
You are a friendly personal assistant chatbot on Dasun Tisara's portfolio website.
Your job is to answer questions about Dasun warmly and helpfully.
Keep answers short (2-4 sentences max) unless asked for details.
Use emojis naturally. Never make up information.

DASUN'S PERSONAL PROFILE:
- Full name: G.D.T. Aberathna (Dasun Tisara)
- Nationality: Sri Lankan
- Location: Urubokka, Sri Lanka
- Education: BSc Computer Science, University of Colombo, 1st Year Undergraduate, Batch 2025
- Profession: Web Developer

SKILLS:
Technical: HTML & CSS (Beginner), C Programming (Beginner), Python (Beginner), C++ (Beginner), MS Office (Intermediate)
Soft skills: Communication, Teamwork, Time Management, Problem Solving, Work Ethic

PROJECTS:
1. Portfolio Website — personal portfolio built with HTML5, CSS3, Flexbox, Grid and JavaScript animations
2. C Maze Game — console-based maze game in C with 2-floor grid, wall collision detection, score system, timer

CONTACT:
Email: dasuntisara5@gmail.com
WhatsApp: 074 119 4259
Telephone: 072 687 1140
Facebook: https://www.facebook.com/share/1CUzjT11CH/
TikTok: @dasun.tisara

DiSSMAC GLOBAL:
Dasun is an active member of DiSSMaC Global, a Sri Lankan IT company with the motto "One Vision. Limitless Reach."
They deliver professional web development, digital advertising and smart business systems.
Website: dissmacglobal.com

PERSONALITY:
Dasun is passionate about technology, hardworking, and eager to learn.
He is a 1st year undergraduate who is already building real projects.

If someone asks something you truly don't know, say:
"I don't have that specific info, but you can reach Dasun directly at dasuntisara5@gmail.com or WhatsApp 074 119 4259!"

Always respond in the same language the user writes in (English or Sinhala).
`.trim();

  /* ══════════════════════════════════════════════════
     🤖  CLAUDE API CALL
  ════════════════════════════════════════════════════ */
  const chatHistory = [];

  async function askClaude(userMessage) {
    if (!CONFIG.ANTHROPIC_KEY || CONFIG.ANTHROPIC_KEY === "YOUR_API_KEY_HERE") {
      return localFallback(userMessage);
    }

    chatHistory.push({ role: "user", content: userMessage });

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CONFIG.ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 350,
          system: DASUN_INFO,
          messages: chatHistory.slice(-8) // last 8 messages for context
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn("Claude API error:", err);
        return localFallback(userMessage);
      }

      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm having trouble responding right now. Try again!";

      chatHistory.push({ role: "assistant", content: reply });
      return reply;

    } catch (err) {
      console.warn("Network error:", err);
      return localFallback(userMessage);
    }
  }

  /* ══════════════════════════════════════════════════
     🔄  LOCAL FALLBACK (if no API key set)
  ════════════════════════════════════════════════════ */
  const FALLBACK = [
    { k: ["hello","hi","hey","hii","ayubowan"],
      r: "👋 Hi! I'm Dasun's personal assistant. Ask me anything about Dasun — his skills, projects, education or how to contact him!" },
    { k: ["who","dasun","tisara","about","kaudu"],
      r: "🙋 Dasun Tisara (G.D.T. Aberathna) is a 1st year CS undergraduate at University of Colombo, Batch 2025, and a passionate web developer." },
    { k: ["skill","skills","html","css","python","c++","c program","code","programming"],
      r: "🛠️ Dasun knows HTML & CSS, C, C++, Python (all Beginner) and MS Office (Intermediate). He's actively building more skills!" },
    { k: ["project","portfolio","maze","game","work"],
      r: "💼 Dasun has built: 1) A personal portfolio website 2) A C-language maze game with scoring & timer. More coming soon!" },
    { k: ["contact","reach","email","phone","whatsapp","message"],
      r: "📬 Contact Dasun: Email dasuntisara5@gmail.com | WhatsApp 074 119 4259 | Or use the Contact page!" },
    { k: ["dissmac","company","it"],
      r: "🏢 DiSSMaC Global is a Sri Lankan IT company Dasun is part of — delivering web dev & digital solutions. dissmacglobal.com" },
    { k: ["university","colombo","study","education","degree","bsc"],
      r: "🎓 Dasun is studying BSc Computer Science at University of Colombo, 1st Year (Batch 2025)." },
    { k: ["hire","freelance","available","collaborate"],
      r: "✅ Dasun is open to freelance & collaborations! Message him at dasuntisara5@gmail.com or WhatsApp 074 119 4259." },
    { k: ["thank","thanks","thank you","thx"],
      r: "😊 You're welcome! Feel free to ask anything else about Dasun." },
    { k: ["bye","goodbye","see you","later"],
      r: "👋 Goodbye! Hope to see you back. You can always reach Dasun at dasuntisara5@gmail.com!" },
    { k: ["help","what can you","menu","options"],
      r: "🤖 Ask me about: Dasun's profile, Education, Skills, Projects, DiSSMaC Global, or How to Contact him!" },
  ];

  function localFallback(msg) {
    const m = msg.toLowerCase();
    for (const item of FALLBACK) {
      if (item.k.some(k => m.includes(k))) return item.r;
    }
    return "🤔 I don't have that info, but you can reach Dasun at **dasuntisara5@gmail.com** or WhatsApp **074 119 4259**!";
  }

  /* ══════════════════════════════════════════════════
     📱  NTFY.SH — PHONE NOTIFICATION
  ════════════════════════════════════════════════════ */
  async function sendPhoneNotification(name, email, phone, message) {
    if (!CONFIG.NTFY_TOPIC) return;

    const body =
      `From: ${name}\n` +
      `Email: ${email || "—"}\n` +
      `Phone: ${phone || "—"}\n\n` +
      `"${message}"`;

    try {
      // Build URL with query params (works better with no-cors)
      const url = new URL(`https://ntfy.sh/${CONFIG.NTFY_TOPIC}`);
      
      await fetch(url.toString(), {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Title": `New contact from ${name}`,
          "Priority": "high",
          "Tags": "envelope",
          "Content-Type": "text/plain"
        },
        body: body
      });
      console.log("ntfy sent OK");
    } catch (err) {
      console.warn("ntfy error:", err);
    }
  }

  /* ══════════════════════════════════════════════════
     🏗️  INJECT CHATBOT HTML
  ════════════════════════════════════════════════════ */
  const QUICK_CHIPS = ["Who is Dasun?","Skills","Projects","Contact info","DiSSMaC?"];

  function buildHTML() {
    // Toast
    const toast = Object.assign(document.createElement("div"), { id: "toast" });
    document.body.appendChild(toast);

    // Toggle button
    const btn = document.createElement("button");
    btn.id = "chat-toggle";
    btn.setAttribute("aria-label", "Open chat");
    btn.innerHTML = `💬<span class="chat-dot"></span>`;
    document.body.appendChild(btn);

    // Chat window
    const win = document.createElement("div");
    win.id = "chat-window";
    win.innerHTML = `
      <div class="chat-header">
        <div class="chat-avatar">🤖</div>
        <div class="chat-header-info">
          <span class="chat-header-name">Dasun's AI Assistant</span>
          <span class="chat-header-status">Online · Powered by AI</span>
        </div>
        <button id="chat-test" title="Test phone notification" style="background:none;border:none;color:rgba(0,255,136,0.5);font-size:14px;cursor:pointer;padding:4px 6px;transition:color 0.2s;" aria-label="Test notification">🔔</button>
        <button id="chat-close" aria-label="Close">✕</button>
      </div>
      <div class="chat-messages" id="chat-messages"></div>
      <div class="quick-chips" id="quick-chips"></div>
      <div class="chat-input-area">
        <input id="chat-input" type="text" placeholder="Ask anything about Dasun..." autocomplete="off" maxlength="300">
        <button id="chat-send" aria-label="Send">➤</button>
      </div>
    `;
    document.body.appendChild(win);
  }

  /* ══════════════════════════════════════════════════
     💬  CHAT UI LOGIC
  ════════════════════════════════════════════════════ */
  function formatText(txt) {
    return txt
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--t-1)">$1</strong>')
      .replace(/\n/g, "<br>");
  }

  function initChat() {
    const toggle   = document.getElementById("chat-toggle");
    const win      = document.getElementById("chat-window");
    const closeBtn = document.getElementById("chat-close");
    const msgs     = document.getElementById("chat-messages");
    const input    = document.getElementById("chat-input");
    const sendBtn  = document.getElementById("chat-send");
    const chips    = document.getElementById("quick-chips");
    const dot      = toggle.querySelector(".chat-dot");

    let open = false, started = false;

    /* add bubble */
    function addMsg(text, who, noAnim) {
      const d = document.createElement("div");
      d.className = `msg ${who}`;
      if (noAnim) d.style.animation = "none";
      d.innerHTML = `<div class="msg-bubble">${who === "bot" ? formatText(text) : escHtml(text)}</div>`;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function escHtml(s) {
      return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    }

    /* typing dots */
    function showTyping() {
      const d = document.createElement("div");
      d.className = "msg bot"; d.id = "typing";
      d.innerHTML = `<div class="typing-bubble"><span></span><span></span><span></span></div>`;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }
    function hideTyping() { document.getElementById("typing")?.remove(); }

    /* bot response (async AI) */
    async function botReply(userMsg) {
      showTyping();
      const reply = await askClaude(userMsg);
      hideTyping();
      addMsg(reply, "bot");
    }

    /* quick chips */
    QUICK_CHIPS.forEach(label => {
      const b = document.createElement("button");
      b.className = "chip";
      b.textContent = label;
      b.addEventListener("click", () => {
        chips.style.display = "none";
        addMsg(label, "user");
        botReply(label);
      });
      chips.appendChild(b);
    });

    /* open / close */
    function openChat() {
      open = true;
      win.classList.add("open");
      if (dot) dot.style.display = "none";
      if (!started) {
        started = true;
        setTimeout(() => addMsg("👋 Hi! I'm Dasun's AI assistant. I can answer **anything** about Dasun — just ask! Or pick a topic below 👇", "bot", true), 250);
      }
      setTimeout(() => input.focus(), 400);
    }
    function closeChat() { open = false; win.classList.remove("open"); }

    toggle.addEventListener("click", () => open ? closeChat() : openChat());

    // Test notification button
    document.getElementById("chat-test")?.addEventListener("click", async () => {
      if (!CONFIG.NTFY_TOPIC || CONFIG.NTFY_TOPIC === "YOUR_TOPIC") {
        showToast("⚠️ Set your NTFY_TOPIC in chatbot.js first!", "#ffb830");
        return;
      }
      showToast("📤 Sending test notification...", "var(--neon-b)");
      try {
        await fetch(`https://ntfy.sh/${CONFIG.NTFY_TOPIC}`, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Title": "Test from Portfolio",
            "Tags": "white_check_mark",
            "Content-Type": "text/plain"
          },
          body: "ntfy is working! Your portfolio notifications are set up correctly."
        });
        setTimeout(() => showToast("✅ Test sent! Check your phone.", "var(--neon-g)"), 800);
      } catch(e) {
        showToast("❌ Could not send. Check your topic name.", "#ff4f7b");
      }
    });
    closeBtn.addEventListener("click", closeChat);

    /* send */
    async function send() {
      const text = input.value.trim();
      if (!text) return;
      chips.style.display = "none";
      addMsg(text, "user");
      input.value = "";
      input.disabled = true;
      sendBtn.disabled = true;
      await botReply(text);
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }

    sendBtn.addEventListener("click", send);
    input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });

    /* cursor hover */
    [toggle, sendBtn, closeBtn, input].forEach(el => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
  }

  /* ══════════════════════════════════════════════════
     📝  CONTACT FORM — sends phone notification
  ════════════════════════════════════════════════════ */
  function initForm() {
    const form = document.querySelector(".from form");
    if (!form) return;

    // remove broken PHP action
    form.removeAttribute("action");
    form.removeAttribute("method");

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const inputs   = form.querySelectorAll("input[type=text], input[type=email], input[type=tel]");
      const textarea = form.querySelector("textarea");

      const name    = inputs[0]?.value.trim() || "";
      const email   = inputs[1]?.value.trim() || "";
      const phone   = inputs[2]?.value.trim() || "";
      const message = textarea?.value.trim()   || "";

      if (!name || !message) {
        showToast("⚠️ Name and message are required!", "#ffb830");
        return;
      }

      const submitBtn = form.querySelector("input[type=submit]");
      const origVal   = submitBtn.value;
      submitBtn.value = "Sending...";
      submitBtn.disabled = true;

      await sendPhoneNotification(name, email, phone, message);

      submitBtn.value    = origVal;
      submitBtn.disabled = false;

      showToast("✅ Message sent! Dasun will get back to you soon.", "var(--neon-g)");
      form.reset();
    });
  }

  /* ══════════════════════════════════════════════════
     🔔  TOAST
  ════════════════════════════════════════════════════ */
  function showToast(msg, color) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.style.color = color || "var(--neon-g)";
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 4000);
  }

  /* ══════════════════════════════════════════════════
     🚀  BOOT
  ════════════════════════════════════════════════════ */
  document.addEventListener("DOMContentLoaded", () => {
    buildHTML();
    initChat();
    initForm();
  });

})();
