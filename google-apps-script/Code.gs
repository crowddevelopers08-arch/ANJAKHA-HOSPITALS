/* ============================================================
   Anjakha Hospitals — Leads + Patient Feedback + Meta Custom Audience sync
   (Google Apps Script web app)

   One web app, two tabs:

   1. "Anjakha Leads"     ← app/api/lead/route.ts     (type: "lead", or no type)
        { token, type:"lead", sheetTab, timestamp, name, phone, age,
          treatment, visit, form, source, pageUrl,
          utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid }

   2. "Patient Feedback"  ← app/api/feedback/route.ts (type: "feedback")
        GMB review funnel: patients who choose 1–3 stars on /review
        fill the "Help Us Improve" form on /client-feedback.
        { token, type:"feedback", sheetTab, timestamp, name, phone, email,
          rating (1-5 or ""), suggestions, branch, source, pageUrl }

   Rows are written by HEADER NAME, not column position, so the team can
   reorder columns or add their own (e.g. "Notes", "Called By") safely.
   Missing standard columns are added automatically.

   Only the leads tab is synced to the Meta Custom Audience; feedback rows
   are never sent to Meta.

   ------------------------------------------------------------
   SETUP (one time)
   1. Open the Google Sheet  >  Extensions  >  Apps Script.
      Replace everything in Code.gs with this file and Save.
   2. Select the function `setupSheets` and click Run.
      Accept the permissions prompt (Advanced > Go to project > Allow).
      This creates/repairs BOTH tabs.
   3. Deploy  >  New deployment  >  type: Web app
        Description:      Anjakha leads + feedback
        Execute as:       Me
        Who has access:   Anyone
      Click Deploy and copy the Web app URL (ends with /exec).
   4. Put that URL in the website environment:
        GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
   5. (Optional) Run `testLead` and `testFeedback` to check rows appear.

   ALREADY DEPLOYED? (updating from the leads-only version)
   Paste this file, Save, run `setupSheets` once, then
   Deploy  >  Manage deployments  >  (pencil) Edit  >  Version: New version  >  Deploy.
   The /exec URL stays the same, so the website needs no change.

   SECURITY (recommended)
   - Project Settings (gear icon)  >  Script Properties  >  Add property
        WEBHOOK_SECRET = <any long random string>
   - Set the same value on the website:
        GOOGLE_SHEETS_SECRET=<the same string>
   When WEBHOOK_SECRET is set, requests without the matching token are rejected.

   FEEDBACK EMAIL ALERT (optional)
   - Script Properties  >  add:
        FEEDBACK_ALERT_EMAILS = manager@example.com, quality@example.com
     Every new feedback row is then emailed to those addresses, so a
     1–3 star patient can be called back the same day.

   META CUSTOM AUDIENCE SYNC (leads tab only)
   - Script Properties  >  add:
        META_ACCESS_TOKEN   System-user token with ads_management
        META_AUDIENCE_ID    Customer-list Custom Audience ID for these leads
   - Run `setupMetaAudienceSync` once from the editor (installs the
     5-minute trigger and does the first sync).
   - The sheet gets a "Meta Audience" menu: "Sync now" and
     "Retry skipped rows" (after fixing a phone number or status).
   - Meta Audience column values:
        Added <time>               sent to the audience
        Duplicate: already added   same number was sent on an earlier row
        Skipped: no valid phone    phone can't be used
        Skipped: marked Invalid    Status was "Invalid" at sync time
        Error adding: <message>    Meta rejected it; retried next run
   - Run `removeMetaAudienceSync` to stop the automatic sync.

   UPDATING THIS CODE LATER
   Deploy  >  Manage deployments  >  (pencil) Edit  >  Version: New version
   >  Deploy. The /exec URL stays the same.
   (Script properties and triggers are kept; no need to re-run setup.)
   ============================================================ */

var LEAD_TAB = 'Anjakha Leads';
var FEEDBACK_TAB = 'Patient Feedback';

var HEADER_BG = '#6b0505';     // logo maroon
var HEADER_FG = '#ffffff';
var STRIPE_BG = '#fff9e5';     // light gold
var NEW_BG = '#fff1c2';        // highlight for Status = New
var REPEAT_FG = '#b45309';

/* Rating cell colours on the feedback tab */
var RATING_STYLE = {
  1: { bg: '#fde2e2', fg: '#991b1b' },
  2: { bg: '#fde2e2', fg: '#991b1b' },
  3: { bg: '#fff1c2', fg: '#92400e' },
  4: { bg: '#e3f4e6', fg: '#166534' },
  5: { bg: '#e3f4e6', fg: '#166534' }
};

