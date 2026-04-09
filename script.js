let attachmentBase64 = [];

// Handle File Attachments
document.getElementById('file-input').addEventListener('change', function(e) {
    const files = e.target.files;
    const previewArea = document.getElementById('preview-area');
    
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64String = event.target.result.split(',')[1];
            attachmentBase64.push({ full: event.target.result, base64: base64String });
            
            const img = document.createElement('img');
            img.src = event.target.result;
            img.className = 'thumb';
            previewArea.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

// Auto-expand textarea
const textarea = document.getElementById("user-input");
textarea.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
});

async function sendMessage() {
    const text = textarea.value.trim();
    if (!text && attachmentBase64.length === 0) return;

    // Remove hero on start
    const hero = document.querySelector('.hero-start');
    if (hero) hero.remove();

    const currentImages = [...attachmentBase64];
    appendMessage("user", text, null, currentImages);

    // Reset Input
    textarea.value = "";
    textarea.style.height = "auto";
    document.getElementById('preview-area').innerHTML = "";
    attachmentBase64 = [];

    const loadingId = "core-" + Date.now();
    // Changed message from "Connecting to Core..." to "Thinking..."
    appendMessage("ai", "Thinking...", loadingId);

    try {
        const response = await fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3.1",
                messages: [{ role: "user", content: text, images: currentImages.map(img => img.base64) }],
                stream: false
            })
        });

        const data = await response.json();
        renderResponse(loadingId, data.message.content);

    } catch (err) {
        document.getElementById(loadingId).innerHTML = `<span class="text-danger">Core Offline. Check local engine connection.</span>`;
    }
}

function renderResponse(id, content) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = "";

    const parts = content.split(/(```[\s\S]*?```)/g);
    
    parts.forEach(part => {
        if (part.startsWith("```")) {
            const lines = part.split('\n');
            const lang = lines[0].replace(/```/g, "").trim() || "code";
            let code = lines.slice(1, -1).join('\n');
            if (lines.length <= 2) code = part.replace(/```\w*/, "").replace(/```$/, "").trim();
            
            container.appendChild(createCodeBlock(code, lang));
        } else if (part.trim()) {
            const div = document.createElement("div");
            div.className = "mb-3";
            div.style.whiteSpace = "pre-wrap";
            div.innerText = part.trim();
            container.appendChild(div);
        }
    });

    Prism.highlightAllUnder(container);
}

function createCodeBlock(code, lang) {
    const wrap = document.createElement("div");
    wrap.className = "code-container";

    const head = document.createElement("div");
    head.className = "code-header";
    head.innerHTML = `<span>${lang.toUpperCase()}</span>`;

    const copyBtn = document.createElement("button");
    copyBtn.className = "btn btn-link p-0 text-decoration-none text-muted";
    copyBtn.style.fontSize = "10px";
    copyBtn.innerText = "COPY";
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(code);
        copyBtn.innerText = "COPIED";
        setTimeout(() => copyBtn.innerText = "COPY", 2000);
    };

    head.appendChild(copyBtn);
    wrap.appendChild(head);

    const pre = document.createElement("pre");
    pre.className = `language-${lang}`;
    const codeTag = document.createElement("code");
    codeTag.className = `language-${lang}`;
    codeTag.textContent = code;

    pre.appendChild(codeTag);
    wrap.appendChild(pre);
    return wrap;
}

function appendMessage(role, text, id = null, images = []) {
    const container = document.getElementById("chat-container");
    const msgWrapper = document.createElement("div");
    msgWrapper.className = `message ${role === 'user' ? 'user-msg' : 'ai-msg'}`;
    
    if (images.length > 0) {
        const imgDiv = document.createElement("div");
        imgDiv.className = "d-flex flex-wrap gap-2 mb-2 justify-content-end";
        images.forEach(img => {
            const i = document.createElement("img");
            i.src = img.full;
            i.className = "chat-img";
            imgDiv.appendChild(i);
        });
        msgWrapper.appendChild(imgDiv);
    }

    const content = document.createElement("div");
    if (id) content.id = id;
    content.innerText = text;
    content.style.whiteSpace = "pre-wrap";
    
    msgWrapper.appendChild(content);
    container.appendChild(msgWrapper);
    container.scrollTop = container.scrollHeight;
}

textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});