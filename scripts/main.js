 /*
    Objectives:

    [X] Implement delete x button (176)
    [ ] Compile less files
    [ ] Upload to portfolio & github
 */

function cl(str) { console.log(str); }

// Implement LESS configuration
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

});

// Alert user
function alertMessage(msg) {
    alert(msg);
}

// Clear create-new-brush UI inputs
function clearCreateBrushUI() {
    $("#create-name").val("");
    $("#create-price").val("");
    $("#new-brush-color").css("background-color", "#444");
}

// Ensure valid price field input
function checkValidFields(brushName, brushPrice) {
    let priceChunks = brushPrice.split("$");
    if(priceChunks.length < 1) return false;
    if( !isNaN(parseFloat(priceChunks[1])) ) {
        return true;
    } else {
        return false;
    }
}

// Initialize functionality for controllers
function setupUserInterface($, brushes, addBrush, removeBrush) {

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

    setupUserInterfaceDeleteBtn($, removeBrush);
}

// Use seperate function since the View is reloaded
// Note: use Backbone events for this to minimize this roundabout method
function setupUserInterfaceDeleteBtn($, removeBrush) {

    // Deleting a brush
    $(".delete-btn").click(function(clickEvent) {
        let removeBrushId = parseInt( clickEvent.currentTarget.id ); cl(removeBrushId);
        removeBrush(removeBrushId); 
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

    // Add new brush model to brushes collection
    var addNewBrush = function (brushModelObject) {
        brushes.add( new Brush({
            name: brushModelObject.name, 
            price: brushModelObject.price, 
            color: brushModelObject.color,
            id: brushes.models.length
        }) );
    };

    // Remove brush model at Id
    var removeBrush = function (brushId) { cl(brushId);
        brushes.remove(brushId); cl(brushes)
    };

    // ==================================================================
    //  Views
    // ==================================================================

    var HomeView = Backbone.View.extend({

        // Host element
        el: "#app",

        tagName: "div",

        // Events
        events: {

        },

        // Init addition and deletion listeners
        initialize: function() {
            this.listenTo(brushes, "add", this.addBrush);
            this.listenTo(brushes, "remove", this.render);
        },

        // Update UI when brushes are added
        addBrush: function(brush) {
            this.$el.append(this.template(brush.toJSON()));

            // Remove button functionality
            setupUserInterfaceDeleteBtn($, removeBrush);
        },

        // Template HTML (underscore.js)
        template:_.template($("#brush-view-template").html()),

        // Render data to DOM
        render: function() {

            // Clear all html
            this.$el.html("");

            // Map through models and display each child
            for(let i = 0; i < brushes.models.length; i++) { cl(brushes.models[i]);

                // Set Id for deletion reference
               // brushes.models[i].id = i; 
                //brushes.models[i].attributes.id = i; 
                let nodeJSON = brushes.models[i].toJSON();
                //nodeJSON.objectId = brushes.models[i].id; cl(nodeJSON);

                // Append
                this.$el.append(this.template(nodeJSON));

                // Remove button functionality
                setupUserInterfaceDeleteBtn($, removeBrush);
            }

            return this;
        }

    });

    var App = new HomeView; 

    App.render();

    setupUserInterface($, brushes, addNewBrush, removeBrush);

});