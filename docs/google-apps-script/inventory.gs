/**
 * 雪ともショップ 在庫・注文管理スクリプト（Google Apps Script）
 *
 * 使い方は docs/google-apps-script/README.md を参照。
 * スクリプトプロパティ SECRET に、サイト側の STOCK_SHEET_SECRET と同じ値を設定すること。
 *
 * シート構成
 *   「在庫」: A=variantId / B=商品名 / C=フレーム / D=レンズ / E=在庫数（1行目は見出し）
 *   「注文」: スクリプトが自動で追記する（1行目は見出し。J列は紹介者コード、K列はメール、L列はお知らせメールの可否）
 */
const STOCK_SHEET = '在庫';
const ORDER_SHEET = '注文';

// 注文が入ったときに通知メールを送る宛先
const NOTIFY_TO = ['natsumi19870721@gmail.com', 'mybeemate@gmail.com'];

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad_request' });
  }

  const secret = PropertiesService.getScriptProperties().getProperty('SECRET');
  if (!secret || body.key !== secret) {
    return json_({ ok: false, error: 'unauthorized' });
  }

  if (body.action === 'stock') return json_({ ok: true, stock: readStock_() });
  if (body.action === 'order') return recordOrder_(body);
  return json_({ ok: false, error: 'unknown_action' });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function readStock_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(STOCK_SHEET);
  const rows = sheet.getLastRow() >= 2 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues() : [];
  const stock = {};
  rows.forEach(function (r) {
    if (r[0]) stock[String(r[0]).trim()] = Number(r[4]) || 0;
  });
  return stock;
}

/** 注文を記録し、在庫を減らす。同じ注文IDは二重に処理しない。 */
function recordOrder_(body) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.getActive();
    const stockSheet = ss.getSheetByName(STOCK_SHEET);
    const orderSheet = ss.getSheetByName(ORDER_SHEET);

    const orderId = String(body.orderId || '');
    if (!orderId || !Array.isArray(body.items) || body.items.length === 0) {
      return json_({ ok: false, error: 'bad_order' });
    }

    // 二重処理の防止（Webhookは再送されることがある）
    const lastOrderRow = orderSheet.getLastRow();
    if (lastOrderRow >= 2) {
      const ids = orderSheet.getRange(2, 2, lastOrderRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === orderId) return json_({ ok: true, duplicate: true });
      }
    }

    const lastStockRow = stockSheet.getLastRow();
    const stockRows = lastStockRow >= 2 ? stockSheet.getRange(2, 1, lastStockRow - 1, 5).getValues() : [];
    const now = new Date();
    const out = [];
    const referral = String(body.referralCode || '').trim();
    const email = String(body.email || '').trim();
    const newsletter = body.newsletter ? 'あり' : 'なし';

    body.items.forEach(function (item) {
      const variantId = String(item.variantId || '');
      const qty = Number(item.qty) || 0;
      var idx = -1;
      for (var j = 0; j < stockRows.length; j++) {
        if (String(stockRows[j][0]).trim() === variantId) { idx = j; break; }
      }
      var name = '', frame = '', lens = '', note = '';
      if (idx === -1) {
        note = '在庫シートに未登録';
      } else {
        name = stockRows[idx][1];
        frame = stockRows[idx][2];
        lens = stockRows[idx][3];
        const current = Number(stockRows[idx][4]) || 0;
        if (current < qty) note = '在庫不足（要確認）';
        const next = Math.max(0, current - qty);
        stockSheet.getRange(idx + 2, 5).setValue(next);
        stockRows[idx][4] = next;
      }
      out.push([now, orderId, variantId, name, frame, lens, qty, Number(item.amount) || 0, note, referral, email, newsletter]);
    });

    orderSheet.getRange(orderSheet.getLastRow() + 1, 1, out.length, 12).setValues(out);
    notify_(orderId, out, ss.getUrl());
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/** 注文の通知メール。失敗しても注文の記録は止めない。 */
function notify_(orderId, rows, sheetUrl) {
  try {
    const referral = rows[0][9] || '';
    const email = rows[0][10] || '';
    const newsletter = rows[0][11] || 'なし';
    const total = rows.reduce(function (sum, r) { return sum + r[7]; }, 0);
    const warn = rows.some(function (r) { return r[8]; });
    const lines = rows.map(function (r) {
      const label = [r[3], r[4], r[5]].filter(String).join(' / ') || r[2];
      return '・' + label + ' × ' + r[6] + '（' + r[7].toLocaleString() + '円）' + (r[8] ? ' ※' + r[8] : '');
    });
    const body = [
      '雪ともショップに注文が入りました。',
      '',
      lines.join('\n'),
      '',
      '商品合計：' + total.toLocaleString() + '円（送料は別）',
      '注文ID：' + orderId,
      '紹介者コード：' + (referral || 'なし'),
      'お客さんのメール：' + (email || '（不明）') + '／お知らせメール：' + newsletter,
      referral ? '★ 雪ともステッカーを同梱してください' : '',
      '',
      'お届け先は、Squareダッシュボードの注文で確認してください。',
      'https://squareup.com/dashboard/orders/overview',
      '',
      '在庫・注文シート：' + sheetUrl,
    ].join('\n');
    MailApp.sendEmail({
      to: NOTIFY_TO.join(','),
      subject: (warn ? '【在庫要確認】' : '') + '【雪とも】新しい注文が入りました',
      body: body,
    });
  } catch (err) {
    console.error('notify failed', err);
  }
}

/** 初回だけ手で実行する。メール送信の権限をGoogleに許可するためのもの（メールは送らない）。 */
function authorizeMail() {
  console.log('メールの残り送信可能数：' + MailApp.getRemainingDailyQuota());
}
