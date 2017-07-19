/**
 * Created by p on 19/07/2017.
 */
define("app/gadgets/project/content/tay-content-types", ["require", "exports", "module", "text!./content-types.html", "css!./content-types.css", "ratchet/web", "oneteam", "ratchet/dynamic/empty"], function (require, t, n) {
  var i = require("text!./content-types.html");
  e("css!./content-types.css");
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
}),
  define("css!app/gadgets/project/content/content-instances", [], function () {
  })
  define("app/gadgets/project/content/tay-content-instances", ["require", "exports", "module", "css!./content-instances.css", "ratchet/web", "ratchet/dynamic/doclist", "oneteam"], function (e, t, n) {
    e("css!./content-instances.css");
    var i = e("ratchet/web")
      , o = e("ratchet/dynamic/doclist")
      , r = e("oneteam");
    i.Messages.using();
    return i.GadgetRegistry.register("tay-content-instances", o.extend({
      configureDefault: function () {
        this.base(),
          this.config({
            observables: {
              query: "content-instances-list_query",
              sort: "content-instances-list_sort",
              sortDirection: "content-instances-list_sortDirection",
              searchTerm: "content-instances-list_searchTerm",
              selectedItems: "content-instances-list_selectedItems"
            }
          })
      },
      setup: function () {
        this.get("/projects/{projectId}/tay/content", this.index),
          this.get("/projects/{projectId}/tay/content/{qname}", this.index)
      },
      entityTypes: function () {
        return {
          plural: "content instances",
          singular: "content instance"
        }
      },
      beforeSwap: function (e, t, n) {
        var i = this;
        this.base(e, t, function () {
          var t = i.refreshHandler(e);
          i.subscribe("selected-content-type", t),
            n()
        })
      },
      checkPermission: function (e, t, n, i) {
        var o = this.base(e, t, n, i);
        if ("capabilities-check" === i.category) {
          o = !1;
          var r = e.observable("selected-content-type").get();
          r && r.capabilities && ("create_subobjects" === n && (n = "create"),
            o = r.capabilities.contains(n))
        }
        return o
      },
      afterSwap: function (e, t, n, i) {
        var o = this;
        this.base(e, t, n, function () {
          var e = o.observable("selected-content-type").get();
          e || $(".btn.list-button-create-content").hide(),
            i()
        })
      },
      doGitanaQuery: function (e, t, n, i, o, a) {
        var s = this;
        s.observable("project").get();
        r.isEmptyOrNonExistent(i) && n && (i = r.searchQuery(n, ["title", "description"])),
        i || (i = {}),
          r.projectBranch(s, function () {
            var e = s.observable("selected-content-type").get();
            return e ? (i._type = e.definition.getQName(),
                void this.queryNodes(i, o).then(function () {
                  a(this)
                })) : a(new Gitana.NodeMap(this))
          })
      },
      linkUri: function (e, t, n) {
        var i = n.tokens.projectId;
        return "#/projects/" + i + "/documents/" + e._doc
      },
      iconUri: function (e, t, n) {
        return r.iconUriForNode(e)
      },
      columnValue: function (e, t, n, i) {
        var o = this
          , a = o.observable("project").get()
          , s = this.base(e, t);
        if ("titleDescription" == t.key) {
          var l = r.buildNodeSummary(e, !1, a);
          s = r.listTitleDescription(i, e, null, null, !1, l)
        }
        return s
      }
    }))
  })





