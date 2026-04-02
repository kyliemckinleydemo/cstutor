import { useState, useRef, useEffect } from "react";

const API = "/api/proxy";
const MODEL = "claude-sonnet-4-6";
const MODEL_OPUS = "claude-opus-4-6";
const ADMINS = ["john@greatfallsventures.com", "kylie.k.mckinley.27@dartmouth.edu"];
const isAdmin = email => ADMINS.includes((email || "").toLowerCase());

const COURSES = {
  cosc77: {
    id: "cosc77",
    label: "Dartmouth COSC 77",
    title: "Darby",
    subtitle: "Ray tracing · Rasterization · Shading · Geometric transforms",
    codeLanguage: "JavaScript",
    system: `Your name is Darby. You are a patient, thorough tutor for a Dartmouth CS student taking COSC 77 (Computer Graphics), taught by Wojciech Jarosz in Spring 2026. Your job is to build genuine understanding of how images are computed from mathematics and geometry — not just to cover material. Students have taken COSC 50 (systems/C) and linear algebra, so they understand pointers, memory, and matrix operations — but the graphics pipeline, shading models, and ray tracing may be entirely new territory. Start from first principles. Before introducing GLSL, WebGL, or C++ code, explain the geometric or optical intuition in plain English. Write in full, connected paragraphs that flow naturally — not bullet points and not terse outlines. Explanations should feel like a brilliant TA who has implemented a ray tracer from scratch explaining something carefully. Use C++ or GLSL for code examples where relevant. Always explain *why* something works — especially for coordinate transforms, the rendering equation, barycentric coordinates, and the rasterization pipeline — before showing how to implement it. For matrix transforms, always derive what the matrix is doing geometrically before writing it out. For shading, start from the physics of light before the math. Key course topics include: digital image representation and color models, 2D and 3D geometric transformations (rotation, scale, translation, perspective and parallel projection), homogeneous coordinates, shape representations (parametric curves and surfaces, polygon meshes, subdivision surfaces), the rasterization pipeline (vertex processing, clipping, scan conversion, z-buffering), ray tracing (ray-object intersection, reflection, refraction, shadows), illumination models (ambient, diffuse, specular, the Phong model, the rendering equation), texture mapping (UV mapping, bilinear interpolation, mipmapping), visible surface determination, light and visual perception, and rigging and skinning for animation. You are a tutor, not a homework service. If a student asks you to solve what appears to be a specific assignment or project question, do not provide a complete solution. Instead, identify the underlying concept, explain it clearly, and walk through a similar, self-contained example. Guide them to the answer through understanding — never hand it to them directly.`,
    suggested: [
      "Ray Tracing & Ray-Object Intersection", "Rasterization Pipeline",
      "Phong Illumination Model", "Geometric Transformations (Rotation, Scale, Translation)",
      "Perspective & Orthographic Projection", "Homogeneous Coordinates",
      "Texture Mapping & UV Coordinates", "Parametric Curves & Surfaces",
      "Z-Buffering & Visible Surface Determination", "Subdivision Surfaces",
      "Barycentric Coordinates", "Rigging & Skinning",
      "The Rendering Equation", "Reflection & Refraction",
    ],
  },
  cosc10: {
    id: "cosc10",
    label: "Dartmouth COSC 10",
    title: "Darby",
    subtitle: "Clear explanations · Code examples · Adaptive quizzing",
    codeLanguage: "Java",
    system: `Your name is Darby. You are a patient, thorough tutor for a Dartmouth student taking COSC 10 (Problem Solving via Object-Oriented Programming). Your job is to build genuine understanding — not just cover material. Assume the student is relatively new to computer science. Start from first principles using concrete, relatable examples before introducing technical terms or code. Write in full, connected paragraphs that flow naturally — not bullet points and not terse outlines. Explanations should feel like a knowledgeable friend explaining something carefully, not a textbook. All code examples should be in Java. Always explain *why* something works before showing *how* to use it. Connect every concept to real programs a student might actually write or use. When covering data structures, always discuss the key tradeoffs — what operations are fast, what are slow, and why — so students can choose the right structure for a given problem. You are a tutor, not a homework service. If a student asks you to solve what appears to be a specific assignment or problem set question, do not provide a complete solution. Instead, identify the underlying concept, explain it clearly, and walk through a similar example. Guide them to the answer through understanding — never hand it to them directly.`,
    suggested: [
      "Encapsulation & Classes", "Inheritance & Polymorphism", "Interfaces & Abstraction",
      "ArrayLists & Linked Lists", "Binary Trees", "Hash Tables & Hashing",
      "Graph Traversal (BFS & DFS)", "Shortest Paths (Dijkstra's)", "Recursion",
      "Sorting Algorithms",
    ],
  },
  cosc50: {
    id: "cosc50",
    label: "Dartmouth COSC 50",
    title: "Darby",
    subtitle: "Systems thinking · C from scratch · Unix & tools mastery",
    codeLanguage: "C",
    system: `Your name is Darby. You are a patient, thorough tutor for a Dartmouth student taking COSC 50 (Software Design and Implementation). This is a systems programming course — the student has taken COSC 10 and knows Java and basic OOP, but C, Unix, and low-level memory are new territory. Your job is to build genuine, ground-up understanding of how software actually works at the systems level. Start from first principles. When introducing C concepts, connect them to what the student already knows from Java — but be honest about where C is fundamentally different (manual memory, no garbage collector, pointers instead of references, no classes). Use plain English before showing code. Write in full, connected paragraphs that flow naturally — not bullet points and not terse outlines. Explanations should feel like a knowledgeable friend who has survived COSC 50 explaining something carefully. All code examples should be in C, with brief shell/Bash examples where relevant. Always explain *why* something works the way it does — especially for memory layout, pointer arithmetic, and Unix process model — before showing how to use it. When discussing tools (gdb, Valgrind, make), explain the problem the tool solves before explaining the tool. The course's major project is the TinySearchEngine (TSE) — when a student says "TSE", they always mean TinySearchEngine. TSE has three components built in sequence: the Crawler (fetches and stores web pages), the Indexer (builds an inverted index from crawled pages), and the Querier (answers search queries using the index). Ground TSE explanations in this architecture. You are a tutor, not a homework service. If a student asks you to solve what appears to be a specific lab assignment or project question (especially TSE labs), do not provide a complete solution. Instead, identify the underlying concept, explain it clearly, and walk through a similar, self-contained example. Guide them to the answer through understanding — never hand it to them directly.`,
    suggested: [
      "Linux Shell & Commands", "Bash Scripting", "Git & Version Control",
      "C Basics & Scope", "Pointers & Memory", "Structs & Linked Lists",
      "Makefiles", "gdb Debugging", "Valgrind & Memory Leaks",
      "File I/O in C", "Tiny Search Engine Crawler", "Tiny Search Engine Indexer", "Tiny Search Engine Querier",
      "Fuzz Testing", "Bitwise Operations", "Network I/O & Sockets",
    ],
  },
  cosc31: {
    id: "cosc31",
    label: "Dartmouth COSC 31",
    title: "Darby",
    subtitle: "Algorithm design · Proof techniques · Complexity analysis",
    codeLanguage: "Python",
    system: `Your name is Darby. You are a patient, thorough tutor for a Dartmouth student taking COSC 31 (Algorithms: Design and Analysis). This is a proof-based algorithms course taught by Amit Chakrabarti. Students have taken COSC 10 and COSC 30, so they know Java, basic data structures, and discrete math — but rigorous algorithm design and formal proof techniques may be new territory. Your job is to build genuine mathematical intuition, not just procedure-following. Start from first principles. Before introducing notation or pseudocode, explain *why* an algorithm works at an intuitive level. Write in full, connected paragraphs that flow naturally — not bullet points and not terse outlines. Explanations should feel like a brilliant TA who actually understands the proofs walking through them carefully. Use pseudocode (language-agnostic) or Python for code examples. Always explain *why* a design choice works — especially for greedy correctness arguments, dynamic programming subproblem structure, and divide-and-conquer recurrences. For graph algorithms, always ground the explanation in the graph structure before the pseudocode. Key course topics include: asymptotic analysis (Big-O, Θ, Ω), the Master Theorem, divide-and-conquer (merge sort, quicksort, Karatsuba), linear-time selection (Quickselect and median-of-medians), greedy algorithms (activity selection, Huffman coding, MST via Kruskal and Prim), Dijkstra's algorithm, dynamic programming (Bellman-Ford, Floyd-Warshall, longest common subsequence, knapsack, edit distance), graph algorithms (DFS, BFS, topological sort, strongly connected components via Kosaraju or Tarjan), network flow and max-flow/min-cut, amortized analysis, randomized algorithms, Union-Find with path compression, and algorithm correctness via loop invariants. You are a tutor, not a homework service. If a student asks you to solve what appears to be a specific problem set question, do not provide a complete solution. Instead, identify the underlying technique, explain it clearly, and walk through a similar, self-contained example. Guide them to the answer through understanding — never hand it to them directly.`,
    suggested: [
      "Asymptotic Notation & Big-O", "Master Theorem", "Divide & Conquer",
      "Merge Sort & Quicksort", "Linear-Time Selection (Quickselect)",
      "Greedy Algorithms", "Minimum Spanning Trees (Kruskal & Prim)",
      "Dijkstra's Shortest Path", "Dynamic Programming", "Bellman-Ford Algorithm",
      "Floyd-Warshall All-Pairs Shortest Paths",
      "Graph DFS, BFS & Topological Sort", "Strongly Connected Components",
      "Network Flow & Max-Flow", "Union-Find",
      "Algorithm Correctness & Loop Invariants",
      "Amortized Analysis", "Randomized Algorithms", "NP-Completeness",
    ],
  },
};

const COURSE = COURSES[import.meta.env.VITE_COURSE_ID] || COURSES.cosc77;
const { system: SYSTEM, suggested: SUGGESTED, label: COURSE_LABEL, title: COURSE_TITLE, subtitle: COURSE_SUBTITLE, codeLanguage: CODE_LANG } = COURSE;
const SNIPPET_LANGS = ["Python", "Java", "JavaScript", "C", "C++"];

async function callAPI(messages, system, maxTokens = 1500, attempt = 0, model = MODEL, opts = {}) {
  const body = { model, max_tokens: maxTokens, system, messages };
  if (opts.thinking) body.thinking = opts.thinking;
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 429 && attempt < 3) {
    const wait = (attempt + 1) * 8000;
    await new Promise(r => setTimeout(r, wait));
    return callAPI(messages, system, maxTokens, attempt + 1, model, opts);
  }
  if (!res.ok) throw new Error("API error " + res.status);
  const d = await res.json();
  const block = (d.content || []).find(b => b.type === "text") || d.content[0];
  return block.text;
}

async function askJSON(messages, extra, maxTokens = 1500, model = MODEL, opts = {}) {
  const sys = SYSTEM + " " + (extra || "") + " Respond ONLY with raw valid JSON — no markdown fences, no preamble, no trailing text after the closing brace or bracket.";
  return callAPI(messages, sys, maxTokens, 0, model, opts);
}

async function askProse(messages, maxTokens = 1400) {
  return callAPI(messages, SYSTEM, maxTokens);
}

const COSC77_TOPIC_MAP = {
  "ray tracing": "ray tracing algorithm computer graphics tutorial",
  "ray-object intersection": "ray sphere intersection ray tracing implementation",
  "rasterization": "rasterization pipeline computer graphics explained",
  "phong": "phong illumination model shading computer graphics tutorial",
  "geometric transform": "3D geometric transformations rotation scale translation matrix",
  "rotation": "3D rotation matrix computer graphics tutorial",
  "perspective projection": "perspective projection matrix computer graphics tutorial",
  "orthographic projection": "orthographic projection computer graphics tutorial",
  "homogeneous coordinates": "homogeneous coordinates computer graphics explained",
  "texture mapping": "texture mapping UV coordinates computer graphics tutorial",
  "uv coordinates": "UV mapping texture coordinates computer graphics",
  "parametric curves": "parametric curves bezier splines computer graphics tutorial",
  "bezier": "bezier curves computer graphics tutorial",
  "subdivision surfaces": "subdivision surfaces catmull clark computer graphics",
  "z-buffer": "z buffer depth buffer computer graphics tutorial",
  "visible surface": "visible surface determination z buffer computer graphics",
  "barycentric coordinates": "barycentric coordinates triangle rasterization tutorial",
  "rigging": "rigging skinning character animation computer graphics",
  "rendering equation": "rendering equation global illumination computer graphics",
  "reflection": "reflection refraction ray tracing computer graphics",
  "refraction": "refraction snells law ray tracing computer graphics",
};

const COSC31_TOPIC_MAP = {
  "master theorem": "master theorem recurrences algorithms explained",
  "divide and conquer": "divide and conquer algorithms tutorial",
  "merge sort": "merge sort algorithm explained tutorial",
  "quicksort": "quicksort algorithm explained tutorial",
  "greedy algorithms": "greedy algorithms computer science tutorial",
  "minimum spanning tree": "minimum spanning tree kruskal prim algorithm",
  "kruskal": "kruskal's algorithm minimum spanning tree tutorial",
  "prim": "prim's algorithm minimum spanning tree tutorial",
  "dijkstra": "dijkstra shortest path algorithm tutorial",
  "dynamic programming": "dynamic programming algorithms tutorial",
  "bellman-ford": "bellman ford algorithm shortest path tutorial",
  "network flow": "network flow max flow algorithm tutorial",
  "max-flow": "max flow min cut algorithm ford fulkerson tutorial",
  "union-find": "union find disjoint set data structure tutorial",
  "topological sort": "topological sort algorithm DAG tutorial",
  "amortized analysis": "amortized analysis algorithms tutorial",
  "randomized algorithms": "randomized algorithms computer science tutorial",
  "np-completeness": "NP completeness P NP problem computer science",
  "asymptotic notation": "big O notation asymptotic analysis tutorial",
  "huffman coding": "huffman coding greedy algorithm tutorial",
  "strongly connected components": "strongly connected components kosaraju tarjan algorithm tutorial",
  "scc": "strongly connected components kosaraju algorithm tutorial",
  "floyd-warshall": "floyd warshall all pairs shortest path algorithm tutorial",
  "bfs": "breadth first search graph algorithm tutorial",
  "breadth first": "breadth first search algorithm tutorial",
  "linear-time selection": "quickselect median of medians linear time selection algorithm",
  "quickselect": "quickselect algorithm linear time selection tutorial",
  "loop invariant": "loop invariant algorithm correctness proof tutorial",
};

