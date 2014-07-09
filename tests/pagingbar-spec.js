var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  Data = require('bui-data'),
  Toolbar = require('../index'),
  PBar = Toolbar.PagingBar,
  Store = Data.Store;

$('<div id="log"></div>').appendTo('body');

describe('一般测试', function(){
  $('<div id="pbar"></div>').appendTo('body');
  var store = new Store({url:'data/number40.json'}),
    bar = new PBar({
    render : '#pbar',
    store : store
  });
  bar.render();

  function log(text){
    $('#log').text(text);
  }

  function getLog(){
    return $('#log').text();
  }
  var barEl = $('#pbar').find('.bui-pagingbar'),
    items = barEl.children();
  describe("测试PagingBar以及主要子元素的生成", function () {
    
    it('测试pagingbar生成',function(){
      expect(barEl[0]).to.be.ok();
      expect(items.length).to.be(bar.get('children').length);
    });

    it('测试生成按钮：首页、下一页、末页和下一页',function(){
      var firstBtn = bar.getItem('first'),
        prevBtn = bar.getItem('prev'),
        nextBtn = bar.getItem('next'),
        lastBtn = bar.getItem('last'),
        emptyBtn = bar.getItem('empty');
      expect(firstBtn).not.to.be(null);
      expect(prevBtn).not.to.be(null);
      expect(nextBtn).not.to.be(null);
      expect(lastBtn).not.to.be(null);
      expect(emptyBtn).to.be(null);

      expect($.contains(barEl[0],firstBtn.get('el')[0])).to.be.ok();
      expect($.contains(barEl[0],prevBtn.get('el')[0])).to.be.ok();
      expect($.contains(barEl[0],nextBtn.get('el')[0])).to.be.ok();
      expect($.contains(barEl[0],lastBtn.get('el')[0])).to.be.ok();

    });
    it('测试生成跳转按钮，跳转文本域',function(){
      var skipBtn = bar.getItem('skip');
      expect(skipBtn).not.to.be(null);
      expect($.contains(barEl[0],skipBtn.get('el')[0])).to.be.ok();
    });
    it('测试生成分页信息',function(){
      var totalPage = bar.getItem('totalPage'),
        curPage = bar.getItem('curPage');
      expect(totalPage).not.to.be(null);
      expect(curPage).not.to.be(null);

      expect($.contains(barEl[0],totalPage.get('el')[0])).to.be.ok();
      expect($.contains(barEl[0],curPage.get('el')[0])).to.be.ok();
    });
    
  });
  
  describe("测试分页栏按钮及输入框事件", function () {
    var  firstBtn = bar.getItem('first'),
      prevBtn = bar.getItem('prev'),
      nextBtn = bar.getItem('next'),
      lastBtn = bar.getItem('last');

    var callFunc = sinon.spy(),
      handler = function(){
        callFunc();
      };
    it('在第一页时，查看按钮状态，首页、前一页',function(done){
      store.load();

      setTimeout(function(){
        //首页、前一页按钮不可用
        expect(firstBtn.get('disabled')).to.be.ok();
        expect(prevBtn.get('disabled')).to.be.ok();
        callFunc.reset();
        firstBtn.get('el').on('click',handler);
        //模拟点击首页按钮
        // jasmine.simulate(firstBtn.get('el')[0],'click');
        firstBtn.get('el').trigger('click');
        setTimeout(function(){
          expect(bar.get('curPage')).to.be(1);
          done();
        }, 200);
      }, 200);
    });
    it('在第一页时，点击首页按钮、前一页',function(done){
      setTimeout(function(){
  
        //模拟点击首页按钮
        firstBtn.get('el').trigger('click');
        setTimeout(function(){
          expect(bar.get('curPage')).to.be(1);
          //模拟点击前一页按钮
          prevBtn.get('el').trigger('click');
          setTimeout(function(){
            expect(bar.get('curPage')).to.be(1);
            done();
          }, 200);
        }, 200);
      }, 200);
    });
    //在第一页时，首页、前一页按钮不可用，末页，下一页可用
    it('在第一页时，查看按钮状态，末页、下一页',function(done){
      bar.jumpToPage(1);
      setTimeout(function(){
        expect(nextBtn.get('disabled')).not.to.be.ok();
        expect(lastBtn.get('disabled')).not.to.be.ok();
        done();
      }, 200);

    });

    it('在第一页时，点击下一页',function(done){
      bar.jumpToPage(1);
      setTimeout(function(){
        //模拟点击下一页按钮
        //jasmine.simulate(nextBtn.get('el')[0],'click');
        nextBtn.fire('click');
        setTimeout(function(){
          expect(bar.get('curPage')).to.be(2);
          done();
        }, 200);

      }, 200);
    });

    it('在第一页时，点击末页',function(done){
      bar.jumpToPage(1);
      setTimeout(function(){
        //模拟点击末页按钮
        lastBtn.fire('click');
        setTimeout(function(){
          expect(bar.get('curPage')).to.be(bar.get('totalPage'));
          done();
        }, 200);    
      }, 200);
    });

    it('在第二页时，查看按钮状态，首页、前一页',function(done){
      bar.jumpToPage(2);
      setTimeout(function(){
        expect(firstBtn.get('disabled')).not.to.be.ok();
        expect(prevBtn.get('disabled')).not.to.be.ok();
        done();
      }, 200);
    });

    it('在第二页时，点击首页',function(done){
      bar.jumpToPage(2);
      setTimeout(function(){
        //模拟点击首页按钮
        firstBtn.fire('click');
        setTimeout(function(){
          expect(bar.get('curPage')).to.be(1);
          done();
        }, 200);  
        
      }, 200);
    });

    it('在第二页时，点击前一页',function(done){
      bar.jumpToPage(2);
      setTimeout(function(){
        //模拟点击前一页按钮
        prevBtn.fire('click');
        setTimeout(function(){
          expect(bar.get('curPage')).to.be(1);
          done();
        }, 200);    
      }, 200);
    });

    it('在第末页时，查看按钮状态，末页、下一页',function(done){
      var totalPage = bar.get('totalPage');
      bar.jumpToPage(totalPage);

      setTimeout(function(){
        expect(nextBtn.get('disabled')).to.be.ok();
        expect(lastBtn.get('disabled')).to.be.ok();
        done();
      }, 200);
    });

    it('在第末页时，末页、下一页',function(done){
      var totalPage = bar.get('totalPage');
      bar.jumpToPage(totalPage);
      setTimeout(function(){
        //模拟点击末页按钮
        lastBtn.fire('click');
        setTimeout(function(){
          expect(bar.get('curPage')).to.be(totalPage);
          //模拟点击下一页按钮
          nextBtn.fire('click');
          setTimeout(function(){
            expect(bar.get('curPage')).to.be(totalPage);
            done();
          }, 200);  
        }, 200);  
      }, 200);
    });
    it('点击跳转页面,跳到第一页',function(done){
      var textEl = barEl.find('.bui-pb-page'),
        skipBtn = bar.getItem('skip');
      textEl.val(1);
      skipBtn.fire('click');
      setTimeout(function(){
        expect(bar.get('curPage')).to.be(1);
        done();
      }, 200);

    });
    it('点击跳转页面,跳到第二页',function(done){
      var textEl = barEl.find('.bui-pb-page'),
        skipBtn = bar.getItem('skip');

      textEl.val(2);
      skipBtn.fire('click');
      setTimeout(function(){
        expect(bar.get('curPage')).to.be(2);
        done();
      }, 200);
    });
  });
  
  
});


