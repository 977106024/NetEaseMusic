$(function(){

  let id = location.search.match(/\bid=([^&]*)/)[1]   //从问号 (?) 开始的 URL（查询部分）
  //向后台获取数据
  // $.get('/songs.json').then(function(response){
  var query = new AV.Query('song');          //改成向数据库获取数据
    query.get(id).then(function(results){   //根据地址栏匹配的id来查询
      let songs = results.attributes
      // let song = songs.filter(i=>i.id === id)[0]
      let {coverUrl,url,name,lyric} = songs
      cover(coverUrl)        //歌曲封面
      initPlayer(url)         //播放歌曲
      initText(name,lyric)    //歌名与歌词

    })
  // })

  function cover(coverUrl){
    let cover = `<img class="cover" src="${coverUrl}">`
    $('.disc').append(cover)
  }

  // 播放歌曲
  function initPlayer(url){
    let $audio = $('<audio>')    //创建标签
    $audio.attr('src',url)
    $audio.appendTo($('.page'))
    audioJs = $('audio')[0]     //转成原生对象
    audioJs.oncanplay = function(){  //页面加载后自动播放
      audioJs.play()          //媒体api 播放歌曲
      $('.disc-container').addClass('palying')   //添加旋转cd动画
    }
    $('.icon-pause').on('click',function(){
      audioJs.pause()       //媒体api 暂停歌曲
      $('.disc-container').removeClass('palying')
    })
    $('.icon-play').on('click',function(){    //点击播放按钮 开始播放
      audioJs.play()
      $('.disc-container').addClass('palying')
    })



    //歌词滚动
    setInterval(()=>{
      let seconds = audioJs.currentTime //歌曲播放进度
      console.log(seconds);
      let munites = ~~(seconds/60)
      let left = seconds - munites * 60
      let time = `${pad(munites)}:${pad(left)}` //转成分和秒
      let $lines = $('.lines > p')
      let $whichLine;
      for(let i = 0; i<$lines.length; i++){
        if($lines.eq(i+1).length !== 0 && $lines.eq(i).attr('data-time') < time && $lines.eq(i+1).attr('data-time') > time){
          $whichLine = $lines.eq(i)  //条件：大于上一句小于下一句，刚好在中间的歌词
          break;
        }
      }
      if($whichLine){
        $whichLine.addClass('active').prev().removeClass('active') //加上白色 上一句去除白色
        let top = $whichLine.offset().top   //歌词与屏幕顶端的距离
        let linesTop = $('.lines').offset().top  //歌词窗口与屏幕顶端的距离
        let delta = top - linesTop - $('.lyric').height()/3 //两者距离相减 除于3行歌词
        $('.lines').css('transform','translateY(-' + delta + 'px)')
                  // 计算歌词滚动的位置 加上css滚动动画
      }
    },500)//定时器察看歌词位置是否有变动
  }

  // 时间前面+0
  function pad(number){
    return number>=10 ? number + '' : '0' + number
  }

  // 歌词与标题
  function initText(name,lyric){
    $('.song-description>h1').text(name)
    parseLyric(lyric)
  }

  // 解析歌词
  function parseLyric(lyric){
    let array = lyric.split(/\\n/)// 匹配回车 字符串'\n' 正则/\\n/
    let regex = /^\[(.+)\](.+)/  // "[03:27.060]相遇乱世以外 危难中相爱"
    array = array.map(function(string){
      let matches = string.match(regex)
      if(matches){
        return {time:matches[1],words:matches[2]} //正则来匹配出时间[1],歌词[2]
      }
    })
    let $lyric = $('.lyric')
    array.map(function(object){ //把每一段歌词 生成p标签放入页面
      if(!object){return}
      let $p = $('<p></p>')
      $p.attr('data-time',object.time).text(object.words) //自定义属性 歌词时间放进去
      $p.appendTo($lyric.children('.lines'))
    })
  }
})
