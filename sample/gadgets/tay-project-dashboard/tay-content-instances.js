/**
 * Created by p on 19/07/2017.
 */

  // define("css!app/gadgets/project/content/content-instances", [], function () {
  // })
  define("sample/gadgets/project/content/tay-content-instances", ["require", "exports", "module", "css!./content-instances.css", "ratchet/web", "ratchet/dynamic/doclist", "oneteam"], function (e, t, n) {
    // e("css!./content-instances.css");
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