/* Per-tab configuration. Columns: [header, width]. */
var TABS = {
  lead: {
    name: LEAD_TAB,
    columns: [
      ['Timestamp', 170],
      ['Name', 170],
      ['Phone', 120],
      ['Age', 60],
      ['Treatment', 190],
      ['Planning to Visit', 140],
      ['Status', 150],
      ['Repeat Enquiry', 120],
      ['Form', 110],
      ['Source', 170],
      ['Page URL', 300],
      ['UTM Source', 120],
      ['UTM Medium', 120],
      ['UTM Campaign', 180],
      ['UTM Term', 140],
      ['UTM Content', 140],
      ['GCLID', 200],
      ['FBCLID', 200],
      ['Meta Audience', 210]
    ],
    statusOptions: ['New', 'Contacted', 'Appointment Booked', 'Visited', 'Not Interested', 'Not Reachable', 'Invalid'],
    centered: ['Phone', 'Age', 'Treatment', 'Planning to Visit', 'Status', 'Repeat Enquiry', 'Form'],
    wrapped: [],
    repeatHeader: 'Repeat Enquiry'
  },
  feedback: {
    name: FEEDBACK_TAB,
    columns: [
      ['Timestamp', 170],
      ['Name', 170],
      ['Phone', 120],
      ['Email', 210],
      ['Rating', 80],
      ['Suggestions', 380],
      ['Status', 150],
      ['Action Taken', 260],
      ['Repeat Feedback', 120],
      ['Branch', 120],
      ['Source', 160],
      ['Page URL', 300]
    ],
    statusOptions: ['New', 'Called Back', 'Resolved', 'Escalated', 'Not Reachable', 'Invalid'],
    centered: ['Phone', 'Rating', 'Status', 'Repeat Feedback', 'Branch'],
    wrapped: ['Suggestions', 'Action Taken'],
    repeatHeader: 'Repeat Feedback'
  }
};

/* ============================================================ Web app */

