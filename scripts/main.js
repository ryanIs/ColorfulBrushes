/**
 * TODO:
 * delete
 * 
 * print 3 resumes
 * ipad images (of projects)
 */

function cl(str) { console.log(str); }

var less = {
    env: "development",
    async: false,
    fileAsync: false,
    poll: 1000,
    functions: {},
    dumpLineNumbers: "comments",
    relativeUrls: false,
    rootpath: "css/"
};

// Configure requirejs
requirejs.config({

    // Base URL for scripts
    baseUrl: "scripts/",

    // Bootstrap requires jquery and popper
    shim: {
        bootstrap: {
            deps: ["jquery", "popper"]
        }
    },

    // Paths of JS files
    paths: {
        jquery: "jquery.min",
        popper: "popper",
        bootstrap: "bootstrap.min",
        underscore: "underscore.min",
        less: "less.min",
        backbone: "backbone.dev"
    }

})

function alertMessage(msg) {
    alert(msg);
}
function clearCreateBrushUI() {
    $("#create-name").val("");
    $("#create-price").val("");
    $("#new-brush-color").css("background-color", "#444");
}

function checkValidFields(brushName, brushPrice) {
    let priceChunks = brushPrice.split("$");
    if(priceChunks.length < 1) return false;
    if( !isNaN(parseFloat(priceChunks[1])) ) {
        return true;
    } else {
        return false;
    }
}

function setupUserInterface($, brushes, addBrush) {

    //$(".create-UI-wrapper").hide();

    // Click New Brush to show creation UI
    $("#create-btn").click(function(clickEvent) {
        if($(".create-UI-wrapper").css("display") == "none") {
            $(".create-UI-wrapper").show();
            $("#create-btn").html("Hide");
        } else {
            $(".create-UI-wrapper").hide();
            $("#create-btn").html("New Brush");
        }
    });

    // Clicking on brushes to set color
    $(".select-brush").click(function(clickEvent) { 
        $("#new-brush-color").css("background-color", $(clickEvent.currentTarget).css("background-color"));
    });

    // Adding brush
    $("#add-btn").click(function(clickEvent) { 

        let newName = $("#create-name").val();
        let newPrice = $("#create-price").val();
        let newColor = $("#new-brush-color").css("background-color");

        if(checkValidFields(newName, newPrice) == true) {
            addBrush({name: newName, price: newPrice, color: newColor});
            alertMessage(newName + " successfully added!");
            clearCreateBrushUI();
        }   else {
            alertMessage("Invalid input fields. (e.g. Brush Name: \"My new Brush\" Price: \"$14.99\")");
        }

    });

}

// Prepare modules for use
define(["jquery", "underscore", "backbone", "less"], function($, _, Backbone, less) {

    less.watch();

    // ==================================================================
    // Brush Model
    // ==================================================================

    var Brush = Backbone.Model.extend({

        defaults: {
            name: "New Brush",
            color: "#fff",
            price: "$19.99"
        }
    });

    var Brushes = Backbone.Collection.extend({ 
        model: Brush
    });

    var brushes = new Brushes([
        new Brush({
            name: "Red brush",
            id: "0",
            color: "#f00",
            price: "$19.99"
        }),
        new Brush({
            name: "Green brush",
            id: "1",
            color: "#0f0",
            price: "$14.99"
        }),
        new Brush({
            name: "Blue brush",
            id: "2",
            color: "#00f",
            price: "$9.99"
        })
    ])

    var addNewBrush = function (brushModelObject) {
        brushes.add( new Brush({
            name: brushModelObject.name, 
            price: brushModelObject.price, 
            color: brushModelObject.color,
            id: brushes.models.length
        }) );
    };

    // ==================================================================
    //  Views
    // ==================================================================

    var HomeView = Backbone.View.extend({

        // Host element
        el: "#app",

        tagName: "div",

        // Delete event
        events: {
            "click .delete-btn": "removeBrush"
        },

        // Init addition and deletion listeners
        initialize: function() {
            this.listenTo(brushes, "add", this.addBrush);
            this.model.on("destroy", this.addBrush, this);
        },

        // Update UI when brushes are added
        addBrush: function(brush) {
            this.$el.append(this.template(brush.toJSON()));
        },
        
        removeBrush: function(event) {
            //this.$el.remove( $("#" + $(this.)).id() );
            //brushes[$(this.$el).id()].destroy();
            this.model.destroy();
        },

        // Template HTML (underscore.js)
        template:_.template($("#brush-view-template").html()),

        // Render data to DOM
        render: function() {

            for(let i = 0; i < brushes.models.length; i++) {
                this.$el.append(this.template(brushes.models[i].toJSON()));
                //console.log( _.template($("#brush-view-template").html() ));
                cl(i);
            }

            return this;
        }

    });

    var App = new HomeView; 

    App.render();

    setupUserInterface($, brushes, addNewBrush);

});