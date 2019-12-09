$(function() {
  $("#get_head_title").click(function() {
    checkCurrentTab();
  });
  $("#get_html").click(function() {
    getHtml();
  });

  $("#dump_text_training").click(function() {
    dumpTextTraining();
  });

  $("#dump_text_magic").click(function() {
    dumpTextMagic();
  });

  $(document).on("ready", function() {});
});

function dumpTextTraining() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, "dumpTextTraining", null, function(
      text
    ) {
      $("#text_content").html(text);
      copyToClip(text);
    });
  });
}

function dumpTextMagic() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, "dumpTextMagic", null, function(text) {
      $("#text_content").html(text);
      copyToClip(text);
    });
  });
}

function getHtml() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    var url = tabs[0].url;
    console.log("checkCurrentTab: " + url);
    $(".pg_url").text(url);

    // request content_script to retrieve title element innerHTML from current tab
    chrome.tabs.sendMessage(tabs[0].id, "getHtml", null, function(obj) {
      console.log("getHeadTitle.from content_script:", obj);
      log("from content_script:" + obj.url);
    });
  });
}

function checkCurrentTab() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    var url = tabs[0].url;
    console.log("checkCurrentTab: " + url);
    $(".pg_url").text(url);

    // request content_script to retrieve title element innerHTML from current tab
    chrome.tabs.sendMessage(tabs[0].id, "getHeadTitle", null, function(obj) {
      console.log("getHeadTitle.from content_script:", obj);
      log("from content_script:" + obj);
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  chrome.windows.getCurrent(function(currentWindow) {
    chrome.tabs.query({ active: true, windowId: currentWindow.id }, function(
      activeTabs
    ) {
      // inject content_script to current tab
      chrome.tabs.executeScript(activeTabs[0].id, {
        file: "content_script.js",
        allFrames: false
      });
    });
  });
});

function log(txt) {
  var h = $("#log").html();
  $("#log").html(h + "<br>" + txt);
}

function copyToClip(text) {
  var dummy = document.createElement("textarea");
  // to avoid breaking orgain page when copying more words
  // cant copy when adding below this code
  // dummy.style.display = 'none'
  document.body.appendChild(dummy);
  //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}
