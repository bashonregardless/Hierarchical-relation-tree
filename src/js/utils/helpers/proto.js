export default {
  clone: function() {
	return Object.create(this);
  },
  create: function(opt) {
	var derived = this.clone();
	derived.init(opt);
	return derived;
  },
  init: function(opt) {
	Object.getOwnPropertyNames(opt).forEach(function(p) {
	  Object.defineProperty(this, p, Object.getOwnPropertyDescriptor(opt, p));
	}, this);
  }
};

