# TigerClub Member Demo — 專案筆記

## 專案位置
- 本地：`/Users/howardchen.design/Documents/tigerair/tigerair-member-demo/`
- GitHub：https://github.com/howardimagine/tigerair-member-demo
- Demo：https://howardimagine.github.io/tigerair-member-demo/

---

## 完成功能清單

| 功能 | 說明 |
|------|------|
| 老虎動畫 hero | tiger walking.mp4 + mix-blend-mode: multiply |
| 統一 hero 三欄 | 會員卡 / 點數資訊 / 老虎影片 |
| 多步驟註冊 | 5步驟 + 護照 OCR 自動填寫 |
| 我的訂單 flight card | 航班卡 + 6個加值服務 chip |
| 機上餐 modal | 餐點選擇 + 虎足跡即時扣點 |
| Voucher 兌換流程 | 選面額 → 確認 → 成功 |
| 虎禮選市集 | 商品格（點數 + 商店名稱） |
| 會員資訊頁 | 雙圓環升等計算器 + icon 權益格 |
| 登出按鈕 | 側邊欄左下角 |
| Dark / Light 雙主題 | CSS token 切換 |

---

## 已修復的 Bug

- 深色模式按鈕黑字 → `--btn-text: #FFFFFF`
- 圓環數字偏移 → `.calc-path-ring-wrap` 130×130 + `inset: 0` flex center
- Stepper 打勾數字跑版 → `::before` 絕對定位
- `--surface` 未定義 → 補入 dark/light token
- CSS cascade 順序錯誤 → media query 移至 base styles 之後

---

## Demo 影片腳本

**總時長建議：3–4 分鐘**

### 第一幕：登入入口（0:00–0:20）
1. 開場：登入頁，展示 Social Login（Google / Apple / Facebook）
2. 點擊「立即註冊」→ 進入多步驟註冊流程

### 第二幕：註冊流程（0:20–1:00）
3. Step 1 基本資料：輸入姓名、Email、手機
4. Step 2 護照資訊：點擊「護照 OCR 掃描」→ 掃描動畫 → 欄位自動填入
5. Step 3 帳戶設定：密碼
6. Step 4 航班偏好
7. Step 5 完成 → 顯示「歡迎加入！新會員禮 500 虎足跡」成功畫面

### 第三幕：首頁 Dashboard（1:00–1:30）
8. 登入後進入首頁：老虎行走動畫 + 會員卡 + 虎足跡點數
9. 捲動至 Tigerclub Exclusive matcha banner
10. 點擊首頁「兌換 Voucher」→ 選擇面額 → 確認 → 成功扣點

### 第四幕：我的行程 → 訂單 + 加值服務（1:30–2:10）
11. 點擊「我的行程」：顯示縮略航班小卡
12. 點擊「查看更多」→ 進入「我的訂單」：完整 flight card
13. 展示加值服務 chip 列：行李、座位、餐點、保險
14. 點擊「機上餐」→ 開啟餐點 Modal → 勾選 → 確認扣點（即時點數變化）

### 第五幕：會員資訊（2:10–2:40）
15. 進入「會員資訊」：個人基本資料、會籍狀態
16. 升等計算器：雙圓形進度環（已飛航段 vs 消費金額）
17. 向下捲動：Icon 權益格，掃過所有 Premium 福利

### 第六幕：虎禮選市集（2:40–3:00）
18. 進入「虎禮選」：市集商品格（點數 + 商店名稱）
19. 點擊商品卡 → 顯示點數兌換說明

### 第七幕：通知中心（3:00–3:15）
20. 點擊右上角鈴鐺 → 通知側板滑出：航班提醒 + 點數到期通知

### 第八幕：主題切換收尾（3:15–3:30）
21. 切換 Dark Premium 主題：深色高質感介面
22. 切換回 Playful Orange：活潑橘色系
23. 結尾 Freeze：TigerClub logo

---

## UX 五大設計亮點（顧問簡報用）

**01 — Effort Justification**
護照 OCR 不只是「方便」，是策略性設計。讓使用者主動完成一個「有份量感」的動作，行為心理學證明：付出越多努力完成的事，放棄門檻越高。OCR 把繁瑣轉換成儀式感，新會員流失率因此下降。

**02 — Endowment Before Engagement**
新會員在使用任何功能前，帳戶已有 500 虎足跡。人對「已擁有的東西」估值是「未得到的東西」的 2 倍（Kahneman, 1984）。點數先給，黏著度後來。

**03 — Anxiety-to-Action Architecture**
升等計算器的雙圓環不是裝飾，是壓力設計。Goal Gradient Effect 證明：可視化的缺口比獎勵承諾更能驅動行為。會員看到「還差 3 段」遠比看到「升等後有 10 項特權」更容易採取行動。

**04 — Contextual Upsell（情境式附加銷售）**
加值服務綁定在航班卡內，不是獨立選單。對的商品在對的情境出現，轉換率是通用推薦的 3–5 倍。使用者在看自己的機票時買座位升等，是需求，不是廣告。

**05 — Dual-Theme as Identity Signal**
深色 Premium / 亮色 Playful 不只是視覺偏好，是會員身份的外顯符號。高消費用戶對「差異化待遇」的感知決定忠誠度上限——讓不同層級的會員「看起來就不一樣」，比積分翻倍更有效鞏固高價值族群。

---

## 關鍵程式碼位置

### index.html
- 頁面：`page-dashboard`, `page-rewards`, `page-orders`, `page-tier`, `page-vouchers`, `page-settings`, `page-login`, `page-register`
- Modal：`modalOverlay`, `passportModal`, `mealModal`, `voucherSelectModal`, `notifPanel`

### style.css（約 4200 行）
- Section 31：`.flight-card`, `.fa-chip`, `.fa-row`
- Section 37：`.meal-modal-card`, `.meal-grid`, `.meal-option`
- Section 38–39：`.rewards-tabs`, `.market-grid`, `.market-card`
- Section 40：`.tier-hero`, `.calc-ring`, `.calc-path-ring-wrap`, `.benefits-grid`

### app.js
- `USER_POINTS = 2580`（共用點數狀態）
- `openVoucherSelect()`, `confirmVoucher()`
- `openMealModal()`, `confirmMeal()`, `updateMealTotal()`
- `openPassportOCR()`, `closePassportOCR()`（OCR 自動填入）
- `goToStep(n)`, `stepNext()`, `stepPrev()`
