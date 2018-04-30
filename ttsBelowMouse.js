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
      console.log(false);
      return;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
  
      return;
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
  
  // Polyfill for Double Click which doesnt work well
  // On Chrome in Mobile View
  ( () => {
    if (isMobileBrowser()) {
      var el;
      var count = 0;
      var counter;
      var clickCount = 0;
  
      const init =() => {
        document.body.addEventListener("click", onDblClick, false);
      }
  
      const onDblClick = e => {
        clickCount++;
        if (clickCount === 1) {
          singleClickTimer = setTimeout( () => {
            clickCount = 0;
          }, 400);
        } else if (clickCount === 2) {
          count++;
          clearTimeout(singleClickTimer);
          clickCount = 0;
          readOutLoud(e);
        }
      }
      init();
    }
  })();
  
