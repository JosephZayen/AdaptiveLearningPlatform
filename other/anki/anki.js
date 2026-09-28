// static/js/anki/anki.js  ──────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  /* ────────── 全局状态 ────────── */
  const state = { deckId: null };

  /* ────────── 工具 ────────── */
  const $ = sel => document.querySelector(sel);

  /* ────────── Deck 列表 & 进度 ────────── */
  function loadDecks() {
    fetch("anki/decks")
      .then(r => r.json())
      .then(ds => {
        const sel = $("#deck-select");
        sel.innerHTML = ds.map(d =>
          `<option value="${d.id}">${d.name}</option>`).join("");
        if (ds.length) {
          state.deckId = ds[0].id;
          loadProgress();
        }
      });
  }
  $("#deck-select").onchange = e => {
    state.deckId = e.target.value;
    loadProgress();
    $("#card-box").innerHTML = "";
  };

  $("#btn-new-deck").onclick = () => {
    const name = prompt("deck name:");
    if (!name) return;
    fetch("anki/deck/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    }).then(loadDecks);
  };

  function loadProgress() {
    fetch(`anki/progress?deck_id=${state.deckId}`)
      .then(r => r.json())
      .then(p => {
        $("#prog-bar").value = p.pct;
        $("#prog-text").innerText = `完成度：${p.pct}%`;
      });
  }

  /* ────────── 复习流程 ────────── */
  function loadNext() {
    fetch(`anki/next?deck_id=${state.deckId}`)
      .then(r => r.json())
      .then(data => {
        const box = $("#card-box");
        if (data.done) {
          box.innerHTML = "<h4>🎉 本牌组已全部完成</h4>";
          loadProgress();
          return;
        }
        box.innerHTML = `
      <div id="front" class="card p-3 mb-2 bg-light">${data.front}</div>
      <button id="show-answer" class="btn btn-info btn-sm my-2">显示答案</button>
      <div id="back" style="display:none" class="card p-3 mb-2">${data.back}</div>
      <div id="grade-btns" style="display:none">
        ${[0,1,2,3,4,5].map(g =>
          `<button class="btn btn-sm btn-light m-1" data-g=${g}>${g}</button>`).join("")}</div>`;
        $("#show-answer").onclick = () => {
          $("#back").style.display = "block";
          $("#grade-btns").style.display = "block";
        };
        document.querySelectorAll("#grade-btns button").forEach(b => {
          b.onclick = () => {
            fetch("anki/review", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cid: data.id, grade: b.dataset.g })
            }).then(() => { loadNext(); loadProgress(); });
          };
        });
      });
  }
  $("#btn-next").onclick = loadNext;

  /* ────────── undo ────────── */
  $("#btn-undo").onclick = () =>
    fetch("anki/undo", { method: "POST" })
      .then(r => { if (r.ok) { loadProgress(); loadNext(); } });

  /* ────────── ADD ────────── */
  $("#submit-nc").onclick = () => {
    const front = $("#nc-front").value.trim();
    const back  = $("#nc-back").value.trim();
    if (!front || !back) return;
    fetch("anki/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deck_id: state.deckId, front, back })
    }).then(() => { $("#nc-front").value = $("#nc-back").value = ""; loadProgress(); });
  };

  /* ────────── SEARCH ────────── */
  $("#btn-search").onclick = () => {
    const q = $("#search-q").value.trim();
    if (!q) return;
    fetch(`anki/search?deck_id=${state.deckId}&q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(res => {
        $("#search-result").innerHTML =
          res.map(c => `<li class="list-group-item"><b>${c.front}</b><br>${c.back}</li>`).join("");
      });
  };

  /* ────────── Tabs ────────── */
  function switchTab(active) {
    $("#tab-add"   ).classList.toggle("active", active === "add");
    $("#tab-search").classList.toggle("active", active === "search");
    $("#panel-add"   ).style.display = active === "add"    ? "block" : "none";
    $("#panel-search").style.display = active === "search" ? "block" : "none";
  }
  $("#tab-add").onclick    = () => switchTab("add");
  $("#tab-search").onclick = () => switchTab("search");

  /* ────────── init ────────── */
  loadDecks();
});