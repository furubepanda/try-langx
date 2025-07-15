import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🟡 Supabaseの設定を自分のプロジェクトの情報に書き換えてください
const supabaseUrl = "https://jgkjmmuqjrezlhgitbyr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impna2ptbXVxanJlemxoZ2l0YnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTE4MTksImV4cCI6MjA2NjU2NzgxOX0.iTacxsHjc9D591jcMJ6Fxqx_KUziU580QencEiPXxMM";
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ DOM読み込み後にボタンイベント設定
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, setting up button handler.");
  document.getElementById("nextButton").addEventListener("click", getNextLink);
});

let fetching = false; // prevent duplicate requests

async function getNextLink() {
  if (fetching) return; // ignore clicks while running
  fetching = true;
  const button = document.getElementById("nextButton");
  if (button) button.disabled = true;
  const display = document.getElementById("linkDisplay");

  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('used', false)
    .limit(1)
    .maybeSingle();  // ← ここが重要！

  if (error || !data) {
    display.textContent = "すべてのリンクが使用済みです。";
    console.error("取得エラーまたはリンクなし:", error || "No unused links.");
    fetching = false;
    if (button) button.disabled = false;
    return;
  }

  // 表示
  display.innerHTML = `<a href="${data.url}" target="_blank">${data.url}</a>`;

  // 使用済みに更新
  const { error: updateError } = await supabase
    .from('links')
    .update({ used: true })
    .eq('id', data.id);

  if (updateError) {
    console.error("使用済み更新エラー:", updateError);
  }

  fetching = false;
  if (button) button.disabled = false;
}