describe('测试生成元素', function(){
  var store = new Store({url:'data/number40.json'}),
    items = ['first','prev','separator','totalPage','separator','refresh','separator','next','last'],
    bar = new PBar({
    render : '#pbar1',
      elCls : 'image-pbar',
      items : items,
      totalPageTpl : '{curPage}/{totalPage}',
      store : store
  });
  bar.render();

  describe('测试生成元素',function(){
    it('测试按钮生成',function(){
      expect(bar.getItem('first')).not.to.be(null);
    });
    it('测试文本生成',function(){
      expect(bar.getItem('totalPage')).not.to.be(null);
      expect(bar.getItem('curPage')).to.be(null);
    });
    it('测试生成项数目',function(){
      expect(bar.getItemCount()).to.be(items.length);
    });  
  });

  describe('测试加载',function(){
    it('加载内容，测试按钮可用',function(done){
      store.load();
      setTimeout(function(){
        expect(bar.getItem('first').get('disabled')).to.be(true);
        expect(bar.getItem('last').get('disabled')).not.to.be(true);
        done();
      }, 200);
    });

    it('测试显示的文本',function(){
      expect(bar.getItem('totalPage').get('el').text()).not.to.be('/');
    });
    it('测试生成项数目',function(){
      expect(bar.getItemCount()).to.be(items.length);
    });  
  });


  
});
