import { render } from "solid-js/web";
import { createSignal, createResource, createMemo, Show, For } from "solid-js";
import "./style.css";

const PAGE = 50;

// Image bytes stay out of /db/* responses; thumbnails reuse the API's public image routes.
// The *_content_type column is set together with the bytes, so it tells whether one exists.
const enc = encodeURIComponent;
const IMAGES = {
  User: (r) => r.avatar_content_type && `/avatars/${enc(r.username)}`,
  Community: (r) => r.cover_content_type && `/communities/${enc(r.id)}/cover?v=${new Date(r.cover_updated_at).getTime()}`,
  BookCover: (r) => `/covers?title=${enc(r.book_title)}`,
};

function Thumb(props) {
  const src = () => IMAGES[props.model]?.(props.row);
  return (
    <Show when={src()} fallback={<span class={`thumb empty ${props.class || ""}`} />}>
      <a href={src()} target="_blank" onClick={(e) => e.stopPropagation()}>
        <img class={`thumb ${props.class || ""}`} src={src()} loading="lazy" alt="" />
      </a>
    </Show>
  );
}
const [token, setToken] = createSignal(localStorage.getItem("dbToken") || "");
// Bumped by global actions (e.g. resetting post balances) so the open table refetches.
const [dataVersion, setDataVersion] = createSignal(0);

async function resetPostQuotas() {
  if (!confirm("Resetar o saldo diário de posts de todos os usuários? Posts já publicados deixam de contar no limite de hoje.")) return;
  try {
    const { users } = await api("POST", "/admin/reset-post-quotas");
    setDataVersion(dataVersion() + 1);
    alert(`Saldo de posts resetado para ${users} usuário${users === 1 ? "" : "s"}.`);
  } catch (err) {
    alert(err.message);
  }
}

// Free-plan limits switch (posts per day, communities, topics per community). Premium users never hit them.
function QuotasToggle() {
  const [settings, { mutate }] = createResource(() => api("GET", "/admin/settings"));
  const on = () => (settings.error ? undefined : settings()?.quotas_enabled);
  async function toggle() {
    const next = !on();
    if (!confirm(next
      ? "Ativar os limites de uso? Usuários que não são apoiadores voltam a ter limite de posts e comunidades."
      : "Desativar os limites de uso? Todos os usuários poderão postar e criar comunidades sem limite.")) return;
    try {
      mutate(await api("PUT", "/admin/settings", { quotas_enabled: next }));
    } catch (err) {
      alert(err.message);
    }
  }
  return (
    <button class="ghost" disabled={on() === undefined} onClick={toggle} title={settings.error?.message}>
      {settings.error ? "Limites: indisponível (servidor desatualizado?)"
        : on() === undefined ? "Limites: …"
        : on() ? "● Limites de posts: ativos" : "○ Limites de posts: desativados"}
    </button>
  );
}

async function api(method, path, body) {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
    body: body && JSON.stringify(body),
  });
  if (res.status === 401 || res.status === 403) logout();
  if (res.status === 204) return null;
  const json = await res.json().catch(() => ({})); // 404s from a stale server come back as HTML
  if (!res.ok) throw new Error(json.error || `${res.status} ${res.statusText} — ${path}`);
  return json;
}

function logout() {
  localStorage.removeItem("dbToken");
  setToken("");
}

// ---- value <-> form conversion, by Prisma field type ----

const isLong = (f) => /text|body|bio|description/.test(f.name);

function toInput(f, v) {
  if (v == null) return f.type === "Boolean" ? false : "";
  if (f.isList) return v.join(", ");
  if (f.type === "DateTime") {
    const d = new Date(v);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  return v;
}

// Returns undefined to leave the column out of the payload (DB default / unchanged).
function fromInput(f, v, creating) {
  if (f.type === "Boolean") return !!v;
  if (f.isList) return String(v).split(",").map((s) => s.trim()).filter(Boolean);
  if (v === "") {
    if (f.type === "String" && f.isRequired && !creating) return "";
    if (creating || f.isRequired) return undefined;
    return null;
  }
  if (f.type === "Int") return Number(v);
  if (f.type === "DateTime") return new Date(v).toISOString();
  return v;
}

function display(f, v) {
  if (v == null) return <span class="muted">—</span>;
  if (f.type === "Boolean") return v ? "✓" : <span class="muted">✗</span>;
  if (f.type === "DateTime") return new Date(v).toLocaleString("pt-BR");
  if (f.isList) return v.map((t) => <span class="tag">{t}</span>);
  return String(v);
}

// ---- screens ----

function Login() {
  const [error, setError] = createSignal("");
  async function submit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    setError("");
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      if (json.role !== "admin") throw new Error("Apenas administradores");
      localStorage.setItem("dbToken", json.token);
      setToken(json.token);
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <form class="login card" onSubmit={submit}>
      <h1>Inkwell <span class="muted">DB</span></h1>
      <label>Email<input name="email" type="email" required autofocus /></label>
      <label>Senha<input name="password" type="password" required /></label>
      <Show when={error()}><p class="error">{error()}</p></Show>
      <button class="primary">Entrar</button>
    </form>
  );
}

