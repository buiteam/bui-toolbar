var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  Toolbar = require('../index'),
  Bar = Toolbar.Bar;

$('<div id="bar"></div>').appendTo('body');

var bar = new Bar({
    render : '#bar',
    elTagName : 'ul',
    children : [
      {
        xclass:'bar-item-button',
        elTagName : 'li',
        text:'测试1'
      },
      {
        xclass:'bar-item-button',
        elTagName : 'li',
        text:'测试2'
      },
      {
        xclass:'bar-item',
        elTagName : 'li',
        content : '<span class="label">Default</span>'
      },
      {
        id :'link1',
        xclass:'bar-item',
        elTagName : 'li',
        content : '<a href="http://www.taobao.com">sssss</a>',
        listeners : {
          'click':function(event){
            //event.halt();
            log('link1');
          }
        }
      },{
        id : 'btn3',
        xclass:'bar-item-button',
        elTagName : 'li',
        text : '测试3',
        listeners : {
          'click':function(event){
            log('button3');
          }
        }
      },{xclass:'bar-item-separator',elTagName : 'li'},{
        id : 'input',
        elTagName : 'li',
        xclass : 'bar-item',
        content : '<input class="span2" type="text"/>',
        listeners : {
          'change':function(event){
            log(event.target.value);
          }
        }
      }/**/
    ]
  });
bar.render();

function log(text){
  $('#log').text(text);
}

function getLog(){
  return $('#log').text();
}

var barEl = $('#bar').find('.bui-bar'),
  items = barEl.children();
describe("测试Bar以及BarItem的生成", function () {
  
  it('测试bar生成',function(){
    expect(barEl).not.to.be(null);
    expect(items.length).to.be(bar.get('children').length);
  });

  /*it('测试BarItem生成,测试Kissy的Button的子元素',function(){
    var btn1 = $(items[0]),
      btn2 = $(items[1]);
    expect(btn1).not.to.be(null);
    expect(btn2).not.to.be(undefined);
    expect(btn1.hasClass('bui-button')).to.be.ok();
    expect(btn2.hasClass('bui-button')).to.be.ok();
  });*/
  it('测试BarItem生成,测试xtype 为 separator 的子元素',function(){
    var separator = $(items[5]);
    expect(separator).not.to.be(null);
    expect(separator.hasClass('bui-bar-item-separator')).to.be.ok();
  });
  it('测试BarItem生成,测试xtype 为"button"的子元素',function(){
    var btn4 = $(items[4]);
    expect(btn4).not.to.be(null);
    expect(btn4.hasClass('bui-bar-item-button')).to.be.ok();
  });
  it('测试BarItem生成,生成文本框作为子元素',function(){
    var inputItem = $(items[6]);
    expect(inputItem).not.to.be(null);
    expect(inputItem.hasClass('bui-bar-item')).to.be.ok();
    expect(inputItem.children('input').length).not.to.be(0);
  });
  it('测试BarItem生成,生成链接作为子元素',function(){
    var inputItem = $(items[3]);
    expect(inputItem).not.to.be(null);
    expect(inputItem.hasClass('bui-bar-item')).to.be.ok();
    expect(inputItem.children('a').length).not.to.be(0);
  });
});

describe("测试BarItem的自定义事件", function () {
  it('测试按钮点击',function(){
    var btn = bar.getItem('btn3');
    expect(btn).not.to.be(null);
    //jasmine.simulate(btn.get('el')[0],'click');
    btn.fire('click');
    expect(getLog()).to.be('button3');
  });
  it('测试链接点击',function(){
    var linkItem = bar.getItem('link1');
    expect(linkItem).not.to.be(null);
    linkItem.fire('click');
    //jasmine.simulate(linkItem.get('el')[0],'click');
    expect(getLog()).to.be('link1');
  });/**/
});

describe("测试BarItem的内容改变", function () {
  
  it('测试改变链接内容',function(){
    var linkItem = bar.getItem('link1'),
      html = '<a href="http://taobao.com">safas</a>';

    linkItem.set('content',html);
    expect(linkItem.get('el').text().toLowerCase()).to.be('safas');
  });
  it('测试链接内容改变后的事件',function(){
    var linkItem = bar.getItem('link1');
    // jasmine.simulate(linkItem.get('el')[0],'click');
    linkItem.get('el').trigger('click')
    expect(getLog()).to.be('link1');
  });
  it('测试按钮设置不可用',function(){
    
  });
});/**/
