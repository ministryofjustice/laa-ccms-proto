(function (url) {
  var div = document.createElement('div');
  div.style.borderBottom = '1px solid #bfc1c3';
  div.style.padding = '10px';
  div.style.marginBottom = '10px';
  div.innerHTML = '<p><strong style="color:white;background-color:#f47738;padding:2px 5px;text-transform:uppercase;margin-right:8px;display:inline-block;">BETA</strong><span>This is a new service – your <a href="' + url + '">feedback</a> will help us to improve it.</span></p>';
  document.body.insertBefore(div, document.body.firstChild);
}('http://google.com/'));
