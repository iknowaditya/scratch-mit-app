# Scratch Playground Assignment

## 📌 Objective
Recreate core features of the Scratch animation playground using React. This assignment involves implementing motion and looks animations, multiple sprite handling, and an interactive collision-based animation swap (Hero Feature).

---

## 🚀 Features to Implement

### 1. 🌀 Motion Animations
Under the **Motion** category, implement the following drag-and-drop blocks:

- `Move ____ steps`
- `Turn ____ degrees`
- `Go to x: ___ y: ____`
- `Repeat` animation block (from **Controls**)

Each of these should animate the sprite as expected when triggered via the play mechanism.

---

### 2. 🎭 Looks Animations
Under the **Looks** category, implement:

- `Say ____ for ____ seconds`
- `Think ____ for ____ seconds`

Ensure these blocks can be dragged and dropped similarly to how Scratch handles them, with corresponding UI updates on the sprite.

---

### 3. 🧍‍♂️ Multiple Sprites Support
- Add functionality to create **multiple sprites**.
- Each sprite should be able to accept its own animation blocks.
- Include a **Play button** that, when clicked, starts the animations for **all** sprites simultaneously.

---

### 4. 🦸‍♂️ Hero Feature – Collision-Based Animation Swap
Introduce a dynamic feature where two characters **swap animations upon collision**:

**Example:**
- **Before collision:**
  - Character 1: `Move 10 steps`, `Repeat`
  - Character 2: `Move -10 steps`, `Repeat`
- **After collision:**
  - Character 1: `Move -10 steps`
  - Character 2: `Move 10 steps`

This feature should detect collisions between any two sprites and dynamically swap their animations.

---

## ✅ Deliverables
- Fully working drag-and-drop blocks for Motion and Looks categories
- Dynamic sprite creation
- Synchronized playback with all sprites
- Functional Hero Feature demonstrating animation swap on collision

---

## 🛠️ Tech Stack
- **React** (with hooks)
- **TailwindCSS** for styling
- **HTML/CSS/JS**
- Optional: **Framer Motion** or other libraries for smooth animation handling

---
