define(function(require) {

    // page: "sample-products-list"
    require("./gadgets/sample-products-list/sample-products-list.js");
    require("../dev/cloud.js");


    // dashlet: "sample-random-product-dashlet"
    require("./gadgets/sample-random-product-dashlet/sample-random-product-dashlet.js");

    // page: "tay-project-dashboard"
    require("./gadgets/tay-project-dashboard/tay-content-instances.js");
    require("./gadgets/tay-project-dashboard/tay-entity-types.js");

    // action: "create-sample-space"
    require("./actions/sample/create-sample-space.js");

    // sample form fields
    require("./fields/sample-city-picker.js");
    require("./fields/cloud-upload.js");
    require("./fields/sample-content-picker.js");

    // sample override to document-properties
    require("./gadgets/sample-product-document-properties/sample-product-document-properties.js");

    // global CSS overrides
    require("css!./styles/sample.css");


});