function doGet() {
  return json_({ status: 'ok', service: 'Anjakha Hospitals lead + feedback API', tabs: [LEAD_TAB, FEEDBACK_TAB] });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents) return json_({ error: 'Empty request body' });

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return json_({ error: 'Invalid JSON' });
    }

    var secret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    if (secret && data.token !== secret) return json_({ error: 'Unauthorized' });

    var kind = String(data.type || '').toLowerCase() === 'feedback' ? 'feedback' : 'lead';
    var cfg = TABS[kind];

    var name = clean_(data.name);
    var phone = String(data.phone || '').replace(/\D/g, '');
    if (name.length < 2 || phone.length < 10) return json_({ error: 'Missing name or phone' });
    if (kind === 'feedback' && clean_(data.suggestions).length < 3) return json_({ error: 'Missing feedback' });

    // Serialise writes (with each other and with the Meta sync) so rows never collide.
    lock.waitLock(20000);

    var sheet = getSheet_(cfg);
    var values = kind === 'feedback' ? feedbackValues_(data, phone) : leadValues_(data, phone);
    var row = appendRow_(sheet, cfg, values, phone);

    lock.releaseLock();
    if (kind === 'feedback') notifyFeedback_(values, row);

    return json_({ success: true, tab: cfg.name, row: row });
  } catch (err) {
    console.error(err);
    return json_({ error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

/* ============================================================ Editor helpers */

/** Run once after pasting the script: creates/repairs both tabs and asks for permissions. */
function setupSheets() {
  var lead = getSheet_(TABS.lead);
  getSheet_(TABS.feedback);
  Logger.log('Ready: "' + LEAD_TAB + '" and "' + FEEDBACK_TAB + '" in ' + lead.getParent().getName());
}

/** Writes a sample lead so you can check the sheet without the website. */
function testLead() {
  var secret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET') || '';
  var res = doPost({ postData: { contents: JSON.stringify({
    token: secret,
    type: 'lead',
    timestamp: istNowLong_(),
    name: 'Test Lead', phone: '9876543210', age: '35',
    treatment: 'Hernia', visit: 'Within 7 Days',
    form: 'hero', source: 'Anjakha Hospitals LP',
    pageUrl: 'https://example.com/?utm_source=test', utm_source: 'test'
  }) } });
  Logger.log(res.getContent());
}

/** Writes a sample feedback row (2 stars). */
function testFeedback() {
  var secret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET') || '';
  var res = doPost({ postData: { contents: JSON.stringify({
    token: secret,
    type: 'feedback',
    timestamp: istNowLong_(),
    name: 'Test Patient', phone: '9876543210', email: 'test@example.com',
    rating: 2, suggestions: 'Waiting time at reception was long.',
    branch: 'Madipakkam', source: 'GMB Review Funnel',
    pageUrl: 'https://anjakhahospitals.com/client-feedback?rating=2'
  }) } });
  Logger.log(res.getContent());
}

/* ============================================================ Row values */

function leadValues_(data, phone) {
  return {
    'Timestamp': clean_(data.timestamp) || istNowLong_(),
    'Name': clean_(data.name),
    'Phone': phone,
    'Age': clean_(data.age),
    'Treatment': clean_(data.treatment) || 'Not specified',
    'Planning to Visit': clean_(data.visit),
    'Status': 'New',
    'Form': clean_(data.form),
    'Source': clean_(data.source),
    'Page URL': clean_(data.pageUrl),
    'UTM Source': clean_(data.utm_source),
    'UTM Medium': clean_(data.utm_medium),
    'UTM Campaign': clean_(data.utm_campaign),
    'UTM Term': clean_(data.utm_term),
    'UTM Content': clean_(data.utm_content),
    'GCLID': clean_(data.gclid),
    'FBCLID': clean_(data.fbclid)
    // 'Repeat Enquiry' is filled by appendRow_; 'Meta Audience' by syncMetaAudience().
  };
}

function feedbackValues_(data, phone) {
  var rating = parseInt(data.rating, 10);
  return {
    'Timestamp': clean_(data.timestamp) || istNowLong_(),
    'Name': clean_(data.name),
    'Phone': phone,
    'Email': clean_(data.email),
    'Rating': rating >= 1 && rating <= 5 ? String(rating) : 'Not given',
    'Suggestions': clean_(data.suggestions),
    'Status': 'New',
    'Action Taken': '',
    'Branch': clean_(data.branch),
    'Source': clean_(data.source) || 'GMB Review Funnel',
    'Page URL': clean_(data.pageUrl)
    // 'Repeat Feedback' is filled by appendRow_.
  };
}

/* ============================================================ Sheet internals */

function getSheet_(cfg) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(cfg.name) || ss.insertSheet(cfg.name);
  ensureHeaders_(sheet, cfg);
  return sheet;
}

/** Creates the header row on a new tab, or appends any missing standard columns to an existing one. */
function ensureHeaders_(sheet, cfg) {
  var wanted = cfg.columns.map(function (c) { return c[0]; });

  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, wanted.length).setValues([wanted]);
    cfg.columns.forEach(function (c, i) { sheet.setColumnWidth(i + 1, c[1]); });
    styleHeader_(sheet, wanted.length);
    sheet.setFrozenRows(1);
    try { sheet.getRange(1, 1, sheet.getMaxRows(), wanted.length).createFilter(); } catch (ignore) {}
    return;
  }

  var existing = headers_(sheet);
  var missing = wanted.filter(function (h) { return existing.indexOf(h) === -1; });
  if (missing.length) {
    var start = sheet.getLastColumn() + 1;
    sheet.getRange(1, start, 1, missing.length).setValues([missing]);
    missing.forEach(function (h, i) {
      var col = cfg.columns.filter(function (c) { return c[0] === h; })[0];
      sheet.setColumnWidth(start + i, col ? col[1] : 150);
    });
    styleHeader_(sheet, sheet.getLastColumn());
  }
}

function headers_(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function (h) {
    return String(h).trim();
  });
}

function styleHeader_(sheet, colCount) {
  sheet.getRange(1, 1, 1, colCount)
    .setBackground(HEADER_BG)
    .setFontColor(HEADER_FG)
    .setFontWeight('bold')
    .setFontSize(11)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);
  sheet.setRowHeight(1, 42);
}

