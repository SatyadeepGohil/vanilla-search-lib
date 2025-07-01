# 🔍 Seekr: vanilla-search-lib

**A blazing-fast, dependency-free JavaScript search utility for arrays, strings, objects, maps, and sets.**
Built for performance, flexibility, and extensibility — with support for deep property traversal, multiple search modes, and type detection.

---

## ⚡ Why vanilla-search-lib?

* ✅ Written in **pure JavaScript** — no dependencies
* 🚀 **Performance-optimized** — tested with over **1000 scenarios**
* 🧠 Intelligently handles **arrays, strings, sets, maps, and objects**
* 🔍 Supports **exact**, **substring**, **regex**, and **range** search
* 🌐 Designed to be **extensible** and developer-friendly
* 🧩 Smart **data type detection** and **deep property access**

---

## 📦 Installation

```bash
npm i @satyadeep-gohil/seekr
```

---

## 🔧 Basic Usage

```js
import Seekr from 'vanilla-search-lib';

// Example with array of objects
const data = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

const engine = new Seekr(data);
const results = engine.search('Alice', 'name', { mode: 'exact' });
console.log(results);
```

---

## 🧩 Supported Data Types

| Type      | Supported  |
| --------- | ---------- |
| Array     | ✅ Yes     |
| Object    | ✅ Yes     |
| String    | ✅ Yes     |
| Map       | 🚧 Planned |
| Set       | 🚧 Planned |
| Primitive | ⚠️ No      |

---

## 🔍 Search Modes

| Mode        | Description                                 |
| ----------- | ------------------------------------------- |
| `exact`     | Matches exactly (case-sensitive optional)   |
| `subString` | Substring match for strings only            |
| `regex`     | Regular expression match for strings        |
| `range`     | Range match for numbers (e.g., `[10, 100]`) |

---

## ⚙️ Options

```js
{
  mode: 'exact' | 'subString' | 'regex' | 'range', // default: 'exact'
  caseSensitive: boolean,                         // default: false
  deep: boolean                                   // default: false
}
```

Supports deep property search like `user.address.city` when `deep: true`.

---

## 🧪 Performance Benchmarks

| Test Description                       | Avg Time | Rating        |
| -------------------------------------- | -------- | ------------- |
| Nested Object - Deep Property Search   | 0.46 ms  | 🚀 Excellent  |
| Medium String Array - Substring Search | 1.80 ms  | 🚀 Excellent  |
| Mixed Array - Exact Search             | 4.57 ms  | 🚀 Excellent  |
| Unicode Strings - Exact Search         | 5.51 ms  | 🚀 Excellent  |
| Duplicate Values - All Match           | 9.57 ms  | 🚀 Excellent  |
| Large Object Array - Property Search   | 28.43 ms | ✅ Good       |
| Large String Array - Case Sensitive    | 31.72 ms | ✅ Good       |
| No Match in Large Array                | 60.85 ms | ⚠️ Acceptable |
| Large String Array - Case Insensitive  | 65.48 ms | ⚠️ Acceptable |

* 🎯 Overall Avg Time: **23.16 ms**
* 🧠 Avg Memory Use: **\~0 MB**
* 🧪 Total Tests: **1000+**
---

## 🧠 Ideal For

* Lightweight in-browser search
* Static site data filtering
* Building mini search engines
* Object and string search logic abstraction

---

## 📜 License

**Custom License**
You may use and modify your own copy freely, but the original repository remains **read-only**.
✅ Attribution required.
📁 See `LICENSE` file for full terms.

---

## 🙌 Contributing

Feature suggestions, ideas, and optimizations are welcome.
**PRs will not be accepted** in the original repo due to its protected license. Forks encouraged.

---

## 🤝 Attribution

Created by Satyadeep Gohil
Inspired by the need for **simple, fast, and flexible** client-side search logic.