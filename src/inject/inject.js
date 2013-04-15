chrome.extension.sendRequest({}, function(settings) {
  var readyStateCheckInterval = setInterval(function() {

    // Start script once loading has been completed
    if( $(".project_loading").get(0).offsetWidth == 0 ) {
      clearInterval(readyStateCheckInterval);
      
      function Tweaker () {

        // If panels are there && icebox is visible
        if ( (story_panels = $("#panels_index").get(0)) && $("#panel_icebox.visible").length ) {
          // If panels are visible (i.e. not on story view) then click on add story
          if ( story_panels.offsetWidth != 0 ) { $(".add_story").click(); }
        }

        tweaker = this;
        tweaker.users = [];

        // Try repeatedly to get a list of users until there is more than one (including "Show All")
        getUsers = setInterval(function() {

          tweaker.current_user = $(".requester .selection span").text() || $(".person_name > a.anchor").text();

          // Get users from requester select ( if add story form is present || on story view )
          $(".requester li span").each( function() { tweaker.users.push($(this).text()); });
          // Get users from all stories ( if on panels view )
          $(".owner").each(function() { tweaker.users.push( $(this).attr("title") ); });

          // If add story form is opened, close it
          if (  $("#panels_index").get(0).offsetWidth != 0 && $(".new.story .requester li span").length > 0) { tweaker.triggerCancelEvent(); }

          tweaker.users.push("Show All");
          tweaker.users = _.reject( _.uniq(tweaker.users), function(name) { return _.isUndefined(name); } );

          if ( tweaker.users.length > 1 ) {
            try { tweaker.init(); } catch (e) { console.log("Tweaker: Something went wrong. Please contact @muanchiou with - " + e + "."); }
            try { tweaker.initHeader(); } catch (e) { console.log("Tweaker: Something went wrong. Please contact @muanchiou with - " + e + "."); }
            try { tweaker.appendControls( tweaker.users ); } catch (e) { console.log("Tweaker: Something went wrong. Please contact @muanchiou with - " + e + "."); }
            try { tweaker.checkDOMChangesForResetting(); } catch (e) { console.log("Tweaker: Something went wrong. Please contact @muanchiou with - " + e + "."); }
            clearInterval(getUsers);
          }

        }, 100);
        
      };

      Tweaker.prototype.init = function() {
        var tweaker = this;
        console.log("You are " + tweaker.current_user + ". This is Pivotal Tweaker. ♥");

        // Create tweaker button group        
        $("#panels_control > div").after("<section class='cn copyin'></section>")
        tweaker.navbar = $(".panels_control .cn")

        // Create tweaker dropdown
        tweaker.wrapper = $('<div class="button menu copyin copyin_toggle"></div>');
        tweaker.navbar.append( tweaker.wrapper );
        // Create tweaker styling
        tweaker.css = $("<style rel=custom></style>");
        $("head").append( tweaker.css );
        
        // Append users menu
        tweaker.menu = $("<ul class='toggle_user_menu copyin toggle_menu items'></ul>");
        tweaker.wrapper.append( tweaker.menu );
        
      };

      Tweaker.prototype.appendControls = function(users) {
        var tweaker = this;

        if ( settings.dropdownOn ) { 
          tweaker.bindToggleStoriesForAllMembers(users); 
        } else {
          tweaker.bindToggleStoriesForCurrentUser(users); 
        }

        if ( settings.tagOn ) { tweaker.giveUsersTags(users); }
        if ( settings.showUnassigned ) { tweaker.bindUnassignedStories(); }

      };

      Tweaker.prototype.triggerCancelEvent = function () {
        var trigger = document.createEvent("Event");
        trigger.initEvent("click", true, true);

        // If on story view
        if ($("#maximizes_show .close").length) {
          closeThis = $("#maximizes_show .close").get(0)
        // If on panels view ( for closing the add story form )
        } else {
          closeThis = $(".cancel").get(0)
        }
        closeThis.dispatchEvent(trigger);
      }

      Tweaker.prototype.checkDOMChangesForResetting = function() {
        // Listen to if the menu has been re-render by Pivotal
        var tweaker = this;
        $("#panels_control > div").bind( "DOMNodeRemovedFromDocument", function() {
          tweaker.lookForNewNavAndReset()
        });
      };

      Tweaker.prototype.lookForNewNavAndReset = function() {
        var tweaker = this;
        look = setInterval( function() {
          // If the new menu has been rendered then reset everything based on new information
          if ($("#panels_control > div").length) {
            tweaker.resetAll();
            tweaker.appendControls( tweaker.users );
            tweaker.checkDOMChangesForResetting();
            clearInterval(look);
          }
        }, 100)
      };

      Tweaker.prototype.resetAll = function() {
        var tweaker = this;
        $(".copyin").remove();
        tweaker.css.html("");
        tweaker.init();
        tweaker.initHeader();
      };

      Tweaker.prototype.bindToggleStoriesForAllMembers = function(users) {
        var tweaker = this;
        tweaker.wrapper.prepend($("<label class='anchor copyin' href='#'>Toggle Stories</label>"));
        
        $.each(users, function(index, value) {
          tweaker.menu.append($("<li class=item><a href='#' class='copyin owner_c' title='" + value + "'>" + value + "</a></li>"));
          
          $("a.owner_c[title='" + value + "']").click( function() {
            
            waitTime = 0;

            // If on story view, then close story view and wait for view changes, then execute toggles
            if ( $("#panels_index").get(0).offsetWidth == 0 ) { tweaker.triggerCancelEvent(); waitTime = 500; }

            setTimeout(function() { 
              if ( settings.effectOn ) { $(".item.story").slideDown(); } else { $(".item.story").show(); }
              $("a.show_unassigned").removeClass("reset");

              if ( value != "Show All") {
                if ( settings.effectOn ) {
                  $(".story.item:not(:has(a[title='" + value + "']))").slideToggle();
                } else {
                  $(".story.item:not(:has(a[title='" + value + "']))").toggle();
                }
              }
            }, waitTime);

            return false;
          });

        });
      }

      Tweaker.prototype.bindToggleStoriesForCurrentUser = function(users) {
        var tweaker = this;

        tweaker.wrapper.removeClass("dropdown_menu");
        tweaker.wrapper.after($("<div class='button'><label class='toggle_current_user copyin anchor' href='#'>My Stories</label></div>"));
        $(".toggle_current_user").click(function() {

          if ( $(".show_unassigned").hasClass("reset") ) { $(".show_unassigned").click(); }

          if ( settings.effectOn ) {
            $(".item.story:not(:has(a[title='" + tweaker.current_user + "']))").slideToggle();
          } else {
            $(".item.story:not(:has(a[title='" + tweaker.current_user + "']))").toggle();
          }

        });
      }

      Tweaker.prototype.bindUnassignedStories = function() {
        var tweaker = this;

        // Add in unassigned button in different places based on dropdown setting
        if ( settings.dropdownOn ) {
          tweaker.menu.append($('<li class="divider copyin"></li>'));
          tweaker.menu.append($('<li class=item><a class="show_unassigned copyin">&nbsp;</a></li>'));
        } else {
          tweaker.navbar.append($('<div class="button"><label class="anchor show_unassigned">&nbsp;</label></div>'));
        }

        $(".show_unassigned").click(function() {
          $(this).toggleClass("reset");

          if ($(this).hasClass("reset")) {
            $(".item.story").hide();
            if ( settings.effectOn ) {
              $(".item.story:not(:has(a.owner))").slideToggle();
            } else {
              $(".item.story:not(:has(a.owner))").toggle();
            }
          } else {
            $(".item.story").show();
          }
        });
      }

      Tweaker.prototype.giveUsersTags = function(users) {
        var tweaker = this;
        var colourCombination = [
          { "bg": "#ecd537", "text":  "#000000"},
          { "bg": "#9d454d", "text": "#ffffff"},
          { "bg": "#aaddee", "text": "#000000"},
          { "bg": "#eb9500", "text": "#ffffff"},
          { "bg": "#6c4281", "text": "#ffffff"},
          { "bg": "#227479", "text": "#ffffff"},
          { "bg": "#008833", "text": "#ffffff"},
          { "bg": "#c1d260", "text": "#000000"},
          { "bg": "#ff8181", "text": "#ffffff"},
          { "bg": "#5b5555", "text": "#ffffff"},
          { "bg": "#59c9ae", "text": "#000000"},
          { "bg": "#b7a2cd", "text": "#000000"},
          { "bg": "#81d076", "text": "#000000"}
        ]

        usersToColoursRatio = Math.ceil( (tweaker.users.length - 1) / colourCombination.length );
        colourCombination = _.flatten(_.times(usersToColoursRatio, function() { return colourCombination; }));

        $.each(users, function(index, value) {
          tweaker.css.append("\
            a.owner[title='" + value + "'] {\
              background-color: " + colourCombination[index].bg + " !important;\
              color: " + colourCombination[index].text + " !important;\
            }\
          ");
        });

        if( settings.userBgColour ) {
          tweaker.css.append(".item a[title='" + current_user + "'] { background-color: " + settings.userBgColour + " }");
        }
        if( settings.userTextColour ) {
          tweaker.css.append(".item a[title='" + current_user + "'] { color: " + settings.userTextColour + " }");
        }

        var tagcss = "a.owner {";

        if( settings.tagInline ) {
          tagcss = tagcss + "display: inline;";
        } else {
          tagcss = tagcss + "display: block; position: absolute;";
        }

        tagcss = tagcss + "\
          font-style: normal !important;\
          font-size: 10px;\
          line-height: : 10px;\
          height: 16px;\
          text-align: center;\
          border-radius: 3px;\
          margin-left: 4px;\
          font-weight: 600;\
          margin-top: -17px;\
          padding: 0 4px;\
          color: #000;\
          width: auto;\
          left: 0;\
          }";

        tweaker.css.append(tagcss);

        // Removing blank brackets, doesn't work with ajax, could potentially do but is it worthwhile?
        $(".tracker_markup:has(.owner)").each(function() {
          var nodes = jQuery.parseHTML( $(this).html() );
          var htmlWithoutEmptyBrackets = _.reject(nodes, function(t) { if(t.wholeText) { if(t.wholeText.match(/\s\(/) || t.wholeText.match(/\)\n/)) { match = true } else { match = false } } else { match = false } return match; } );
          $(this).html("").append(htmlWithoutEmptyBrackets);
        });
      };

      Tweaker.prototype.initHeader = function() {
        $("body").append("<div id=\"tongue\" class=\"copyin\"></div>");
        $("#tongue").click( function() {
          $("header.project, #tongue").toggleClass("expanded");
        } );
      };

      var PivotalTweaker = new Tweaker();

    }
	}, 1000);
});