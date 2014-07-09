var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  Data = require('bui-data'),
  Toolbar = require('../index'),
  NumerPBar = Toolbar.NumberPagingBar,
  Store = Data.Store;


describe("测试初始化", function(){
	$('<div id="numpbar"></div>').appendTo('body');

  var bar = new NumerPBar({
    render : '#numpbar',
    elCls : 'pagination'
  });
  bar.render();

  var barEl = $('#numpbar .bui-bar-item');

  it('测试pagingbar生成',function(){
    expect(barEl).not.to.be(null);
    expect(barEl.length).to.be(bar.get('children').length);
  });

  it('测试生成按钮：上一页和下一页',function(){
    var firstBtn = bar.getItem('first'),
      prevBtn = bar.getItem('prev'),
      nextBtn = bar.getItem('next');

    //未生成首页按钮
    expect(firstBtn).to.be(null);
    expect(prevBtn).not.to.be(null);
    expect(nextBtn).not.to.be(null);

    expect(prevBtn.get('el')).to.be.ok();
    expect(nextBtn.get('el')).to.be.ok();
  });    
});

describe("测试加载数据后，当页面少于6页时", function(){
	$('<div id="numpbar1"></div>').appendTo('body');
  var store = new Store({
    url:'data/number40.json',
    pageSize : 10
  });
  var bar1 = new NumerPBar({
    render : '#numpbar1',
    elCls : 'pagination',
    store: store
  });
  bar1.render();

  var barItem = bar1.get('el');
  it('测试生成的页码是否正确',function(done){
    var count  = bar1.get('totalPage');
    store.load();
    setTimeout(function(){
      var count  = bar1.get('totalPage'),
        curPage = bar1.get('curPage');
      expect($('.bui-button-number',barItem).length).to.be(count);
      expect($('.active',barItem).text()).to.be(curPage.toString());
      done();
    }, 200);      
  });

  it('跳转到首页,选中数字按钮 “1”,按钮有选中状态',function(done){
    bar1.jumpToPage(1);
    setTimeout(function(){
      var curPageObj = $('.bui-button-number',barItem)[0];
      expect($(curPageObj).hasClass('active')).to.be(true);
      expect($('.active',barItem).text()).to.be('1');
      done();
    }, 200);      
  });

  it('跳转到末页,选中最后一个按钮',function(done){
    var lastPage = bar1.get('totalPage');
    bar1.jumpToPage(lastPage);
    setTimeout(function(){
      expect($('.active',barItem).text()).to.be(lastPage.toString());
      done();
    }, 200);      
  });

  it('跳转到中间页',function(done){
    var lastPage = bar1.get('totalPage'),
      middle = parseInt((lastPage + 1) / 2);
    bar1.jumpToPage(middle);
    setTimeout(function(){
      expect($('.active',barItem).text()).to.be(middle.toString());
      done();
    }, 200);
  });    
});

describe("测试加载数据后，当页面大于6页时",function(){
	$('<div id="numpbar2"></div>').appendTo('body');
  var store = new Store({
      url:'data/number40.json',
      pageSize : 4
    }),
  bar1 = new NumerPBar({
    render : '#numpbar2',
    elCls : 'pagination',
    store : store
  });
  bar1.render();

  var barItem = bar1.get('el');
  var limitCount = bar1.get('maxLimitCount');
  it('测试生成的页码是否正确',function(done){
    var count  = bar1.get('totalPage');
    store.load();
    setTimeout(function(){
      var count  = bar1.get('totalPage'),
        curPage = bar1.get('curPage');

      expect($('.bui-button-number',barItem).length).not.to.be(count);
      expect($('.active',barItem).text()).to.be(curPage.toString()); 
      done(); 
    }, 200);      
  });

  it('跳转到中间页',function(done){
    var lastPage = bar1.get('totalPage'),
      middle = parseInt((lastPage + 1) / 2);
    bar1.jumpToPage(middle);
    setTimeout(function(){
      expect($('.active',barItem).text()).to.be(middle.toString());
      done();
    }, 200);
  });

  it('跳到第九页',function(done){
    bar1.jumpToPage(9);
    setTimeout(function(){
      var curPage = bar1.get('curPage');
      expect($('.active',barItem).text()).to.be(curPage.toString());
      done();
    }, 200);
  });  

});

describe('测试按钮事件',function(){
	$('<div id="numpbar3"></div>').appendTo('body');
  var store = new Store({
      url:'data/number40.json',
      pageSize : 1
    }),
  bar1 = new NumerPBar({
    render : '#numpbar3',
    elCls : 'pagination',
    store : store
  });
  bar1.render();

  var barItem = bar1.get('el');
  it('测试点击上一页',function(done){
    var prevBtn = bar1.getItem('prev');

    expect(prevBtn).not.to.be(null);

    //跳转到第11页
    store.load({start:10});

    setTimeout(function(){
      var curPage = bar1.get('curPage');
      prevBtn.fire('click');
      setTimeout(function(){        
        expect(bar1.get('curPage')).to.be(curPage - 1);
        done();
      }, 200);        
    }, 200);

  });

  it('测试点击下一页',function(done){
    var nextBtn = bar1.getItem('next');

    expect(nextBtn).not.to.be(null);

    var curPage = bar1.get('curPage');

    nextBtn.fire('click');
    setTimeout(function(){          
      expect(bar1.get('curPage')).to.be(curPage + 1);
      done();
    }, 200);        
  });

  it('测试当前页数据刷新',function(done){
    var curPage = bar1.get('curPage'),
      item = bar1.getItem(curPage);
    var callback = sinon.spy();
    store.on('load', callback)
    item.fire('click');

    setTimeout(function(){ 
      expect(callback.called).to.be(true);
      store.off('load', callback);
      done();
    }, 200);        
  });

});
