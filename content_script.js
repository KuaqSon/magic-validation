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

function markClass() {
  var h2 = document.getElementsByTagName("h2");
  for (let htem of h2) {
    var htext = htem.outerText
      .trim()
      .replace(/\s+/g, "_")
      .toLowerCase();
    htem.className = htext;
  }
  var table = document.getElementsByClassName("ait-table");
  for (let ttem of table) {
    var trs = ttem.querySelectorAll("tr");
    for (let trtem of trs) {
      var trtext = trtem.outerText
        .trim()
        .replace(/\s+/g, "_")
        .toLowerCase();
      if (trtext.length < 100) {
        trtem.className = trtext;
      }
    }
  }
}

function dumpText() {
  console.log("dumpText -> function");
  markClass();

  const ele = getElementsPerformanceCriteria();
  const skill = getFoundationSkills();
  const performance_evidence = getPerformanceEvidence();
  const knowledge_evidence = getKnowledgeEvidence();
  const assessment_conditions = getAssessmentConditions();
  return [
    ele,
    skill,
    performance_evidence,
    knowledge_evidence,
    assessment_conditions
  ].join("\r\n----------------------\r\n");
}

function getElementsPerformanceCriteria() {
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

function getFoundationSkills() {
  var skills = [];
  var foundation_skills = document.querySelector(".foundation_skills");
  if (!foundation_skills) return "";
  var next = foundation_skills.nextElementSibling;
  while (
    next &&
    next.nodeType === 1 &&
    next.className.toLowerCase().indexOf("ait") !== 1 &&
    next.tagName.toLowerCase() !== "h2"
  ) {
    if (next.tagName.toLowerCase() === "p") {
      skills.push(next.outerText);
    } else if (
      next.tagName.toLowerCase() === "table" &&
      next.className.toLowerCase().indexOf("ait-table") !== -1
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

function getPerformanceEvidence() {
  var pers = getContentLevelType(".performance_evidence");
  pers = ["PERFORMANCE EVIDENCE (or Required Skills)"].concat(pers);

  var required_skills = document.querySelector(".required_skills");
  if (required_skills) {
    var required_skills_text = required_skills.nextElementSibling;

    pers.push(required_skills_text.outerText);
  }

  return pers.join("\r\n");
}

function getKnowledgeEvidence() {
  var pers = getContentLevelType(".knowledge_evidence");
  pers = ["KNOWLEDGE EVIDENCE (or Required Knowledge)"].concat(pers);
  var required_knowledge = document.querySelector(".required_knowledge");
  if (required_knowledge) {
    var required_knowledge_text = required_knowledge.nextElementSibling;

    pers.push(required_knowledge_text.outerText);
  }
  return pers.join("\r\n");
}

function getAssessmentConditions() {
  var pers = getContentLevelType(".assessment_conditions");
  pers = ["ASSESSMENT CONDITIONS"].concat(pers);
  return pers.join("\r\n");
}

function getContentLevelType(selector) {
  var pers = [];
  var content = document.querySelector(selector);
  if (!content) return "";
  var next = content.nextElementSibling;
  var level = 0;
  var levelDash = "";
  while (
    next &&
    next.nodeType === 1 &&
    next.className.toLowerCase().indexOf("ait") !== -1 &&
    next.tagName.toLowerCase() !== "h2"
  ) {
    if (next.tagName.toLowerCase() === "p") {
      pers.push(next.outerText);
    } else if (next.tagName.toLowerCase() === "ul") {
      var ulLevel = Number(next.className.trim().replace("ait", ""));
      if (ulLevel > level) {
        level = ulLevel;
        levelDash = levelDash + "-";
      }

      if (ulLevel < level) {
        level = ulLevel;
        levelDash = levelDash.substring(1);
      }

      var lis = next.querySelectorAll("li");
      for (let item of lis) {
        pers.push(levelDash + item.outerText);
      }
    }

    next = next.nextElementSibling;
  }

  return pers;
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
