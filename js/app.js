const form = document.querySelector("#search-form");
const output = document.querySelector("#query-output");
const sinceDate = document.querySelector("#since-date");
const untilDate = document.querySelector("#until-date");

const normalizeWords = (value) => value.trim().split(/\s+/).filter(Boolean);
const cleanHandle = (value) => value.trim().replace(/^@+/, "");
const cleanTag = (value) => value.trim().replace(/^#+/, "");
const accountGroup = (prefix, value) => {
  const accounts = normalizeWords(value).map(cleanHandle).filter(Boolean);
  const terms = accounts.map((account) => `${prefix}${account}`);
  if (terms.length > 1) return `(${terms.join(" OR ")})`;
  return terms[0] || "";
};

function buildQuery(formData) {
  const parts = [];

  const allWords = normalizeWords(formData.get("allWords") || "");
  if (allWords.length) parts.push(...allWords);

  const exactPhrase = (formData.get("exactPhrase") || "").trim();
  if (exactPhrase) parts.push(`"${exactPhrase.replaceAll('"', '\\"')}"`);

  const anyWords = normalizeWords(formData.get("anyWords") || "");
  if (anyWords.length) parts.push(`(${anyWords.join(" OR ")})`);

  const noneWords = normalizeWords(formData.get("noneWords") || "");
  if (noneWords.length) parts.push(...noneWords.map((word) => `-${word}`));

  const hashtags = normalizeWords(formData.get("hashtags") || "")
    .map(cleanTag)
    .filter(Boolean);
  if (hashtags.length) parts.push(...hashtags.map((tag) => `#${tag}`));

  const fromAccount = accountGroup("from:", formData.get("fromAccount") || "");
  if (fromAccount) parts.push(fromAccount);

  const toAccount = accountGroup("to:", formData.get("toAccount") || "");
  if (toAccount) parts.push(toAccount);

  const mentionAccount = accountGroup(
    "@",
    formData.get("mentionAccount") || "",
  );
  if (mentionAccount) parts.push(mentionAccount);

  const tweetType = formData.get("tweetType");
  if (tweetType) parts.push(tweetType);

  if (formData.get("verified")) parts.push("filter:verified");
  if (formData.get("hideReplies")) parts.push("-filter:replies");
  if (formData.get("hideNativeRetweets")) parts.push("-filter:nativeretweets");

  const language = formData.get("language");
  if (language) parts.push(`lang:${language}`);

  const minReplies = formData.get("minReplies");
  if (minReplies) parts.push(`min_replies:${minReplies}`);

  const minLikes = formData.get("minLikes");
  if (minLikes) parts.push(`min_faves:${minLikes}`);

  const minRetweets = formData.get("minRetweets");
  if (minRetweets) parts.push(`min_retweets:${minRetweets}`);

  const sinceDateValue = formData.get("sinceDate");
  if (sinceDateValue) parts.push(`since:${sinceDateValue}`);

  const untilDateValue = formData.get("untilDate");
  if (untilDateValue) parts.push(`until:${untilDateValue}`);

  return parts.join(" ");
}

function updatePreview() {
  const query = buildQuery(new FormData(form));
  output.value = query || "Start typing to build a search.";
  output.dataset.empty = query ? "false" : "true";
}

function syncDateConstraints(event) {
  if (sinceDate.value && untilDate.value && sinceDate.value > untilDate.value) {
    if (event?.target === sinceDate) {
      untilDate.value = "";
    } else {
      sinceDate.value = "";
    }
  }

  untilDate.min = sinceDate.value;
  sinceDate.max = untilDate.value;
}

form.addEventListener("input", (event) => {
  if (event.target === sinceDate || event.target === untilDate) {
    syncDateConstraints(event);
  }

  updatePreview();
});
form.addEventListener("reset", () =>
  requestAnimationFrame(() => {
    syncDateConstraints();
    updatePreview();
  }),
);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = buildQuery(new FormData(form));
  if (!query) {
    form.querySelector("input, select").focus();
    return;
  }

  const url = new URL(form.action);
  url.searchParams.set("q", query);
  url.searchParams.set("src", "typed_query");
  const searchUrl = url.toString();

  const opened = window.open(searchUrl, "_blank");
  if (opened) {
    opened.opener = null;
  } else {
    window.location.href = searchUrl;
  }
});

syncDateConstraints();
updatePreview();