const COSC50_TOPIC_MAP = {
  "tiny search engine crawler": "web crawler implementation C programming breadth first",
  "tiny search engine indexer": "inverted index data structure C programming tutorial",
  "tiny search engine querier": "boolean query parser ranked search results C programming",
  "tse crawler": "web crawler implementation C programming breadth first",
  "tse indexer": "inverted index data structure C programming tutorial",
  "tse querier": "boolean query parser ranked search results C programming",
  "bash scripting": "bash shell scripting tutorial",
  "linux shell": "linux command line tutorial",
  "git": "git version control tutorial",
  "makefiles": "makefile tutorial C programming",
  "gdb": "gdb debugger tutorial C programming",
  "valgrind": "valgrind memory leak detection C",
  "bitwise": "bitwise operations C programming",
  "network i/o": "socket programming C networking",
  "fuzz testing": "fuzz testing software tutorial",
};

function youtubeQuery(topic) {
  if (COURSE.id === "cosc50") {
    const lower = topic.toLowerCase();
    const match = Object.keys(COSC50_TOPIC_MAP).find(k => lower.includes(k));
    if (match) return COSC50_TOPIC_MAP[match];
    return topic + " C programming explained";
  }
  if (COURSE.id === "cosc31") {
    const lower = topic.toLowerCase();
    const match = Object.keys(COSC31_TOPIC_MAP).find(k => lower.includes(k));
    if (match) return COSC31_TOPIC_MAP[match];
    return topic + " algorithm explained tutorial";
  }
  if (COURSE.id === "cosc77") {
    const lower = topic.toLowerCase();
    const match = Object.keys(COSC77_TOPIC_MAP).find(k => lower.includes(k));
    if (match) return COSC77_TOPIC_MAP[match];
    return topic + " computer graphics tutorial";
  }
  return topic + " " + CODE_LANG + " explained";
}

async function fetchYouTubeVideos(topic) {
  const key = import.meta.env.VITE_YOUTUBE_KEY;
  if (!key) return [];
  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(youtubeQuery(topic))}&type=video&maxResults=10&key=${key}`
  );
  if (!searchRes.ok) return [];
  const searchData = await searchRes.json();
  const ids = (searchData.items || []).map(i => i.id.videoId).join(",");
  if (!ids) return [];
  const statsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${ids}&key=${key}`
  );
  if (!statsRes.ok) return [];
  const statsData = await statsRes.json();
  return (statsData.items || [])
    .sort((a, b) => Number(b.statistics.viewCount) - Number(a.statistics.viewCount))
    .slice(0, 2)
    .map(v => ({
      id: v.id,
      title: v.snippet.title,
      channel: v.snippet.channelTitle,
      views: Number(v.statistics.viewCount),
      thumbnail: v.snippet.thumbnails.medium.url,
    }));
}

const stor = {
  get: (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

const today = () => new Date().toISOString().split("T")[0];

function repairJSON(raw) {
  // Strip fences and trim
  let s = raw.replace(/```json|```/g, "").trim();
  // If truncated mid-string, close the string at the last complete sentence or word boundary
  const inString = (() => {
    let inStr = false, escaped = false;
    for (const ch of s) {
      if (escaped) { escaped = false; continue; }
      if (ch === "\\") { escaped = true; continue; }
      if (ch === '"') inStr = !inStr;
    }
    return inStr;
  })();
  if (inString) s += '"';
  // Remove trailing incomplete key-value pairs (e.g. ,"key": with no value)
  s = s.replace(/,\s*"[^"]*"\s*:\s*$/, "");
  // Try to close unclosed structures
  const stack = [];
  for (const ch of s) {
    if (ch === "{" || ch === "[") stack.push(ch);
    if (ch === "}" || ch === "]") stack.pop();
  }
  for (let i = stack.length - 1; i >= 0; i--) {
    s += stack[i] === "{" ? "}" : "]";
  }
  return s;
}

function parseJSON(raw) {
  const trimmed = raw.trim();
  // Try direct parse first — preserves code blocks inside string values (e.g. diagrams)
  try { return JSON.parse(trimmed); } catch {}
  // Strip only outer markdown fences if Claude wrapped the response in ```json ... ```
  const fenced = trimmed.replace(/^```(?:json)?\s*\n/, "").replace(/\n```\s*$/, "").trim();
  try { return JSON.parse(fenced); } catch {}
  // Extract outermost object/array
  const m = fenced.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  // Try repair
  try { return JSON.parse(repairJSON(raw)); } catch {}
  throw new Error("Could not parse response as JSON. Please try again.");
}


function Inline({ text }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, j) => {
        if (p.startsWith("**") && p.endsWith("**"))
          return <strong key={j} style={{ fontWeight: 600 }}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("`") && p.endsWith("`"))
          return <code key={j} style={{ fontFamily: "var(--font-mono,monospace)", background: "rgba(26,58,42,0.1)", color: "var(--pine-mid)", padding: "2px 6px", borderRadius: "4px", fontSize: "0.87em" }}>{p.slice(1, -1)}</code>;
        if (p.startsWith("*") && p.endsWith("*"))
          return <em key={j}>{p.slice(1, -1)}</em>;
        return p;
      })}
    </>
  );
}

function MermaidBlock({ code }) {
  const [err, setErr] = useState(false);
  // mermaid.ink renders Mermaid syntax server-side and returns a PNG
  const encoded = btoa(unescape(encodeURIComponent(code.trim())));
  const url = `https://mermaid.ink/img/${encoded}?theme=neutral&bgColor=fafef9`;
  if (err) {
    // Fallback: show raw code if image fails to load
    return (
      <pre style={{ margin: "0.75rem 0 1.1rem", padding: "14px 16px", background: "#1e2a22", borderRadius: "8px", overflowX: "auto", fontSize: "12px", lineHeight: "1.6", fontFamily: "monospace", color: "#e8f0ea", whiteSpace: "pre" }}>
        {code}
      </pre>
    );
  }
  return (
    <div style={{ margin: "0.75rem 0 1.1rem", borderRadius: "10px", border: "1.5px solid var(--border)", background: "#fafef9", padding: "12px", textAlign: "center" }}>
      <img src={url} alt="Diagram" style={{ maxWidth: "100%", borderRadius: "6px" }} onError={() => setErr(true)} />
    </div>
  );
}

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); };

  if (lang === "mermaid") return <MermaidBlock code={code} />;

  if (lang === "svg") {
    // Strip scripts and event handlers; render inline SVG directly
    const safe = code
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
      .replace(/href\s*=\s*"javascript:[^"]*"/gi, "");
    return (
      <div style={{ margin: "0.75rem 0 1.1rem", borderRadius: "10px", border: "1.5px solid var(--border)", background: "#fff", padding: "16px 20px", overflowX: "auto" }}
        dangerouslySetInnerHTML={{ __html: safe }} />
    );
  }

  return (
    <div style={{ margin: "0.75rem 0 1.1rem", borderRadius: "8px", overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1a2e20", padding: "5px 12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--mint)", letterSpacing: "0.05em", textTransform: "lowercase" }}>{lang || "code"}</span>
        <button onClick={copy} style={{ fontSize: "10px", fontWeight: 600, color: copied ? "var(--mint)" : "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>{copied ? "Copied!" : "Copy"}</button>
      </div>
      <pre style={{ margin: 0, padding: "14px 16px", background: "#1e2a22", overflowX: "auto", fontSize: "12.5px", lineHeight: "1.7", fontFamily: "var(--font-mono, 'Menlo', 'Monaco', monospace)", color: "#e8f0ea", whiteSpace: "pre" }}>
        <code>{code.replace(/\n$/, "")}</code>
      </pre>
    </div>
  );
}

function ProseParagraphs({ text, size }) {
  if (!text) return null;
  const segments = text.split(/(```[^\n]*\n[\s\S]*?```)/g);
  return (
    <div>
      {segments.map((seg, i) => {
        const codeMatch = seg.match(/^```(\w*)[^\n]*\n([\s\S]*?)```$/);
        if (codeMatch) return <CodeBlock key={i} lang={codeMatch[1]} code={codeMatch[2]} />;
        return seg.split(/\n\n+/).map((para, j) => {
          const t = para.trim();
          if (!t) return null;
          return (
            <p key={`${i}-${j}`} style={{ margin: "0 0 1.1rem", lineHeight: "1.88", fontSize: size || "15px", color: "var(--color-text-primary)" }}>
              <Inline text={t} />
            </p>
          );
        });
      })}
    </div>
  );
}

function LoadDots() {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--pine)", animation: `pls 1s ease-in-out ${i * 0.18}s infinite` }} />
      ))}
    </div>
  );
}

const PHASES = ["Topic", "Learn", "Quiz", "Results", "Review", "Done"];
const PIDX = { topic: 0, learn: 1, quiz: 2, grade: 3, followup: 4, done: 5 };

function PhaseBar({ phase }) {
  const cur = PIDX[phase];
  return (
    <div style={{ background: "var(--cream)", borderBottom: "1px solid var(--border)", padding: "20px 2.5rem 16px", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", alignItems: "flex-start", maxWidth: "900px", margin: "0 auto", position: "relative" }}>
        <div style={{ position: "absolute", top: "17px", left: "18px", right: "18px", height: "1px", background: "var(--border)", zIndex: 0 }} />
        {PHASES.map((label, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", position: "relative", zIndex: 1 }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: i <= cur ? "var(--pine)" : "var(--warm-white)",
              border: `2px solid ${i <= cur ? "var(--pine)" : "var(--border)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", fontWeight: 500,
              color: i < cur ? "#fff" : i === cur ? "var(--gold)" : "var(--text-muted)",
              transition: "all 0.25s",
              boxShadow: i === cur ? "0 0 0 4px rgba(26,58,42,0.1)" : "none",
            }}>
              {i < cur ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: i === cur ? 600 : 500, color: i === cur ? "var(--pine)" : "var(--text-muted)", letterSpacing: "0.03em", textAlign: "center" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DrillDown({ item, topic }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (content) { setOpen(o => !o); return; }
    setOpen(true);
    setLoading(true);
    try {
      const text = await askProse([{
        role: "user",
        content: `We're studying "${topic}". Please explain "${item.label}" deeply and from scratch.

Context about this item: ${item.context}

Write 4 flowing paragraphs (no bullet points):

Paragraph 1 — Plain English intuition. What is this actually saying, before any math? If useful, use a real-world analogy or a simple case first.

Paragraph 2 — Where it comes from. Build the formula or concept piece by piece. Explain what each symbol means, why it's there, and where it originates. Don't just restate the formula — derive or motivate it.

Paragraph 3 — A fully worked concrete example with real numbers or explicit symbols. Walk through every step out loud, explaining what's happening and why at each stage.

Paragraph 4 — Why this matters. When does this show up in practice? What goes wrong if someone misunderstands this?

Be thorough. Use ${CODE_LANG} for any code examples.`
      }], 1000);
      setContent(text);
    } catch { setContent("Couldn't load explanation. Please try again."); }
    setLoading(false);
  };

  return (
    <div style={{ margin: "0.4rem 0 1rem", borderRadius: "var(--border-radius-md)", border: "0.5px solid " + (open ? "var(--color-border-secondary)" : "var(--color-border-tertiary)"), overflow: "hidden", background: open ? "var(--color-background-secondary)" : "transparent", transition: "background 0.2s" }}>
      <button onClick={load} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 1rem", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: 1, minWidth: 0 }}>
          <code style={{ fontFamily: "var(--font-mono,monospace)", fontSize: "13px", background: "rgba(0,105,62,0.09)", color: "#004d2e", padding: "3px 9px", borderRadius: "4px", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>{item.label}</code>
          <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>{item.context}</span>
        </div>
        <span style={{ fontSize: "11px", fontWeight: 600, color: open ? "#ba7517" : "var(--pine)", whiteSpace: "nowrap", background: open ? "#faeeda" : "rgba(26,58,42,0.09)", padding: "3px 9px", borderRadius: "var(--border-radius-md)", flexShrink: 0 }}>
          {loading ? "loading…" : open ? "close ×" : "explain →"}
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          {loading
            ? <div style={{ padding: "1.1rem 0", display: "flex", alignItems: "center", gap: "10px" }}><LoadDots /><span style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>Building deep explanation…</span></div>
            : <div style={{ paddingTop: "1rem" }}><ProseParagraphs text={content} size="14px" /></div>}
        </div>
      )}
    </div>
  );
}

function CodeSnippet({ section, topic }) {
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(CODE_LANG);
  const [codeByLang, setCodeByLang] = useState({});
  const [loadingLang, setLoadingLang] = useState(null);
  const [copied, setCopied] = useState(false);

  const currentCode = codeByLang[selectedLang] || "";

  const copyCode = () => {
    navigator.clipboard.writeText(currentCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const loadLang = async (lang) => {
    setCopied(false);
    setSelectedLang(lang);
    setOpen(true);
    if (codeByLang[lang]) return;
    setLoadingLang(lang);
    try {
      const text = await askProse([{
        role: "user",
        content: `We're studying "${topic}", specifically the section "${section.title}".

Write a concise, focused ${lang} code example that directly illustrates the core concept from this section. Requirements:
- Runnable, self-contained code (no missing imports or dependencies)
- Every non-obvious line has a short inline comment explaining *why*, not just what
- 15-35 lines — tight and purposeful, no padding
- End with 2-3 lines of plain English (as comments) explaining what to observe when you run it

Return ONLY the code block, no prose before or after.`
      }]);
      const clean = text.replace(/^```[^\n]*\n?/m, "").replace(/```$/m, "").trim();
      setCodeByLang(prev => ({ ...prev, [lang]: clean }));
    } catch {
      setCodeByLang(prev => ({ ...prev, [lang]: `// Could not load ${lang} example — please try again.` }));
    }
    setLoadingLang(null);
  };

  const handleMainButton = () => {
    if (open) { setOpen(false); } else { loadLang(CODE_LANG); }
  };

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <button onClick={handleMainButton} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 11px", fontSize: "11px", fontWeight: 600, background: open ? "#1e1e1e" : "var(--color-background-secondary)", color: open ? "#a8d8a8" : "var(--color-text-secondary)", border: open ? "none" : "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", cursor: "pointer" }}>
        {loadingLang === CODE_LANG && !open ? "loading…" : open ? "× Hide code" : `Show ${CODE_LANG} code →`}
      </button>
      {open && (
        <div style={{ marginTop: "6px", borderRadius: "var(--border-radius-md)", background: "#1e1e1e", overflow: "hidden", maxWidth: "100%" }}>
          <div style={{ display: "flex", gap: "2px", padding: "8px 10px 4px", borderBottom: "0.5px solid rgba(255,255,255,0.08)", flexWrap: "wrap" }}>
            {SNIPPET_LANGS.map(lang => (
              <button key={lang} onClick={() => loadLang(lang)} style={{
                padding: "3px 10px", fontSize: "11px", fontWeight: 600,
                background: selectedLang === lang ? "rgba(255,255,255,0.14)" : "transparent",
                color: selectedLang === lang ? "#a8d8a8" : "rgba(255,255,255,0.4)",
                border: selectedLang === lang ? "0.5px solid rgba(255,255,255,0.22)" : "0.5px solid transparent",
                borderRadius: "4px", cursor: "pointer",
              }}>
                {lang}{loadingLang === lang ? " …" : ""}
              </button>
            ))}
          </div>
          {loadingLang === selectedLang
            ? <div style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "10px" }}><LoadDots /><span style={{ fontSize: "12px", color: "var(--mint)" }}>Generating {selectedLang} example…</span></div>
            : currentCode
              ? <>
                  <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 8px 0" }}>
                    <button onClick={copyCode} style={{ background: "none", border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: "4px", color: copied ? "var(--mint)" : "rgba(255,255,255,0.45)", fontSize: "11px", padding: "2px 9px", cursor: "pointer" }}>{copied ? "Copied!" : "Copy"}</button>
                  </div>
                  <pre style={{ margin: 0, padding: "0.5rem 1.25rem 1rem", fontSize: "12.5px", lineHeight: "1.65", color: "#d4d4d4", fontFamily: "var(--font-mono,monospace)", overflowX: "auto", whiteSpace: "pre" }}>{currentCode}</pre>
                </>
              : <div style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "10px" }}><LoadDots /><span style={{ fontSize: "12px", color: "var(--mint)" }}>Generating {selectedLang} example…</span></div>
          }
        </div>
      )}
    </div>
  );
}

