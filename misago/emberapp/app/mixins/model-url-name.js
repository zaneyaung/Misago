import Ember from 'ember';

var urlNameRe = new RegExp(/^([a-zA-Z0-9-]+)-(\d+)$/);

export default Ember.Mixin.create({
  usingUrlName: false,

  parseUrlName: function(urlName) {
    if (urlNameRe.test(urlName)) {
      var idPosition = urlName.lastIndexOf('-');
      return {
        slug: urlName.substr(0, idPosition),
        id: urlName.substr(idPosition + 1)
      };
    } else {
      return false;
    }
  },

  getParsedUrlNameOr404: function(urlName) {
    var parsedUrlName = this.parseUrlName(urlName);
    if (parsedUrlName) {
      return parsedUrlName;
    } else {
      this.throw404();
    }
  },

  afterModel: function(model, transition) {
    if (this.get('usingUrlName')) {
      var userUrlName = transition.params[transition.targetName].url_name;
      if (this.serialize(model) !== userUrlName) {
        return this.transitionTo(transition.targetName, model);
      }
    }
  },

  serialize: function(model, params) {
    if (this.get('usingUrlName')) {
      return { url_name: model.get('slug') + '-' + model.get('id') };
    } else {
      return this._super(model, params);
    }
  }
});
