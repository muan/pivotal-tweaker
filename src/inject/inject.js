chrome.extension.sendRequest({}, function(settings) {
  var readyStateCheckInterval = setInterval(function() {
  if( $(".project_loading").get(0).offsetWidth == 0 ) {
    clearInterval(readyStateCheckInterval);
    
    function Tweaker () {

      $(".add_story").click();
      tweaker = this;
      this.users = [];

      getUsers = setInterval(function() {

        if ($(".requester li span").length > 0) {
          $(".requester li span").each( function() {
            tweaker.users.push($(this).text());
          });

          tweaker.current_user = $(".requester .selection span").text();
          $(".new.story.item").remove();

          tweaker.users.push("Show All");
          tweaker.users = _.uniq(tweaker.users);
          
          tweaker.init();
          tweaker.initHeader();
          tweaker.appendControls( tweaker.users );
          tweaker.checkDOMChangesForResetting();
          
          clearInterval(getUsers);
        }
      }, 100);
      
    };

    Tweaker.prototype.checkDOMChangesForResetting = function() {
      var tweaker = this;

      $("#layout > tbody > tr").first().bind( "DOMNodeRemoved DOMNodeRemovedFromDocument", function() {
        if ( $("#layout > tbody > tr").length > 1 ) {
          var reset = setInterval( function() {
            var panel = $("#layout > tbody > tr");
            if ( panel.length == 1 && panel.is(":visible") ) {
              tweaker.resetAll();
              tweaker.appendControls( tweaker.users );
              clearInterval( reset );
            }
          }, 200);
        }
      });

    };

    Tweaker.prototype.init = function() {

      var tweaker = this;
      console.log("You are " + tweaker.current_user + ". This is Pivotal Tweaker. ♥");
      $(".panels_control > div").after("<section class='cn'></section>")
      tweaker.navbar = $(".panels_control .cn")

      // create tweaker dropdown
      tweaker.wrapper = $('<div class="button menu copyin_toggle"></div>');
      tweaker.navbar.append( tweaker.wrapper );
      
      // tweaker styling
      tweaker.css = $("<style rel=custom></style>");
      $("head").append( tweaker.css );

      // this is user menu
      tweaker.menu = $("<ul class='toggle_user_menu toggle_menu items'></ul>");
      tweaker.wrapper.append( tweaker.menu );
      
    };

    Tweaker.prototype.resetAll = function() {
      var tweaker = this;
      $(".copyin").remove();
      tweaker.css.html("");
    }

    Tweaker.prototype.appendControls = function(users) {
      var tweaker = this;

      if ( settings.dropdownOn ) { 
        tweaker.bindToggleStoriesForAllMembers(users); 
      } else {
        tweaker.bindToggleStoriesForCurrentUser(users); 
      }
      if ( settings.tagOn ) { tweaker.giveUsersTags(users); }
      if ( settings.showUnassigned ) { tweaker.bindUnassignedStories(); }

    }

    Tweaker.prototype.bindToggleStoriesForAllMembers = function(users) {
      var tweaker = this;
        
      tweaker.wrapper.prepend($("<label class='anchor copyin' href='#'>Toggle Stories</label>"));
      
      $.each(users, function(index, value) {
        tweaker.menu.append($("<li class=item><a href='#' class='copyin owner_c' title='" + value + "'>" + value + "</a></li>"));
        
        $("a.owner_c[title='" + value + "']").click( function() {
          
          if ( settings.effectOn ) { 
            $(".item.story").slideDown();
           } else {
            $(".item.story").show();
          }

          $("a.show_unassigned").removeClass("reset");

          if ( value != "Show All") {
            if ( settings.effectOn ) {
              $(".story.item:not(:has(a[title='" + value + "']))").slideToggle();
            } else {
              $(".story.item:not(:has(a[title='" + value + "']))").toggle();
            }
          }

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
        tweaker.menu.append($('<li class=item><a class="show_unassigned copyin" href="#">&nbsp;</a></li>'));
      } else {
        tweaker.navbar.append($('<div class="button" href="#"><label class="anchor show_unassigned">&nbsp;</label></div>'));
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
        ["#ecd537", "#000000"],
        ["#9d454d", "#ffffff"],
        ["#aaddee", "#000000"],
        ["#eb9500", "#ffffff"],
        ["#6c4281", "#ffffff"],
        ["#227479", "#ffffff"],
        ["#008833", "#ffffff"]
      ]

      $.each(users, function(index, value) {
        tweaker.css.append("\
          a.owner[title='" + value + "'] {\
            background-color: " + colourCombination[index][0] + " !important;\
            color: " + colourCombination[index][1] + " !important;\
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
    }

    Tweaker.prototype.initHeader = function(argument) {
      $("body").append("<div id=\"tongue\" class=\"copyin\"></div>");
      $("#tongue").click( function() {
        $("header.project, #tongue").toggleClass("expanded");
      } );
    }

    var PivotalTweaker = new Tweaker();

  }
	}, 1000);
});