<!DOCTYPE html>
<html>
<head>
  <title>Sandbox</title>

  {{! @venus-css includes !}}
  {{#css}}
  <style>
    {{{.}}}
  </style>
  {{/css}}
</head>
<body>
  <div id="venus-html-fixtures">
    {{! @venus-html includes !}}
    {{#html}}
    {{{.}}}
    {{/html}}
  </div>

  {{! @venus-script includes !}}
  {{#script}}
  <script>
    {{{.}}}
  </script>
  {{/script}}

  {{! @venus-code includes !}}
  {{#code}}
  <script>
    {{{.}}}
  </script>
  {{/code}}

  {{! test source !}}
  <script>
    {{{test}}}
  </script>

</body>
</html>