function LessonSection({ section, topic }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.1rem" }}>
        <div style={{ width: "4px", height: "22px", background: "var(--pine)", borderRadius: "2px", flexShrink: 0 }} />
        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>{section.title}</h3>
      </div>
      <ProseParagraphs text={section.prose} />
      <CodeSnippet section={section} topic={topic} />
      {section.keyItems?.length > 0 && (
        <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "0.5px dashed var(--color-border-tertiary)" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--color-text-tertiary)", textTransform: "uppercase", margin: "0 0 0.6rem" }}>Key items — click any to get a deep explanation</p>
          {section.keyItems.map((item, i) => <DrillDown key={i} item={item} topic={topic} />)}
        </div>
      )}
    </div>
  );
}

function buildChatContext(phase, topic, sections, questions, answers, results, followUpText) {
  const parts = [`Topic: "${topic}"`, `Current phase: ${phase}`];
  if (sections?.length) {
    const summary = sections.map(s => `${s.title}:\n${(s.prose || "").slice(0, 1200)}`).join("\n\n");
    parts.push("Lesson content:\n" + summary);
  }
  if (questions?.length) {
    if (phase === "quiz") {
      parts.push("Quiz questions:\n" + questions.map((q, i) => `Q${i+1}: ${q.question}`).join("\n"));
    }
    if ((phase === "grade" || phase === "followup" || phase === "done") && results?.results) {
      const qDetail = questions.map((q, i) => {
        const r = results.results[i];
        return `Q${i+1} [${r?.score === 1 ? "correct" : r?.score === 0.5 ? "partial" : "wrong"}]: ${q.question}\nStudent answered: ${answers[i] || "[blank]"}\nFeedback: ${r?.feedback || ""}`;
      }).join("\n\n");
      parts.push("Quiz Q&A detail:\n" + qDetail);
    }
  }
  if (results)
    parts.push(`Overall: ${Math.round((results.score/results.total)*100)}%. Weak: ${(results.weakAreas||[]).join(", ")||"none"}. Strong: ${(results.strongAreas||[]).join(", ")||"none"}.`);
  if (followUpText) parts.push("Review content: " + followUpText.slice(0, 400));
  return parts.join("\n\n");
}

function QuestionExplain({ question, userAnswer, score, topic }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (content) { setOpen(o => !o); return; }
    setOpen(true);
    setLoading(true);
    try {
      const text = await askProse([{
        role: "user",
        content: `We're studying "${topic}". This was a quiz question:

Question: ${question?.question}
Student's answer: ${userAnswer || "[no answer given]"}
Score: ${score === 1 ? "full credit" : score === 0.5 ? "partial credit" : "incorrect"}

Write a teaching explanation with 3 paragraphs:

Paragraph 1 — The complete correct answer, explained clearly from first principles. Don't just state the answer — explain *why* it's correct in plain English, building up the reasoning so it's obvious.

Paragraph 2 — Walk through the solution step by step. If it's computational, show every step with real numbers. If it's conceptual, trace the logic carefully. Make the method replicable.

Paragraph 3 — What this question is really testing. Explain the deeper concept behind it, where it comes up in practice, and what distinguishes a strong answer from a weak one on this type of question.

Write in flowing paragraphs, no bullet points. Be thorough — this is a teaching moment.`
      }]);
      setContent(text);
    } catch { setContent("Couldn't load explanation. Please try again."); }
    setLoading(false);
  };

  const scoreLabel = score === 1 ? "see why this is correct" : score === 0.5 ? "see full answer" : "see correct answer";
  const accentColor = score === 1 ? "var(--pine)" : score === 0.5 ? "#ba7517" : "#a32d2d";
  const accentBg = score === 1 ? "rgba(26,58,42,0.09)" : score === 0.5 ? "#faeeda" : "#fcebeb";

  return (
    <div style={{ marginTop: "10px", marginLeft: "36px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden", background: open ? "var(--color-background-secondary)" : "transparent" }}>
      <button onClick={load} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.55rem 0.9rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>Teaching explanation</span>
        <span style={{ fontSize: "11px", fontWeight: 600, color: accentColor, background: accentBg, padding: "2px 9px", borderRadius: "var(--border-radius-md)", whiteSpace: "nowrap" }}>
          {loading ? "loading…" : open ? "close ×" : scoreLabel + " →"}
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 1rem 1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          {loading
            ? <div style={{ padding: "1rem 0", display: "flex", alignItems: "center", gap: "10px" }}><LoadDots /><span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>Building explanation…</span></div>
            : <div style={{ paddingTop: "0.9rem" }}><ProseParagraphs text={content} size="13px" /></div>}
        </div>
      )}
    </div>
  );
}

