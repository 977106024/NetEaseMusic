$(function(){
  // $.get('/songs.json').then(function(response){//ajax
  //   console.log(response)
  //   let items = response
  //   items.forEach((i)=>{

  // 最新音乐 无序列表
  var lastestMusic = new AV.Query('song');//数据库
    lastestMusic.find().then(function(results){//获取所有数据 数据库api
      for(var i=0; i<results.length; i++){
        let lastestSong = results[i].attributes
        let $li = $(`
          <li>
            <a class="play-circled" href="/song.html?id=${results[i].id}">
              <h3>${lastestSong.name}</h3>
              <p>
                <svg class="sq">
                  <use xlink:href="#icon-sq"></use>
                </svg>
                ${lastestSong.singer}</p>
                <svg>
                  <use xlink:href="#icon-play-circled"></use>
                </svg>
            </a>
          </li>
        `)
        $('#lastestMusic').append($li);
      }
      $('.loading').remove()     //去除loading动画
    })

    //tab
    $('.siteNav').on('click','ol.tab-items>li',function(e){
      let $li = $(e.currentTarget)    //点击的dom
      let index = $li.index()
      $li.trigger('tabChang',index) //自定义事件
      $li.addClass('active').siblings().removeClass('active')  //自身加上css 兄弟去除css
      $('.tab-content > li').eq(index).addClass('active')      //控制tab下的页面显示隐藏
                                      .siblings().removeClass('active')
    })
    $('.siteNav').on('tabChang',function(e,index){ //监听自定义事件
      let $li = $('.tab-content > li').eq(index)
      if($li.attr('data-downloaded') === 'yes'){return} //页面已经加载过了 不要重复请求加载

      if(index === 1){
        // $.get('/songs.json').then((response)=>{
        var lastestMusic = new AV.Query('song');
          lastestMusic.find().then(function(results){
          $li.attr('data-downloaded','yes')  //自定义属性加上yes
          createHtml(results) //拼接html函数
        })
        // })

      }else if(index === 2){
        $.get('/songs.json').then((response)=>{
          $li.attr('data-downloaded','yes')
        })
      }
    })

    function pad(index){  //小于10的前面+0
      return index >= 10 ? index : '0' + index
    }

    //最热音乐 有序列表
    function createHtml(results){
      let index = 1    //歌曲前面的序号
      // items.forEach((i)=>{
      for(var i=0;i<results.length;i++){
        let items = results[i].attributes
        if(i <= 3){  //序号前三变红色
          $('.listNumber').addClass('hot-three')
        }
        let $li = $(`
          <li>
            <a class="play-circled" href="/song.html?id=${results[i].id}">
              <div class="listNumber">${pad(index)}</div>
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
      $('.tab-music2 ol#music-hot').append($li)
      index++
      }
      // })
      $('.tab2-loading').remove()
    }

    //歌曲搜索
    var timer = null
    $('input#search').on('input',function(e){//搜索框
      if(timer){window.clearTimeout(timer)} //砸闹钟
      timer = setTimeout(function () { //函数节流
      timer = null

      let $input = $(e.currentTarget)
      let value = $input.val().trim() //去除前后空格
      searchHint(value)
      searchClose()
      if(value === ''){return}

      var query1 = new AV.Query('song');
      query1.contains('name',value); // 字符串查询
      var query2 = new AV.Query('song');
      query2.contains('singer',value);
      var query = AV.Query.or(query1,query2)// or查询 歌名或者歌手

      query.find().then(function(results){
      $('#search-result').empty()   //移除所有内容
      if(results.length === 0){  //数据是空的 搜不到内容
        $('#search-result').html('没有结果...')
      }else{
        createMusic(results)// 创建歌曲li
        searchClose()
      }
    })
    }, 400)
  })

  function createMusic(results){
    for(var i=0; i<results.length; i++){
      let song = results[i].attributes
      let li =`
      <li data-id="${results[i].id}">
        <svg class="icon-search">
          <use xlink:href="#icon-search"></use>
        </svg>
        <a href="./song.html?id=${results[i].id}">${song.name} - ${song.singer}</a>
      </li>
        `
      $('#search-result').append(li)
    }
  }

  function searchHint(value){//搜索提示的显示隐藏
    $('.search-content').addClass('show')
    $('.search-content > span').text(value)
    $('.hot-search').addClass('hide') //热门搜索隐藏
    if(value.length === 0){
      $('.search-content').removeClass('show')
      $('.hot-search').removeClass('hide')
      $('#search-result').empty()
    }
  }

  function searchClose(){//搜索框x 的显示隐藏
    $('.icon-close-wrap').addClass('show')
    $('.icon-close-wrap').on('click',function(){//点击清空内容且隐藏
      $('#search').val('')
      $('.icon-close-wrap').removeClass('show')//x隐藏
      $('.search-content').removeClass('show')//搜素提示隐藏
      $('.hot-search').removeClass('hide') //热门搜索显示
      $('#search-result').empty()  //搜索内容清空
    })
  }

  $('.hot-search').on('click','li',function(e){
    let $hotLi = $(e.currentTarget)
    let text = $hotLi.text()

    var query1 = new AV.Query('song');
    query1.contains('name',text); // 字符串查询
    var query2 = new AV.Query('song');
    query2.contains('singer',text);
    var query = AV.Query.or(query1,query2)// or查询 歌名或者歌手

    query.find().then(function(results){
      createMusic(results)
      $('.hot-search').addClass('hide') //热门搜索隐藏
      $('input#search').val(text)
      searchClose()
    })
  })
})
