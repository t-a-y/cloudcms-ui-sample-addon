

define(function(require, exports, module) {

  var UI = require("ui");

  return UI.registerDashlet("tay-project-dashboard", UI.AbstractDashlet.extend({
    setup: function () {
      this.get(this.index)
    },
    configureDefault: function () {
      this.base(),
        this.config({
          chrome: !1,
          columnHeaders: !1,
          columns: [{
            title: "Content test",
            key: "titleDescription"
          }],
          options: {
            filter: !1,
            paginate: !1,
            info: !1,
            sizing: !1,
            processing: !1,
            zeroRecords: "bla bla."
          },
          icon: !0,
          loader: "remote"
        })
    },
    entityTypes: function () {
      return {
        plural: "content items",
        singular: "content item"
      }
    },
    prepareModel: function (e, t, n) {
      n()
    },
    doRemoteQuery: function (e, t, n, i, r, a) {
      var s = this
        , l = s.observable("project").get();
      o.platform(function () {
        var e = this;
        o.dashletContent(s, e, l.getId(), !1, {}, {
          limit: 5,
          sort: {
            "timestamp.ms": -1
          }
        }, function (e) {
          a(e)
        })
      })
    },
    linkUri: function (e, t) {
      var n = e._isContainer
        , i = "#/projects/" + e._projectId + "/documents/" + e._doc;
      return n && (i += "/browse"),
        i
    },
    iconUri: function (e, t, n) {
      var i = e._repositoryId
        , r = e._branchId
        , a = e._doc
        , s = e._isContainer
        , l = e._type
        , c = {
        size: 48
      };
      return o.iconUri(i, r, a, s, l, c)
    },
    iconClass: function (e) {
      var t = null;
      return t = e._isContainer ? "folder-icon-64" : "document-icon-64"
    },
    columnValue: function (e, t, n) {
      var i = this
        , r = this.base(e, t);
      if ("titleDescription" == t.key) {
        var s = e.title;
        s || (s = e._doc);
        var l = i.linkUri(e, n);
        if (r = "<h2 class='list-row-info title'>",
            r += "<a href='" + l + "'>",
            r += o.filterXss(s),
            r += "</a>",
            r += "</h2>",
          e.description && (r += "<p class='list-row-info description'>" + o.filterXss(e.description) + "</p>"),
            e._system.created_on) {
          var c = new Date(e._system.created_on.ms);
          r += "<p class='list-row-info created'>Created " + a.relativeDate(c),
          e._system.created_by && (r += " by " + e._system.created_by),
            r += "</p>"
        } else if (e._system.modified_on) {
          var c = new Date(e._system.modified_on.ms);
          r += "<p class='list-row-info modified'>Modified " + a.relativeDate(c),
          e._system.modified_by && (r += " by " + e._system.modified_by),
            r += "</p>"
        }
      }
      return r
    },
    afterSwap: function (e, t, n, i) {
      this.base(e, t, n, function () {
        i()
      })
    }
  }));
});