function appendRow_(sheet, cfg, values, phone) {
  var headers = headers_(sheet);
  var isRepeat = phoneExists_(sheet, headers, phone);
  values[cfg.repeatHeader] = isRepeat ? 'Yes' : 'No';

  var rowValues = headers.map(function (h) {
    return Object.prototype.hasOwnProperty.call(values, h) ? values[h] : '';
  });

  var rowIndex = sheet.getLastRow() + 1;
  // Grow the tab before it fills up. Inserting *inside* the last row keeps the header filter covering new rows.
  if (rowIndex >= sheet.getMaxRows()) sheet.insertRowsBefore(sheet.getMaxRows(), 500);
  var range = sheet.getRange(rowIndex, 1, 1, headers.length);
  range.setNumberFormat('@');            // keep phone/age/rating as plain text
  range.setValues([rowValues]);
  styleRow_(sheet, cfg, rowIndex, headers, isRepeat, values);
  return rowIndex;
}

function styleRow_(sheet, cfg, rowIndex, headers, isRepeat, values) {
  var range = sheet.getRange(rowIndex, 1, 1, headers.length);
  range.setBackground(rowIndex % 2 === 0 ? STRIPE_BG : '#ffffff')
    .setFontColor('#262626')
    .setFontSize(10)
    .setFontWeight('normal')
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('left')
    .setWrap(false)
    .setBorder(false, false, true, false, false, false, '#ececec', SpreadsheetApp.BorderStyle.SOLID);

  cfg.centered.forEach(function (h) {
    var i = headers.indexOf(h);
    if (i !== -1) sheet.getRange(rowIndex, i + 1).setHorizontalAlignment('center');
  });

  var wrappedAny = false;
  cfg.wrapped.forEach(function (h) {
    var i = headers.indexOf(h);
    if (i !== -1) {
      sheet.getRange(rowIndex, i + 1).setWrap(true).setVerticalAlignment('top');
      wrappedAny = true;
    }
  });
  // Fixed height for single-line rows; wrapped (feedback) rows grow to fit the text.
  if (!wrappedAny) sheet.setRowHeight(rowIndex, 34);

  var statusCol = headers.indexOf('Status');
  if (statusCol !== -1) {
    var cell = sheet.getRange(rowIndex, statusCol + 1);
    cell.setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(cfg.statusOptions, true).setAllowInvalid(true).build()
    );
    cell.setBackground(NEW_BG).setFontWeight('bold');
  }

  var repeatCol = headers.indexOf(cfg.repeatHeader);
  if (repeatCol !== -1 && isRepeat) {
    sheet.getRange(rowIndex, repeatCol + 1).setFontColor(REPEAT_FG).setFontWeight('bold');
  }

  var ratingCol = headers.indexOf('Rating');
  var style = values && RATING_STYLE[values['Rating']];
  if (ratingCol !== -1 && style) {
    sheet.getRange(rowIndex, ratingCol + 1).setBackground(style.bg).setFontColor(style.fg).setFontWeight('bold');
  }
}

/** True if this phone number already appears in an earlier row of the same tab. */
function phoneExists_(sheet, headers, phone) {
  var col = headers.indexOf('Phone');
  var last = sheet.getLastRow();
  if (col === -1 || last < 2) return false;
  var found = sheet.getRange(2, col + 1, last - 1, 1)
    .createTextFinder(phone)
    .matchEntireCell(true)
    .findNext();
  return Boolean(found);
}

/** Emails new feedback to FEEDBACK_ALERT_EMAILS (if set). Failures are logged, never block the row. */
function notifyFeedback_(values, row) {
  var to = PropertiesService.getScriptProperties().getProperty('FEEDBACK_ALERT_EMAILS');
  if (!to) return;
  try {
    var rating = values['Rating'];
    var stars = /^\d$/.test(rating) ? rating + '/5' : 'Not given';
    var url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
    var esc = function (s) {
      return String(s || '').replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    };
    var line = function (k, v) { return '<tr><td style="padding:4px 12px 4px 0;color:#6b4a4a"><b>' + k + '</b></td><td>' + esc(v) + '</td></tr>'; };

    MailApp.sendEmail({
      to: to,
      subject: 'Patient feedback (' + stars + ') — ' + values['Name'] + ', ' + (values['Branch'] || 'Anjakha'),
      htmlBody:
        '<div style="font-family:Arial,sans-serif;font-size:14px;color:#2a0202">' +
        '<h2 style="color:#6b0505;margin:0 0 12px">New patient feedback</h2>' +
        '<table>' +
        line('Rating', stars) +
        line('Name', values['Name']) +
        line('Phone', values['Phone']) +
        line('Email', values['Email']) +
        line('Branch', values['Branch']) +
        line('Received', values['Timestamp']) +
        '</table>' +
        '<p style="margin:16px 0 4px"><b>Feedback</b></p>' +
        '<p style="white-space:pre-wrap;background:#fdf8f2;padding:12px;border-left:4px solid #6b0505;margin:0">' + esc(values['Suggestions']) + '</p>' +
        '<p style="margin-top:16px"><a href="' + url + '">Open the sheet</a> (row ' + row + ' in "' + FEEDBACK_TAB + '")</p>' +
        '</div>'
    });
  } catch (err) {
    console.error('Feedback email failed: ' + err);
  }
}

