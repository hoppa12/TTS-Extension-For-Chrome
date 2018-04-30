String.prototype.splitTTSString = function(maxLength) {
    let retArr = [];
    let str = "";
    let count = 0;
    for (let x = 0; x < this.length; x++) {
      str += this[x];
  
      if (count >= maxLength) {
        if (!/\w/.test(this[x])) {
          retArr.push(str);
          str = "";
          count = 0;
        }
      } else {
        count++;
      }
    }
    if (str !== "") {
      retArr.push(str);
    }
    return retArr;
  };
  
  const textNodesUnder = (el, mouseY) => {
    const filter = {
      acceptNode: function(node) {
        if (node.parentNode.nodeName == "SCRIPT") return NodeFilter.FILTER_REJECT;
  
        if (node.parentNode.nodeName == "LINK") return NodeFilter.FILTER_REJECT;
  
        if (node.parentNode.getBoundingClientRect().y + 10 < mouseY)
          return NodeFilter.FILTER_REJECT;
  
        if (
          node.parentNode.nodeName == "A" &&
          node.parentNode.textContent.trim() === node.parentNode.href
        ) {
          return NodeFilter.FILTER_REJECT;
        }
  
        return NodeFilter.FILTER_ACCEPT;
      }
    };
    var n,
      a = [],
      walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, filter, false);
    while ((n = walk.nextNode())) a.push(n);
    return a;
  };
  
  const readOutLoud = ev => {
    if (!isMobileBrowser()) {
      return;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
  
      return;
    }
  
    if (/youtube.com\/watch\?/.test(window.location.href)) {
      if (document.querySelector(".customOverlay")) {
        document.querySelector(".customOverlay").parentElement.remove();
  
        return;
      }
  
      const hTarget = document.querySelector(".koya-partial");
      if (ev.target === hTarget) {
        let newDiv = document.createElement("div");
        newDiv.innerHTML = `<div style="z-index:9999999999!important;top:0!important;left:0!important;height:6000px;width:100vw;background-color:white;position:absolute!important" class="customOverlay"></div>`;
        document.body.appendChild(newDiv);
  
        return;
      }
    }
  
    const mouseY = ev.clientY;
  
    let textNodes = textNodesUnder(document.body, mouseY)
      .map(item => item.wholeText)
      .filter(item => /\w/.test(item))
  
      .reduce((prev, curr) => prev + curr)
  
      .splitTTSString(2000)
      .map(item => {
        // stop TTS saying "dot"
        //example "end sentence.Start Sentence"
  
        let match = item.match(/\.[A-Z]/);
        while (match !== null) {
          item =
            item.substring(0, match.index + 1) +
            " " +
            match[0][1] +
            item.substring(match.index + 2, item.length);
          match = item.match(/\.[A-Z]/);
        }
        return item;
      });
  
    let stopVoices = window.speechSynthesis;
    stopVoices.cancel();
    for (let v of textNodes) {
      speechSynthesis.speak((u = new SpeechSynthesisUtterance(v)), u);
    }
  
    return;
  };
  
  const isMobileBrowser = () => {
    return (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    );
  };
  document.body.addEventListener("dblclick", readOutLoud);
  
