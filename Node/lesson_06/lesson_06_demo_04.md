# Lesson 06 Demo 04 — Debugging with VS Code

**Objective:** Use VS Code's built-in debugger to step through code, inspect variables, and find bugs.

**Tools:** VS Code, Node.js

**Prerequisites:** None

---

## Why Debug?

`console.log` only gets you so far. A real debugger lets you:

- **Pause execution** at any line (breakpoints)
- **Inspect variables** and their current values
- **Step through code** line by line
- **Watch expressions** change over time
- **See the call stack** to understand how you got here

VS Code has a powerful built-in debugger for Node.js.

---

## Step 1: Set Up Auto-Attach

VS Code can automatically attach the debugger when you run `node` in the terminal.

### Enable Auto-Attach

1. Open the Command Palette: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type: `Debug: Toggle Auto Attach`
3. Select **Smart** (recommended) or **Always**

The options:
- **Always** — Attach to every Node.js process
- **Smart** — Attach only when running in your project folder (recommended)
- **Only With Flag** — Only attach when you use `node --inspect`

After enabling, **restart your terminal** (close and reopen the integrated terminal).

You'll see "Auto Attach: Smart" in the VS Code status bar at the bottom.

---

## Step 2: Create a File to Debug

```bash
mkdir debugDemo
cd debugDemo
touch loops.js
code .
```

Write the following in `loops.js` — a bubble sort implementation with something to watch:

```js
function bubbleSort(arr) {
    const n = arr.length;
    let swaps = 0;

    for (let i = n - 1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swaps++;
            }
        }
        console.log(`Pass ${n - i}: [${arr}] — ${swaps} swaps so far`);
    }

    return { sorted: arr, totalSwaps: swaps };
}

const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log('Original:', numbers);

const result = bubbleSort([...numbers]); // Copy to preserve original
console.log('Result:', result);
```

---

## Step 3: Set Breakpoints

Breakpoints pause execution so you can inspect the state at that moment.

### Add Breakpoints

1. Open `loops.js` in VS Code
2. Click in the **left margin** (gutter) next to line numbers to add breakpoints:
   - Line 6: `for (let j = 0; j < i; j++)` — inner loop start
   - Line 8: `[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]` — the swap

A red dot appears where you've set breakpoints.

### Types of Breakpoints

| Type | How to set | Use case |
|---|---|---|
| Line breakpoint | Click the gutter | Pause at specific line |
| Conditional | Right-click → "Add Conditional Breakpoint" | Pause only when condition is true (e.g., `swaps > 3`) |
| Logpoint | Right-click → "Add Logpoint" | Log a message without pausing |

Try adding a **conditional breakpoint** on line 8 with condition: `arr[j] > 50`

This pauses only when swapping a number greater than 50.

---

## Step 4: Run with Debugger

With auto-attach enabled, run your file normally:

```bash
node loops.js
```

VS Code automatically:
1. Attaches the debugger
2. Switches to the **Run and Debug** view
3. Pauses at your first breakpoint

---

## Step 5: Use the Debug Controls

When paused, you'll see a floating toolbar with these controls:

| Button | Name | Keyboard | What it does |
|---|---|---|---|
| ▶️ | Continue | `F5` | Run until next breakpoint |
| ⏭️ | Step Over | `F10` | Execute current line, move to next |
| ⬇️ | Step Into | `F11` | Enter the function being called |
| ⬆️ | Step Out | `Shift+F11` | Finish current function, return to caller |
| 🔄 | Restart | `Ctrl+Shift+F5` | Restart debugging |
| ⏹️ | Stop | `Shift+F5` | Stop debugging |

### Try This Workflow

1. When paused at the inner loop, look at the **Variables** panel on the left
2. Expand **Local** to see `i`, `j`, `arr`, `swaps`
3. Press **F10** (Step Over) repeatedly to watch values change
4. Watch `arr` reorder as the algorithm runs

---

## Step 6: Watch Expressions

The **Watch** panel lets you track specific expressions.

1. In the Debug sidebar, find the **Watch** section
2. Click the **+** button
3. Add these expressions:
   - `arr[j]`
   - `arr[j + 1]`
   - `arr[j] > arr[j + 1]`
   - `swaps`

Now as you step through, you'll see these values update in real-time.

---

## Step 7: Debug Console

The **Debug Console** (at the bottom) lets you run JavaScript while paused:

```js
> arr
[34, 25, 12, 22, 11, 64, 90]

> arr.slice(0, 3)
[34, 25, 12]

> swaps
2

> i * j
6
```

This is incredibly useful for testing fixes before changing code.

---

## Step 8: Launch Configuration (Optional)

For more control, create a launch configuration:

1. Go to **Run and Debug** view (Ctrl+Shift+D)
2. Click **create a launch.json file**
3. Select **Node.js**

VS Code creates `.vscode/launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug loops.js",
            "program": "${workspaceFolder}/loops.js",
            "skipFiles": ["<node_internals>/**"]
        }
    ]
}
```

Now you can:
- Press **F5** to start debugging (no terminal needed)
- Use the dropdown to switch between configurations
- Add environment variables, arguments, etc.

---

## Debugging Tips

### Finding Bugs Faster

| Technique | When to use |
|---|---|
| Conditional breakpoints | Only pause when something unexpected happens |
| Logpoints | Add logging without modifying code |
| Watch expressions | Track calculated values that aren't in variables |
| Call stack | Understand how you reached the current point |

### Common Debugging Scenarios

**Infinite loop?**
- Set a breakpoint inside the loop
- Check loop variables — is the exit condition ever met?

**Wrong value?**
- Set a breakpoint where the value is set
- Step through to see what's happening

**Function not called?**
- Set a breakpoint at the function start
- If it never hits, the function isn't being called

**Unexpected undefined?**
- Add a watch expression for the variable
- Step backward to find where it should have been set

---

## Summary

| Feature | How to access | What it does |
|---|---|---|
| Auto-attach | Command Palette → "Debug: Toggle Auto Attach" | Automatically debug when running `node` |
| Breakpoint | Click left margin | Pause at specific line |
| Conditional breakpoint | Right-click margin → "Add Conditional Breakpoint" | Pause only when condition is true |
| Step Over (F10) | Debug toolbar | Execute line, don't enter functions |
| Step Into (F11) | Debug toolbar | Enter the function being called |
| Variables panel | Debug sidebar | See all variables in scope |
| Watch panel | Debug sidebar | Track specific expressions |
| Debug Console | Bottom panel | Run code while paused |
| Launch config | `.vscode/launch.json` | Saved debug settings |