/** Trims input and blocks spreadsheet formula injection (=, +, -, @). */
function clean_(v) {
  var s = v == null ? '' : String(v).trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function istNowLong_() {
  return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

/* ============================================================ Meta Custom Audience sync (leads tab only) */

var META_GRAPH_VERSION = 'v21.0';
var META_SYNC_TRIGGER = 'syncMetaAudience';
var META_COLUMN = 'Meta Audience';
var META_BATCH_SIZE = 5000; // Meta accepts up to 10,000 users per request.

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Meta Audience')
    .addItem('Sync now', 'syncMetaAudienceFromMenu')
    .addItem('Retry skipped rows', 'retryMetaAudienceFromMenu')
    .addToUi();
}

/** Run once from the editor: checks the settings, installs the trigger, syncs. */
function setupMetaAudienceSync() {
  metaSettings_();

  removeMetaAudienceSync();
  ScriptApp.newTrigger(META_SYNC_TRIGGER).timeBased().everyMinutes(5).create();
  Logger.log('Trigger installed: ' + META_SYNC_TRIGGER + ' every 5 minutes');

  Logger.log(JSON.stringify(syncMetaAudience()));
}

function removeMetaAudienceSync() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === META_SYNC_TRIGGER) ScriptApp.deleteTrigger(t);
  });
  Logger.log('Meta audience trigger removed.');
}

function syncMetaAudienceFromMenu() {
  var msg;
  try {
    msg = metaSummary_(syncMetaAudience());
  } catch (err) {
    msg = 'Error: ' + (err.message || err);
  }
  SpreadsheetApp.getActive().toast(msg, 'Meta Audience', 8);
}

/** Clears "Skipped" cells (e.g. after fixing a number or status) so those rows are tried again. */
function retryMetaAudienceFromMenu() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEAD_TAB);
  if (!sheet || sheet.getLastRow() < 2) return;

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    SpreadsheetApp.getActive().toast('Sheet is busy - try again in a moment.', 'Meta Audience', 8);
    return;
  }
  try {
    var idx = headers_(sheet).indexOf(META_COLUMN);
    if (idx !== -1) {
      var range = sheet.getRange(2, idx + 1, sheet.getLastRow() - 1, 1);
      range.setValues(range.getValues().map(function (r) {
        return [String(r[0]).indexOf('Skipped') === 0 ? '' : r[0]];
      }));
    }
  } finally {
    lock.releaseLock();
  }
  syncMetaAudienceFromMenu();
}

/**
 * Pushes every lead not yet sent to the audience:
 *   - new rows                         → added      ("Added <time>")
 *   - same number already added before → not resent ("Duplicate: already added")
 *   - no usable phone                  → skipped    ("Skipped: no valid phone")
 *   - Status set to "Invalid"          → skipped    ("Skipped: marked Invalid")
 * Errors are written into the cell and retried on the next run.
 */