function RowForm(props) {
  const creating = !props.row;
  // Plain object on purpose: inputs are uncontrolled, so typing doesn't re-render the form.
  const values = Object.fromEntries(props.model.fields.map((f) => [f.name, toInput(f, props.row?.[f.name])]));
  const [error, setError] = createSignal("");
  const [busy, setBusy] = createSignal(false);
  const fields = props.model.fields.filter((f) => !f.isUpdatedAt || !creating);
  const locked = (f) => f.isUpdatedAt || (!creating && props.model.key.includes(f.name));
  const set = (name, v) => { values[name] = v; };

  async function submit(e) {
    e.preventDefault();
    const data = {};
    for (const f of fields) {
      if (locked(f)) continue;
      const v = fromInput(f, values[f.name], creating);
      if (v !== undefined) data[f.name] = v;
    }
    setBusy(true);
    setError("");
    try {
      if (creating) await api("POST", `/db/${props.model.name}`, data);
      else await api("PUT", `/db/${props.model.name}`, { key: props.keyOf(props.row), data });
      props.onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function input(f) {
    const common = { value: values[f.name], disabled: locked(f), onInput: (e) => set(f.name, e.target.value) };
    const enumValues = props.enums[f.type];
    if (enumValues) {
      return (
        <select {...common} onChange={common.onInput}>
          <Show when={!f.isRequired || f.hasDefaultValue}><option value="">—</option></Show>
          <For each={enumValues}>{(v) => <option value={v}>{v}</option>}</For>
        </select>
      );
    }
    if (f.type === "Boolean") {
      return <input type="checkbox" checked={values[f.name]} disabled={common.disabled} onChange={(e) => set(f.name, e.target.checked)} />;
    }
    if (f.type === "Int") return <input type="number" {...common} />;
    if (f.type === "DateTime") return <input type="datetime-local" {...common} />;
    if (isLong(f) && !f.isList) return <textarea rows="4" {...common} />;
    const password = props.model.name === "User" && f.name === "password";
    return (
      <input
        type={password ? "password" : "text"}
        placeholder={password && !creating ? "deixe vazio para manter" : f.isList ? "separado por vírgula" : ""}
        {...common}
      />
    );
  }

  return (
    <div class="overlay" onClick={(e) => e.target === e.currentTarget && props.onClose()}>
      <form class="card modal" onSubmit={submit}>
        <header>
          <h2>{creating ? "Novo" : "Editar"} <span class="muted">{props.model.name}</span></h2>
          <button type="button" class="ghost" onClick={props.onClose}>✕</button>
        </header>
        <div class="fields">
          <Show when={!creating && IMAGES[props.model.name]}>
            <Thumb model={props.model.name} row={props.row} class="large" />
          </Show>
          <For each={fields}>
            {(f) => (
              <label class={f.type === "Boolean" ? "check" : ""}>
                <span>
                  {f.name}
                  <Show when={f.isRequired && !f.hasDefaultValue && !f.isUpdatedAt}><b class="req">*</b></Show>
                  <small>{f.type}{f.isList ? "[]" : ""}</small>
                </span>
                {input(f)}
              </label>
            )}
          </For>
        </div>
        <Show when={error()}><p class="error">{error()}</p></Show>
        <footer>
          <button type="button" class="ghost" onClick={props.onClose}>Cancelar</button>
          <button class="primary" disabled={busy()}>{busy() ? "Salvando…" : "Salvar"}</button>
        </footer>
      </form>
    </div>
  );
}

function Table(props) {
  const [q, setQ] = createSignal("");
  const [skip, setSkip] = createSignal(0);
  const [editing, setEditing] = createSignal(null); // null = closed, {} = new, {row} = edit
  const [data, { refetch }] = createResource(
    () => [props.model.name, q(), skip(), dataVersion()],
    ([name, q, skip]) => api("GET", `/db/${name}?q=${encodeURIComponent(q)}&skip=${skip}&take=${PAGE}`),
  );
  const keyOf = (row) => Object.fromEntries(props.model.key.map((k) => [k, row[k]]));
  const page = () => (data.error ? undefined : data.latest);
  const total = () => page()?.total ?? 0;

  let searchTimer;
  function search(v) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { setSkip(0); setQ(v); }, 250);
  }

  async function remove(row) {
    const label = props.model.key.map((k) => row[k]).join(" / ");
    if (!confirm(`Excluir ${props.model.name} "${label}"?`)) return;
    try {
      await api("DELETE", `/db/${props.model.name}`, { key: keyOf(row) });
      refetch();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <section class="main">
      <header class="toolbar">
        <div>
          <h2>{props.model.name}</h2>
          <span class="muted">{total()} registro{total() === 1 ? "" : "s"}</span>
        </div>
        <input class="search" type="search" placeholder="Buscar…" onInput={(e) => search(e.target.value)} />
        <button class="primary" onClick={() => setEditing({})}>+ Novo</button>
      </header>

      <div class="table-wrap card">
        <table>
          <thead>
            <tr>
              <Show when={IMAGES[props.model.name]}><th>imagem</th></Show>
              <For each={props.model.fields}>
                {(f) => <th classList={{ key: props.model.key.includes(f.name) }}>{f.name}</th>}
              </For>
              <th />
            </tr>
          </thead>
          <tbody>
            <For each={page()?.rows} fallback={<tr><td class="empty" colspan="99">{data.loading ? "Carregando…" : data.error ? data.error.message : "Nenhum registro"}</td></tr>}>
              {(row) => (
                <tr onDblClick={() => setEditing({ row })}>
                  <Show when={IMAGES[props.model.name]}><td class="thumb-cell"><Thumb model={props.model.name} row={row} /></td></Show>
                  <For each={props.model.fields}>{(f) => <td title={String(row[f.name] ?? "")}>{display(f, row[f.name])}</td>}</For>
                  <td class="actions">
                    <button class="ghost" onClick={() => setEditing({ row })}>Editar</button>
                    <button class="ghost danger" onClick={() => remove(row)}>Excluir</button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <Show when={total() > PAGE}>
        <footer class="pager">
          <button class="ghost" disabled={skip() === 0} onClick={() => setSkip(Math.max(0, skip() - PAGE))}>← Anterior</button>
          <span class="muted">{skip() + 1}–{Math.min(skip() + PAGE, total())} de {total()}</span>
          <button class="ghost" disabled={skip() + PAGE >= total()} onClick={() => setSkip(skip() + PAGE)}>Próxima →</button>
        </footer>
      </Show>

      <Show when={editing()}>
        <RowForm
          model={props.model}
          enums={props.enums}
          row={editing().row}
          keyOf={keyOf}
          onClose={() => setEditing(null)}
          onDone={() => { setEditing(null); refetch(); }}
        />
      </Show>
    </section>
  );
}

function Admin() {
  const [schema] = createResource(() => api("GET", "/db/schema"));
  // Reading an errored resource throws in Solid, so everything goes through this guard.
  const ready = () => (schema.error ? undefined : schema());
  const [current, setCurrent] = createSignal(location.hash.slice(1));
  const model = createMemo(() => {
    const models = ready()?.models || [];
    return models.find((m) => m.name === current()) || models[0];
  });
  const select = (name) => { location.hash = name; setCurrent(name); };

  return (
    <div class="layout">
      <nav class="sidebar">
        <h1>Inkwell <span class="muted">DB</span></h1>
        <For each={ready()?.models}>
          {(m) => (
            <a classList={{ active: model()?.name === m.name }} onClick={() => select(m.name)}>{m.name}</a>
          )}
        </For>
        <div class="sidebar-actions">
          <QuotasToggle />
          <button class="ghost" onClick={resetPostQuotas}>↺ Resetar saldos de posts</button>
          <button class="ghost" onClick={logout}>Sair</button>
        </div>
      </nav>
      <Show when={model()} keyed fallback={<p class="main muted">{schema.error?.message || "Carregando…"}</p>}>
        {(m) => <Table model={m} enums={ready().enums} />}
      </Show>
    </div>
  );
}

render(() => <Show when={token()} fallback={<Login />}><Admin /></Show>, document.getElementById("root"));
