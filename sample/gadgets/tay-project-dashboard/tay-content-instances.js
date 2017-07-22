/**
 * Created by p on 19/07/2017.
 */

// define("css!app/gadgets/project/content/content-instances", [], function () {
// })
define(function (e, t, n) {
  // e("css!./content-instances.css");
  var i = e("ratchet/web")
    , o = e("ratchet/dynamic/doclist")
    , oneteam = e("oneteam");
  i.Messages.using();
  return i.GadgetRegistry.register("tay-content-instances", o.extend({
    configureDefault: function () {
      this.base();
      var c = {
        "columnHeaders": true,
        "buttons": [{
          "key": "create-content",
          "title": "Create Content",
          "iconClass": "fa fa-plus",
          "align": "left",
          "action": "create-content",
          "allowPermission": ["create"],
          "category": "capabilities-check"
        }]
        ,
        "navbox": false,
        "defaultFirstColumnAsId": true,
        "options": {"filter": true, "paginate": true, "info": true, "sizing": true, "processing": true},
        "observables": {
          "query": "content-instances-list_query",
          "sort": "content-instances-list_sort",
          "sortDirection": "content-instances-list_sortDirection",
          "searchTerm": "content-instances-list_searchTerm",
          "selectedItems": "content-instances-list_selectedItems",
          "length": "length",
          "optionsFilter": "optionsFilter",
          "refresh": "refresh_content-instances_gadget132"
        },
        "checkbox": true,
        "icon": true,
        "columns": [{"key": "titleDescription", "title": "Content Instance"}],
        "loader": "gitana",
        "lengthMenu": {"values": [10, 25, 50, 100, 999999], "labels": [10, 25, 50, 100, "All"]},
        "selectorGroups": {
          "multi-documents-action-selector-group": {
            "actions": [{
              "action": "delete-content",
              "order": 100,
              "_allowPermission": ["delete"]
            }, {"action": "edit-content", "order": 200, "_allowPermission": ["update"]}, {
              "action": "start-workflow",
              "order": 300,
              "_allowAuthority": ["collaborator", "contributor", "editor", "manager"]
            }]
          },
          "single-document-action-selector-group": {"actions": []},
          "sort-selector-group": {
            "fields": [{
              "key": "title",
              "title": "Title",
              "field": "title"
            }, {"key": "description", "title": "Description", "field": "description"}, {
              "key": "createdOn",
              "title": "Created On",
              "field": "_system.created_on.ms"
            }, {"key": "createdBy", "title": "Created By", "field": "_system.created_by"}, {
              "key": "modifiedOn",
              "title": "Modified On",
              "field": "_system.modified_on.ms"
            }, {"key": "modifiedBy", "title": "Modified By", "field": "_system.modified_by"}, {
              "key": "type",
              "title": "Type",
              "field": "TYPE"
            }, {"key": "size", "title": "Size", "field": "size"}]
          },
          "options-filter": {"options": []}
        },
        "chrome": false,
        "cssClasses": " content-instances",
        "tokens": {"projectId": "e1b5b4592c39d60bae02"},
        "route": {"method": "GET", "uri": "/projects/e1b5b4592c39d60bae02/content"},
        "uri": "/projects/e1b5b4592c39d60bae02/content",
        "method": "GET",
        "items": [],
        "originalSelectorGroups": {
          "multi-documents-action-selector-group": {
            "actions": [{
              "action": "delete-content",
              "order": 100,
              "_allowPermission": ["delete"]
            }, {"action": "edit-content", "order": 200, "_allowPermission": ["update"]}, {
              "action": "start-workflow",
              "order": 300,
              "_allowAuthority": ["collaborator", "contributor", "editor", "manager"]
            }]
          },
          "single-document-action-selector-group": {"actions": []},
          "sort-selector-group": {
            "fields": [{
              "key": "title",
              "title": "Title",
              "field": "title"
            }, {"key": "description", "title": "Description", "field": "description"}, {
              "key": "createdOn",
              "title": "Created On",
              "field": "_system.created_on.ms"
            }, {"key": "createdBy", "title": "Created By", "field": "_system.created_by"}, {
              "key": "modifiedOn",
              "title": "Modified On",
              "field": "_system.modified_on.ms"
            }, {"key": "modifiedBy", "title": "Modified By", "field": "_system.modified_by"}, {
              "key": "type",
              "title": "Type",
              "field": "TYPE"
            }, {"key": "size", "title": "Size", "field": "size"}]
          },
          "options-filter": {"options": []}
        }
      }
      this.config(c);
      // this.config({
      //   loader: 'gitana',
      //   observables: {
      //     query: "tay-content-instances-list_query",
      //     sort: "tay-content-instances-list_sort",
      //     sortDirection: "tay-content-instances-list_sortDirection",
      //     searchTerm: "tay-content-instances-list_searchTerm",
      //     selectedItems: "tay-content-instances-list_selectedItems"
      //   }
      // })
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
      oneteam.isEmptyOrNonExistent(i) && n && (i = oneteam.searchQuery(n, ["title", "description"])),
      i || (i = {}),
        oneteam.projectBranch(s, function () {
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
      return oneteam.iconUriForNode(e)
    },
    columnValue: function (row, item, model, context) {
      var o = this
        , project = o.observable("project").get()
        , value = this.base(row, item);
      if ("titleDescription" == item.key) {
        var l = oneteam.buildNodeSummary(row, !1, project);
        value = oneteam.listTitleDescription(context, row, null, null, !1, l)
        var pub = "False";
        if (row.published) {
          pub = "True"
        }
        value += "<div>Published : " + pub +"</div>"
      }
      return value
    }
  }))
})