function syncMetaAudience() {
  var settings = metaSettings_();

  // Same lock as doPost, so a row being written is never half-read.
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return { busy: true };

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEAD_TAB);
    if (!sheet || sheet.getLastRow() < 2) return { added: 0, failed: 0, skipped: 0 };

    ensureHeaders_(sheet, TABS.lead); // adds the "Meta Audience" column to older tabs
    var headers = headers_(sheet);
    var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
    var nameIdx = headers.indexOf('Name');
    var phoneIdx = headers.indexOf('Phone');
    var statusIdx = headers.indexOf('Status');
    var col = headers.indexOf(META_COLUMN);

    var rows = values.map(function (row) {
      return {
        state: String(row[col]).trim(),
        status: statusIdx === -1 ? '' : String(row[statusIdx]).trim(),
        user: metaUser_(row[nameIdx], row[phoneIdx])
      };
    });

    // Numbers already in the audience (from earlier runs), so repeat enquiries aren't re-sent.
    var sentPhones = {};
    rows.forEach(function (r) {
      if (r.user && r.state.indexOf('Added') === 0) sentPhones[r.user[0]] = true;
    });

    var column = values.map(function (row) { return [row[col]]; });
    var toAdd = [], skipped = 0;

    rows.forEach(function (r, i) {
      var notSentYet = !r.state || r.state.indexOf('Error adding') === 0;
      if (!notSentYet) return;
      if (r.status === 'Invalid') {
        column[i][0] = 'Skipped: marked Invalid';
        skipped++;
        return;
      }
      if (!r.user) {
        column[i][0] = 'Skipped: no valid phone';
        skipped++;
        return;
      }
      if (sentPhones[r.user[0]]) {
        column[i][0] = 'Duplicate: already added';
        return;
      }
      sentPhones[r.user[0]] = true;
      toAdd.push({ i: i, user: r.user });
    });

    var added = sendBatches_(settings, toAdd, column, 'Added', 'Error adding');

    // One write for the whole column; doPost is locked out, so the rows haven't moved.
    sheet.getRange(2, col + 1, column.length, 1).setNumberFormat('@').setValues(column);

    return { added: added.ok, failed: added.failed, skipped: skipped };
  } finally {
    lock.releaseLock();
  }
}

function metaSettings_() {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('META_ACCESS_TOKEN');
  var audienceId = props.getProperty('META_AUDIENCE_ID');
  if (!token) throw new Error('Set the META_ACCESS_TOKEN script property first');
  if (!audienceId) throw new Error('Set the META_AUDIENCE_ID script property first');
  return { token: token, audienceId: audienceId };
}

function sendBatches_(settings, items, column, okLabel, errLabel) {
  var ok = 0, failed = 0;
  for (var start = 0; start < items.length; start += META_BATCH_SIZE) {
    var batch = items.slice(start, start + META_BATCH_SIZE);
    var label;
    try {
      var res = addAudienceUsers_(settings, batch.map(function (p) { return p.user; }));
      label = okLabel + ' ' + istNow_();
      ok += batch.length - (res.num_invalid_entries || 0);
    } catch (err) {
      label = errLabel + ': ' + String(err.message || err).slice(0, 200);
      failed += batch.length;
      Logger.log(errLabel + ': ' + err);
    }
    batch.forEach(function (p) { column[p.i][0] = label; });
  }
  return { ok: ok, failed: failed };
}

/** [PHONE, FN, LN] hashed per Meta's normalisation rules, or null without a usable number. */
function metaUser_(name, phone) {
  var digits = String(phone || '').replace(/\D/g, '').replace(/^0+/, '');
  if (digits.length === 10) digits = '91' + digits; // sheet stores 10-digit Indian numbers
  if (digits.length < 11 || digits.length > 15) return null;

  // Meta wants names lowercase with no punctuation ("Dr. O'Neil" → "dr", "oneil").
  var parts = String(name || '').trim().toLowerCase().split(/\s+/).map(function (p) {
    return p.replace(/[.,'"`()\-_]/g, '');
  }).filter(Boolean);
  var fn = parts[0] || '';
  var ln = parts.length > 1 ? parts[parts.length - 1] : '';

  return [sha256_(digits), fn ? sha256_(fn) : '', ln ? sha256_(ln) : ''];
}

/** POST /{audience_id}/users adds users to the audience. */
function addAudienceUsers_(settings, users) {
  var url = 'https://graph.facebook.com/' + META_GRAPH_VERSION + '/' +
    encodeURIComponent(settings.audienceId) + '/users';
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    payload: {
      access_token: settings.token,
      payload: JSON.stringify({ schema: ['PHONE', 'FN', 'LN'], data: users })
    },
    muteHttpExceptions: true
  });

  var json = {};
  try { json = JSON.parse(res.getContentText()); } catch (ignore) {}
  if (res.getResponseCode() !== 200 || json.error) {
    throw new Error((json.error && json.error.message) || ('Meta HTTP ' + res.getResponseCode()));
  }
  return json; // { audience_id, num_received, num_invalid_entries, ... }
}

function sha256_(value) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

function istNow_() {
  return Utilities.formatDate(new Date(), 'Asia/Kolkata', 'd MMM yyyy, h:mm a');
}

function metaSummary_(result) {
  if (result.busy) return 'Sheet is busy - try again in a moment.';
  return result.added + ' added' +
    (result.failed ? ', ' + result.failed + ' failed' : '') +
    (result.skipped ? ', ' + result.skipped + ' skipped' : '');
}
