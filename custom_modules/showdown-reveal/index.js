module.exports = function showdownReveal() {
  
  return [
    
    {
      type: 'output',
      filter: function (text) {
        let flag = text.search(/\*\*\* *?\n*?(SLIDES) *?\n*?\*\*\*/);
        if (flag!=-1) {
          let i = 0
          while (text.search(/\-\-\-/g)!=-1) {
            console.log(text.search(/\-\-\-/g))
              i++
              text = text.replace(/\-\-\-/g, ()=>i%1===1?'<section>':'</section>')
            }
          console.log(text)
          final_text = `
          <html lang="en">
          <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><title>reveal.js</title><link rel="stylesheet" href="../reveal/dist/reset.css"><link rel="stylesheet" href="../reveal/dist/reveal.css"><link rel="stylesheet" href="../reveal/dist/theme/nul.css"><link rel="stylesheet" href="../reveal/plugin/highlight/monokai.css"></head>
            <body><div class="reveal"><div class="slides">
            ${text}
          </div>
          </div>
          <script src="../reveal/dist/reveal.js"></script>
          <script src="../reveal/plugin/notes/notes.js"></script>
          <script src="../reveal/plugin/markdown/markdown.js"></script>
          <script src="../reveal/plugin/highlight/highlight.js"></script>
          <script src="../reveal/plugin/search/search.js"></script>
          <script src="../reveal/plugin/math/math.js"></script>
          <script src="../reveal/plugin/zoom/zoom.js"></script>
          <script>
            Reveal.initialize({
              hash: true,
              plugins: [ RevealMarkdown, RevealHighlight, RevealNotes, RevealSearch, RevealMath, RevealZoom ]
            });
          </script>
        </body>
      </html>`;
      return final_text
          }
          //reset array
      else {
        return text
      }

    }
  }

  ]
};
