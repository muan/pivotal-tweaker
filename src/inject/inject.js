chrome.extension.sendMessage({}, function(settings) {
  var readyStateCheckInterval = setInterval(function() {

    // Start script once loading has been completed
    if( $("[id^='panel_']").length ) {
      clearInterval(readyStateCheckInterval);

      function Tweaker () {

        tweaker = this;
        tweaker.users = {};

        // Try repeatedly to get a list of users until there is more than one (including "Show All")
        getUsers = setInterval(function() {

          tweaker.current_user = [$("[id^='panel_my_work'] .owner").first().text(), $("[id^='panel_my_work'] .owner").first().attr("title")]

          // Get users from requester select ( if add story form is present || on story view )
          $(".requester .dropdown_item").each( function() {
            var name = $(this).find(".dropdown_label").text()
            var initials = $(this).find(".dropdown_description").text()
            if (name && !tweaker.users[initials]) {
              tweaker.users[initials] = name
            }
          })

          // Get users from all stories ( if on panels view )
          $(".owner").each(function() {
            var name = $(this).attr("title")
            var initials = $(this).text()
            if (initials && !tweaker.users[initials]) {
              tweaker.users[initials] = name
            }
          })

          if( $("#tongue").length == 0 ) {
            try { tweaker.initHeader(); } catch (e) { console.log("Tweaker: Something went wrong. Please contact @muanchiou with - " + e + "."); }
          }

          if ( Object.keys(tweaker.users).length ) {
            try { tweaker.init(); } catch (e) { console.log("Tweaker: Something went wrong. Please contact @muanchiou with - " + e + "."); }
            try { tweaker.appendControls( tweaker.users ); } catch (e) { console.log("Tweaker: Something went wrong. Please contact @muanchiou with - " + e + "."); }

            clearInterval(getUsers);
          }

        }, 200);

        setTimeout( function() {
          clearInterval(getUsers); // No, if there's still no users after 10 secs, NO!
        }, 10000 );

      };

      Tweaker.prototype.init = function() {
        var tweaker = this;
        console.log("You are " + tweaker.current_user[1] + ". This is Pivotal Tweaker. ♥");

        // Create tweaker button group
        $(".settings_area").after("<section class='cn-control copyin'></section>")
        tweaker.controls = $(".cn-control")

        // Create tweaker dropdown
        tweaker.wrapper = $('<div class="copyin copyin_toggle"></duv>');
        tweaker.controls.append( tweaker.wrapper );
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
          tweaker.wrapper.prepend($("<label class='anchor copyin' href='#'><span class='panel_name'>Toggle Stories</span></label>"));
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

      Tweaker.prototype.resetAll = function() {
        var tweaker = this;
        $(".copyin").remove();
        tweaker.css.html("");
        tweaker.init();
        tweaker.initHeader();
      };

      Tweaker.prototype.bindToggleStoriesForAllMembers = function(users) {
        var tweaker = this;
        $(".copyin.item:has(.owner_c)").remove();

        $.each(users, function(index, value) {
          tweaker.menu.prepend($("<li class='copyin item'><a href='#' class='owner_c' title='" + value + "'>" + value + "</a></li>"));
          $("a.owner_c[title='" + value + "']").click( function() { tweaker.toggleStories( value ); return false; } );
        });

        tweaker.menu.find(".item:has(.owner_c):last").after($("<li class='copyin item'><a href='#' class='owner_c' title='Show All'>Show all</a></li>"));
        $("[title='Show All']").click( function() { tweaker.toggleStories(); return false; } );

      };

      Tweaker.prototype.toggleStories = function( value ) {
        var tweaker = this;
        var waitTime = 0;

        // If on story view, then close story view and wait for view changes, then execute toggles
        // if ( $("[id*=panel_current]").get(0).offsetWidth == 0 ) { tweaker.triggerCancelEvent(); waitTime = 500; }

        setTimeout(function() {
          if ( settings.effectOn ) { $(".item.story").slideDown(); } else { $(".item.story").show(); }
          $(".show_unassigned").removeClass("reset");

          if (value) {
            $(".story.item:not(:has(a[title='" + value + "']))").hide();
            }
          }
        }, waitTime);
      };

      Tweaker.prototype.bindToggleStoriesForCurrentUser = function(users) {
        var tweaker = this;

        tweaker.wrapper.removeClass("dropdown_menu");
        tweaker.wrapper.after($("<div class='button'><label class='toggle_current_user copyin anchor' href='#'><span class='panel_name'>My Stories</span></label></div>"));
        $(".toggle_current_user").click(function() {

          if ( $(".show_unassigned").hasClass("reset") ) { $(".show_unassigned").click(); }

          if ( settings.effectOn ) {
            $(".item.story:not(:has(a[title='" + tweaker.current_user[1] + "']))").slideToggle();
          } else {
            $(".item.story:not(:has(a[title='" + tweaker.current_user[1] + "']))").toggle();
          }

        });
      }

      Tweaker.prototype.bindUnassignedStories = function() {
        var tweaker = this;

        // Add in unassigned button in different places based on dropdown setting
        if ( settings.dropdownOn ) {
          tweaker.menu.append($('<li class="divider copyin"></li>'));
          tweaker.menu.append($('<li class=item><a class="show_unassigned copyin"><span class=panel_name>&nbsp;</span></label></li>'));
        } else {
          tweaker.controls.append($('<a class="anchor show_unassigned"><span class=panel_name>&nbsp;</span></label>'));
        }

        $(".show_unassigned").click(function() {
          $(this).toggleClass("reset");

          if ( $("[id*=panel_current]").get(0).offsetWidth == 0 ) { tweaker.triggerCancelEvent(); }
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

        tweaker.css.html("");
        usersToColoursRatio = Math.ceil( (Object.keys(tweaker.users).length) / colourCombination.length );
        colourCombination = _.flatten(_.times(usersToColoursRatio, function() { return colourCombination; }));

        Object.keys(tweaker.users).forEach(function (initials, index) {
          tweaker.css.append("\
            a.owner[title='" + tweaker.users[initials] + "'] {\
              background-color: " + colourCombination[index].bg + " !important;\
              color: " + colourCombination[index].text + " !important;\
            }\
          ");
        })

        if( settings.userBgColour ) {
          tweaker.css.append(".item a[title='" + current_user[1] + "'] { background-color: " + settings.userBgColour + " }");
        }
        if( settings.userTextColour ) {
          tweaker.css.append(".item a[title='" + current_user[1] + "'] { color: " + settings.userTextColour + " }");
        }

        var tagcss = "a.owner {";

        tagcss = tagcss + "\
          font-size: 10px;\
          border-radius: 3px;\
          margin-left: 4px;\
          font-weight: 600;\
          padding: 0 4px;\
          color: #000;\
          }";

        tweaker.css.append(tagcss);
      };

      Tweaker.prototype.initHeader = function() {
        $(".page_header_container").before("<div id=\"tongue\" class=\"copyin\"></div>");
        $("#tongue").click( function() {
          $("body").toggleClass("_header_expanded");
        } );
      };

      var PivotalTweaker = new Tweaker();

    }
	}, 100);
});