$(function(){

  // icon-arrow显示隐藏
  $('.icon-arrow').on('click','svg',function(e){
    let $svg = $(e.currentTarget)
    let $intro = $('.play-intro .intro')
    $svg.css('display','none').siblings('.icon').css('display','inline-block')
    if($intro.hasClass('active')){
      $intro.removeClass('active')
    }else{
      $intro.addClass('active')
    }
  })
  // $('.icon-arrow-down').on('click',function(){
  //   $('.play-intro .intro').addClass('active')
  //   $('.icon-arrow-down').css('display','none')
  //   $('.icon-arrow-up').css('display','inline-block')
  // })
  // $('.icon-arrow-up').on('click',function(){
  //   $('.play-intro .intro').removeClass('active')
  //   $('.icon-arrow-down').css('display','inline-block')
  //   $('.icon-arrow-up').css('display','none')
  // })

  // 歌曲列表
  var lastestMusic = new AV.Query('song');
    lastestMusic.find().then(function(results){
    // $li.attr('data-downloaded','yes')  //自定义属性加上yes
    createHtml(results) //拼接html函数
  })
  function createHtml(results){
    // items.forEach((i)=>{
    for(var i=0;i<results.length;i++){
      let items = results[i].attributes
      let $li = $(`
        <li>
          <a class="play-circled" href="/song.html?id=${results[i].id}">
            <div class="listNumber">${i+1}</div>
            <div class="list-wrap">
              <h3>${items.name}</h3>
              <p>
                <svg class="sq">
                  <use xlink:href="#icon-sq"></use>
                </svg>
                ${items.singer}
              </p>
              <svg class="play">
                <use xlink:href="#icon-play-circled"></use>
              </svg>
            </div>
          </a>
        </li>
        `)
    $('.play-list ol.list').append($li)
    }
    // })
    // $('.tab2-loading').remove()
  }
})
