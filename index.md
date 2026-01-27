---
layout: none
permalink: /
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <!-- 0초 후에 해당 URL로 이동 -->
  <meta http-equiv="refresh" content="0; url={{ site.data.links.portfolio_pdf_view }}">
  <script type="text/javascript">
    // 자바스크립트로 한 번 더 보장
    window.location.href = "{{ site.data.links.portfolio_pdf_view }}";
  </script>
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="{{ site.data.links.portfolio_pdf_view }}">Document</a>...</p>
</body>
</html>
