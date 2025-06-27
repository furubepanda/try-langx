import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = "https://jgkjmmuqjrezlhgitbyr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impna2ptbXVxanJlemxoZ2l0YnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTE4MTksImV4cCI6MjA2NjU2NzgxOX0.iTacxsHjc9D591jcMJ6Fxqx_KUziU580QencEiPXxMMY";
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ DOMが完全に読み込まれてから実行
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, setting up button handler.");
  document.getElementById("nextButton").addEventListener("click", getNextLink);
});

async function getNextLink() {
  const display = document.getElementById("linkDisplay");

  // 未使用リンクを1件取得
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('used', false)
    .limit(1)
    .single();

  if (error || !data) {
    display.textContent = "すべてのリンクが使用済みです。";
    console.error("取得エラーまたはリンクなし:", error);
    return;
  }

  // 表示
  display.innerHTML = `<a href="${data.url}" target="_blank">${data.url}</a>`;

  // 使用済みに更新
  await supabase
    .from('links')
    .update({ used: true })
    .eq('id', data.id);
}

