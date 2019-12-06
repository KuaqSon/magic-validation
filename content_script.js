// you will see this log in console log of current tab in Chrome when the script is injected
console.log("content_script.js");

chrome.runtime.onMessage.addListener(function(cmd, sender, sendResponse) {
  console.log("chrome.runtime.onMessage: " + cmd);
  switch (cmd) {
    case "getHtml":
      // retrieve document HTML and send to popup.js
      sendResponse({
        title: document.title,
        url: window.location.href,
        html: document.documentElement.innerHTML
      });
      break;
    case "getHeadTitle":
      // retrieve title HTML and send to popup.js
      sendResponse(document.getElementsByTagName("title")[0].innerHTML);
      break;
    case "dumpText":
      console.log("dumpText");
      var text = dumpText();
      console.log(text);
      sendResponse(text);
      break;
    default:
      sendResponse(null);
  }
});

function dumpText() {
  console.log("dumpText -> function");
  var h2 = document.getElementsByTagName("h2");
  for (let htem of h2) {
    var htext = htem.outerText
      .trim()
      .replace(/\s+/g, "_")
      .toLowerCase();
    htem.className = htext;
  }

  const ele = GetElementsPerformanceCriteria();
  const skill = GetFoundationSkills();

  return ele + "\r\n----------------------\r\n" + skill;
}

function GetElementsPerformanceCriteria() {
  var eles = [];
  var elements_and_performance_criteria = document.querySelectorAll(
    ".elements_and_performance_criteria + .ait-table tr:not(:first-child) [class*=ait]"
  );
  for (let item of elements_and_performance_criteria) {
    if (item.children.length === 0 && item.tagName.toLowerCase() === "p") {
      eles.push(item.outerText);
    }

    if (
      item.children.length > 0 &&
      item.children[0].tagName.toLowerCase() === "span"
    ) {
      eles.push(item.outerText);
    }
  }

  eles = ["ELEMENTS AND PERFORMANCE CRITERIA"].concat(eles);
  return eles.join("\r\n");
}

function GetFoundationSkills() {
  var skills = [];
  var foundation_skills = document.querySelector(".foundation_skills");
  var next = foundation_skills.nextElementSibling;
  while (next && next.nodeType === 1 && next.tagName.toLowerCase() !== "h2") {
    if (
      next.tagName.toLowerCase() === "p" &&
      next.className.toLowerCase().indexOf("ait") > 0
    ) {
      skills.push(next.outerText);
    } else if (
      next.tagName.toLowerCase() === "table" &&
      next.className.toLowerCase() === "ait-table"
    ) {
      skills = [];
      var table = next.querySelectorAll("tr:not(:first-child) [class*=ait]");
      for (let item of table) {
        if (item.children.length === 0 && item.tagName.toLowerCase() === "p") {
          skills.push(item.outerText);
        }

        if (
          item.children.length > 0 &&
          (item.children[0].tagName.toLowerCase() === "span" ||
            item.tagName.toLowerCase() === "ul")
        ) {
          skills.push(item.outerText);
        }
      }
    }

    next = next.nextElementSibling;
  }
  skills = ["FOUNDATION SKILLS"].concat(skills);
  return skills.join("\r\n");
}

function getOtherText() {
  var texts = [];
  // var list = document.getElementsByClassName("ait4");
  var list = document.querySelectorAll("[class*=ait]");
  for (let item of list) {
    texts.push(item.outerText);
  }

  return texts.join("\r\n");
}