function ChatPanel({ topic, sections, questions, answers, results, followUpText, phase, history, setHistory, user }) {
  const displayName = user?.email ? user.email.split("@")[0].split(".")[0] : "You";
  const initials = displayName.slice(0, 1).toUpperCase();
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [learnPrompts, setLearnPrompts] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" }); }, [history, thinking]);

  useEffect(() => {
    if (!sections.length || !topic) return;
    setLearnPrompts(null);
    const keyTerms = sections.flatMap(s => (s.keyItems || []).map(k => k.label)).slice(0, 8).join(", ");
    const snippet = (sections[0]?.prose || "").slice(0, 200);
    askJSON([{ role: "user", content: `A student just finished a lesson on "${topic}". Key terms covered: ${keyTerms || "none"}. Lesson excerpt: "${snippet}". Generate 4 follow-up questions they might click to ask next. Rules: (1) Every question must name "${topic}" or a specific term from the lesson — no generic questions like "Walk me through the intuition again". (2) Under 9 words each. (3) Mix question types: one asking why something works, one asking about a specific term, one asking for an example, one connecting to a real use case. Return a JSON array of exactly 4 strings.` }], "", 400)
      .then(raw => {
        try {
          const arr = parseJSON(typeof raw === "string" ? raw : JSON.stringify(raw));
          if (Array.isArray(arr) && arr.length >= 4) setLearnPrompts(arr.slice(0, 4));
        } catch {}
      })
      .catch(() => {});
  }, [topic, sections]);

  const send = async () => {
    const q = input.trim();
    if (!q || thinking) return;
    setInput("");
    setHistory(h => [...h, { from: "user", text: q }]);
    setThinking(true);
    try {
      const ctx = buildChatContext(phase, topic, sections, questions, answers, results, followUpText);
      const sys = SYSTEM + `\n\nSession context:\n${ctx}\n\n${phaseContext}\n\nAnswer the student's question directly and specifically. Reference lesson content, quiz questions, their actual answers, or results feedback as relevant. Be thorough but focused — don't re-summarize the whole topic.`;
      const msgs = [...history.map(m => ({ role: m.from === "user" ? "user" : "assistant", content: m.text })), { role: "user", content: q }];
      const reply = await callAPI(msgs, sys, 1000);
      setHistory(h => [...h, { from: "ai", text: reply }]);
    } catch { setHistory(h => [...h, { from: "ai", text: "Something went wrong — please try again." }]); }
    setThinking(false);
  };

  const QUICK = {
    learn: learnPrompts || (COURSE.id === "cosc10"
      ? ["Show me a complete working Java example", "What's the most common bug with this?", "How would I know when to use this?", "What trips people up the most here?"]
      : COURSE.id === "cosc50"
      ? ["What happens in memory when this runs?", "Show me a minimal C example", "What undefined behavior should I watch for?", "How would I debug this with gdb?"]
      : COURSE.id === "cosc31"
      ? ["Walk me through the correctness proof", "What's the worst-case complexity and why?", "When would this algorithm fail or be suboptimal?", "Show me a concrete small example traced step by step"]
      : COURSE.id === "cosc77"
      ? ["Show me the math of a concrete example", "How does the rasterization pipeline handle this?", "What's the physical/geometric intuition here?", "Connect this to what I know about matrix transforms"]
      : ["Derive this from scratch for me", "When would this break down in practice?", "What's the key insight I need to remember?", "How does this connect to the bigger picture?"]),
    quiz: COURSE.id === "cosc10"
      ? ["Help me think through this without giving the answer", "What Java concept is this really testing?", "Can you remind me of the syntax?", "What should I trace through to solve this?"]
      : COURSE.id === "cosc50"
      ? ["Help me think through this without giving the answer", "What should the memory layout look like?", "What C concept is this really testing?", "Walk me through the approach step by step"]
      : COURSE.id === "cosc31"
      ? ["Help me set up the recurrence without solving it", "What algorithm design technique applies here?", "What's the key invariant I need to identify?", "Walk me through the approach without giving the answer"]
      : COURSE.id === "cosc77"
      ? ["Help me think through this without giving the answer", "What transformation matrix is involved here?", "What's the geometric intuition behind this?", "Walk me through the approach step by step"]
      : ["Help me set up the math without solving it", "What formula or concept should I start with?", "What's the intuition behind this question?", "Walk me through the approach step by step"],
    grade: ["Why did I get that wrong?", "Explain Q" + (results?.results?.findIndex(r => r.score < 1) + 1 || 1) + " to me from scratch", "What's the right mental model here?", "Give me a similar practice problem"],
    followup: COURSE.id === "cosc10"
      ? ["Show me a clean Java example of this", "Try explaining it from a completely different angle", "What's the one thing I need to get right?", "What would this look like on a CS 10 exam?"]
      : COURSE.id === "cosc50"
      ? ["Show me a clean C example from scratch", "Try explaining it from a completely different angle", "How would Valgrind catch a bug here?", "What would a COSC 50 lab question look like here?"]
      : COURSE.id === "cosc31"
      ? ["Trace through the algorithm on a small example", "What's the formal proof sketch I should know?", "How does this compare to the alternative approaches?", "What would a COSC 31 exam question look like here?"]
      : COURSE.id === "cosc77"
      ? ["Show me a minimal C++ or GLSL example", "Try explaining it from a different geometric angle", "What's the tradeoff vs the alternative approach?", "What would a COSC 77 assignment question look like here?"]
      : ["Show me a clean worked example", "Try explaining it from a completely different angle", "What's the one thing I need to nail this?", "What would a perfect exam answer look like?"],
    done: ["What's the single most important thing to remember?", "What should I study next?", "Give me a harder practice problem", "How might this show up on an exam?"],
  };
  const quickList = QUICK[phase] || QUICK.learn;

  const phaseContext = {
    grade: `The student just got their quiz results. Score: ${results ? Math.round((results.score/results.total)*100) : 0}%. Weak areas: ${results?.weakAreas?.join(", ") || "none"}. Strong areas: ${results?.strongAreas?.join(", ") || "none"}. Their specific answers and feedback are part of the session context. Help them understand what they got wrong and why.`,
    followup: `The student is in the targeted review phase, re-learning their weak areas: ${results?.weakAreas?.join(", ") || ""}. Address their question in the context of that re-instruction.`,
  }[phase] || "";

  const qCount = history.filter(m => m.from === "user").length;

  return (
    <div style={{ marginTop: "1.5rem", borderRadius: "14px", border: "1.5px solid var(--border)", background: "#fff", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.85rem 1.25rem", borderBottom: "1px solid var(--border)" }}>
        <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(26,58,42,0.09)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1C4.13 1 1 3.91 1 7.5c0 1.61.62 3.08 1.65 4.22L2 14l2.58-.87C5.55 13.68 6.75 14 8 14c3.87 0 7-2.91 7-6.5S11.87 1 8 1z" fill="var(--pine)" /></svg>
        </div>
        <div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-dark)" }}>Ask a question</span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "8px" }}>{qCount ? `${qCount} so far` : "Anything about this topic"}</span>
        </div>
      </div>

      {/* Quick prompts (no history yet) */}
      {history.length === 0 && (
        <div style={{ padding: "0.75rem 1.25rem 0.5rem", display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {quickList.map(q => (
            <button key={q} onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 0); }}
              style={{ fontSize: "12px", padding: "5px 12px", background: "var(--cream)", border: "1px solid var(--border)", borderRadius: "100px", cursor: "pointer", color: "var(--text-mid)", whiteSpace: "nowrap" }}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Conversation history */}
      {history.length > 0 && (
        <div style={{ maxHeight: "360px", overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "14px" }}>
          {history.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", flexDirection: m.from === "user" ? "row-reverse" : "row" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0, marginTop: "1px", background: m.from === "user" ? "rgba(26,58,42,0.09)" : "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: m.from === "user" ? "var(--pine)" : "var(--text-muted)" }}>{m.from === "user" ? initials : "AI"}</span>
              </div>
              <div style={{ flex: 1, maxWidth: "88%" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "3px", textAlign: m.from === "user" ? "right" : "left" }}>{m.from === "user" ? displayName : "Darby"}</div>
                <div style={{ background: m.from === "user" ? "rgba(26,58,42,0.09)" : "var(--cream)", borderRadius: m.from === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "10px 14px" }}>
                  <ProseParagraphs text={m.text} size="13px" />
                </div>
              </div>
            </div>
          ))}
          {thinking && (
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--text-muted)" }}>AI</span>
              </div>
              <div style={{ background: "var(--cream)", borderRadius: "12px 12px 12px 2px", padding: "12px 14px" }}>
                <LoadDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input row — always visible */}
      <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--border)", display: "flex", gap: "8px", alignItems: "flex-end", background: "var(--warm-white)" }}>
        <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask anything about this lesson… (Enter to send)"
          rows={1}
          style={{ flex: 1, padding: "10px 14px", fontSize: "13px", lineHeight: "1.5", borderRadius: "10px", border: "1.5px solid var(--border)", background: "#fff", color: "var(--text-dark)", resize: "none", fontFamily: "var(--font-sans)", outline: "none", maxHeight: "90px" }}
        />
        <button onClick={send} disabled={!input.trim() || thinking}
          style={{ padding: "10px 18px", background: input.trim() && !thinking ? "var(--pine)" : "var(--cream-dark)", color: input.trim() && !thinking ? "white" : "var(--text-muted)", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: input.trim() && !thinking ? "pointer" : "default", flexShrink: 0, boxShadow: input.trim() && !thinking ? "0 2px 6px rgba(26,58,42,0.2)" : "none" }}>
          Send
        </button>
      </div>
    </div>
  );
}

const scoreColor = p => p >= 80 ? "var(--pine)" : p >= 60 ? "#ba7517" : "#a32d2d";
const scoreBg = p => p >= 80 ? "rgba(26,58,42,0.09)" : p >= 60 ? "#faeeda" : "#fcebeb";

function VideoCard({ video }) {
  const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? Math.round(n / 1e3) + "K" : String(n);
  return (
    <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer"
      style={{ display: "flex", gap: "12px", textDecoration: "none", padding: "0.75rem", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-primary)", flex: "1 1 0", minWidth: 0 }}>
      <img src={video.thumbnail} alt={video.title} style={{ width: "112px", height: "63px", borderRadius: "5px", objectFit: "cover", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text-primary)", lineHeight: "1.45", marginBottom: "5px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{video.title}</div>
        <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>{video.channel}</div>
        <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginTop: "2px" }}>{fmt(video.views)} views</div>
      </div>
    </a>
  );
}

function TopNav({ view, setView, onHome, sessionCount, formulaCount, dueCount, user, onSignOut, savedLessons, onCourseSelect }) {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const courseList = Object.entries(savedLessons || {}).sort((a, b) => b[1].savedAt - a[1].savedAt);
  const navLinks = [
    { id: "history", label: `History${sessionCount ? ` (${sessionCount})` : ""}` },
    { id: "formulas", label: `Formulas/Defs${formulaCount ? ` (${formulaCount})` : ""}` },
    { id: "review", label: `Review${dueCount ? ` (${dueCount})` : ""}`, urgent: dueCount > 0 },
    { id: "help", label: "Help" },
    ...(isAdmin(user?.email) ? [{ id: "admin", label: "Admin" }] : []),
  ];
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "var(--pine)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2.5rem", height: "64px",
      boxShadow: "0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.25)",
    }}>
      {/* Brand */}
      <button onClick={onHome} style={{ display: "flex", alignItems: "center", gap: "12px", background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
        <div style={{ width: "58px", height: "58px", borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <img src="https://communications.dartmouth.edu/sites/communications/files/2024-07/lone-pine-rev.png" alt="Dartmouth" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 600, color: "#fff", letterSpacing: "0.01em", lineHeight: 1.2 }}>{COURSE_TITLE}</div>
          <div style={{ fontSize: "0.7rem", fontWeight: 500, color: "var(--mint)", letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.85 }}>{COURSE_LABEL}</div>
        </div>
      </button>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <button onClick={onHome}
          style={{ fontSize: "0.83rem", fontWeight: 600, padding: "7px 18px", background: "var(--gold)", color: "var(--pine)", border: "none", borderRadius: "8px", cursor: "pointer", letterSpacing: "0.02em", boxShadow: "0 2px 8px rgba(200,168,75,0.35)", marginRight: "2px" }}>
          + New Topic
        </button>
        {courseList.length > 0 && (
          <div style={{ position: "relative", marginRight: "6px" }}>
            {coursesOpen && <div onClick={() => setCoursesOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />}
            <button onClick={() => setCoursesOpen(o => !o)}
              style={{ fontSize: "0.83rem", fontWeight: 600, padding: "7px 14px", background: coursesOpen ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", cursor: "pointer", letterSpacing: "0.02em" }}>
              My Courses ▾
            </button>
            {coursesOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 200, background: "#fff", border: "1.5px solid var(--border)", borderRadius: "10px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", minWidth: "240px", maxHeight: "320px", overflowY: "auto" }}>
                {courseList.map(([t]) => (
                  <button key={t} onClick={() => { onCourseSelect(t); setCoursesOpen(false); }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", background: "none", border: "none", borderBottom: "1px solid var(--color-border-tertiary)", cursor: "pointer", fontSize: "13px", color: "var(--text-dark)", fontFamily: "var(--font-sans)" }}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {navLinks.map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            style={{
              fontSize: "0.83rem", fontWeight: 500,
              padding: t.id === "help" ? "6px 10px" : "6px 14px",
              background: view === t.id ? "rgba(255,255,255,0.14)" : "transparent",
              color: t.urgent ? "var(--gold-light)" : view === t.id ? "#fff" : "rgba(255,255,255,0.7)",
              border: "none", borderRadius: "8px", cursor: "pointer", whiteSpace: "nowrap",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* User */}
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
          <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
          <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.12)" }} />
          <button onClick={onSignOut} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.15s" }}>Sign out</button>
        </div>
      )}
    </nav>
  );
}

function HelpView() {
  const Section = ({ title, children }) => (
    <div style={{ marginBottom: "1.75rem" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pine)", marginBottom: "0.75rem" }}>{title}</div>
      {children}
    </div>
  );
  const Item = ({ label, children }) => (
    <div style={{ marginBottom: "0.6rem", display: "flex", gap: "10px" }}>
      <span style={{ fontWeight: 600, fontSize: "13px", minWidth: "120px", flexShrink: 0, color: "var(--color-text-primary)" }}>{label}</span>
      <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>{children}</span>
    </div>
  );
  return (
    <div style={{ maxWidth: "800px" }}>
      <Section title="The Study Flow">
        <Item label="1. Pick a topic">Type anything or click a suggested chip, then hit Start Lesson.</Item>
        <Item label="2. Read the lesson">6 sections: intuition, mechanics, fully traced example, visual diagram, proof sketch, and clarifications. Click any bolded term for a deep dive.</Item>
        <Item label="3. Code examples">Click Show example code under any section for a runnable example. Copy button included.</Item>
        <Item label="4. Take the quiz">5 questions — conceptual, computational, and synthesis. Show your work.</Item>
        <Item label="5. Review results">Per-question feedback, strong/weak areas, and a targeted re-explanation of missed concepts.</Item>
      </Section>
      <Section title="Navigation">
        <Item label="History">Log of every completed session with score and weak/strong area tags.</Item>
        <Item label="Formulas/Defs">Auto-built reference sheet from every lesson. Filter by type, print by category, delete entries with ×.</Item>
        <Item label="Review">Spaced repetition queue. Wrong answers return in 1 day, partial in 3 days, correct in 30 days. Each card generates a fresh question on the same concept.</Item>
      </Section>
      <Section title="Tips">
        <Item label="Regen button">On any lesson, click ↺ Regen to regenerate a new lesson and quiz on the same topic. History and formulas are preserved.</Item>
        <Item label="Chat">Available at every phase. Ask follow-up questions, request examples, or say "explain that differently." The tutor knows your full context.</Item>
        <Item label="Persistence">Completed lessons survive page refresh — you'll land back where you left off. Starting a new topic clears the current session.</Item>
        <Item label="Formula sheet">Fills automatically as you study. After a few lessons you'll have a printable reference sheet.</Item>
      </Section>
    </div>
  );
}

function HistoryView({ sessions }) {
  if (!sessions.length) return (
    <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-tertiary)", fontSize: "14px" }}>
      No sessions yet — start studying to build your history.
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
      {sessions.map((s, i) => {
        const pct = s.total ? Math.round((s.score / s.total) * 100) : 0;
        return (
          <div key={s.id || i} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "2px" }}>{s.topic}</div>
              <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>{s.date}</div>
              {s.weakAreas?.length > 0 && <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "4px" }}>Struggled: {s.weakAreas.join(", ")}</div>}
              {s.strongAreas?.length > 0 && <div style={{ fontSize: "12px", color: "var(--pine)", marginTop: "2px" }}>Strong: {s.strongAreas.join(", ")}</div>}
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: scoreColor(pct), lineHeight: 1 }}>{pct}%</div>
              <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginTop: "2px" }}>{s.score}/{s.total}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FormulasView({ formulas, setFormulas }) {
  const [filter, setFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const [newType, setNewType] = useState("formula");
  const [newTopic, setNewTopic] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newContext, setNewContext] = useState("");

  const existingTopics = [...new Set(formulas.map(f => f.topic))].sort();

  const submitNew = () => {
    if (!newLabel.trim() || !newContext.trim() || !newTopic.trim()) return;
    setFormulas(prev => [...prev, { topic: newTopic.trim(), label: newLabel.trim(), context: newContext.trim(), type: newType }]);
    setNewLabel(""); setNewContext(""); setAdding(false);
  };

  const formulaItems = formulas.filter(f => f.type === "formula");
  const definitionItems = formulas.filter(f => f.type !== "formula");

  if (!formulas.length && !adding) return (
    <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <div style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "1.25rem" }}>No entries yet — complete a lesson or add one manually.</div>
      <button onClick={() => setAdding(true)} style={{ padding: "9px 20px", background: "var(--pine)", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(26,58,42,0.2)" }}>+ Add entry</button>
    </div>
  );

  const deleteEntry = (f) => setFormulas(prev => prev.filter(x => !(x.topic === f.topic && x.label === f.label)));

  const printHideRule = filter === "formulas"
    ? `@media print { [data-ftype="definition"] { display: none !important; } }`
    : filter === "definitions"
    ? `@media print { [data-ftype="formula"] { display: none !important; } }`
    : "";

  const Section = ({ items, heading, color, ftype }) => {
    if (!items.length) return null;
    if (filter !== "all" && filter !== ftype) return null;
    const byTopic = items.reduce((acc, f) => { (acc[f.topic] = acc[f.topic] || []).push(f); return acc; }, {});
    const isFormula = ftype === "formulas";
    const rowBg = isFormula ? "rgba(0,105,62,0.06)" : "rgba(100,100,110,0.06)";
    const rowBorder = isFormula ? "0.5px solid rgba(0,105,62,0.2)" : "0.5px solid rgba(100,100,110,0.18)";
    return (
      <div data-ftype={ftype} style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color, marginBottom: "0.75rem" }}>{heading}</div>
        {Object.keys(byTopic).map(topic => (
          <div key={topic} style={{ marginBottom: "1rem", pageBreakInside: "avoid" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.4rem" }}>
              <div style={{ width: "3px", height: "13px", background: color, borderRadius: "2px", flexShrink: 0 }} />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-text-primary)" }}>{topic}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {byTopic[topic].map((f, i) => (
                <div key={i} data-ftype={ftype} style={{ display: "flex", gap: "8px", alignItems: "flex-start", padding: "4px 8px", background: rowBg, border: rowBorder, borderRadius: "5px" }}>
                  <code style={{ fontFamily: "var(--font-mono,monospace)", fontSize: "11px", background: isFormula ? "rgba(26,58,42,0.1)" : "rgba(26,58,42,0.06)", color: isFormula ? "var(--pine-mid)" : "var(--text-muted)", padding: "1px 6px", borderRadius: "3px", fontWeight: 600, whiteSpace: "pre", flexShrink: 0 }}>{f.label}</code>
                  <span style={{ fontSize: "11px", color: "var(--color-text-secondary)", lineHeight: "1.5", flex: 1 }}>{f.context}</span>
                  <button onClick={() => deleteEntry(f)} className="no-print" style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", fontSize: "13px", lineHeight: 1, padding: "1px 3px", borderRadius: "3px" }}>×</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const inputStyle = { width: "100%", boxSizing: "border-box", padding: "9px 12px", fontSize: "13px", borderRadius: "8px", border: "1.5px solid var(--border)", background: "var(--cream)", color: "var(--text-dark)", outline: "none", fontFamily: "var(--font-sans)" };

  return (
    <div>
      <style>{`@media print { .no-print { display: none !important; } body { background: white; } } ${printHideRule}`}</style>

      {/* Toolbar */}
      <div className="no-print" style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: "6px 12px", fontSize: "12px", fontWeight: 600, borderRadius: "8px", border: "1.5px solid var(--border)", background: "var(--cream)", color: "var(--text-mid)", cursor: "pointer" }}>
          <option value="all">All</option>
          <option value="formulas">Formulas</option>
          <option value="definitions">Definitions</option>
        </select>
        <div style={{ flex: 1 }} />
        <button onClick={() => { setAdding(a => !a); }} style={{ padding: "6px 16px", fontSize: "12px", fontWeight: 600, borderRadius: "8px", border: "1.5px solid var(--border)", background: adding ? "var(--pine)" : "var(--cream)", color: adding ? "white" : "var(--text-mid)", cursor: "pointer" }}>
          {adding ? "Cancel" : "+ Add entry"}
        </button>
        <button onClick={() => window.print()} style={{ padding: "6px 16px", fontSize: "12px", fontWeight: 600, borderRadius: "8px", border: "1.5px solid var(--border)", background: "var(--cream)", color: "var(--text-mid)", cursor: "pointer" }}>Print / PDF</button>
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.25rem", boxShadow: "0 4px 16px rgba(26,58,42,0.07)" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--pine)", marginBottom: "1rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>New Entry</div>

          {/* Type toggle */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
            {["formula", "definition"].map(t => (
              <button key={t} onClick={() => setNewType(t)}
                style={{ padding: "6px 18px", fontSize: "12px", fontWeight: 600, borderRadius: "100px", border: "1.5px solid", borderColor: newType === t ? "var(--pine)" : "var(--border)", background: newType === t ? "var(--pine)" : "var(--cream)", color: newType === t ? "white" : "var(--text-muted)", cursor: "pointer", textTransform: "capitalize" }}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "5px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {newType === "formula" ? "Label / Expression" : "Term"}
              </label>
              <input value={newLabel} onChange={e => setNewLabel(e.target.value)}
                placeholder={newType === "formula" ? "e.g. A^T · A" : "e.g. Gradient"}
                style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "5px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Topic</label>
              <input value={newTopic} onChange={e => setNewTopic(e.target.value)}
                placeholder="e.g. Linear Algebra"
                list="topic-suggestions"
                style={inputStyle} />
              {existingTopics.length > 0 && (
                <datalist id="topic-suggestions">
                  {existingTopics.map(t => <option key={t} value={t} />)}
                </datalist>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "5px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {newType === "formula" ? "What it means / when to use it" : "Definition"}
            </label>
            <textarea value={newContext} onChange={e => setNewContext(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitNew(); }}
              placeholder={newType === "formula" ? "Describe what this formula represents and when it applies…" : "Define this term in plain language…"}
              rows={3}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.55 }} />
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={submitNew} disabled={!newLabel.trim() || !newContext.trim() || !newTopic.trim()}
              style={{ padding: "9px 22px", background: (newLabel.trim() && newContext.trim() && newTopic.trim()) ? "var(--pine)" : "var(--cream-dark)", color: (newLabel.trim() && newContext.trim() && newTopic.trim()) ? "white" : "var(--text-muted)", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: (newLabel.trim() && newContext.trim() && newTopic.trim()) ? "pointer" : "default", boxShadow: (newLabel.trim() && newContext.trim() && newTopic.trim()) ? "0 2px 8px rgba(26,58,42,0.2)" : "none" }}>
              Add to sheet
            </button>
            <button onClick={() => { setAdding(false); setNewLabel(""); setNewContext(""); setNewTopic(""); }}
              style={{ padding: "9px 16px", background: "none", border: "1.5px solid var(--border)", borderRadius: "8px", fontSize: "13px", color: "var(--text-muted)", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <Section items={formulaItems} heading="Formulas & Expressions" color="var(--pine)" ftype="formulas" />
      <Section items={definitionItems} heading="Definitions" color="var(--text-mid)" ftype="definitions" />
    </div>
  );
}

function ReviewView({ flagged, setFlagged, onDone }) {
  const due = flagged.filter(f => f.dueDate <= today());
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [genQ, setGenQ] = useState(null);
  const [genLoading, setGenLoading] = useState(false);

  const ref = due[idx];

  useEffect(() => {
    if (!ref) return;
    setGenQ(null); setAnswer(""); setResult(null);
    setGenLoading(true);
    askJSON([{ role: "user", content: `The student previously struggled with this question on "${ref.topic}":\n\nOriginal question: ${ref.question}\nFeedback they received: ${ref.feedback || "none"}\n\nGenerate a fresh question that tests the same concept from a different angle. It should be ${ref.difficulty || "medium"} difficulty and ${ref.type || "conceptual"} type.\n\nReturn JSON only:\n{"question":"..."}` }])
      .then(raw => setGenQ(parseJSON(raw)?.question || ref.question))
      .catch(() => setGenQ(ref.question))
      .finally(() => setGenLoading(false));
  }, [idx, ref?.topic, ref?.question]);

  if (!due.length || done) return (
    <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <div style={{ fontSize: "32px", marginBottom: "0.75rem" }}>{done ? "✓" : "🎉"}</div>
      <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>{done ? "Review complete!" : "Nothing due!"}</div>
      <div style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
        {done ? `You reviewed ${due.length} question${due.length !== 1 ? "s" : ""}.` : "Come back later when questions are due."}
      </div>
      <button onClick={onDone} style={{ padding: "10px 22px", background: "var(--pine)", color: "white", border: "none", borderRadius: "var(--border-radius-md)", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Back to Home</button>
    </div>
  );

  const q = ref;

  const grade = async () => {
    if (!answer.trim() || loading || !genQ) return;
    setLoading(true);
    try {
      const raw = await askJSON([{ role: "user", content: `Grade this answer on "${q.topic}":\n\nQuestion: ${genQ}\nAnswer: ${answer}\n\n1=correct, 0.5=partial, 0=wrong. Return JSON:\n{"score":0,"feedback":"2 specific sentences"}` }]);
      const parsed = parseJSON(raw);
      setResult(parsed);
      const d = new Date();
      if (parsed.score === 1) d.setDate(d.getDate() + 30);
      else if (parsed.score === 0.5) d.setDate(d.getDate() + 3);
      else d.setDate(d.getDate() + 1);
      const newDate = d.toISOString().split("T")[0];
      setFlagged(prev => prev.map(f => (f.topic === q.topic && f.question === q.question) ? { ...f, dueDate: newDate, feedback: parsed.feedback } : f));
    } catch { setResult({ score: 0, feedback: "Could not grade — please try again." }); }
    setLoading(false);
  };

  const next = () => {
    setAnswer(""); setResult(null); setGenQ(null);
    if (idx + 1 >= due.length) setDone(true);
    else setIdx(i => i + 1);
  };

  return (
    <div>
      <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginBottom: "1rem" }}>Question {idx + 1} of {due.length}</div>
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem 1.5rem" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--pine)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{q.topic}</div>
        {genLoading
          ? <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 1rem" }}><LoadDots /><span style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>Generating question…</span></div>
          : <p style={{ margin: "0 0 1rem", fontSize: "14px", fontWeight: 500, lineHeight: "1.75" }}>{genQ}</p>}
        {!result ? (
          <>
            <textarea value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); grade(); } }}
              placeholder="Your answer… (Enter to submit)"
              rows={3} style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", fontSize: "14px", lineHeight: "1.65", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", resize: "vertical", fontFamily: "var(--font-sans,system-ui)", outline: "none" }} />
            <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={grade} disabled={!answer.trim() || loading} style={{ padding: "9px 20px", background: answer.trim() && !loading ? "var(--pine)" : "var(--color-background-secondary)", color: answer.trim() && !loading ? "white" : "var(--color-text-tertiary)", border: "none", borderRadius: "var(--border-radius-md)", fontSize: "13px", fontWeight: 600, cursor: answer.trim() && !loading ? "pointer" : "default" }}>
                {loading ? "Grading…" : "Submit →"}
              </button>
            </div>
          </>
        ) : (
          <div>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "0.85rem", background: result.score === 1 ? "rgba(26,58,42,0.09)" : result.score === 0.5 ? "#faeeda" : "#fcebeb", borderRadius: "var(--border-radius-md)", marginBottom: "1rem" }}>
              <span style={{ fontWeight: 700, color: result.score === 1 ? "var(--pine)" : result.score === 0.5 ? "#ba7517" : "#a32d2d", flexShrink: 0 }}>{result.score === 1 ? "✓" : result.score === 0.5 ? "½" : "✗"}</span>
              <span style={{ fontSize: "13px", lineHeight: "1.65" }}>{result.feedback}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={next} style={{ padding: "9px 20px", background: "var(--pine)", color: "white", border: "none", borderRadius: "var(--border-radius-md)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                {idx + 1 < due.length ? "Next →" : "Finish"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Btn = ({ label, onClick, primary = true, disabled = false }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: "10px 22px", background: primary && !disabled ? "var(--pine)" : "transparent", color: primary && !disabled ? "white" : "var(--color-text-secondary)", border: primary ? "none" : "1px solid var(--border)", borderRadius: "var(--border-radius-md)", fontSize: "14px", fontWeight: primary ? 600 : 400, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1, boxShadow: primary && !disabled ? "0 2px 8px rgba(26,58,42,0.2)" : "none" }}>
    {label}
  </button>
);

const COURSE_LABELS = { cosc77: "COSC 77 — Computer Graphics", cosc10: "COSC 10 — OOP", cosc50: "COSC 50 — Systems", cosc31: "COSC 31 — Algorithms" };

function AdminView({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken: user.sessionToken }),
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setData)
      .catch(() => setError("Could not load report."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "4rem", textAlign: "center" }}><LoadDots /></div>;
  if (error) return <div style={{ padding: "2rem", color: "var(--color-text-danger)" }}>{error}</div>;

  const thStyle = { padding: "8px 12px", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" };
  const tdStyle = { padding: "8px 12px", fontSize: "13px", color: "var(--text-dark)", borderBottom: "1px solid var(--color-border-tertiary)", verticalAlign: "middle" };
  const scoreColor = p => p == null ? "var(--text-muted)" : p >= 80 ? "var(--pine)" : p >= 60 ? "#b07a10" : "#a32d2d";
  const scoreBg = p => p == null ? "transparent" : p >= 80 ? "rgba(26,58,42,0.09)" : p >= 60 ? "#faeeda" : "#fcebeb";

  const StatBox = ({ label, value, sub }) => (
    <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "12px", padding: "1.25rem 1.5rem", minWidth: "130px" }}>
      <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--pine)", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-dark)", marginTop: "5px" }}>{label}</div>
      {sub && <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{sub}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>Admin</div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 600, color: "var(--text-dark)", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Usage Report</h2>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>All courses · Aggregate totals and last 7 days</p>
      </div>

      {Object.entries(data).map(([courseId, courseData]) => {
        const { total, weekly } = courseData;
        return (
          <div key={courseId} style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
              <div style={{ width: "3px", height: "18px", background: "var(--pine)", borderRadius: "2px" }} />
              <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-dark)" }}>{COURSE_LABELS[courseId] || courseId}</span>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "1.75rem" }}>
              <StatBox label="Total sessions" value={total.sessions} />
              <StatBox label="Unique students" value={total.uniqueStudents} sub="all time" />
              <StatBox label="Sessions this week" value={weekly.sessions} />
              <StatBox label="Students this week" value={weekly.uniqueStudents} />
            </div>

            {/* Topics table */}
            {total.topTopics.length > 0 && (
              <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem" }}>
                <div style={{ padding: "1rem 1.25rem 0.75rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-dark)" }}>Topics studied</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>by frequency</span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--cream)" }}>
                      <th style={thStyle}>Topic</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>Total</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>This week</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>Avg score</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>Low (&lt;70%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {total.topTopics.map((t, i) => {
                      const w = weekly.topTopics.find(x => x.topic === t.topic);
                      return (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "var(--warm-white)" }}>
                          <td style={tdStyle}>{t.topic}</td>
                          <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600 }}>{t.count}</td>
                          <td style={{ ...tdStyle, textAlign: "right", color: w?.count ? "var(--pine)" : "var(--text-muted)" }}>{w?.count || "—"}</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {t.avgScore != null
                              ? <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "20px", background: scoreBg(t.avgScore), color: scoreColor(t.avgScore), fontWeight: 600, fontSize: "12px" }}>{t.avgScore}%</span>
                              : <span style={{ color: "var(--text-muted)" }}>—</span>}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right", color: t.lowCount > 0 ? "#a32d2d" : "var(--text-muted)" }}>{t.lowCount || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Weak areas */}
            {total.topWeakAreas.length > 0 && (
              <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.25rem 0.75rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-dark)" }}>Struggling with</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>concepts most often marked weak</span>
                </div>
                <div style={{ padding: "1rem 1.25rem", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {total.topWeakAreas.map((w, i) => {
                    const weekly_w = weekly.topWeakAreas.find(x => x.area === w.area);
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--cream)", border: "1.5px solid var(--border)", borderRadius: "100px", padding: "6px 14px" }}>
                        <span style={{ fontSize: "13px", color: "var(--text-dark)", fontWeight: 500 }}>{w.area}</span>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#a32d2d" }}>{w.count}×</span>
                        {weekly_w?.count > 0 && <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>({weekly_w.count} this wk)</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {total.sessions === 0 && (
              <div style={{ color: "var(--text-muted)", fontSize: "14px", padding: "1rem 0" }}>No sessions recorded yet for this course.</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SignInView({ onSignedIn }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    if (!email.trim() || loading) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!res.ok) throw new Error("Could not send — please try again.");
      setSent(true);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const features = COURSE.id === "cosc77"
    ? [
        { icon: "🔺", label: "Pipeline to pixel", desc: "Ray tracing and rasterization explained from physics up" },
        { icon: "📐", label: "Math from geometry", desc: "Transforms, projections, and shading derived intuitively" },
        { icon: "🎯", label: "Adaptive quizzing", desc: "Graded questions with targeted follow-ups" },
        { icon: "🔁", label: "Spaced repetition", desc: "AI-generated review on your weak spots" },
      ]
    : COURSE.id === "cosc50"
    ? [
        { icon: "💡", label: "Clear explanations", desc: "Concepts in plain English before the code" },
        { icon: "⚙️", label: "C examples", desc: "Real C code from labs and the TSE project" },
        { icon: "🎯", label: "Adaptive quizzing", desc: "Graded answers with targeted follow-ups" },
        { icon: "🔁", label: "Spaced repetition", desc: "AI-generated review questions on weak spots" },
      ]
    : COURSE.id === "cosc31"
    ? [
        { icon: "📐", label: "Algorithm intuition", desc: "Correctness proofs and design choices explained" },
        { icon: "🔬", label: "Complexity analysis", desc: "Recurrences, Big-O, and Master Theorem breakdowns" },
        { icon: "🎯", label: "Adaptive quizzing", desc: "Proof and analysis questions with targeted review" },
        { icon: "🔁", label: "Spaced repetition", desc: "AI-generated practice on your weak algorithms" },
      ]
    : [
        { icon: "💡", label: "Clear explanations", desc: "Concepts in plain English before the code" },
        { icon: "☕", label: "Java examples", desc: "Real code you'd write in class or on a job" },
        { icon: "🎯", label: "Adaptive quizzing", desc: "Graded answers with targeted follow-ups" },
        { icon: "🔁", label: "Spaced repetition", desc: "AI-generated review questions on weak spots" },
      ];

  if (sent) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0d2018 0%, var(--pine) 50%, var(--pine-mid) 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: "380px", background: "white", borderRadius: "16px", padding: "3rem 2.5rem", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(26,58,42,0.09)", border: "3px solid var(--pine)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "30px" }}>✉</div>
        <div style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px", letterSpacing: "-0.01em" }}>Check your email</div>
        <div style={{ fontSize: "14px", color: "var(--text-mid)", lineHeight: "1.7" }}>
          We sent a sign-in link to <strong>{email}</strong>.<br />
          It expires in 15 minutes.
        </div>
        <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--text-muted)" }}>Don't see it? Check your spam folder.</div>
        <button onClick={() => setSent(false)} style={{ marginTop: "2rem", fontSize: "13px", background: "none", border: "1px solid var(--border)", borderRadius: "20px", padding: "6px 16px", color: "var(--text-muted)", cursor: "pointer" }}>Use a different email</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Green hero */}
      <div style={{ background: "linear-gradient(135deg, #0d2018 0%, var(--pine) 100%)", color: "white", padding: "3.5rem 2rem 4rem", textAlign: "center" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "1.75rem" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img src="https://communications.dartmouth.edu/sites/communications/files/2024-07/lone-pine-rev.png" alt="Dartmouth" style={{ width: "38px", height: "38px", objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, opacity: 0.75, letterSpacing: "0.08em", textTransform: "uppercase" }}>{COURSE_LABEL}</div>
              <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{COURSE_TITLE}</div>
            </div>
          </div>
          <div style={{ fontSize: "18px", opacity: 0.9, lineHeight: 1.5, marginBottom: "2.5rem", fontWeight: 400 }}>
            Your AI study partner for Dartmouth CS.<br />
            <span style={{ opacity: 0.7, fontSize: "15px" }}>{COURSE_SUBTITLE}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", textAlign: "left", maxWidth: "520px", margin: "0 auto" }}>
            {features.map(f => (
              <div key={f.label} style={{ background: "rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px 16px", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ fontSize: "20px", marginBottom: "5px" }}>{f.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "2px" }}>{f.label}</div>
                <div style={{ fontSize: "12px", opacity: 0.7, lineHeight: 1.4 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sign-in card */}
      <div style={{ flex: 1, background: "var(--cream)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "3rem 2rem" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "14px", padding: "2.5rem", boxShadow: "0 4px 24px rgba(26,58,42,0.08)" }}>
            <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "6px", letterSpacing: "-0.01em", color: "var(--text-dark)" }}>Sign in to get started</div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "1.75rem" }}>No password — we'll email you a one-click sign-in link.</div>
            {error && <div style={{ fontSize: "13px", color: "var(--color-text-danger)", background: "var(--color-background-danger)", padding: "10px 14px", borderRadius: "8px", marginBottom: "1rem" }}>{error}</div>}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="your@email.com" autoFocus
              style={{ width: "100%", boxSizing: "border-box", padding: "13px 15px", fontSize: "16px", borderRadius: "8px", border: "1.5px solid var(--border)", background: "var(--cream)", color: "var(--text-dark)", outline: "none", marginBottom: "12px", fontFamily: "var(--font-sans)" }} />
            <button onClick={send} disabled={!email.trim() || loading}
              style={{ width: "100%", padding: "13px", background: email.trim() ? "var(--pine)" : "var(--cream-dark)", color: email.trim() ? "white" : "var(--text-muted)", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: email.trim() ? "pointer" : "default", transition: "background 0.15s", boxShadow: email.trim() ? "0 2px 8px rgba(26,58,42,0.2)" : "none" }}>
              {loading ? "Sending…" : "Send sign-in link →"}
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "13px", color: "var(--text-muted)" }}>Your study data syncs across all your devices.</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("session");
  const [phase, setPhase] = useState("topic");
  const [topic, setTopic] = useState("");
  const [sections, setSections] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [followUpSections, setFollowUpSections] = useState([]);
  const [videos, setVideos] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [error, setError] = useState("");
  const [confirmRegen, setConfirmRegen] = useState(false);

  const [sessions, setSessions] = useState(() => stor.get(`cstutor_${COURSE.id}_sessions`, []));
  const [formulas, setFormulas] = useState(() => stor.get(`cstutor_${COURSE.id}_formulas`, []));
  const [flagged, setFlagged] = useState(() => stor.get(`cstutor_${COURSE.id}_flagged`, []));
  const [savedLessons, setSavedLessons] = useState(() => stor.get(`cstutor_${COURSE.id}_savedLessons`, {}));
  const [savedSession, setSavedSession] = useState(() => {
    const s = stor.get(`cstutor_${COURSE.id}_current`, null);
    return (s?.phase && s.phase !== "topic") ? s : null;
  });
  const sessionSavedRef = useRef(false);
  const adminTrackedRef = useRef(false);
  const lessonTrackedRef = useRef(false);

  // Auth
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("cstutor_session") || new URLSearchParams(window.location.search).has("token");
  });

  const loadCloudData = async (u) => {
    try {
      const res = await fetch("/api/sync/get", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionToken: u.sessionToken, courseId: COURSE.id }) });
      if (res.status === 401) { signOut(); return; }
      const { data } = await res.json();
      if (data) {
        setSessions(data.sessions || []);
        setFormulas(data.formulas || []);
        setFlagged(data.flagged || []);
      }
      // If no cloud data yet, current localStorage data will be pushed on next sync
    } catch {}
  };

  const signOut = () => {
    localStorage.removeItem("cstutor_session");
    setUser(null);
  };

  // Verify magic link token from URL or restore stored session
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const magicToken = params.get("token");
    if (magicToken) {
      window.history.replaceState({}, "", window.location.pathname);
      (async () => {
        try {
          const res = await fetch("/api/auth/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: magicToken }) });
          if (!res.ok) { const { error } = await res.json(); throw new Error(error); }
          const { email, sessionToken } = await res.json();
          const u = { email, sessionToken };
          localStorage.setItem("cstutor_session", JSON.stringify(u));
          setUser(u);
          await loadCloudData(u);
        } catch (e) { alert(e.message || "Sign-in link failed — please try again."); }
        setAuthLoading(false);
      })();
      return;
    }
    const stored = localStorage.getItem("cstutor_session");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u?.sessionToken) {
          setUser(u);
          loadCloudData(u).finally(() => setAuthLoading(false));
          return;
        }
      } catch {}
    }
    setAuthLoading(false);
  }, []);

  // Debounced cloud sync whenever persistent data changes
  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => {
      fetch("/api/sync/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionToken: user.sessionToken, courseId: COURSE.id, data: { sessions, formulas, flagged } }) }).catch(() => {});
    }, 2000);
    return () => clearTimeout(t);
  }, [sessions, formulas, flagged, user]);

  // Persist cross-session data
  useEffect(() => stor.set(`cstutor_${COURSE.id}_sessions`, sessions), [sessions]);
  useEffect(() => stor.set(`cstutor_${COURSE.id}_formulas`, formulas), [formulas]);
  useEffect(() => stor.set(`cstutor_${COURSE.id}_flagged`, flagged), [flagged]);
  useEffect(() => stor.set(`cstutor_${COURSE.id}_savedLessons`, savedLessons), [savedLessons]);

  const continueSession = () => {
    const s = savedSession;
    setSavedSession(null);
    setTopic(s.topic || ""); setSections(s.sections || []); setQuestions(s.questions || []);
    setAnswers(s.answers || {}); setResults(s.results || null);
    setFollowUpSections(s.followUpSections || []); setVideos(s.videos || []);
    if (s.phase === "done") sessionSavedRef.current = true;
    setPhase(s.phase);
  };

  // Save session on state changes (all phases except home screen)
  useEffect(() => {
    if (phase === "topic") { stor.set(`cstutor_${COURSE.id}_current`, null); return; }
    stor.set(`cstutor_${COURSE.id}_current`, { topic, sections, questions, answers, results, followUpSections, videos, phase });
  }, [phase, answers]);

  // Save to history as soon as quiz is graded (don't wait for "Complete Session")
  useEffect(() => {
    if ((phase === "grade" || phase === "done") && results && !sessionSavedRef.current) {
      sessionSavedRef.current = true;
      setSessions(prev => [{ id: Date.now(), topic, date: today(), score: results.score, total: results.total, weakAreas: results.weakAreas || [], strongAreas: results.strongAreas || [] }, ...prev]);
    }
  }, [phase]);

  const wrap = async (fn, msg) => {
    setLoading(true); setLoadMsg(msg); setError("");
    try { await fn(); } catch (e) { setError(e.message || "Something went wrong — please try again."); }
    setLoading(false); setLoadMsg("");
  };

  const doRegen = () => {
    setConfirmRegen(false);
    sessionSavedRef.current = false;
    adminTrackedRef.current = false;
    lessonTrackedRef.current = false;
    setAnswers({}); setResults(null); setFollowUpSections([]); setChatHistory([]); setError("");
    doLesson();
  };

  const expandTopic = (t) => COURSE.id === "cosc50" ? t.replace(/\bTSE\b/g, "Tiny Search Engine") : t;

  const doLesson = () => {
    const expanded = expandTopic(topic.trim());
    if (expanded !== topic.trim()) setTopic(expanded);
    setSavedSession(null); return wrap(async () => {
    const sectionPrompt = (specs) => `<task>
Build part of a thorough lesson on "${expanded || topic}" for a Dartmouth CS student in ${COURSE.label}. This is a rigorous course — explanations must be mathematically precise and build genuine understanding.
</task>

<output_format>
Return JSON with exactly this structure — sections array only, no other keys:
{
  "sections": [
    ${specs.map(([id, title, instruction]) => `{
      "id": "${id}",
      "title": "${title}",
      "prose": "${instruction}",
      "keyItems": [
        { "label": "exact formula, expression, or key term", "context": "one sentence explaining what it means or where it comes from", "type": "formula or definition" }
      ]
    }`).join(",\n    ")}
  ]
}
</output_format>

<rules>
- prose: Write real lesson content — never return the instruction text itself
- Length: each section must be substantial — at least 5 full paragraphs, each paragraph at least 80 words; do not truncate
- No bullet points, no sub-headers inside prose — only flowing connected paragraphs
- keyItems: always include 3-4 per section, never empty; type must be "formula" or "definition"
- Use "formula" for: Big-O (O(n log n)), recurrences (T(n) = 2T(n/2) + O(n)), equations (h(k) = k mod m), any symbolic expression, matrix notation
- Use "definition" for conceptual terms with no symbolic form
- Code: any inline code snippet or short code reference in prose must be written in ${CODE_LANG}
</rules>`;

    const DEEP = { thinking: { type: "enabled", budget_tokens: 8000 } };

    const [r1, r2, r3, ytVideos] = await Promise.all([
      askJSON([{ role: "user", content: sectionPrompt([
        ["intro", "Intuition before the math",
         "5+ full paragraphs — zero formulas, zero notation, zero code. Paragraph 1: what problem this concept solves and why anyone cared enough to invent it. Paragraph 2: the core idea in terms a curious non-specialist could follow — use a concrete analogy or spatial description, not abstract language. Paragraph 3: what the concept is actually doing at its heart, before any symbols are introduced. Paragraph 4: how to think about this intuitively — what mental picture or physical model to hold. Paragraph 5+: what understanding this unlocks — what questions become easy, what you can see that was opaque before. Do NOT introduce any symbols, formulas, or equations anywhere in this section."],
        ["mechanics", "The mechanics, derived",
         "5+ full paragraphs. Build the math or algorithm entirely from scratch by deriving it — never just state formulas. Paragraph 1: start from the intuition and identify what needs to be made precise. Paragraphs 2-4: introduce each symbol or operation as you first need it — name it, say exactly where it comes from, explain what it measures or does — then show the reasoning that forces each formula or algorithmic choice to be what it is. Paragraph 5+: synthesize the full picture — what the complete formula or algorithm looks like and why every piece is necessary. A student who reads this section should be able to reconstruct the approach on their own without looking anything up."],
      ]) }], "", 16000, MODEL_OPUS, DEEP),
      askJSON([{ role: "user", content: sectionPrompt([
        ["example", "A fully traced example",
         "5+ full paragraphs. Choose a concrete case with real numbers or explicit symbols — not a toy, but a case rich enough to show the full behavior. Paragraph 1: set up the problem and state what you are going to compute and why. Paragraphs 2-4: work through the ENTIRE process step by step — at every step say WHAT you are doing AND WHY, not just the algebra; show intermediate values and what they mean. Paragraph 5+: reflect on what the example reveals — what would change with different inputs, what edge cases exist, what the result tells you about the concept. A student should finish this section able to apply the procedure to a new input without any further help."],
        ["diagram", "A visual diagram",
         "Open with a Mermaid diagram in a code block (three backticks followed immediately by 'mermaid'). Choose the right type: use 'flowchart LR' or 'flowchart TD' for pipelines, data flow, or algorithm steps; use 'graph TD' for trees or graphs (edge labels with |label| syntax); use 'classDiagram' for OOP class hierarchies; use 'stateDiagram-v2' for state machines. Rules: wrap multi-word labels in double quotes; keep to 8-14 nodes total; avoid parentheses, angle brackets, or equals signs inside node labels — use words instead. Topic guide: graphics → pipeline stages as a labeled flowchart LR with each stage as a node and transformation labels on edges; algorithm → concrete traced example on real data using graph TD for a tree or flowchart TD for algorithm steps with state shown at each node; systems → memory layout or process flow as flowchart TD with labeled regions; OOP → class hierarchy as classDiagram with method names shown. After the closing fence, write 3+ paragraphs: one explaining every node and edge in the diagram; one describing the structural relationship it makes visible that prose cannot; one showing how the diagram shifts for a different input or case."],
      ]) }], "", 16000, MODEL_OPUS, DEEP),
      askJSON([{ role: "user", content: sectionPrompt([
        ["proof", "Why it works: the proof sketch",
         "5+ full paragraphs giving the rigorous correctness argument or first-principles derivation. For algorithms: paragraph 1 states the claim precisely; paragraphs 2-4 prove the key loop invariant (state exactly what is maintained, at what point in the loop, and why it holds initially and is preserved by each iteration), or give the exchange argument (show why any deviation from the greedy choice can only make things worse), or sketch the induction (base case, inductive step, what the inductive hypothesis is); paragraph 5+ shows how the invariant/argument implies the correctness of the final result. For graphics or math topics: derive the formula from first principles — from an optical law, a geometric theorem, or a coordinate transformation rule — so the student sees WHY it must be exactly that formula and not any other. For systems: explain the invariant that guarantees the abstraction works (memory safety, ordering, bounds checking). For OOP: explain why the interface contract holds under all valid use. A student who reads this section should be able to sketch a correct proof or derivation on their own during an exam."],
        ["clarification", "Where students need more clarification",
         "5+ full paragraphs that re-teach the 2-3 concepts in this topic where students most consistently need a second, different explanation. For each concept: open with one sentence identifying which aspect needs re-teaching and why the first explanation often does not fully land. Then provide 3+ paragraphs of fresh instruction from a completely different angle than the mechanics section — a new analogy, a different entry point, a more careful unpacking of the step that breaks down, or a side-by-side comparison of the right and wrong mental models. Make each re-explanation self-contained: a student who skipped the mechanics section should still follow it. End the entire section with a single paragraph giving the one insight that, once understood, makes all the clarifications above feel obvious in retrospect."],
      ]) }], "", 16000, MODEL_OPUS, DEEP),
      fetchYouTubeVideos(expanded).catch(() => []),
    ]);

    const s1 = parseJSON(r1).sections || [];
    const s2 = parseJSON(r2).sections || [];
    const s3 = parseJSON(r3).sections || [];
    const allSecs = [...s1, ...s2, ...s3];
    setSections(allSecs);
    setVideos(ytVideos);
    // Collect key items into formula sheet
    const newItems = allSecs.flatMap(s => (s.keyItems || []).map(ki => ({ topic: expanded, label: ki.label, context: ki.context, type: ki.type })));
    if (newItems.length) {
      setFormulas(prev => {
        const seen = new Set(prev.map(f => f.topic + "||" + f.label));
        return [...prev, ...newItems.filter(ki => !seen.has(ki.topic + "||" + ki.label))];
      });
    }
    setPhase("learn");
    // Save lesson content for My Courses (keep last 30)
    setSavedLessons(prev => {
      const next = { ...prev, [expanded]: { sections: allSecs, savedAt: Date.now() } };
      const keys = Object.keys(next).sort((a, b) => next[b].savedAt - next[a].savedAt);
      keys.slice(30).forEach(k => delete next[k]);
      return next;
    });
    // Track lesson start (fire-and-forget, once per session)
    if (user && !lessonTrackedRef.current) {
      lessonTrackedRef.current = true;
      fetch("/api/admin/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: user.sessionToken, courseId: COURSE.id, topic: expanded }),
      }).catch(() => {});
    }
  }, "Building your lesson… (takes 45–75 seconds)"); };

  const doQuiz = () => wrap(async () => {
    const summary = sections.map(s => s.title + ": " + (s.prose || "").slice(0, 300)).join("\n\n");
    const synthesisDesc = COURSE.id === "cosc50" ? "connect to systems programming or C in practice"
      : COURSE.id === "cosc10" ? "connect to Java, OOP, or software design"
      : COURSE.id === "cosc31" ? "connect to algorithm complexity, correctness proofs, or compare with an alternative algorithm"
      : COURSE.id === "cosc77" ? "connect two or more graphics pipeline stages, or explain a tradeoff between rasterization and ray tracing"
      : "connect to broader CS";
    const raw = await askJSON([{
      role: "user",
      content: `Based on this lesson about "${topic}":\n\n${summary}\n\nGenerate 5 quiz questions. 2 conceptual (intuition/definition, no calculation), 2 computational (show your work), 1 synthesis (${synthesisDesc}). Make them specific to the lesson. Any question involving code must use ${CODE_LANG}. Return JSON array:\n[{"id":1,"question":"...","difficulty":"easy|medium|hard","type":"conceptual|computational|synthesis"}]`,
    }]);
    setQuestions(parseJSON(raw)); setAnswers({}); setPhase("quiz");
  }, "Generating quiz…");

  const doGrade = () => wrap(async () => {
    const qa = questions.map((q, i) => `Q${i + 1} [${q.difficulty}/${q.type}]: ${q.question}\nAnswer: ${answers[i] || "[blank]"}`).join("\n\n");
    const raw = await askJSON([{
      role: "user",
      content: `Grade these answers on "${topic}":\n\n${qa}\n\n1 = correct, 0.5 = understands but incomplete, 0 = wrong or blank. Return JSON:\n{"score":N,"total":5,"results":[{"id":1,"score":0|0.5|1,"feedback":"3 specific sentences: what was right, what was wrong or missing, and what the student should understand or do differently"}],"weakAreas":["concept name"],"strongAreas":["concept name"]}`,
    }]);
    const parsed = parseJSON(raw);
    setResults(parsed);
    // Track analytics (fire-and-forget, first grade only)
    if (user && !adminTrackedRef.current) {
      adminTrackedRef.current = true;
      fetch("/api/admin/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken: user.sessionToken,
          courseId: COURSE.id,
          topic,
          pct: Math.round((parsed.score / parsed.total) * 100),
          weakAreas: parsed.weakAreas || [],
          strongAreas: parsed.strongAreas || [],
        }),
      }).catch(() => {});
    }
    // Flag wrong/partial questions for spaced repetition
    const newFlagged = (parsed.results || [])
      .map((r, i) => ({ r, q: questions[i] }))
      .filter(({ r }) => r.score < 1)
      .map(({ r, q }) => {
        const d = new Date();
        d.setDate(d.getDate() + (r.score === 0.5 ? 3 : 1));
        return { topic, question: q.question, type: q.type, difficulty: q.difficulty, feedback: r.feedback, dueDate: d.toISOString().split("T")[0] };
      });
    if (newFlagged.length) {
      setFlagged(prev => [...prev.filter(f => !newFlagged.some(nf => nf.topic === f.topic && nf.question === f.question)), ...newFlagged]);
    }
    setPhase("grade");
  }, "Grading your answers… (takes 20–30 seconds)");

  const doFollowUp = () => wrap(async () => {
    if (!results?.weakAreas?.length) { setPhase("done"); return; }
    // Build per-area context: what did the student actually answer wrong?
    const wrongQA = (results.results || [])
      .map((r, i) => ({ r, q: questions[i], a: answers[i] }))
      .filter(({ r }) => r.score < 1)
      .map(({ r, q, a }) => `Q: ${q?.question}\nStudent answered: ${a || "[blank]"}\nFeedback: ${r.feedback}`)
      .join("\n\n");

    const sections = await Promise.all(results.weakAreas.map(async (area) => {
      try {
        const r = await askJSON([{
          role: "user",
          content: `The student struggled with "${area}" from the topic "${topic}".

${wrongQA ? `Here is what they got wrong:\n${wrongQA}\n\n` : ""}Return JSON for a single re-instruction section:
{
  "sections": [
    {
      "id": "${area.toLowerCase().replace(/\s+/g, "_")}",
      "title": "Revisiting: ${area}",
      "prose": "Write 3 full paragraphs (no bullets): (1) Why this is confusing and what the correct mental model is — address the specific mistake above directly. (2) A fresh explanation from a different angle than a typical textbook. (3) A step-by-step example showing correct application — include a ${CODE_LANG} code example if it aids understanding.",
      "keyItems": [
        { "label": "specific formula or term they likely misunderstood", "context": "what the confusion usually is" }
      ]
    }
  ]
}`
        }]);
        return parseJSON(r).sections || [];
      } catch { return []; }
    }));
    const allSections = sections.flat();
    setFollowUpSections(allSections);
    setPhase("followup");
  }, "Preparing targeted review…");

  const reset = () => {
    sessionSavedRef.current = false;
    adminTrackedRef.current = false;
    lessonTrackedRef.current = false;
    setSavedSession(null);
    stor.set(`cstutor_${COURSE.id}_current`, null);
    setView("session"); setPhase("topic"); setTopic(""); setSections([]); setQuestions([]);
    setAnswers({}); setResults(null); setFollowUpSections([]); setVideos([]); setChatHistory([]); setError("");
    setConfirmRegen(false);
  };

  const pct = results ? Math.round((results.score / results.total) * 100) : 0;
  const followUpText = followUpSections.map(s => s.prose || "").join(" ");
  const chatProps = { topic, sections, questions, answers, results, followUpText, phase, history: chatHistory, setHistory: setChatHistory, user };
  const dueCount = flagged.filter(f => f.dueDate <= today()).length;

  const navBar = (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--pine)", display: "flex", alignItems: "center", gap: "12px", padding: "0 2.5rem", height: "64px", boxShadow: "0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.25)" }}>
      <div style={{ width: "58px", height: "58px", borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="https://communications.dartmouth.edu/sites/communications/files/2024-07/lone-pine-rev.png" alt="Dartmouth" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
      </div>
      <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 600, color: "#fff" }}>{COURSE_TITLE}</span>
      <span style={{ fontSize: "0.7rem", color: "var(--mint)", letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.8 }}>{COURSE_LABEL}</span>
    </nav>
  );

  if (authLoading) return (
    <>
      {navBar}
      <div style={{ textAlign: "center", padding: "6rem 1rem", position: "relative", zIndex: 1 }}><LoadDots /></div>
    </>
  );

  if (!user) return <SignInView />;

  return (
    <>
      {/* Decorative background blobs */}
      <div style={{ position: "fixed", top: "-120px", right: "-120px", width: "480px", height: "480px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,213,181,0.15) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-80px", left: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,168,75,0.09) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <TopNav view={view} setView={setView} onHome={reset} sessionCount={sessions.length} formulaCount={formulas.length} dueCount={dueCount} user={user} onSignOut={signOut} savedLessons={savedLessons} onCourseSelect={t => {
          const saved = savedLessons[t];
          if (!saved) return;
          setTopic(t); setSections(saved.sections); setQuestions([]); setAnswers({}); setResults(null);
          setFollowUpSections([]); setChatHistory([]); setPhase("learn"); setView("session");
          setSavedSession(null); sessionSavedRef.current = false; adminTrackedRef.current = false; lessonTrackedRef.current = true;
        }} />
        {view === "session" && <PhaseBar phase={phase} />}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 2.5rem 3rem", color: "var(--text-dark)" }}>
      {view === "history" && <HistoryView sessions={sessions} />}
      {view === "formulas" && <FormulasView formulas={formulas} setFormulas={setFormulas} />}
      {view === "review" && <ReviewView flagged={flagged} setFlagged={setFlagged} onDone={() => setView("session")} />}
      {view === "help" && <HelpView />}
      {view === "admin" && <AdminView user={user} />}

      {view === "session" && error && (
        <div style={{ background: "var(--color-background-danger)", border: "0.5px solid var(--color-border-danger)", borderRadius: "var(--border-radius-md)", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "var(--color-text-danger)" }}>{error}</div>
      )}

      {view === "session" && loading && (
        <div style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}><LoadDots /></div>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", margin: 0 }}>{loadMsg}</p>
        </div>
      )}

      {/* TOPIC */}
      {view === "session" && !loading && phase === "topic" && (
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem", animation: "fadeUp 0.5s ease both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(26,58,42,0.07)", border: "1px solid rgba(26,58,42,0.12)", borderRadius: "100px", padding: "5px 16px", fontSize: "0.72rem", fontWeight: 600, color: "var(--pine-mid)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "20px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--gold)", display: "inline-block" }} />
              AI-Powered Learning
            </div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 600, color: "var(--text-dark)", lineHeight: 1.2, letterSpacing: "-0.02em", margin: "0 0 14px" }}>
              What would you like to study today?
            </h1>
            <p style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 400, lineHeight: 1.6, margin: 0 }}>
              Pick a topic, work through a guided lesson, then test your understanding.
            </p>
          </div>

          {/* Continue session */}
          {savedSession && (
            <div style={{ background: "#fff", border: "1.5px solid var(--pine)", borderRadius: "14px", padding: "1.25rem 1.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "14px", animation: "fadeUp 0.5s 0.05s ease both", boxShadow: "0 4px 16px rgba(26,58,42,0.1)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--pine-mid)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>
                  {{ learn: "Lesson in progress", quiz: "Quiz in progress", grade: "Quiz graded", followup: "Review in progress", done: "Session complete" }[savedSession.phase] || "Session saved"}
                </div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-dark)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{savedSession.topic}</div>
              </div>
              <button onClick={continueSession} style={{ padding: "9px 20px", background: "var(--pine)", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", flexShrink: 0, boxShadow: "0 2px 8px rgba(26,58,42,0.2)" }}>Continue →</button>
            </div>
          )}

          {/* Search card */}
          <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "20px", padding: "28px 32px 24px", boxShadow: "0 8px 32px rgba(26,58,42,0.08), 0 2px 8px rgba(26,58,42,0.04)", marginBottom: "3rem", animation: "fadeUp 0.6s 0.1s ease both" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "12px" }}>
              {savedSession ? "Or start a new topic" : "Enter a topic"}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <input type="text" value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && topic.trim() && doLesson()}
                placeholder={COURSE.id === "cosc77" ? "e.g. Gradient Descent, SVD, Eigenvalues…" : "e.g. Recursion, Binary Trees, Sorting…"}
                autoFocus={!savedSession}
                style={{ flex: 1, fontFamily: "var(--font-sans)", fontSize: "1.05rem", color: "var(--text-dark)", background: "var(--cream)", border: "1.5px solid var(--border)", borderRadius: "12px", padding: "14px 18px", outline: "none", transition: "border-color 0.2s, background 0.2s" }} />
              <button onClick={doLesson} disabled={!topic.trim()}
                style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem", fontWeight: 600, color: "#fff", background: topic.trim() ? "var(--pine)" : "var(--border)", border: "none", borderRadius: "12px", padding: "14px 26px", cursor: topic.trim() ? "pointer" : "default", whiteSpace: "nowrap", boxShadow: topic.trim() ? "0 2px 12px rgba(26,58,42,0.25)" : "none", transition: "background 0.18s, box-shadow 0.18s" }}>
                Start Lesson →
              </button>
            </div>
          </div>

          {/* Suggested topics */}
          <div style={{ animation: "fadeUp 0.6s 0.15s ease both" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>Suggested topics (click to use)</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {SUGGESTED.map((s, i) => (
                <button key={s} onClick={() => setTopic(s)}
                  style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-mid)", background: "#fff", border: "1.5px solid var(--border)", borderRadius: "100px", padding: "9px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", animation: `chipIn 0.4s ${0.2 + i * 0.05}s ease both`, whiteSpace: "nowrap" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--mint)", flexShrink: 0 }} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LESSON */}
      {view === "session" && !loading && phase === "learn" && (
        <div>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.75rem 2rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.75rem", paddingBottom: "1.25rem", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
              <span style={{ padding: "3px 10px", background: "rgba(26,58,42,0.09)", borderRadius: "var(--border-radius-md)", fontSize: "11px", fontWeight: 700, color: "var(--pine)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Lesson</span>
              <span style={{ fontSize: "16px", fontWeight: 600, flex: 1 }}>{topic}</span>
              {!confirmRegen
                ? <button onClick={() => setConfirmRegen(true)} style={{ padding: "4px 11px", fontSize: "11px", fontWeight: 600, background: "none", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", color: "var(--color-text-tertiary)", cursor: "pointer", flexShrink: 0 }}>↺ Regen</button>
                : <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "4px 8px", background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", fontSize: "12px", color: "var(--color-text-secondary)" }}>
                    <span>Regenerate for <strong>{topic}</strong>? History &amp; formulas kept.</span>
                    <button onClick={doRegen} style={{ padding: "2px 9px", fontSize: "12px", fontWeight: 600, background: "var(--pine)", color: "white", border: "none", borderRadius: "var(--border-radius-md)", cursor: "pointer" }}>Yes</button>
                    <button onClick={() => setConfirmRegen(false)} style={{ padding: "2px 6px", fontSize: "12px", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)" }}>Cancel</button>
                  </div>
              }
            </div>
            {sections.map((sec, i) => (
              <div key={sec.id || i}>
                {i > 0 && <div style={{ height: "1px", background: "var(--color-border-tertiary)", margin: "2rem 0" }} />}
                <LessonSection section={sec} topic={topic} />
              </div>
            ))}
          </div>
          {videos.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--color-text-tertiary)", textTransform: "uppercase", margin: "0 0 0.6rem" }}>Recommended Videos</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {videos.map(v => <VideoCard key={v.id} video={v} />)}
              </div>
            </div>
          )}
          <ChatPanel {...chatProps} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.25rem" }}>
            <Btn label="← Change Topic" onClick={() => { setConfirmRegen(false); setPhase("topic"); }} primary={false} />
            <Btn label="Ready — Take Quiz →" onClick={doQuiz} />
          </div>
        </div>
      )}

      {/* QUIZ */}
      {view === "session" && !loading && phase === "quiz" && (
        <div>
          <div style={{ padding: "0.7rem 1rem", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "1.25rem" }}>
            5 questions — conceptual, computational, and synthesis. Show your work where relevant.
          </div>
          {questions.map((q, i) => (
            <div key={q.id} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-text-tertiary)", paddingTop: "2px", minWidth: "24px" }}>Q{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                    {[
                      [q.difficulty, { hard: ["#fcebeb", "#a32d2d"], medium: ["#faeeda", "#ba7517"], easy: ["#eaf3de", "#3b6d11"] }[q.difficulty] || ["var(--color-background-secondary)", "var(--color-text-secondary)"]],
                      [q.type, ["var(--color-background-secondary)", "var(--color-text-secondary)"]],
                    ].map(([v, m]) => <span key={v} style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: m[0], color: m[1], fontWeight: 600 }}>{v}</span>)}
                  </div>
                  <p style={{ margin: 0, lineHeight: "1.75", fontSize: "14px", fontWeight: 500 }}>{q.question}</p>
                </div>
              </div>
              <textarea value={answers[i] || ""} onChange={e => setAnswers(p => ({ ...p, [i]: e.target.value }))}
                placeholder="Your answer — show your work…" rows={3}
                style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", fontSize: "14px", lineHeight: "1.65", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", resize: "vertical", fontFamily: "var(--font-sans,system-ui)", outline: "none" }} />
            </div>
          ))}
          <ChatPanel {...chatProps} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
            <Btn label="← Back to Lesson" onClick={() => setPhase("learn")} primary={false} />
            <Btn label="Submit Answers →" onClick={doGrade} />
          </div>
        </div>
      )}

      {/* RESULTS */}
      {view === "session" && !loading && phase === "grade" && results && (
        <div>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.5rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", paddingBottom: "1.25rem", borderBottom: "0.5px solid var(--color-border-tertiary)", marginBottom: "1.25rem" }}>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: "46px", fontWeight: 800, color: scoreColor(pct), lineHeight: 1, letterSpacing: "-0.03em" }}>{pct}%</div>
                <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "4px" }}>{results.score} / {results.total}</div>
              </div>
              <div style={{ flex: 1, fontSize: "13px", lineHeight: "1.85" }}>
                {results.strongAreas?.length > 0 && <div><span style={{ color: "var(--pine)", fontWeight: 600 }}>Strong: </span><span style={{ color: "var(--color-text-secondary)" }}>{results.strongAreas.join(", ")}</span></div>}
                {results.weakAreas?.length > 0 && <div><span style={{ color: "#a32d2d", fontWeight: 600 }}>Needs work: </span><span style={{ color: "var(--color-text-secondary)" }}>{results.weakAreas.join(", ")}</span></div>}
              </div>
            </div>
            {results.results?.map((r, i) => (
              <div key={i} style={{ padding: "0.85rem 0", borderBottom: i < results.results.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: r.score === 1 ? "rgba(26,58,42,0.09)" : r.score === 0.5 ? "#faeeda" : "#fcebeb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: r.score === 1 ? "var(--pine)" : r.score === 0.5 ? "#ba7517" : "#a32d2d" }}>{r.score === 1 ? "✓" : r.score === 0.5 ? "½" : "✗"}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "4px", lineHeight: "1.55" }}>Q{i + 1}: {questions[i]?.question}</div>
                    <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>{r.feedback}</div>
                  </div>
                </div>
                <QuestionExplain question={questions[i]} userAnswer={answers[i]} score={r.score} topic={topic} />
              </div>
            ))}
          </div>
          <ChatPanel {...chatProps} />
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "1.25rem" }}>
            <Btn label="Retake Quiz" onClick={doQuiz} primary={false} />
            {results.weakAreas?.length > 0 ? <Btn label="Review Weak Areas →" onClick={doFollowUp} /> : <Btn label="Complete Session →" onClick={() => setPhase("done")} />}
          </div>
        </div>
      )}

      {/* FOLLOW-UP */}
      {view === "session" && !loading && phase === "followup" && (
        <div>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.75rem 2rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.75rem", paddingBottom: "1.25rem", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
              <span style={{ padding: "3px 10px", background: "#faeeda", borderRadius: "var(--border-radius-md)", fontSize: "11px", fontWeight: 700, color: "#ba7517", letterSpacing: "0.05em", textTransform: "uppercase" }}>Targeted Review</span>
              <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{results?.weakAreas?.join(" · ")}</span>
            </div>
            {followUpSections.map((sec, i) => (
              <div key={sec.id || i}>
                {i > 0 && <div style={{ height: "1px", background: "var(--color-border-tertiary)", margin: "2rem 0" }} />}
                <LessonSection section={sec} topic={topic} />
              </div>
            ))}
          </div>
          <ChatPanel {...chatProps} />
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "1.25rem" }}>
            <Btn label="Retake Quiz" onClick={doQuiz} primary={false} />
            <Btn label="Complete Session →" onClick={() => setPhase("done")} />
          </div>
        </div>
      )}

      {/* DONE */}
      {view === "session" && !loading && phase === "done" && (
        <div>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "2.5rem 2rem", textAlign: "center" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(26,58,42,0.09)", border: "2px solid var(--pine)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: "22px", color: "var(--pine)", fontWeight: 700 }}>✓</div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 0.4rem" }}>Session Complete</h2>
            <p style={{ fontSize: "15px", color: "var(--color-text-secondary)", margin: "0 0 0.5rem" }}>{topic}</p>
            {results && (
              <div style={{ display: "inline-block", margin: "0.75rem 0 1.75rem", padding: "0.5rem 1.75rem", background: scoreBg(pct), borderRadius: "var(--border-radius-md)" }}>
                <span style={{ fontSize: "28px", fontWeight: 800, color: scoreColor(pct), letterSpacing: "-0.02em" }}>{pct}%</span>
              </div>
            )}
            <div><Btn label="Study Another Topic →" onClick={reset} /></div>
          </div>
          <ChatPanel {...chatProps} />
        </div>
      )}
        </div>
      </div>
    </>
  );
}
