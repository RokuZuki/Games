# AI PANDEMIC 開発ソース

公開版と同じゲーム処理、UI、地図、スタイルをこのフォルダーで管理します。ルートの index.html は生成物です。

- src/game-ui.js: React UI（ブラウザ実行用 JavaScript）
- src/style.css: スタイル
- public/legacy-core.js: シミュレーションとセーブ互換
- public/legacy-data.js、legacy-events.js: イベントデータとエンジン
- public/region-geography.js: 地域地図
- vendor/: 公開版の React ランタイム
- template.html: 配信 HTML の骨格

Node.js で npm run build を実行すると、ルートの index.html を再生成します。音楽はルートの audio-v12/ を参照します。リポジトリルートを静的 HTTP サーバーで開いて確認してください。
