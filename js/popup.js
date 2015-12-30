$(function(){

  var localStore = {};

  $('body').on('click', 'a', function(){
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  });

  $('body')
    .on('mouseover', 'a', function(){
      var url = $(this).attr('href');

      var setText = function() {
        $('#info-title').text(localStore[url].title);
        $('#info-message').text(localStore[url].message);
        $('#info-price').css('color', localStore[url].price === '¥630-' ? 'red' : 'aqua')
                        .text(localStore[url].price);
      };

      if (localStore[url]) {
        setText();
      } else {
        fetch(url).then(function(response) {
          return response.text();
        }).then(function(body) {
          var html = $.parseHTML(body);
          var $info = $(html).find('#naiyou');
          var $dt = $info.find('dt');
          var $dd = $info.find('dd');
          var _title = $dt.text();
          var _message = $dd.eq(0).text();
          var _price = $dd.eq(1).text();
          localStore[url] = {title: _title, message: _message, price: _price};
          setText();
        });
      }
      return false;
  });

  fetch('http://bento-shogun.jp/menu/week/week.html').then(function(response) {
    return response.text();
  }).then(function(body) {
    var html = $.parseHTML(body);

    $menus = $('<div>');
    $(html).find('.menu-inner').each(function(){
      var $menu = $(this).find('span, ul');
      $('.menuReserve', $menu).remove();
      $menus.append($menu);
    });

    var $week = $('#week');
    $week.html($menus.html());

    setTimeout(function(){
      var $today = $('span', $week).filter(function(){
        return new RegExp(new Date().getDate()).test($(this).text());
      });

      $('body').animate({
        scrollTop: $today.length && $today.offset().top
      }, {
        queue: false
      });
    }, 300)

  });
});
