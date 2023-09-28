module.exports = function showdownMermaid() {
  let mermaidBlocks = []
  return [
    {
      type: 'lang',
      regex: ('(?:^|\\n)``` ?mermaid(.*)\\n([\\s\\S]*?)\\n```'),
      replace: function (s, match) {
        let thing = s.match('(?:^|\\n)``` ?mermaid(.*)\\n([\\s\\S]*?)\\n```');
        let thing_group = thing.length - 1;
        mermaidBlocks.push(thing[thing_group]);
        let n = mermaidBlocks.length - 1;
        return '%PLACEHOLDER' + n + '%';
      }
    },
    {
      type: 'output',
      filter: function (text) {
        let counter = mermaidBlocks.length
        if (counter > 0) {
          for (let i = 0; i < counter; ++i) {
            let pat = '%PLACEHOLDER' + i + '%';
            text = text.replace(new RegExp(pat, 'gi'), '<pre><code class="language-mermaid"><div class="mermaid" id="mermaid_' + i + '">' + mermaidBlocks[i] + '</div></code></pre>');
          }
          //reset array
          mermaidBlocks = [];
          console.log(text)
          return `${text} 
<script type="module">
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
</script>`;
        } else { return text }
      }

    }


  ];
};
