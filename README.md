# Intelligence Core | Llama 3.1 Web UI

**Intelligence Core** is a high-performance, web-based interface designed to bring a premium, ChatGPT-like experience to your local machine. Optimized specifically for the Llama 3.1 architecture, it provides a seamless environment for AI interactions, featuring advanced code syntax highlighting, multi-image processing support, and a sophisticated deep-space dark-mode aesthetic.

---

## ⚠️ Important: System Requirements

To run this interface, you must have the Llama 3.1 model running locally via **Ollama**.

### 1. Model Specifications & Sizes
* **Primary Model:** Llama 3.1 (8B Parameter) — `~4.7 GB` (Required for Text)
* **Vision Model:** LLaVA — `~4.1 GB` (Required for Image support)

### 2. Hardware Requirements
* **RAM:** Minimum **8GB** (16GB recommended).
* **Storage:** At least **15GB** of free space.
* **GPU:** Optional but highly recommended for faster responses.

---

## 🚀 How to Install & Run

### Step 1: Install Ollama
Download and install the Ollama engine from [ollama.com/download](https://ollama.com/download).

### Step 2: Download the Models
Open your terminal (PowerShell on Windows, or Terminal on Mac/Linux) and run these commands:

**For Text support:**
```bash
ollama run llama3.1
```

**For Image support:**
```bash
ollama pull llava
```

### Step 3: Enable Web Access (Mandatory)
By default, Ollama blocks browser connections. You **must** run this command to allow the website to talk to the AI:

**Windows (PowerShell):**
```powershell
$env:OLLAMA_ORIGINS="*"; ollama serve
```

**Mac/Linux:**
```bash
OLLAMA_ORIGINS="*" ollama serve
```

---

## 🔍 How to Check if it's Working
1.  **Browser Check:** Go to `http://localhost:11434`. You should see "Ollama is running".
2.  **Terminal Check:** Type `ollama list` in a new terminal to see your downloaded models.

## 🛠️ Troubleshooting
* **"Core Offline":** Make sure you didn't close the terminal window from **Step 3**.
* **Image Errors:** Ensure you have pulled the `llava` model.
* **Slow Performance:** Close heavy background apps like games or many browser tabs.

---
**Maintained by:** [bhanukaboy]
