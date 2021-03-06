let template = Handlebars.compile([
  '<div class="basic tiny ui button mr_button dropdown">',
  '  <input name="selection" type="hidden" />',
  '  <div class="default text"></div>',
  '  <i class="dropdown icon"></i>',
  '  <div class="menu">',
  '  </div>',
  '</div>'
].join(''));

export default class {
  /**
   * A selector dropdown implemented with Semantic UI.
   */
  constructor(options) {
    jQuery.extend(this, {
      appendTo: null,
      changeCallback: null
    }, options);

    this.init();
  }
  
  init() {
    var _this = this;
    this.element = jQuery(template());
    this.appendTo.append(this.element);
    this.element.dropdown({
      onChange: function(value, text) {
        if (typeof _this.changeCallback === 'function') {
          _this.changeCallback(value, text);
        }
      },
      action: function(text, value) {
        _this.element.dropdown('set selected', value);
        _this.element.dropdown('hide');
      }
    });
  }
  
  setItems(itemsConfig) {
    var root = this.element.find('.menu');
    root.empty();
    this._setItems(itemsConfig, root);
  }
  
  _setItems(itemsConfig, parent) {
    var _this = this;
    jQuery.each(itemsConfig, function(index, value) {
      if (value.children.length > 0) {
        _this.addItem(value.label, value.value, parent);
        var menu = _this.addMenuItem(value.label, value.value, parent);
        _this._setItems(value.children, menu);
      } else {
        _this.addItem(value.label, value.value, parent);
      }
    });
  }
  
  addMenuItem(label, value, parent) {
    var item = jQuery('<div/>')
      .addClass('item')
      .attr('data-text', label)
      .attr('data-value', value)
      .text(label);
    var menu = jQuery('<div/>')
      .addClass('menu')
      .css('overflow', 'hidden');
    item.append(jQuery('<i class="dropdown icon"></i>'));
    item.append(menu)
    parent.append(item);
    return menu;
  }
  
  addItem(label, value, parent) {
    var item = jQuery('<div/>')
      .addClass('item')
      .attr('data-text', label)
      .attr('data-value', value)
      .text(label);
    parent = parent || this.element.find('.menu');
    parent.append(item);
  }
  
  empty() {
    this.element.find('.menu').empty();
  }
  
  val(value) {
    if (value === undefined) {
      return this.element.dropdown('get value');
    } else {
      this.element.dropdown('set selected', value);
    }
  }
  
  destroy() {
    this.element.remove();
  }
}
