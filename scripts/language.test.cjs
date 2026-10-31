const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

// Exercise the real helpers without a browser or an API connection.
function setup() {
  const storage = new Map();
  const window = new EventTarget();
  const document = { documentElement: { lang: "en" } };
  const cache = new Map();
  let subscription;
  function load(file) {
    file = path.resolve(__dirname, "..", file);
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} };
    cache.set(file, module);
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    vm.runInNewContext(code, {
      module, exports: module.exports, window, document, Event,
      localStorage: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
      },
      require: (name) => {
        if (name === "react") return {
          useSyncExternalStore: (subscribe, getSnapshot) => {
            subscription = subscribe;
            return getSnapshot();
          },
        };
        return load(name.replace("@/", "src/") + ".ts");
      },
    }, { filename: file });
    return module.exports;
  }
  const language = load("src/helpers/language.ts");
  return { storage, window, document, language, load, subscribe: (callback) => subscription(callback) };
}

test("language preference survives reads and safely falls back for invalid storage", () => {
  const { language, storage, document } = setup();
  assert.equal(language.getLanguage(), "en");
  language.setLanguage("vi");
  assert.equal(storage.get("language"), '"vi"');
  assert.equal(language.default({ en: "Save", vi: "Lưu" }), "Lưu");
  assert.equal(document.documentElement.lang, "vi");
  storage.set("language", '"fr"');
  assert.equal(language.getLanguage(), "en");
  storage.set("language", "invalid JSON");
  assert.equal(language.getLanguage(), "en");
});

test("language subscribers respond to local changes, other tabs and storage clearing", () => {
  const env = setup();
  env.load("src/hooks/useLanguage.ts").useLanguage();
  let updates = 0;
  const unsubscribe = env.subscribe(() => updates++);
  env.language.setLanguage("vi");
  assert.equal(updates, 1);
  function storageEvent(key) {
    const event = new Event("storage");
    Object.defineProperty(event, "key", { value: key });
    env.window.dispatchEvent(event);
  }
  storageEvent("unrelated-setting");
  assert.equal(updates, 1);
  env.storage.set("language", '"en"');
  storageEvent("language");
  assert.equal(updates, 2);
  assert.equal(env.document.documentElement.lang, "en");
  env.storage.clear();
  storageEvent(null);
  assert.equal(updates, 3);
  unsubscribe();
  env.language.setLanguage("vi");
  storageEvent("language");
  assert.equal(updates, 3);
});

test("existing schedule options and weekday labels update after switching language", () => {
  const { language, load } = setup();
  const { SCHEDULER_TYPE_LIST } = load("src/helpers/scheduler.ts");
  const { getDayOfWeekText } = load("src/utils/utils.ts");
  const option = SCHEDULER_TYPE_LIST[0];
  const value = option.value;
  assert.equal(option.label, "Daily hours");
  language.setLanguage("vi");
  assert.equal(option.label, "Giờ chạy hằng ngày");
  assert.equal(option.value, value);
  assert.equal(getDayOfWeekText({ day: 0 }), "Chủ nhật");
  language.setLanguage("en");
  assert.equal(option.label, "Daily hours");
  assert.equal(getDayOfWeekText({ day: 0 }), "Sunday");
});
