# Lesson 07 Demo 02 — Integrating Claude AI with Node.js

**Objective:** Integrate Claude AI with Node.js to build intelligent applications using Anthropic's API

**Tools:** VS Code, Node.js

**Prerequisites:** Anthropic API key

---

## Overview

In this demo, you'll learn how to integrate Claude, Anthropic's AI assistant, into your Node.js applications. Claude can help with text generation, analysis, coding assistance, and conversational AI.

---

## Step 1: Set up a Node.js Project

Check your Node.js version:

```bash
node --version
```

Create a directory for the project:

```bash
mkdir claude-api-demo
cd claude-api-demo
```

Initialize the project:

```bash
npm init -y
```

---

## Step 2: Install the Anthropic SDK

Install the official Anthropic Node.js library:

```bash
npm install @anthropic-ai/sdk
```

This library provides a convenient interface for interacting with Claude's API.

---

## Step 3: Get Your API Key

### Option 1: If you already have an API key

Skip to Step 4 and use your existing key.

### Option 2: Get a new API key

1. Visit [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in to your account
3. Navigate to **API Keys** in the console
4. Click **Create Key**
5. Give your key a name (e.g., "Node.js Demo")
6. Copy the API key immediately — you won't be able to see it again

**Important:** Keep your API key secret! Never commit it to version control.

---

## Step 4: Store Your API Key Securely

Create a `.env` file to store your API key:

```bash
touch .env
```

Add your API key to `.env`:

```
ANTHROPIC_API_KEY=your_api_key_here
```

Install the `dotenv` package to load environment variables:

```bash
npm install dotenv
```

Create a `.gitignore` file to prevent committing sensitive data:

```bash
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
```

---

## Step 5: Create Your First Claude Integration

Create a file named `claude-basic.js`:

```bash
touch claude-basic.js
code .
```

Add the following code:

```js
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

async function askClaude(prompt) {
    try {
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [
                { role: 'user', content: prompt }
            ]
        });

        console.log('\n=== Claude\'s Response ===\n');
        console.log(message.content[0].text);
        console.log('\n========================\n');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Ask Claude a question
askClaude('What is the MERN stack?');
```

Run the script:

```bash
node claude-basic.js
```

You should see Claude's response explaining the MERN stack!

---

## Step 6: Build an Interactive Chat

Let's create a simple interactive chat interface. Create `claude-chat.js`:

```js
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const readline = require('readline');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

const conversationHistory = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function chat(userMessage) {
    // Add user message to history
    conversationHistory.push({
        role: 'user',
        content: userMessage
    });

    try {
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: conversationHistory
        });

        const assistantMessage = message.content[0].text;

        // Add assistant response to history
        conversationHistory.push({
            role: 'assistant',
            content: assistantMessage
        });

        console.log('\nClaude:', assistantMessage, '\n');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function startChat() {
    console.log('=== Chat with Claude ===');
    console.log('Type "exit" to quit\n');

    const askQuestion = () => {
        rl.question('You: ', async (input) => {
            const message = input.trim();

            if (message.toLowerCase() === 'exit') {
                console.log('Goodbye!');
                rl.close();
                return;
            }

            if (message) {
                await chat(message);
            }

            askQuestion();
        });
    };

    askQuestion();
}

startChat();
```

Run the interactive chat:

```bash
node claude-chat.js
```

Now you can have a back-and-forth conversation with Claude!

---

## Step 7: Build a Code Helper Tool

Let's create a practical application — a code explanation tool. Create `code-helper.js`:

```js
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

async function explainCode(code, language) {
    const prompt = `Please explain the following ${language} code in simple terms:

\`\`\`${language}
${code}
\`\`\`

Include:
1. What the code does
2. How it works step-by-step
3. Any important concepts used`;

    try {
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1500,
            messages: [{ role: 'user', content: prompt }]
        });

        console.log('\n=== Code Explanation ===\n');
        console.log(message.content[0].text);
        console.log('\n======================\n');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example: Explain some JavaScript code
const exampleCode = `
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.listen(3000);
`;

explainCode(exampleCode, 'javascript');
```

```bash
node code-helper.js
```

Claude will provide a detailed explanation of the code!

---

## Step 8: Build a Text Summarizer

Create `summarizer.js`:

```js
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

async function summarizeText(text, maxLength = 100) {
    const prompt = `Please summarize the following text in ${maxLength} words or less:

${text}`;

    try {
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 500,
            messages: [{ role: 'user', content: prompt }]
        });

        return message.content[0].text;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

// Example usage
const longText = `
Node.js is an open-source, cross-platform JavaScript runtime environment that 
executes JavaScript code outside a web browser. It allows developers to use 
JavaScript for server-side scripting, enabling the production of dynamic web 
page content before the page is sent to the user's web browser. Node.js uses 
an event-driven, non-blocking I/O model that makes it lightweight and efficient, 
perfect for data-intensive real-time applications that run across distributed 
devices. It uses the V8 JavaScript engine developed by Google for Chrome, which 
compiles JavaScript to native machine code for faster execution.
`;

(async () => {
    console.log('Original text length:', longText.trim().split(' ').length, 'words\n');
    
    const summary = await summarizeText(longText, 50);
    
    console.log('=== Summary ===\n');
    console.log(summary);
    console.log('\n===============\n');
})();
```

```bash
node summarizer.js
```

---

## Step 9: Stream Responses for Better UX

For long responses, streaming provides a better user experience. Create `claude-stream.js`:

```js
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

async function streamResponse(prompt) {
    console.log('Claude: ');

    const stream = await anthropic.messages.stream({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
    });

    for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && 
            chunk.delta.type === 'text_delta') {
            process.stdout.write(chunk.delta.text);
        }
    }

    console.log('\n');
}

// Example
streamResponse('Explain how event loops work in Node.js in detail.');
```

```bash
node claude-stream.js
```

The response will appear word-by-word, just like typing!

---

## Summary

### What You Learned

- How to integrate Claude AI into Node.js applications
- How to securely store API keys using environment variables
- How to send messages and receive responses from Claude
- How to maintain conversation history for context
- How to stream responses for better UX
- How to build practical AI tools (chat, code helper, summarizer)

### Claude Models

| Model | Description | Best For |
|---|---|---|
| `claude-3-5-sonnet-20241022` | Latest, most capable | Complex tasks, coding |
| `claude-3-opus-20240229` | Most powerful | Research, analysis |
| `claude-3-haiku-20240307` | Fastest, cheapest | Simple tasks, high volume |

### Key Parameters

| Parameter | Description | Typical Value |
|---|---|---|
| `model` | Which Claude model to use | `claude-3-5-sonnet-20241022` |
| `max_tokens` | Maximum response length | 1024-4096 |
| `temperature` | Randomness (0-1) | 0.7 (default) |
| `messages` | Conversation history | Array of message objects |

### Best Practices

✅ **Always** use environment variables for API keys  
✅ **Never** commit `.env` files to version control  
✅ Keep conversation history for context in multi-turn chats  
✅ Use streaming for long responses  
✅ Handle errors gracefully  
✅ Set appropriate `max_tokens` limits to control costs

### Next Steps

- Build a chatbot for your website
- Create a code review assistant
- Build a content generator for blogs
- Integrate Claude with a database for persistent conversations
- Explore system prompts for customizing Claude's behavior

---

## Challenge Exercise

Create a **Technical Interview Prep Tool** that:
1. Accepts a programming topic from the user
2. Generates 3 technical interview questions about that topic
3. When the user answers, Claude evaluates the response
4. Provides feedback and suggestions for improvement

**Bonus:** Save the Q&A history to a JSON file for later review.
