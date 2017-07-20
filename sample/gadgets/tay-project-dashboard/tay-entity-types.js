define(function(require, exports, module) {
  var i = require("text!./content-types.html");
  require("css!./content-types.css");
  var o = require("ratchet/web")
    , r = require("oneteam")
    , a = require("ratchet/dynamic/empty");
  return o.GadgetRegistry.register("tay-content-types", a.extend({
    TEMPLATE: i,
    configureDefault: function () {
      this.base()
    },
    setup: function () {
      this.get("/projects/{projectId}/tay/content", this.index),
        this.get("/projects/{projectId}/tay/content/{qname}", this.index)
    },
    prepareModel: function (e, t, n) {
      var i = this;
      this.base(e, t, function () {
        var e = i.observable("project").get();
        t.projectId = e.getId(),
          t.types = [],
          r.projectContentTypes(i, function (r, a) {
            for (var s = [], l = 0; l < r.length; l++) {
              var c = r[l];
              c.definition.systemBootstrapped || ("undefined" != typeof c.capabilities ? c.capabilities.indexOf("read") > -1 ? s.push(c) : console.log("Filtering off: " + c + " because lacks READ capability") : s.push(c))
            }
            r = s,
            e.contentTypeSortByTitle && r.sort(function (e, t) {
              return e.title.localeCompare(t.title)
            }),
            e.contentTypesSortField && r.sort(function (t, n) {
              var i = o.resolveDotNotation(t.definition, e.contentTypesSortField) || ""
                , r = o.resolveDotNotation(n.definition, e.contentTypesSortField) || "";
              return i.localeCompare(r)
            });
            for (var d = 0; d < r.length; d++)
              r[d].displayTitle = r[d].title,
              e.contentTypesDisplayField && (r[d].displayTitle = o.resolveDotNotation(r[d].definition, e.contentTypesDisplayField) || r[d].title);
            var u = t.tokens.qname;
            if (u) {
              for (var h = null, l = 0; l < r.length; l++)
                if (r[l].qname === u) {
                  h = r[l];
                  break
                }
              h && i.observable("selected-content-type").set(h)
            }
            var p = i.observable("selected-content-type").get();
            !p && r && r.length > 0 && i.observable("selected-content-type").set(r[0]);
            var f = null
              , m = i.observable("selected-content-type").get();
            m && (f = m.definition.getQName());
            for (var l = 0; l < r.length; l++)
              m || (m = r[l],
                f = r[l].qname),
              f == r[l].qname && (r[l].current = !0),
                t.types = r;
            n()
          })
      })
    },
    afterSwap: function (e, t, n, i) {
      var o = this;
      this.base(e, t, n, function () {
        $(e).find("li.header").first().addClass("header-first");
        o.observable("project").get();
        $(e).find(".content-type-link").off().click(function (e) {
          e.preventDefault();
          var t = $(this).attr("data-dispatch-uri");
          o.topRatchet().run(t)
        }),
          i()
      })
    }
  }))
})
